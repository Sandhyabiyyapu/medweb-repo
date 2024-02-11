const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/LoginSignup", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define MongoDB schema and model
const logInSchema = new mongoose.Schema({
    name: String,
    password: String,
    medications: [{ medicine: String, time: String, days: String }]
});

const LogInCollection = mongoose.model("LogIn", logInSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

// Session middleware setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            // User already exists
            return res.send("User details already exist");
        }

        // User does not exist, insert new user
        await LogInCollection.create({
            name: req.body.name,
            password: req.body.password
        });

        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });

        if (user && user.password === req.body.password) {
            // Store the user name in the session
            req.session.user = req.body.name;

            res.status(201).render("home", { naming: req.body.name });
        } else {
            res.send("Incorrect credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

});

app.post('/addMedication', async (req, res) => {
    try {
        // Access user name from the session
        const userName = req.session.user;

        const user = await LogInCollection.findOne({ name: userName });

        if (user) {
            user.medications.push({
                medicine: req.body.medicine,
                time: req.body.time,
                days: req.body.days,
            });

            await user.save();

            console.log("Medication added successfully");
            res.status(201).send("Medication added successfully");
        } else {
            console.log("User not found");
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error in /addMedication:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/getUserMedications', async (req, res) => {
    try {
        // Access user name from the session
        const userName = req.session.user;

        const user = await LogInCollection.findOne({ name: userName });

        if (user) {
            // Send the user's medications as JSON response
            res.json(user.medications);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
