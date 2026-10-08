const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
let mongo, app, a, b, User, Post, Comment;
const password = 'OnlyLocalQa123';
const token = user => `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;
before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.DATABASE = mongo.getUri('metawall_qa');
  process.env.DATABASE_PASSWORD = '';
  process.env.JWT_SECRET = 'local-test-secret-never-a-production-credential';
  process.env.JWT_EXPIRES_DAY = '1h';
  process.env.NODE_ENV = 'test';
  app = require('../app');
  await mongoose.connection.asPromise();
  User = require('../models/user'); Post = require('../models/post'); Comment = require('../models/comment');
  for (const [name, email] of [['QA Alice', 'alice@example.test'], ['QA Bob', 'bob@example.test']]) {
    await request(app).post('/user/sign_up').send({name,email,password}).expect(201);
  }
  a = await User.findOne({email:'alice@example.test'}); b = await User.findOne({email:'bob@example.test'});
}, { timeout: 120000 });
after(async () => { await mongoose.disconnect(); if(mongo) await mongo.stop(); });

test('authentication rejects missing, malformed, expired and deleted-user tokens with 401', async () => {
  await request(app).get('/user/checkLogin').expect(401);
  for(const value of ['Bearer invalid', `Bearer ${jwt.sign({id:a.id},process.env.JWT_SECRET,{expiresIn:-1})}`, token({_id:new mongoose.Types.ObjectId()})]) {
    await request(app).get('/user/checkLogin').set('Authorization',value).timeout(2000).expect(401);
  }
  await request(app).get('/user/checkLogin').set('Authorization',token(a)).expect(200);
});
test('ordinary users cannot use either bulk deletion endpoint', async () => {
  await request(app).delete('/posts').set('Authorization',token(a)).expect(403);
  await request(app).delete('/users').set('Authorization',token(a)).expect(403);
  assert.equal(await User.countDocuments(),2);
});
test('another user cannot edit or delete a post; author deletion also removes its comments', async () => {
  const p=await Post.create({user:a.id,content:'Owner only'});
  await Comment.create({user:b.id,post:p._id,comment:'test'});
  await request(app).patch('/post/'+p._id).set('Authorization',token(b)).send({content:'changed'}).expect(403);
  await request(app).delete('/post/'+p._id).set('Authorization',token(b)).expect(403);
  assert.ok(await Post.findById(p._id));
  await request(app).delete('/post/'+p._id).set('Authorization',token(a)).expect(200);
  assert.equal(await Comment.countDocuments({post:p._id}),0);
});
test('invalid IDs and missing posts return client errors', async () => {
  await request(app).get('/post/not-an-id').set('Authorization',token(a)).expect(400);
  await request(app).get('/post/'+new mongoose.Types.ObjectId()).set('Authorization',token(a)).expect(404);
});
test('search treats regex characters as literal text without throwing', async () => {
  await Post.create({user:a.id,content:'[hello] literal.*'});
  const res=await request(app).get('/posts').query({q:'['}).set('Authorization',token(a)).expect(200);
  assert.equal(res.body.posts.length,1);
});
test('blank posts and comments are rejected', async () => {
  await request(app).post('/post').set('Authorization',token(a)).send({content:'  \n'}).expect(400);
  const p=await Post.create({user:a.id,content:'comments'});
  await request(app).post('/post/'+p._id+'/comment').set('Authorization',token(b)).send({comment:'   '}).expect(400);
});
test('likes and follows remain unique and can be undone; missing targets do not mutate data', async () => {
  const p=await Post.create({user:a.id,content:'interactions'});
  for(let i=0;i<2;i++) {
    await request(app).post('/post/'+p._id+'/likes').set('Authorization',token(b)).expect(200);
    await request(app).post('/user/'+a.id+'/follow').set('Authorization',token(b)).expect(200);
  }
  assert.equal((await Post.findById(p._id)).likes.length,1);
  assert.equal((await User.findById(b.id)).following.length,1);
  assert.equal((await User.findById(a.id)).followers.length,1);
  await request(app).post('/user/not-an-id/follow').set('Authorization',token(b)).expect(400);
  await request(app).post('/user/'+new mongoose.Types.ObjectId()+'/follow').set('Authorization',token(b)).expect(404);
  assert.equal((await User.findById(b.id)).following.length,1);
  await request(app).delete('/user/'+a.id+'/follow').set('Authorization',token(b)).expect(200);
  await request(app).delete('/post/'+p._id+'/likes').set('Authorization',token(b)).expect(200);
  assert.equal((await User.findById(b.id)).following.length,0);
  assert.equal((await Post.findById(p._id)).likes.length,0);
});
test('profile and password updates persist; old password stops working', async () => {
  await request(app).patch('/user/profile').set('Authorization',token(a)).send({name:'Alice Updated',sex:'female'}).expect(200);
  const me=await request(app).get('/user/profile').set('Authorization',token(a)).expect(200);
  assert.equal(me.body.user.name,'Alice Updated'); assert.equal(me.body.user.sex,'female');
  await request(app).patch('/user/profile').set('Authorization',token(a)).send({name:' '}).expect(400);
  await request(app).patch('/user/updatePassword').set('Authorization',token(a)).send({password:'AnotherLocal123',confirmPassword:'AnotherLocal123'}).expect(200);
  await request(app).post('/user/sign_in').send({email:'alice@example.test',password}).expect(400);
  await request(app).post('/user/sign_in').send({email:'alice@example.test',password:'AnotherLocal123'}).expect(200);
});
test('upload rejects missing, wrong format, damaged and oversized files without contacting Imgur', async () => {
  for(const route of ['/upload/avatar','/upload/post']) {
    await request(app).post(route).set('Authorization',token(a)).expect(400);
    await request(app).post(route).set('Authorization',token(a)).attach('file-to-upload',Buffer.from('not an image'),'test.txt').expect(400);
    await request(app).post(route).set('Authorization',token(a)).attach('file-to-upload',Buffer.from('not an image'),'test.png').expect(400);
    await request(app).post(route).set('Authorization',token(a)).attach('file-to-upload',Buffer.alloc(3*1024*1024),'large.png').expect(400);
  }
});

test('concurrent duplicate follows and likes remain unique on both users', async () => {
  const p=await Post.create({user:a.id,content:'parallel'});
  await Promise.all(Array.from({length:4},()=>request(app).post('/user/'+a.id+'/follow').set('Authorization',token(b)).expect(200)));
  await Promise.all(Array.from({length:4},()=>request(app).post('/post/'+p._id+'/likes').set('Authorization',token(b)).expect(200)));
  assert.equal((await User.findById(b.id)).following.filter(x=>String(x.user)===a.id).length,1);
  assert.equal((await User.findById(a.id)).followers.filter(x=>String(x.user)===b.id).length,1);
  assert.equal((await Post.findById(p._id)).likes.length,1);
});
test('comment author and text can be read back through the post API',async()=>{
  const p=await Post.create({user:a.id,content:'comment persistence'});
  await request(app).post('/post/'+p._id+'/comment').set('Authorization',token(b)).send({comment:'saved comment'}).expect(200);
  const r=await request(app).get('/post/'+p._id).set('Authorization',token(a)).expect(200);
  assert.ok(r.body.post.comments[0].createdAt);assert.equal(r.body.post.comments[0].comment,'saved comment');assert.equal(r.body.post.comments[0].user.name,b.name);
});
test('invalid input types and duplicate email stay client errors',async()=>{
  await request(app).post('/user/sign_in').send({email:{$ne:null},password:'Anything1'}).expect(400);
  await request(app).post('/user/sign_up').send({name:'Valid Name',email:' ALICE@EXAMPLE.TEST ',password:'Duplicate123'}).expect(400);
  await request(app).get('/posts?q[x]=bad').set('Authorization',token(a)).expect(400);
  await request(app).patch('/user/profile').set('Authorization',token(a)).send({sex:[],name:45}).expect(400);
});
test('valid image upload keeps the response contract, with recoverable upstream failures',async(t)=>{
  const {ImgurClient}=require('imgur');
  const sharp=require('sharp');
  const png=await sharp({create:{width:16,height:16,channels:3,background:'#baccdf'}}).png().toBuffer();
  const wide=await sharp({create:{width:32,height:16,channels:3,background:'#baccdf'}}).png().toBuffer();
  const mocked=t.mock.method(ImgurClient.prototype,'upload',async()=>({success:true,data:{link:'https://i.imgur.com/qa-test.png'}}));
  await request(app).post('/upload/avatar').set('Authorization',token(a)).attach('file-to-upload',wide,'wide.png').expect(400);
  await request(app).post('/upload/post').set('Authorization',token(a)).attach('file-to-upload',png.subarray(0,50),'truncated.png').expect(400);
  assert.equal(mocked.mock.callCount(),0);
  for(const route of ['/upload/avatar','/upload/post']) {
    const res=await request(app).post(route).set('Authorization',token(a)).attach('file-to-upload',png,'qa.png').expect(200);
    assert.equal(res.body.imgUrl,'https://i.imgur.com/qa-test.png');
  }
  mocked.mock.mockImplementation(async()=>({success:false,data:{error:'upstream'}}));
  await request(app).post('/upload/post').set('Authorization',token(a)).attach('file-to-upload',png,'qa.png').expect(502);
  mocked.mock.mockImplementation(async()=>{throw new Error('upstream offline')});
  await request(app).post('/upload/avatar').set('Authorization',token(a)).attach('file-to-upload',png,'qa.png').expect(502);
});

test('only an existing admin role can reach bulk deletion (isolated database only)',async()=>{
 const admin=await User.create({name:'QA Admin',email:'admin@example.test',password:'unused-test-hash',role:'admin'});
 await request(app).delete('/posts').set('Authorization',token(admin)).expect(200);
 await request(app).delete('/users').set('Authorization',token(admin)).expect(200);
 assert.equal(await Post.countDocuments(),0);assert.equal(await User.countDocuments(),0);
});
