const Task = require('../model/tasks');
const auth=require('../middleware/auth')
const express = require('express');
const { response } = require('express');
const { findOneAndDelete } = require('../model/tasks');
const router = express.Router();

//create


router.post('/tasks',auth, async (req, res) => {
   
    try {
        // const task = new Task(req.body);
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400);
    }
})

// getting all data

router.get('/task/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id, owner:req.user.id});
        if (!task)
        {
           return res.send('task dosent exist')
        }
        console.log(task)
        res.send(task);
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }

})
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort={}
    if (req.query.status)
    {
        match.status = req.query.status === 'true'
    }
    if (req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]]=parts[1]==='desc'?-1 :1
    }
    
   try {
       const user = await req.user;
       await console.log(req.query.status)
       await user.populate({
           path: 'tasks',
           match: match,
           options: {
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort:sort
           }
    });
    
    res.send(user.tasks);
   } catch (error) {
       console.log(error)
   }
    
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['discription', 'status'];
    const input = Object.keys(req.body);
    const validate = input.every((update) => {
        return allowedUpdates.includes(update);
    })
    if (!validate)
    {
       return res.send('update not available');
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task)
        {
            return response.status(404).send()
        }
        input.forEach((property) => {
            task[property] = req.body[property];
        })
       
        await task.save();
        res.send(task);
        // const taks=await Task.findByIdAndUpdate(req.params.id,req.body)
    } catch (error) {
        res.status(400).send(error);
        // console.log(error)
    }
})
    
router.delete('/task/:id' , auth , async (req,res)=>{
    try {
        const _id = req.params.id;
        await Task.findOneAndDelete({ _id, owner: req.user.id })
        res.send('delete successfuly')
    } catch (error) {
        res.status(400).send();
        console.log(error)
    }
})

module.exports = router;