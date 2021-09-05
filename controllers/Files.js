const _ = require('lodash')
const { perPage } = require('../config/settings')
const File = require('../models/Files');
const BaseObject = require('../models/BaseObject');
const { validObjectId } = require('./validation')

let ctrl = {
  async validate(req, res, next) {
    console.log(req.body)
    const data = _.pick(req.body, ['driveId', 'parentId', 'name']);
    let errorMsg = []
    if (_.isEmpty(data.name)) {
      errorMsg.push({ code:3, message: 'File Info Missing'})
    }
    if (_.isEmpty(data.driveId) || !validObjectId(data.driveId)) {
      errorMsg.push({ code: 1, message: 'Drive Info missing'})
    }
    if (_.isEmpty(data.parentId) || !validObjectId(data.parentId)) {
      errorMsg.push({ code: 21, message: 'Folder Info missing'})
    }

    if (errorMsg.length > 0) {
      res.status(400).json({ code: 1, errors: errorMsg})
    } else {
      req.newFile = data;
      return next();
    }
  },
  async create(req, res, next) {
    if (!req.newFile) res.status(500).json({code: 5, message: 'Server Error' })
    const newFile = File(req.newFile)
    try {
      const resFile = await newFile.save();
      const parentObj = await BaseObject.findOne({ _id: newFile.parentId });
      console.log('allFolders', parentObj)
      if (parentObj) {
        parentObj.allFolders.push(newFile.parentId)
        await BaseObject.updateMany(
          {
            __t: 'folders',
            _id: { $in: parentObj.allFolders }
          },
          { $inc: { totalFiles: 1 } }
        )
      }
      res.status(200).json(resFile);
    } catch(err) {
      next(err)
    }
    // next();
  },
  async get(req, res, next) {
    console.log(req.params, req.query)
    const arg = _.defaults(req.query, { page: 1 })
    const skip = (arg.page-1) * perPage;
    const qry = {}
    if (req.params.folderId) {
      qry.parentId = req.params.folderId;
    }
    if (req.params.driveId) {
      qry.driveId = req.params.driveId;
    }
    if (req.query.search) {
      qry.__t = 'files';
      qry.name = req.query.search
    }
    if (req.query.type == 'top10') {
      const expr = new RegExp(`^${req.query.search}`)
      qry.name = expr
    }
    const promiseArr = [
      BaseObject.find(qry).count(),
      BaseObject.find(qry).sort('-__t name').skip(skip).limit(perPage)
    ]
    const rec = await Promise.all(promiseArr);
    res.status(200).json({ total: rec[0], data: rec[1] })
  },
  async rename(req, res, next) {
    console.log(req.body, req.params);
    const errors = [];
    if (_.isEmpty(req.body.name)) {
      errors.push({ code: 2, message: 'File Name Cant be empty'})
    }
    const fileId = req.params.fileId;
    if (_.isEmpty(fileId) && !validObjectId(fileId)) {
      errors.push({ code: 21, message: 'File Id not valid'})
    }
    if (errors.length > 0) {
      return res.status(400).json({ code: 2, errors: errors});
    }

    const name = req.body.name;
    const resFile = await File.updateOne({ _id: fileId }, { $set: { name} })
    return res.status(200).json({ message: 'File Name updated' });
  },
  async remove(req, res, next) {
    console.log(req.body, req.params);
    const fileId = req.params.fileId;
    if (_.isEmpty(fileId) && !validObjectId(fileId)) {
      res.status(400).json({ code: 21, message: 'File Id not valid'})
    }
    const archived = {
      value: true,
      at: Date.now()
    }
    const resFolder = await File.updateOne({ _id: fileId }, { $set: { archived }})
    res.status(200).json({ message: 'File archived' });
  }
}

module.exports = ctrl;