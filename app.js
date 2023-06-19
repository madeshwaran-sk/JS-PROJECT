require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const router = require("./Routes/router");
const PORT = 4002;
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');


app.use(bodyParser.json()); // <-- this guy!
app.use(busboy());

// middleware
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(router);


app.listen(PORT,()=>{
    console.log(`Server start at Port No :${PORT}`)
})
