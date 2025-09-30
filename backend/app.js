import express from "express";           // Import the Express library
import cors from "cors";                 // for backend frontend connection
import {connectDatabase} from "./database/db.js"
import dotenv from "dotenv";               // Load environment variables from .env
// import path from "path";                // for photo
// import { fileURLToPath } from "url";    // needed for __dirname  


dotenv.config();
const app = express();           // create express app


//setup for dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)


//middleware
app.use(cors({ origin: "https://family-tree-tailwindcss-typescript-ten.vercel.app" }));            // allow forntend to call backend, allow all origin
app.use(express.json());    // parse incoming JSON body

app.use(express.urlencoded({ extended: true }));


//or restrict to specific frontend origin
// app.use(cors({ origin: "http://localhost:5173" }));


//server uploaded images
// app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));  // to display photo in frontend



// import routes   , mounting the routes/api's
import familyRoutes from './routes/familyRoutes.js';
app.use('/api/family', familyRoutes);   //base route for all other routes

import createUser from './routes/createUser.js'
import login from './routes/login.js'
app.use('/api', createUser)   //for new user
app.use('/api', login)        //for existing user

import userRoutes from './routes/userRoutes.js'
app.use("/api/user", userRoutes)

//DB connection function called from database/db.js
connectDatabase();


//api for home page--> '/'
app.get("/", (req, res) => {
    res.send("this is home page");
})



//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Servr running on port ${PORT}`)});
