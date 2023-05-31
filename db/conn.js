const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/unoindia")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Database Not Connected");
    })