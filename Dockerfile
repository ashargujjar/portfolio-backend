FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# default mode = development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

# if production → build first, else run dev
CMD if [ "$NODE_ENV" = "production" ]; \
    then npm run build && npm start; \
    else npm run dev; \
    fi