FROM node:12.7.0
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN npm install -g yarn
RUN yarn install --prod
COPY . .
EXPOSE 3000
EXPOSE 40510

CMD ["node", "./src/server/server.js"]