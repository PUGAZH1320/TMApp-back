const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check, validationResult} = require('express-validator');
router.get('/me',auth, async(req,res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if (!profile) {
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/',[auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]],async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
       company,
       website,
       location,
       status,
       skills,
       bio,
       githubusername, 
    } = req.body

    const profileFields = {};
    profileFields.user=req.user.id;
    if(company)profileFields.company=company;
    if(website)profileFields.website=website;
    if(location)profileFields.location=location;
    if(status)profileFields.status=status;
    if(skills){profileFields.skills=skills.split(',').map(skill=>skill.trim())};
    if(bio)profileFields.bio=bio;
    if(githubusername)profileFields.githubusername=githubusername;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new:true}
            )

            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;