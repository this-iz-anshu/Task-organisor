const express = require('express');
const multer = require('multer');
require('../db/mongoose.js');
const Task=require('../model/tasks')
const UserRouter = require('../routers/userRouter');
const taskRouter = require('../routers/taskRouter');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const app = express(); 
app.use(express.json());
app.use(UserRouter);
app.use(taskRouter);

const upload = multer({ dest: 'images' });

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})


// const token = async () => jwt.sign({ _id: "123" }, "this is my new course") ;
// console.log(token()) 




// const main = async () => {
//     const task = await Task.findById("61f97f2a6a63e1f72eff1313");
//     await task.populate('owner') 
//     console.log(task.owner);
// }
// main();

app.listen(port, () => {
    console.log('server is up on port' + process.env.PORT);
})


