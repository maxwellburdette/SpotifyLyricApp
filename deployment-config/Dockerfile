FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g serve

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]