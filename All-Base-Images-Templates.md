<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docker Notes</title>
<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        line-height: 1.6;
    }
    header {
        background-color: #2d3e50;
        color: #fff;
        padding: 20px;
        text-align: center;
    }
    h1, h2, h3 {
        color: #2d3e50;
    }
    h2 {
        border-bottom: 2px solid #2d3e50;
        padding-bottom: 5px;
    }
    .container {
        max-width: 1000px;
        margin: auto;
        padding: 20px;
        background-color: #fff;
    }
    pre {
        background-color: #2d3e50;
        color: #fff;
        padding: 15px;
        overflow-x: auto;
        border-radius: 5px;
    }
    code {
        font-family: 'Courier New', Courier, monospace;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
    }
    table, th, td {
        border: 1px solid #2d3e50;
    }
    th, td {
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #2d3e50;
        color: #fff;
    }
    .note {
        background-color: #fff3cd;
        color: #856404;
        border-left: 5px solid #ffeeba;
        padding: 10px;
        margin: 10px 0;
        border-radius: 3px;
    }
    .important {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 5px solid #f5c6cb;
        padding: 10px;
        margin: 10px 0;
        border-radius: 3px;
    }
    a {
        color: #007bff;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
</head>
<body>

<header>
    <h1>Docker Notes: Production-Ready Dockerfiles</h1>
    <p>Nginx, Node.js, Python, Java, PHP – Examples, Explanations, Best Practices</p>
</header>

<div class="container">

<h2>1. General Docker Best Practices</h2>
<ul>
    <li>Use lightweight base images (Alpine, slim) to reduce attack surface.</li>
    <li>Create a non-root system user in the Dockerfile.</li>
    <li>Set correct ownership and permissions for app files and directories.</li>
    <li>Install only production dependencies.</li>
    <li>Expose only necessary ports.</li>
    <li>Use ENTRYPOINT + CMD appropriately.</li>
    <li>Use .dockerignore to reduce image size.</li>
    <li>Keep containers immutable — do not modify users or files at runtime.</li>
</ul>

<h2>2. Nginx Production Dockerfile</h2>
<pre><code>FROM nginx:alpine

LABEL maintainer="avinash"
LABEL description="Production-ready Nginx static site Docker image"

RUN addgroup -S webgroup && adduser -S webuser -G webgroup

COPY ./html /usr/share/nginx/html

RUN chown -R webuser:webgroup /usr/share/nginx/html \
    && chown -R webuser:webgroup /var/cache/nginx \
    && chown -R webuser:webgroup /var/run \
    && chmod -R 755 /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN chown webuser:webgroup /etc/nginx/nginx.conf

USER webuser
EXPOSE 80 443

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]</code></pre>

<div class="note">
<strong>Note:</strong> Use a custom <code>nginx.conf</code> for production settings like caching, gzip, and security headers.
</div>

<h3>Example Custom nginx.conf</h3>
<pre><code>user  webuser;
worker_processes  auto;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name _;

        root /usr/share/nginx/html;
        index index.html;

        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";

        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    }
}</code></pre>

<h2>3. Node.js Production Dockerfile</h2>
<pre><code>FROM node:20-alpine

LABEL maintainer="avinash"
LABEL description="Production Node.js app Docker image"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN chown -R appuser:appgroup /usr/src/app

USER appuser
EXPOSE 3000

CMD ["node", "server.js"]</code></pre>

<h2>4. Python Production Dockerfile (Flask/FastAPI)</h2>
<pre><code>FROM python:3.12-alpine

LABEL maintainer="avinash"
LABEL description="Production Python app Docker image"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]</code></pre>

<h2>5. Java Production Dockerfile (Spring Boot)</h2>
<pre><code>FROM eclipse-temurin:20-jdk-alpine

LABEL maintainer="avinash"
LABEL description="Production Java Spring Boot Docker image"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY target/myapp.jar .

RUN chown appuser:appgroup /app/myapp.jar

USER appuser
EXPOSE 8080

CMD ["java", "-jar", "myapp.jar"]</code></pre>

<h2>6. PHP Production Dockerfile</h2>
<pre><code>FROM php:8.2-apache

LABEL maintainer="avinash"
LABEL description="Production PHP app Docker image"

RUN addgroup --system appgroup && adduser --system -G appgroup appuser

COPY ./src /var/www/html
RUN chown -R appuser:appgroup /var/www/html

USER appuser
EXPOSE 80

CMD ["apache2-foreground"]</code></pre>

<h2>7. Build & Run Commands</h2>
<pre><code># Nginx
docker build -t static-dashboard-prod .
docker run -d -p 80:80 -p 443:443 --name dashboard-prod static-dashboard-prod

# Node.js
docker build -t node-app .
docker run -d -p 3000:3000 --name node-app node-app

# Python
docker build -t python-app .
docker run -d -p 8000:8000 --name python-app python-app

# Java
docker build -t java-app .
docker run -d -p 8080:8080 --name java-app java-app

# PHP
docker build -t php-app .
docker run -d -p 80:80 --name php-app php-app</code></pre>

<h2>8. Verification Commands</h2>
<pre><code># Check user inside container
docker exec -it &lt;container_name&gt; whoami

# Check file permissions
docker exec -it &lt;container_name&gt; ls -l /app

# Check processes
docker exec -it &lt;container_name&gt; ps aux</code></pre>

<div class="important">
<strong>Important:</strong> Root is required only during build for installing packages, creating users, and setting permissions. Containers should run as non-root for security. Keep images small, immutable, and secure.
</div>

</div>
</body>
</html>
