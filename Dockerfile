FROM node:13

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

ARG PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASS
ARG DB_HOST
ARG SECRET_KEY
ARG SECRET_KEY_REFRESH
ARG accessKeyId
ARG secretAccessKey
ARG userPhotoFolder
ARG bucketName


ENV PORT=$PORT
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS
ENV DB_HOST=$DB_HOST

ENV SECRET_KEY=$SECRET_KEY
ENV SECRET_KEY_REFRESH=$SECRET_KEY_REFRESH
ENV accessKeyId=$accessKeyId
ENV secretAccessKey=$secretAccessKey
ENV userPhotoFolder=$userPhotoFolder
ENV bucketName=$bucketName


EXPOSE $PORT

CMD ["npm", "start"]




