FROM node:trixie-slim
WORKDIR /coffee
COPY package.json .
RUN npm install --production
COPY . .
CMD ["npm","start"]