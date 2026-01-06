FROM nginx
MAINTAINER avinash
LABEL Simple HTML static file Docker Image Practice

# Copy the HTML files into the container
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Set ENTRYPOINT to nginx to ensure it is always the default executable
ENTRYPOINT ["nginx"]

# Specify the default command to run nginx in the foreground
CMD ["-g", "daemon off;"]
