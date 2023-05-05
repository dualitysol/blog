#!/bin/bash

#build docker images
cd back-end
docker build . -t blog-backend
cd ../front-end
docker build . -t blog-frontend

#run tests for backend
docker run --rm -it blog-backend npm run format:check || true
docker run --rm -it blog-backend npm run lint:check || true
docker run --rm -it blog-backend npm run test || true

#run tests for frontend
docker run --rm -it blog-frontend npm run lint || true
docker run --rm -it blog-frontend npm run test:unit || true


docker-compose config
docker-compose up #-d

#run e2e test for frontend
docker run --rm -it blog-frontend npm run test:cy

#exit 0
docker-compose stop
docker-compose kill
