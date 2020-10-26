FROM node:12-alpine

#Change Work Directory
WORKDIR /home/app/server

#Copy the package.json file
COPY package*.json ./

# Clean APK cache
RUN rm -rf /var/cache/apk/*

RUN npm install

EXPOSE 3001

CMD 'npm run start'



