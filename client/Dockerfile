FROM node:12.18.1

WORKDIR /client

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]