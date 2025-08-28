// DB connextion code goes here

const mongoose = require("mongoose");


//making and exporting DB connection arrow function at the same time
exports.connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI,  {      //establish connextion between nodejs and mongoDB
        useNewUrlParser: true,                      //Uses the new MongoDB connection string parser.
         useUnifiedTopology: true                  //Uses the new MongoDB driver engine for handling connections, monitoring, and failovers.
         })  
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log(err));
}