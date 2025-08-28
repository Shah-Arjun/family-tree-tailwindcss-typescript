const express = require('express');
const app = express();


//api for home page--> '/'
app.get("/", (req, res) => {
    res.send("this is home page");
})



//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Servr running on port ${PORT}`)});
