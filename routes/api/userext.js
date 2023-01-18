const express = require('express');
const router = express.Router();
const User = require('../../models/User')

router.get('/', (req,res) => {
       User.find({},{"name":1,"email":1}).then((result)=>{
        res.send(result)
       }).catch((err) =>{
        console.log(err)
       })
})

module.exports = router;