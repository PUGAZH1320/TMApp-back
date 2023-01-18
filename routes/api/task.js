const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');

const Task = require('../../models/Task')
router.post('/',[
    check('personId','Name is required').not().isEmpty(),
    check('title','Name is required').not().isEmpty(),
    check('markdown','Name is required').not().isEmpty(),
    check('tags','Name is required').not().isEmpty(),

],async (req,res) =>{
    const errors = validationResult (req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {personId,title, markdown, tags } = req.body
    try {
        task = new Task ({
            personId,
            title,
            markdown,
            tags
        })


        await task.save();

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
    
} )

module.exports = router;