const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

if (!process.env.DATABASE) throw new Error('DATABASE is required');
if (process.env.DATABASE.includes('<password>') && !process.env.DATABASE_PASSWORD) throw new Error('DATABASE_PASSWORD is required');
if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_DAY) throw new Error('JWT_SECRET and JWT_EXPIRES_DAY are required');
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD || '').replace('Database', 'metawall');
module.exports = mongoose.connect(DB, { serverSelectionTimeoutMS: 15000 });
