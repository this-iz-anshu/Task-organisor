// const mongoose = require('mongoose');

require('../db/mongoose.js');
const Task = require('../model/tasks.js');

//remove a given task by id . will use findOneAndRemove




// Task.findByIdAndRemove("61d7ae1765907d659bb72c5f").then((task) => {
//     console.log(task)
// }).catch((err) => {
//     console.log(err);
// })


const deletAndCount = async (id) => {
    const task=await Task.findByIdAndDelete(id);
      const count = await Task.countDocuments({ id });
    return count;
}
deletAndCount("61d7ae4065907d659bb72c65").then((count) => {
    console.log(count);
}).catch((er) => {
    console.log(er);
})


