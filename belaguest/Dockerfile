FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --fetch-retries 3 --fetch-retry-mintimeout 10000

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
