FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g serve && npm run build

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["serve", "-s", "build"]