FROM mysql:8.0.44-debian
COPY ./database.sql /docker-entrypoint-initdb.d/
ENV MYSQL_ROOT_PASSWORD=rootpassword
