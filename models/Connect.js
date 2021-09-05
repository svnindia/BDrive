const mongoose = require('mongoose');
const { mongo } = require('../config/settings') 
const process = require('process');

mongoose.set('debug', true);

mongoose.connect(`${mongo.url}${mongo.dbname}`)
process.on('SIGINT', ()=>{
  console.log('exit...');
  return mongoose.connection.close(()=> { 
    console.log('DB Close...');
    return process.exit(0)
  });
})
module.exports = mongoose;