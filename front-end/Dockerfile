FROM node:18-bullseye-slim

RUN apt update && \
    apt-get install -y  \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb

WORKDIR /app/frontend

COPY package*.json ./

RUN npm ci \
    && npm prune

COPY . .

ENV PATH $PATH:/app/frontend/node_modules/.bin/

CMD npm run serve || { cat ~/.npm/_logs/*.log && exit 1; }

EXPOSE 8080