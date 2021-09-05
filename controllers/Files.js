let ctrl = {
  create(req, res, next) {
    const data = {
      __t: 'folder',
      name: 'root'
    }
    res.status(200).json(data)
  },
  get(req, res, next) {

  },
  rename(req, res, next) {

  },
  remove(req, res, next) {

  }
}

module.exports = ctrl;