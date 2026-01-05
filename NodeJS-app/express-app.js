// Express.js Server - More advanced and feature-rich
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from 'public' directory

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Express.js Server</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                .hero {
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    color: white;
                    padding: 60px 0;
                    margin-bottom: 40px;
                }
                .feature-icon {
                    width: 60px;
                    height: 60px;
                    background-color: #6a11cb;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: white;
                    font-size: 24px;
                }
                .card {
                    transition: transform 0.3s;
                    height: 100%;
                }
                .card:hover {
                    transform: translateY(-5px);
                }
                .api-test {
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    padding: 30px;
                }
            </style>
        </head>
        <body>
            <div class="hero text-center">
                <div class="container">
                    <h1 class="display-4 fw-bold">Express.js Web Server</h1>
                    <p class="lead">A modern, feature-rich web server built with Node.js and Express</p>
                    <a href="/api" class="btn btn-light btn-lg mt-3">Explore API</a>
                </div>
            </div>
            
            <div class="container">
                <div class="row mb-5">
                    <div class="col-md-4 mb-4">
                        <div class="card text-center p-4">
                            <div class="feature-icon">
                                <i class="fas fa-bolt"></i>
                            </div>
                            <h4>Fast & Efficient</h4>
                            <p>Built on Node.js for high performance and low latency responses.</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card text-center p-4">
                            <div class="feature-icon">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <h4>RESTful API</h4>
                            <p>Complete REST API with CRUD operations and JSON responses.</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card text-center p-4">
                            <div class="feature-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h4>Secure</h4>
                            <p>Built-in security features and middleware protection.</p>
                        </div>
                    </div>
                </div>
                
                <div class="api-test mb-5">
                    <h3 class="mb-4">Test the API</h3>
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <a href="/api/users" class="btn btn-primary w-100">GET Users</a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="/api/products" class="btn btn-success w-100">GET Products</a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="/api/status" class="btn btn-info w-100">Server Status</a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="/api/docs" class="btn btn-secondary w-100">API Docs</a>
                        </div>
                    </div>
                </div>
                
                <h3 class="mb-4">Quick Links</h3>
                <div class="row">
                    <div class="col-md-6">
                        <div class="list-group">
                            <a href="/admin" class="list-group-item list-group-item-action">Admin Panel</a>
                            <a href="/about" class="list-group-item list-group-item-action">About This Server</a>
                            <a href="/contact" class="list-group-item list-group-item-action">Contact</a>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Server Info</h5>
                                <p class="card-text">
                                    <strong>Port:</strong> ${PORT}<br>
                                    <strong>Node.js:</strong> ${process.version}<br>
                                    <strong>Platform:</strong> ${process.platform}<br>
                                    <strong>Uptime:</strong> ${Math.floor(process.uptime())} seconds
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer class="bg-dark text-white text-center py-4 mt-5">
                <div class="container">
                    <p>Express.js Server &copy; 2023 | Running on port ${PORT}</p>
                </div>
            </footer>
            
            <script src="https://kit.fontawesome.com/your-fontawesome-kit.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

// API Routes
app.get('/api', (req, res) => {
    const apiInfo = {
        name: "Express API",
        version: "1.0.0",
        endpoints: [
            { method: "GET", path: "/api/users", description: "Get all users" },
            { method: "GET", path: "/api/users/:id", description: "Get user by ID" },
            { method: "POST", path: "/api/users", description: "Create new user" },
            { method: "GET", path: "/api/products", description: "Get all products" },
            { method: "GET", path: "/api/status", description: "Get server status" },
            { method: "GET", path: "/api/docs", description: "API documentation" }
        ],
        documentation: "Visit /api/docs for detailed API documentation"
    };
    res.json(apiInfo);
});

// Sample data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

let products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 15 },
    { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics', stock: 30 },
    { id: 3, name: 'Headphones', price: 149.99, category: 'Electronics', stock: 50 },
    { id: 4, name: 'Desk Chair', price: 199.99, category: 'Furniture', stock: 20 }
];

// Users API
app.get('/api/users', (req, res) => {
    res.json({ users: users });
});

app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (user) {
        res.json({ user: user });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || 'user'
    };
    
    users.push(newUser);
    res.status(201).json({ message: 'User created', user: newUser });
});

// Products API
app.get('/api/products', (req, res) => {
    res.json({ products: products });
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (product) {
        res.json({ product: product });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Server status
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
    };
    res.json(status);
});

