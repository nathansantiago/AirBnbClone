const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = 'fdahjfhs43u128vu8s9df';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.ATLAS_URI);

// cors allows api and client to communicate on different ports
app.get('/test', (req,res) => {
    res.json('test ok');
});

// Api post when registering user
app.post('/register', async (req, res) => {
    const {name, email, password} = req.body; // Puts form inputs into a variable
    try {
        // Creates new user in mongodb
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt), // Want to encrypt passwords first
        });
        res.json(userDoc); // Puts user data into a response when done
    }
    // Catches error expceptions such as duplicate email
    catch (e) {
        res.status(422).json(e);
    }
});

// Api post when logging in
app.post('/login', async (req, res) =>{
    const {email, password} = req.body; // Puts form inputs into a variable
    const userDoc = await User.findOne({email}); // Finds user with email in mongodb
    if (userDoc) { // If email is found
        const passOk = bcrypt.compareSync(password, userDoc.password); // Compares password hashes
        if (passOk) {
            // Create authentication token
            jwt.sign({
                email:userDoc.email, 
                id:userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc); // Creates response cookie to verify user is logged in
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

// Deletes session token when logged in user is logging out
app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
});

// Gets user info on each reload while logged in
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name,email,_id} = await User.findById(userData.id);
            res.json({name,email,_id});
        });
    } else {
        res.json(null);
    }
})

// Uploads photos by link
app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body; // Grabs link from request
    const newName = Date.now()+'.jpg';
    await imageDownloader.image ({
        url: link,
        dest: __dirname+'/uploads/'+newName // __dirname gets full directory name, more safe
    });
    res.json(newName);
})

app.listen(4000);