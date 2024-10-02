# Use the official Node.js image
FROM node:16 AS build

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application 
RUN npm run build

# Use a lightweight web server to serve the app
FROM nginx:alpine

# Copy the build folder from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run the server
CMD ["nginx", "-g", "daemon off;"]