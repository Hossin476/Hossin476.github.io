const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const bcrypt = require('bcryptjs');
const googleUser = require('../models/google');

passport.use(new passportGoogle({
    callbackURL: '/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const user = await googleUser.findOne({ googleId: profile.id });
        if (user) {
            done(null, user);
        } else {
            const newUser = await new googleUser({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: profile.id
            }).save();
            done(null, newUser);
        }
    } catch (error) {
        console.log(error.message);
    }
}));