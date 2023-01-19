const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Tags = require('../../models/Tags')
const {check, validationResult} = require('express-validator');
router.get('/me',auth, async(req,res) => {
    try{
        const tags = await Tags.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if (!tags) {
            return res.status(400).json({msg:'There is no tags for this user'})
        }
        res.json(tags)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/',[auth,[
    check('label','Label is required').not().isEmpty(),
]],async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
       id,
       label
    } = req.body

    const tagsFields = {};
    tagsFields.user=req.user.id;
    if(id)tagsFields.id=id;
    if(label)tagsFields.label=label;

    try {
        let tags = await Tags.findOne({user: req.user.id});

        if(tags){
            tags = await Tags.findOneAndUpdate(
                {user: req.user.id},
                {$set: tagsFields},
                {new:true}
            )

            return res.json(tags);
        }

        tags = new Tags(tagsFields);
        await tags.save();
        res.json(tags)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;