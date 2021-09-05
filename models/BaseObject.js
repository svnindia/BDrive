const { boolean } = require('webidl-conversions');
const mongoose = require('./Connect');

const BaseObjectSchema = mongoose.Schema({
  name: String,
  driveId: mongoose.Schema.Types.ObjectId,
  parentId: mongoose.Schema.Types.ObjectId,
  created: {
    by: mongoose.Schema.Types.ObjectId,
    at: {
      type: Date,
      default: Date.now
    }
  },
  modified: {
    by: mongoose.Schema.Types.ObjectId,
    at: {
      type: Date,
      default: Date.now
    }
  },
  archived: {
    value: {
      type: Boolean,
      default: false
    },
    by: mongoose.Schema.Types.ObjectId,
    at: {
      type: Date,
    }
  }
  
});

BaseObjectSchema.virtual('isParent', ()=>{
  return !this.parent
})

module.exports = mongoose.model('BaseObject',BaseObjectSchema);