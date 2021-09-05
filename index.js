const express = require('express');
const app = express();
const port = 3000;
const { isError } = require('lodash')

const defaultRouter = require('./routes/index');
const folderRouter = require('./routes/folders');
const fileRouter = require('./routes/files');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/v1/', defaultRouter)
app.use('/v1/files', fileRouter);
app.use('/v1/folders', folderRouter)
app.use((err, req, res) => {
  let errObj = err
  if (isError(errObj)) {
    errObj = {}
    errObj.message = err.toString();
  }
  return res.status(500).json(errObj);
})
app.listen(port, ()=> console.log(`Server listening on ${port}`))
