const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Log requests
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Handle proxy requests
app.use('/proxy', async (req, res) => {
    try {
        const proxyResponse = await axios({
            method: req.method,
            url: `https://api.example.com${req.url}`,
            headers: { ...req.headers, host: 'api.example.com' }, // Forward headers
            data: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
        });

        // Forward the response headers
        res.set(proxyResponse.headers);

        // Send the response body
        res.status(proxyResponse.status).send(proxyResponse.data);
    } catch (error) {
        console.error(`Proxy Error: ${error.message}`);
        res.status(500).send('Proxy Error');
    }
});

// Set up HTTPS server
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('public-cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
