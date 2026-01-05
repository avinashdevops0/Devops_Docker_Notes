// Import the HTTP module
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create the server
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    // Handle different routes
    if (req.url === '/') {
        // Home page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Node.js Server</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f0f0f0;
                    }
                    .container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        border-bottom: 2px solid #4CAF50;
                        padding-bottom: 10px;
                    }
                    .endpoints {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    code {
                        background-color: #eee;
                        padding: 2px 5px;
                        border-radius: 3px;
                        font-family: 'Courier New', monospace;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Node.js HTTP Server</h1>
                    <p>This is a simple HTTP server built with native Node.js modules.</p>
                    
                    <div class="endpoints">
                        <h3>Available Endpoints:</h3>
                        <ul>
                            <li><code>GET /</code> - This home page</li>
                            <li><code>GET /api/data</code> - JSON data endpoint</li>
                            <li><code>GET /api/time</code> - Current server time</li>
                            <li><code>POST /api/echo</code> - Echo back POST data</li>
                            <li><code>GET /about</code> - About page</li>
                        </ul>
                    </div>
                    
                    <div>
                        <a href="/api/data" class="btn">View JSON Data</a>
                        <a href="/api/time" class="btn">Get Server Time</a>
                        <a href="/about" class="btn">About</a>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <h3>Test POST Request:</h3>
                        <form id="echoForm" style="margin-top: 10px;">
                            <input type="text" id="message" placeholder="Enter a message" style="padding: 8px; width: 200px;">
                            <button type="button" onclick="sendPost()" style="padding: 8px 15px; background-color: #2196F3; color: white; border: none; border-radius: 5px;">Send POST</button>
                        </form>
                        <div id="result" style="margin-top: 10px; padding: 10px; background-color: #e8f5e8; border-radius: 5px;"></div>
                    </div>
                    
                    <script>
                        async function sendPost() {
                            const message = document.getElementById('message').value;
                            const resultDiv = document.getElementById('result');
                            
                            if (!message) {
                                resultDiv.innerHTML = '<span style="color: red;">Please enter a message</span>';
                                return;
                            }
                            
                            try {
                                const response = await fetch('/api/echo', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ message: message })
                                });
                                
                                const data = await response.json();
                                resultDiv.innerHTML = \`<strong>Server Response:</strong> \${data.echo}\`;
                            } catch (error) {
                                resultDiv.innerHTML = \`<span style="color: red;">Error: \${error.message}</span>\`;
                            }
                        }
                    </script>
                </div>
            </body>
            </html>
        `);
    }
    else if (req.url === '/api/data') {
        // JSON data endpoint
        const data = {
            message: "Hello from Node.js server!",
            timestamp: new Date().toISOString(),
            server: "Basic HTTP Server",
            endpoints: [
                "/api/data",
                "/api/time",
                "/api/echo",
                "/about"
            ],
            status: "running"
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
    }
    else if (req.url === '/api/time') {
        // Current time endpoint
        const timeData = {
            timestamp: new Date().toISOString(),
            localTime: new Date().toString(),
            unixTime: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(timeData, null, 2));
    }
    else if (req.url === '/api/echo' && req.method === 'POST') {
        // Echo endpoint for POST requests
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = { text: body };
            }
            
            const response = {
                received: parsedBody,
                echo: `You said: ${parsedBody.message || parsedBody.text || 'Something'}`,
                timestamp: new Date().toISOString()
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, null, 2));
        });
    }
    else if (req.url === '/about') {
        // About page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>About - Node.js Server</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f0f0f0;
                    }
                    .container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        border-bottom: 2px solid #2196F3;
                        padding-bottom: 10px;
                    }
                    .back-link {
                        display: inline-block;
                        margin-top: 20px;
                        color: #2196F3;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>About This Server</h1>
                    <p>This is a simple HTTP server built with native Node.js modules.</p>
                    
                    <h3>Features:</h3>
                    <ul>
                        <li>Built with Node.js native HTTP module</li>
                        <li>Multiple API endpoints</li>
                        <li>JSON responses</li>
                        <li>POST request handling</li>
                        <li>HTML page serving</li>
                        <li>CORS headers enabled</li>
                    </ul>
                    
                    <h3>Technical Details:</h3>
                    <ul>
                        <li><strong>Node.js Version:</strong> ${process.version}</li>
                        <li><strong>Platform:</strong> ${process.platform}</li>
                        <li><strong>Server Start Time:</strong> ${new Date().toString()}</li>
                        <li><strong>Memory Usage:</strong> ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</li>
                    </ul>
                    
                    <a href="/" class="back-link">← Back to Home</a>
                </div>
            </body>
            </html>
        `);
    }
    else if (req.url === '/api/users') {
        // Users API endpoint
        const users = [
            { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
            { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
            { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Moderator' }
        ];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: users }, null, 2));
    }
    else {
        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 50px;
                        background-color: #f0f0f0;
                    }
                    .error-container {
                        background-color: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        display: inline-block;
                    }
                    h1 {
                        color: #d32f2f;
                        font-size: 48px;
                        margin: 0;
                    }
                    .back-link {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #2196F3;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>The requested URL ${req.url} was not found on this server.</p>
                    <a href="/" class="back-link">Go to Homepage</a>
                </div>
            </body>
            </html>
        `);
    }
});

// Define the port
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Homepage: http://localhost:${PORT}/`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api/data`);
    console.log(`⏰ Time Endpoint: http://localhost:${PORT}/api/time`);
    console.log(`👥 Users Endpoint: http://localhost:${PORT}/api/users`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Server is shutting down...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});