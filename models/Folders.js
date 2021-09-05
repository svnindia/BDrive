const mongoose = require('./Connect');
const BaseObject = require('./BaseObject');

const FolderSchema = mongoose.Schema({
  totalFiles: Number,
});
const FolderModel = BaseObject.discriminator('folder', FolderSchema);
module.exports = FolderModel