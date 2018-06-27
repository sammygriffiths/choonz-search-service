FROM node:latest

WORKDIR /code
ENTRYPOINT node bin/www

COPY package.json package-lock.json /code/
RUN npm install

COPY ./ /code/

EXPOSE 3000
