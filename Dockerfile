FROM node:14 AS build-client

COPY . /var/tmp/
WORKDIR /var/tmp/client
RUN npm install
RUN npm run build
RUN cp -r /var/tmp/client/dist /client-build

FROM node:14

COPY . /var/www/html
COPY --from=build-client /client-build /var/www/html/client/dist
WORKDIR /var/www/html/server
RUN npm install

ENV PROJECT_ROOT_DIRECTORY /var/nightwatch

VOLUME [$PROJECT_ROOT_DIRECTORY]

EXPOSE 8080

CMD ["node", "start-server.js"]




