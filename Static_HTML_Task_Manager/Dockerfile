FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend files
COPY . /usr/share/nginx/html

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
