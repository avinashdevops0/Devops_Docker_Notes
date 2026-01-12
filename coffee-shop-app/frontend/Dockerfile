FROM nginx:trixie-perl
COPY . /usr/share/nginx/html/
RUN sudo chmod -R 755 /usr/share/nginx/html/
COPY nginx-coffee.conf /etc/nginx/conf.d/coffee.conf
CMD ["nginx","-g","daemon off;"]