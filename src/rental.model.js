const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    renterName: {
        type: String,
        required: true
    },
    renterEmail: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    txRef: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['successful', 'failed', 'pending'],
        default: 'pending'
    },
    dateRented: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rental', rentalSchema);