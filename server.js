const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use environment variables for sensitive information
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY;

const profiles = [
    { name: "Dess 1", passcode: "2356", email: "deskofi96@gmail.com", password: "Dessy71@" },
    { name: "Dess 2", passcode: "3456", email: "deskofi96@gmail.com", password: "Dessy71@" },
    { name: "Dess 3", passcode: "4567", email: "deskofi96@gmail.com", password: "Dessy71@" },
    { name: "Dess 4", passcode: "9876", email: "deskofi96@gmail.com", password: "Dessy71@" },
    { name: "Dess 5", passcode: "2345", email: "deskofi96@gmail.com", password: "Dessy71@" },
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.post('/verify-payment', async (req, res) => {
    const reference = req.body.reference;

    try {
        // Make a request to Paystack to verify the payment
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
            },
        });

        if (response.data.data.status === 'success') {
            // Payment is successful
            const passcode = generatePasscode();
            const profile = getRandomProfile();

            // You may want to store the passcode in a secure manner, like in a database

            // Hash the password before sending it to the client
            const hashedPassword = hashPassword(profile.password);

            // Send the passcode and profile information to the client
            res.json({
                passcode,
                profile: {
                    name: profile.name,
                    passcode: profile.passcode,
                    email: profile.email,
                    password: hashedPassword,
                },
            });
        } else {
            // Payment failed
            res.status(400).json({ status: 'failed', message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function getRandomProfile() {
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    return randomProfile;
}

function generatePasscode() {
    // Generate a random passcode (you may want to implement a more secure method)
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function hashPassword(password) {
    // Implement a secure password hashing algorithm (e.g., bcrypt)
    // For simplicity, this example uses a basic hashing method, which is not secure for production
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
}
