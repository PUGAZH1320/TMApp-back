const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

connectDB();


app.use(express.json({extended: false}));

app.get ('/',(req,res) => res.send('API running'))

app.use('/api/users', require('./routes/api/users'));
app.use('/api/tasks', require('./routes/api/task'));
app.use('/api/userext', require('./routes/api/userext'));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))