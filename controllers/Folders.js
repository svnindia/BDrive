const _ = require('lodash')
const { perPage } = require('../config/settings')
const Folder = require('../models/Folders');
const BaseObject = require('../models/BaseObject');
const { validObjectId } = require('./validation')
let ctrl = {
  async validate(req, res, next) {
    console.log(req.body)
    const data = _.pick(req.body, ['name', 'driveId', 'parentId']);
    let errorMsg = []
    if (_.isEmpty(data.name)) {
      errorMsg.push({ code: 2, message: 'Folder Name Cant be empty'})
    }
    if (_.isEmpty(data.driveId) || !validObjectId(data.driveId)) {
      errorMsg.push({ code: 1, message: 'Drive Info missing'})
    }
    if (errorMsg.length > 0) {
      res.status(400).json({ code: 1, errors: errorMsg})
    } else {
      req.newFolder = data;
      if (!_.isEmpty(data.parentId) && validObjectId(data.parentId)) {
        req.newFolder.parentId = data.parentId;
      }
      return next();
    }
  },
  async create(req, res, next) {
    if (!req.newFolder) res.status(500).json({code: 5, message: 'Server Error' })
    const newFolder = Folder(req.newFolder)
    try {
      const resFolder = await newFolder.save();
      res.status(200).json(resFolder);
    } catch(err) {
      next(err)
    }
    return next();
  },
  async get(req, res, next) {
    console.log(req.params, req.query)
    const arg = _.defaults(req.query, { page: 1 })
    const skip = (arg.page-1) * perPage;
    const qry = { __t: 'folder' }
    if (req.params.folderId) {
      qry.parent = req.params.folderId;
    }
    const promiseArr = [
      Folder.find(qry).count(),
      Folder.find(qry).skip(skip).limit(perPage)
    ]
    const rec = await Promise.all(promiseArr);
    res.status(200).json({ total: rec[0], data: rec[1] })
  },
  async rename(req, res, next) {
    console.log(req.body, req.params);
    if (_.isEmpty(req.body.name)) {
      res.status(400).json({ code: 2, message: 'Folder Name Cant be empty'})
    }
    const folderId = req.params.folderId;
    if (_.isEmpty(folderId) && !validObjectId(folderId)) {
      res.status(400).json({ code: 21, message: 'Folder Id not valid'})
    }
    const name = req.body.name;
    const resFolder = await BaseObject.updateOne({ _id: req.params.folderId }, { $set: { name} })
    res.status(200).json({ message: 'Folder Name updated' });
  },
  async remove(req, res, next) {
    console.log(req.body, req.params);
    const folderId = req.params.folderId;
    if (_.isEmpty(folderId) && !validObjectId(folderId)) {
      res.status(400).json({ code: 21, message: 'Folder Id not valid'})
    }
    const archived = {
      value: true,
      at: Date.now()
    }
    const resFolder = await BaseObject.updateMany({$or: [{ parentId: folderId }, { _id: folderId }]}, { $set: { archived }})
    res.status(200).json({ message: 'Folder and contents archived' });
  }
}

module.exports = ctrl;