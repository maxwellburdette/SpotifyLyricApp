FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g serve

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["serve", "-s", "build"]