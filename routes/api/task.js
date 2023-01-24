const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const adminauth = require('../../middleware/adminauth')
const Task = require('../../models/Task')
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
router.get('/me',auth, async(req,res) => {
    try{
        const task = await Task.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if (!task) {
            return res.status(400).json({msg:'There is no Task for this user'})
        }
        res.json(task)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/all',auth, async(req,res) => {
    try{
        const task = await Task.find({user: req.user.id}).populate('user',['name','avatar']);

        if (!task) {
            return res.status(400).json({msg:'There is no Task for this user'})
        }
        res.json(task)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
router.get('/alluser',adminauth, async(req,res) => {
    try{
        const alltask = await Task.find({}).populate('user',['name','avatar']);

        if (!alltask) {
            return res.status(400).json({msg:'There is no Task'})
        }
        res.json(alltask)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('markdown','Markdown is required').not().isEmpty()
]],async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
       title,
       markdown,
       tagIds
    } = req.body

    const taskFields = {};
    taskFields.user=req.user.id;
    if(title)taskFields.title=title;
    if(markdown)taskFields.markdown=markdown;
    if(tagIds){taskFields.tagIds=tagIds.split(',').map(tagid=>tagid.trim())};

    try {
        let task = await Task.findOne({user: req.user.id});

        if(task){
            task = await Task.findOneAndUpdate(
                {user: req.user.id},
                {$set: taskFields},
                {new:true}
            )

            return res.json(task);
        }
       

         task = new Task(taskFields);
        await task.save();
        res.json(task)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.delete('/', auth, async(req,res) => {
    try{
        await Task.findOneAndDelete({ _id: req.user.id});

        res.json({msg: 'Task removed'})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')

    }
})
router.delete('/:task_id', auth, async(req,res) => {
    try{
        await Task.findOneAndRemove({id:req.params.task_id});
        res.json({msg: 'Task removed'})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')

    }
})

module.exports = router;