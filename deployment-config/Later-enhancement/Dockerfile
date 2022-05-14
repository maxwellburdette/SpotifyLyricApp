FROM node:16-alpine as react-build

WORKDIR /app

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

ENV REACT_APP_AUTH_URL $REACT_APP_AUTH_URL
ENV REACT_APP_COLOR $REACT_APP_COLOR
ENV REACT_APP_LOGIN $REACT_APP_LOGIN
ENV REACT_APP_LYRICS $REACT_APP_LYRICS
ENV REACT_APP_PROD_ID $REACT_APP_PROD_ID
ENV REACT_APP_REFRESH $REACT_APP_REFRESH
ENV GENERATE_SOURCEMAP $GENERATE_SOURCEMAP

RUN npm run build

FROM nginx:alpine
COPY ./deployment-config/nginx/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=react-build app/build /usr/share/nginx/html
ENV PORT 8080
ENV HOST 0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]