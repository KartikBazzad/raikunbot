FROM node:16
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY prisma ./
RUN npm install -g pm2
COPY . .
RUN npm install
RUN npx prisma generate
CMD ["pm2","start","index.js"]