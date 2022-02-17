const express = require('express');
const User = require('../model/User.js');
const auth = require('../middleware/auth')
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const welMsg = require('../emails/account');

//multer config
const fileUpload = multer({
    limits: {
        fileSize: 500000
    },
    fileFilter:function (req,file,cb)
    {
        if (!file.originalname.match( /\.jpg/))
        {
            return cb(new Error('please provide pdf'))
        }
        cb(undefined,true)
    }
});

//CRUD
//READ

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.send(error);
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        welMsg.welMsg(user.name, user.email);
        const token = await  user.generateToken();
        res.send({user:user,token:token});
    } catch (error) {
        res.send(error);
    }
})


router.post('/users/login' , async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
       
        const token = await user.generateToken()
        res.send({user:user,token:token});
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/users/logout' ,auth,async (req, res) => {
    try {
        
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send("successfully logout")
    } catch (error) {
        res.status(400).send()
        console.log(error)
    }
})

router.post('/users/logoutAll',auth, async (req, res) =>
{
    try {
        req.user.tokens = [];
   await req.user.save();
    res.send("successfully log out from all session")
    } catch (error) {
        res.status(400).send(error);
    }
    
})

router.patch('/me/update', auth, async (req, res) => {
    
    const updates = ['password', 'age', 'name'];
    const userInput = Object.keys(req.body);
    const isValidate = userInput.every((update) => {
        return updates.includes(update);
    })
    if (!isValidate)
    {
        return res.send('update not available')
    }
    try {
        const user = req.user;

        userInput.forEach((update) => user[update] = req.body[update])
        await user.save()

        // const user = await User.findById(req.params.id);
        // userInput.forEach((input) =>user[input]=req.body[input])
        // await user.save();

        // const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
       
            res.send(user);
        
        
    } catch (error) {
        res.status(404).send(error);
    }
})

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/me/avator', auth, fileUpload.single('avator'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();
    req.user.avator = buffer;
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error:error.message})
})

//delete avator

router.delete('/users/me/avator/delete', auth, async (req, res) => {
    req.user.avator = undefined;
    await req.user.save()
    res.send();
})

router.get('/user/:id/avator', async (req, res) => {

try {
    const user = await User.findById(req.params.id)
    const avator=user.avator
    if (!user || !avator)
    {
       throw new error()
    }
    res.set('Content-Type', 'image/png');
    res.send(avator);
} catch (error) {
    res.status(400).send()
    console.log(error)
}
})

router.delete('/users/delete', auth, async (req, res) => {
    req.user.avator = '';
    await req.user.save();
    res.send("successfull deleter");
})


module.exports = router;