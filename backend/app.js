const express = require('express');           // Import the Express library
const cors = require("cors");
const { connectDatabase } = require("./database/db");
require("dotenv").config();               // Load environment variables from .env

const app = express();           // create express app


//middleware
app.use(cors());            // allow forntend to call backend
app.use(express.json());    // parse incoming JSON body


// import routes   , mounting the routes/api's
const familyRoutes = require('./routes/familyRoutes');
app.use('/api/family', familyRoutes);   //base route for all other routes




//DB connection function called from database/db.js
connectDatabase();


//api for home page--> '/'
app.get("/", (req, res) => {
    res.send("this is home page");
})





//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Servr running on port ${PORT}`)});
