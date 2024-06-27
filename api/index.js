const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const BookingModel = require('./models/Booking.js');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = 'fdahjfhs43u128vu8s9df';

app.use(express.json());
app.use(cookieParser());
// Allows images to be accessed by api
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.ATLAS_URI);

// Grabs the userData using the request to verify the session
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => { // Verifies user token
            if (err) throw err;
            resolve(userData);
        }); 
    });
}

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
    const newName = 'photo' + Date.now()+'.jpg';
    await imageDownloader.image ({
        url: link,
        dest: __dirname+'/uploads/'+newName // __dirname gets full directory name, more safe
    });
    res.json(newName);
})

const photosMiddleware = multer({dest: 'uploads/'});
// Maximum number of photos is 100
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    // Adds extension to uploaded files
    for (let i=0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.'); //Array of every part of the string
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath); // Changes path of files
        uploadedFiles.push(newPath.replace('uploads\\', '')); // Pushes new path to the array of uploaded files
    }
    res.json(uploadedFiles);
});

// Fills Place model before uploading to data base
app.post('/places', (req, res) => {
    const {token} = req.cookies; // Grabs user token
    const {
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verifies user token
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id, // Grabs user id from token
            title, address, photos: addedPhotos, description, // Photos need to be inside models schema
            perks, extraInfo, checkIn, checkOut, maxGuests, price,
        });
        res.json(placeDoc);
    });
});

app.get('/user-places', (req, res) => {
    const {token} = req.cookies; // Grabs user token
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verifies user token
        const {id} = userData;
        res.json( await Place.find({owner: id}) ); // JSON response with all places where the owner matches the id
    });
});

// Api endpoint for filling in form when updating places
app.get('/places/:id', async (req, res) => {
    const {id} = req.params; // Grabs page id
    res.json(await Place.findById(id));
});

// Update place in mongodb
app.put('/places', async (req, res) => {
    const {token} = req.cookies; // Grabs user token
    const {
        id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    // Grabs user id
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verifies user token
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json( await Place.find() );
})

app.post('/bookings', async (req, res) => {
    // Place is place id
    // Grabs required variables from req body
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price
    } = req.body;
    BookingModel.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});

app.get('/bookings', async (req, res) => {
    // First need to grab token because they are private
    const userData = await getUserDataFromReq(req); // Grabs user data after verifying token
    res.json( await BookingModel.find({user: userData.id}).populate('place') );
});

app.listen(4000);