# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build Next.js app
RUN npm run build

# Start the app
CMD ["npm", "start"]