const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Create a generic proxy server
const proxy = httpProxy.createProxyServer({ target: 'http://localhost:1337', changeOrigin: true });

// Handle proxy requests
app.use('/', (req, res) => {
    proxy.web(req, res);
});

// Log proxy errors
proxy.on('error', (err, req, res) => {
    console.error(err);
    res.status(500).send('Proxy Error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
