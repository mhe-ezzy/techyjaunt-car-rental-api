const Car = require('../models/car.schema'); 
const Rental = require('../models/rental.model'); // NEW
const Flutterwave = require('flutterwave-node-v3');
require('dotenv').config();

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Step 1: Rent a car & start payment
exports.rentCar = async (req, res) => {
    try {
        const { carId, email, name } = req.body;

        if (!carId || !email || !name) {
            return res.status(400).json({ message: "Please provide carId, email, and name" });
        }

        // Find car
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        if (car.isRented) {
            return res.status(400).json({ message: "Car is already rented" });
        }

        // Create Flutterwave payment payload
        const txRef = `TX-${Date.now()}-${carId}`;
        const payload = {
            tx_ref: txRef,
            amount: car.pricePerDay,
            currency: "NGN",
            payment_options: "card, banktransfer, ussd",
            redirect_url: `http://localhost:3000/cars/verify-rent?carId=${carId}&txRef=${txRef}`,
            customer: { email, name },
            customizations: {
                title: "Car Rental Payment",
                description: `Payment for renting ${car.name}`,
                logo: "https://via.placeholder.com/150"
            }
        };

        const response = await flw.Payment.initialize(payload);

        // Save rental record with pending payment
        await Rental.create({
            car: carId,
            renterName: name,
            renterEmail: email,
            amountPaid: car.pricePerDay,
            txRef: txRef,
            paymentStatus: 'pending'
        });

        return res.status(200).json({
            status: "success",
            message: "Redirect to payment link to complete rental",
            paymentLink: response.data.link
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error initiating car rental payment" });
    }
};

// Step 2: Verify payment & update records
exports.verifyRentPayment = async (req, res) => {
    try {
        const transactionId = req.query.transaction_id;
        const carId = req.query.carId;
        const txRef = req.query.txRef;

        const response = await flw.Transaction.verify({ id: transactionId });

        if (response.data.status === "successful") {
            // Mark car as rented
            await Car.findByIdAndUpdate(carId, { isRented: true });

            // Update rental record
            await Rental.findOneAndUpdate(
                { txRef: txRef },
                { paymentStatus: 'successful' },
                { new: true }
            );

            res.send(`Payment successful. Car ${carId} is now rented.`);
        } else {
            // Update rental record as failed
            await Rental.findOneAndUpdate(
                { txRef: txRef },
                { paymentStatus: 'failed' },
                { new: true }
            );

            res.send("Payment failed. Car not rented.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error verifying rent payment");
    }
};
