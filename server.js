const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

//Init middleware
app.use(express.json({extended:false}));

//Routes
app.use("/api/auth/a",(req,res)=>{
    res.status(200).json({msg:'yeah'})
})
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/posts", require("./routes/comments"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

