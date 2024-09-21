const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./models/user');
const Address = require('./models/address');

const app = express();
app.use(bodyParser.json());

// Serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://kvishalgoud:<db_password>@cluster0.sgrnvnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// POST route to create a user and address
app.post('/submit', async (req, res) => {
    const { name, address } = req.body;

    try {
        // Create new user
        const user = new User({ name });
        await user.save();

        // Create new address linked to the user
        const userAddress = new Address({ address, user: user._id });
        await userAddress.save();

        // Add address to user's addresses array
        user.addresses.push(userAddress._id);
        await user.save();

        res.status(201).json({ message: 'User and Address created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all users with their addresses (for testing purposes)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('addresses');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
