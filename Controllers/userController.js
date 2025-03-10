const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

exports.register_get = asyncHandler(async (req, res) => {
    res.render('register_form', { title: 'Register' });
});

exports.login_get = asyncHandler(async (req, res) => {
    res.render('login_form', { title: 'Login' });
});

exports.register_post = asyncHandler(async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userExists = await User.findOne({ mail_address: email });
        const user = new User({
            username: email,
            mail_address: email,
            first_name,
            last_name,
            password: hashedPassword,
        });
        if (userExists) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        user.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
})

exports.login_post = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const roleCheck = req.headers['rolecheck'];

    let user = "";
    if (roleCheck === 'true') {
        user = await User.findOne({ mail_address: email, role: 'admin' });
        if (!user) {
            return res.status(403).json("You are not authorized to login");
        }
    } else {
        user = await User.findOne({ mail_address: email });
    }

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1hr' });
        res.json({ auth: true, token });
    } else {
        res.status(401).json('Invalid username or password');
    }
});

exports.login_google = asyncHandler(async (req, res) => {
    const { token } = req.body;
    try {
        const googleUser = await verifyGoogleToken(token);
        const roleCheck = req.headers['rolecheck'];

        let user = "";

        if (roleCheck === 'true') {
            user = await User.findOne({ mail_address: googleUser.email, role: 'admin' });
            if (!user) {
                return res.status(403).json("You are not authorized to login");
            }
        }
        else {
            user = await User.findOne({ mail_address: googleUser.email });
        }

        if (!user) {
            user = new User({
                googleId: googleUser.sub,
                username: googleUser.email,
                mail_address: googleUser.email,
                first_name: googleUser.given_name,
                last_name: googleUser.family_name || '',
            });
            await user.save();
        }


        const jwtToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1hr' });

        res.json({ auth: true, token: jwtToken });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

exports.fetch_user = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
})

exports.update_user = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, bio, imgUrl } = req.body;
        const user = await User.findById(userId);
        user.first_name = first_name;
        user.last_name = last_name;
        user.bio = bio;
        user.imgUrl = imgUrl ? imgUrl : user.imgUrl;
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
});


exports.logout = asyncHandler(async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session', err);
            res.status(500).send('Server error');
        } else {
            res.redirect('/user/login'); // Redirect to login page after logout
        }
    });
});