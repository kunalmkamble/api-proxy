This is http proxy utility created for handing of the CORS issue. 

How it works?
This middleware could be used as a proxy server. So that all the reuqest from the client would be redirected vi this. 

Beofre you run 
Update the server.js with with approporiate target API server. Replace target from the below mentioned line from ./server.js
const proxy = httpProxy.createProxyServer({ target: 'http://localhost:1337', changeOrigin: true });

How to run?
> npm i 
> node ./server.js