// API Documentation
app.get('/api/docs', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>API Documentation</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding-top: 20px; background-color: #f5f5f5; }
                .endpoint { background-color: white; border-radius: 5px; padding: 15px; margin-bottom: 10px; }
                .method-get { border-left: 5px solid #28a745; }
                .method-post { border-left: 5px solid #007bff; }
                .method-put { border-left: 5px solid #ffc107; }
                .method-delete { border-left: 5px solid #dc3545; }
                code { background-color: #f8f9fa; padding: 2px 5px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="mb-4">API Documentation</h1>
                
                <div class="endpoint method-get">
                    <h4><span class="badge bg-success">GET</span> /api/users</h4>
                    <p>Retrieve all users</p>
                    <p><strong>Response:</strong> JSON array of user objects</p>
                </div>
                
                <div class="endpoint method-get">
                    <h4><span class="badge bg-success">GET</span> /api/users/:id</h4>
                    <p>Retrieve a specific user by ID</p>
                    <p><strong>Parameters:</strong> id (integer)</p>
                </div>
                
                <div class="endpoint method-post">
                    <h4><span class="badge bg-primary">POST</span> /api/users</h4>
                    <p>Create a new user</p>
                    <p><strong>Body:</strong> { "name": "string", "email": "string", "role": "string" }</p>
                </div>
                
                <div class="endpoint method-get">
                    <h4><span class="badge bg-success">GET</span> /api/products</h4>
                    <p>Retrieve all products</p>
                </div>
                
                <div class="endpoint method-get">
                    <h4><span class="badge bg-success">GET</span> /api/status</h4>
                    <p>Get server status information</p>
                </div>
                
                <a href="/" class="btn btn-secondary mt-3">Back to Home</a>
            </div>
        </body>
        </html>
    `);
});

// Admin panel (protected route example)
app.get('/admin', (req, res) => {
    // In a real app, you would check authentication here
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Panel</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Admin Panel</h1>
                <p>This is a protected admin area. In a real application, this would require authentication.</p>
                
                <div class="card mt-4">
                    <div class="card-header">Server Management</div>
                    <div class="card-body">
                        <h5 class="card-title">Quick Actions</h5>
                        <div class="row mt-3">
                            <div class="col-md-3 mb-2">
                                <a href="/api/status" class="btn btn-info w-100">Server Status</a>
                            </div>
                            <div class="col-md-3 mb-2">
                                <button class="btn btn-warning w-100">Restart Services</button>
                            </div>
                            <div class="col-md-3 mb-2">
                                <button class="btn btn-danger w-100">Emergency Stop</button>
                            </div>
                            <div class="col-md-3 mb-2">
                                <a href="/api/users" class="btn btn-success w-100">View Users</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <a href="/" class="btn btn-secondary mt-3">Back to Home</a>
            </div>
        </body>
        </html>
    `);
});

// About page
app.get('/about', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>About</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h1>About This Server</h1>
                <p>This is an Express.js web server demonstrating REST API capabilities and web serving.</p>
                
                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Technical Stack</h5>
                        <ul>
                            <li><strong>Runtime:</strong> Node.js ${process.version}</li>
                            <li><strong>Framework:</strong> Express.js</li>
                            <li><strong>Template Engine:</strong> HTML with inline templates</li>
                            <li><strong>CSS Framework:</strong> Bootstrap 5</li>
                        </ul>
                    </div>
                </div>
                
                <a href="/" class="btn btn-primary mt-3">Back to Home</a>
            </div>
        </body>
        </html>
    `);
});

// Contact page
app.get('/contact', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contact</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Contact Us</h1>
                <p>This is a demonstration contact page. In a real application, this would include a working contact form.</p>
                
                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Contact Information</h5>
                        <p><strong>Email:</strong> admin@example.com</p>
                        <p><strong>Server:</strong> localhost:${PORT}</p>
                        <p><strong>Status:</strong> Online</p>
                    </div>
                </div>
                
                <a href="/" class="btn btn-primary mt-3">Back to Home</a>
            </div>
        </body>
        </html>
    `);
});

// File upload endpoint (example)
app.post('/api/upload', (req, res) => {
    // This is a simple example - in real app you'd use multer or similar
    res.json({
        message: 'File upload endpoint',
        note: 'In a real application, this would handle file uploads'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container mt-5 text-center">
                <h1 class="display-1 text-danger">404</h1>
                <h2 class="mb-4">Page Not Found</h2>
                <p class="lead">The page you are looking for does not exist.</p>
                <a href="/" class="btn btn-primary">Go to Homepage</a>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Express server running at http://localhost:${PORT}`);
    console.log(`📁 Homepage: http://localhost:${PORT}/`);
    console.log(`📊 API Base: http://localhost:${PORT}/api`);
    console.log(`👤 Admin: http://localhost:${PORT}/admin`);
    console.log(`\nEndpoints:`);
    console.log(`  GET  /api/users     - Get all users`);
    console.log(`  GET  /api/products  - Get all products`);
    console.log(`  GET  /api/status    - Get server status`);
    console.log(`  POST /api/users     - Create new user`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

// Create public directory if it doesn't exist
fs.mkdir('public', { recursive: true }).catch(console.error);