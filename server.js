const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
const router = require('./routes/userRouter.js');
app.use('/api', router); // Prefix all routes with /api

app.get('/', (req, res) => {
    res.json({ message: "Hello" });
});

// Start server
app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`);
});
