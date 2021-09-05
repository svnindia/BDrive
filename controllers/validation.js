const mongoose = require('mongoose');
module.exports = {
  validObjectId: (id)=> {
    try {
      const check = new mongoose.Types.ObjectId(id);
      return (check.toString() == id);
    } catch(err) {
      return false;
    }
    return false
  }
}