const mongoose = require("mongoose");

const logInSchema = new mongoose.Schema({
    name: String,
    password: String,
    medications: [
        {
            medicine: String,
            time: String,
            days: String,
        },
    ],
});

const LogInCollection = mongoose.model("LogIn", logInSchema);

module.exports = LogInCollection;
