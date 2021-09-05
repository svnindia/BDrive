const mongoose = require('./Connect');
const BaseObject = require('./BaseObject');

const FolderSchema = mongoose.Schema({
  allFolders: [mongoose.Schema.Types.ObjectId],
  totalFiles: {
    type: Number,
    default: 0
  },
});

const FolderModel = BaseObject.discriminator('folders', FolderSchema);
module.exports = FolderModel