FROM node:trixie-slim

LABEL maintainer="devops"
LABEL app="backend_task_manager"

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]