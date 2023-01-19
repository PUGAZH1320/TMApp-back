const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Task = require('../../models/Task')
const {check, validationResult} = require('express-validator');
router.get('/me',auth, async(req,res) => {
    try{
        const task = await Task.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if (!task) {
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(task)
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
       id,
       title,
       markdown,
       tagIds
    } = req.body

    const taskFields = {};
    taskFields.user=req.user.id;
    if(id)taskFields.id=id;
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

module.exports = router;