# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose your app’s port (change if your app uses a different one)
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]


