FROM node:14
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install -g pm2
RUN npm install
RUN npx prisma db push
RUN npx prisma generate
CMD [ "pm2","start","index.js" ]