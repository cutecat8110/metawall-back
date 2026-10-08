// Runs the real Express application against a disposable local MongoDB.
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('node:fs');
const crypto = require('node:crypto');
(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.DATABASE = mongo.getUri('metawall_qa');
  process.env.DATABASE_PASSWORD = '';
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.JWT_EXPIRES_DAY = '1h';
  process.env.NODE_ENV = 'test';
  // Keep all uploads local even when the developer has a real config.env.
  require('imgur').ImgurClient.prototype.upload = async () => { throw new Error('Imgur is disabled in isolated QA'); };
  const app = require('../app');
  await require('../connections');
  const User = require('../models/user');
  const Post = require('../models/post');
  const bcrypt = require('bcryptjs');
  const password = 'LocalQa123456';
  const a = await User.create({name:'QA Alice',email:'alice@example.test',password:await bcrypt.hash(password,12)});
  const b = await User.create({name:'QA Bob',email:'bob@example.test',password:await bcrypt.hash(password,12)});
  const posts=[];
  for (const [user,content] of [[a,'QA 既有貼文：測試 [搜尋] 與留言。'],[b,'QA 長文字 '+ 'abcdefghij'.repeat(30)]]) posts.push(await Post.create({user:user.id,content,image:user.id === b.id ? '/metawall-front/images/sign-bg.png' : ''}));
  fs.writeFileSync('/tmp/metawall-qa-state.json',JSON.stringify({database:process.env.DATABASE,users:[{id:a.id,email:'alice@example.test'},{id:b.id,email:'bob@example.test'}],password,posts:posts.map(p=>p._id)}),{mode:0o600});
  const server=app.listen(8091,'127.0.0.1',()=>console.log('Isolated real API ready: http://127.0.0.1:8091'));
  async function stop(){server.close();await require('mongoose').disconnect();await mongo.stop();process.exit(0)}
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
})().catch(err=>{console.error(err.name,err.message);process.exit(1)});
