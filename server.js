const express = require('express');
const https = require('https');
const fs = require('fs');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Create a generic proxy server
const proxy = httpProxy.createProxyServer({
    target: 'http://localhost:1337',
    changeOrigin: true,
    secure: false, // This line may help, but it's not recommended for production
    protocol: 'https:',
});

// Handle proxy requests
app.use('/proxy', (req, res) => {
    proxy.web(req, res);
});

// Log proxy errors
proxy.on('error', (err, req, res) => {
    console.error(err);
    res.status(500).send('Proxy Error');
});

// Set up HTTPS server
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('public-cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
