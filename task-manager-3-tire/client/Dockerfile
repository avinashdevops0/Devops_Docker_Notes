FROM nginx:alpine

LABEL maintainer="devops"
LABEL app="frontend_task_manager"

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
