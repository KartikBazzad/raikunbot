FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install -g pm2
RUN npm install
CMD [ "npx prisma generate","&&", "pm2-runtime","pm2","start","index.js", "-i max" ]