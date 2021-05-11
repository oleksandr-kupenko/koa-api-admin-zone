FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

ARG PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASS
ARG DB_HOST

ENV PORT=$PORT
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS
ENV DB_HOST=$DB_HOST

EXPOSE $PORT

CMD ["npm", "start"]




