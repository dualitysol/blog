FROM node:18-bullseye-slim

WORKDIR /app/api

COPY package*.json ./

RUN npm ci \
    && npm prune

COPY . .

ENV PATH $PATH:/app/api/node_modules/.bin/

CMD npm run start || { cat ~/.npm/_logs/*.log && exit 1; }
EXPOSE 3001
