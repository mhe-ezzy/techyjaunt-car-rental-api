const express = require('express');
const dotenv = require('dotenv'); // Keep this
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/user.routes');
const carRouter = require('./src/routes/cars.routes');
const paymentRouter = require('./src/routes/payment.routes');

// THIS LINE MUST BE HERE, AT THE VERY TOP
dotenv.config(); 

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4500;

app.get('/', (req, res) => {
    res.send('Welcome To My Home Page');
});

app.use('/api/users', userRouter);
app.use('/api/cars', carRouter);
app.use('/api/payments', paymentRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
});