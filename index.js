const express = require('express');
const app = express();
const port = 3000;

const defaultRouter = require('./routes/index');
const folderRouter = require('./routes/folders');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/v1/', defaultRouter)
app.use('/v1/folders', folderRouter)
app.listen(port, ()=> console.log(`Server listening on ${port}`))
