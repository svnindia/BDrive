const mongoose = require('./Connect');
const BaseObject = require('./BaseObject');

const FileSchema = mongoose.Schema({
  url: String
})

const FileModel = BaseObject.discriminator('files', FileSchema);
module.exports = FileModel