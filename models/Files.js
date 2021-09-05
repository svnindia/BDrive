const mongoose = require('./Connect');
const BaseObject = require('./BaseObject');

const FileSchema = mongoose.Schema({
  url: String
})
FileSchema.post('save', (next)=>{
  // update the folder.totalFiles
  return next()
})
const FileModel = BaseObject.discriminator('file', FileSchema);
module.exports = FileModel