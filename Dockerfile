<<<<<<< HEAD
# Build stage
FROM node:18.18.2-alpine as build

RUN mkdir /app

ADD . /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginx:1.21.6-alpine as production-stage

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
=======
FROM node:18-alpine3.18 as builder
WORKDIR /app
COPY package.json .
# RUN npm install
RUN yarn install
COPY . .
RUN yarn run build
# RUN npm run build
FROM nginx
# FROM nginx:alpine
#WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
>>>>>>> suhrob2
