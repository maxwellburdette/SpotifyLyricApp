FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ARG REACT_APP_AUTH_URL
ARG REACT_APP_COLOR
ARG REACT_APP_LOGIN
ARG REACT_APP_LYRICS
ARG REACT_APP_PROD_ID
ARG REACT_APP_REFRESH
ARG GENERATE_SOURCEMAP
ARG REACT_APP_REDIRECT_URI

ENV REACT_APP_AUTH_URL $REACT_APP_AUTH_URL
ENV REACT_APP_COLOR $REACT_APP_COLOR
ENV REACT_APP_LOGIN $REACT_APP_LOGIN
ENV REACT_APP_LYRICS $REACT_APP_LYRICS
ENV REACT_APP_PROD_ID $REACT_APP_PROD_ID
ENV REACT_APP_REFRESH $REACT_APP_REFRESH
ENV GENERATE_SOURCEMAP $GENERATE_SOURCEMAP
ENV REACT_APP_REDIRECT_URI $REACT_APP_REDIRECT_URI

RUN npm run dockerBuild

EXPOSE 3000

CMD ["serve", "-s", "build"]