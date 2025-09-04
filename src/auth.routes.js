const express = require('express');
const router = express.Router();
const { 
    signup,
    login,
    verifyEmail,
    forgotPassword,
    verifyOtp,
    resetPassword,
    initiateGooglrAuth,
    handleGoogleCallback,
    unlinkGoogle,
    setPasswordForGoogleUser
 } = require('../controller/auth.controller');


router.post('/signup', signup); // Signup route
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail); // Email verification route
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password/:userId', resetPassword);
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);
router.delete('/unlink-google/:userId', unlinkGoogle);
router.post('/set-password/:userId', setPasswordForGoogleUser);

module.exports = router;