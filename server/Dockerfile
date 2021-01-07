FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENV APP_MYSQL_HOST=192.168.1.85
ENV APP_MYSQL_USERNAME=edrop_user
ENV APP_MYSQL_PASSWORD=edropTest123

EXPOSE 3000
CMD ["node", "."]
