const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    discription: {
        required: true,
        trim: true,
        type:String
    },
    status: {
        type: Boolean,
        required:true
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},
    {
        timestamps:true
    }
);

const Task = mongoose.model('task', taskSchema);



module.exports = Task;