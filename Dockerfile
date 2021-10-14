FROM node:16
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install -g pm2
RUN npm install
RUN npx prisma generate
CMD ["pm2","start","index.js", "-i max" ]