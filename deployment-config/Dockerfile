FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run dockerBuild

EXPOSE 3000

CMD ["serve", "-s", "build"]