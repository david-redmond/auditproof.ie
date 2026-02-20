# Use a lightweight Node.js image as base
FROM node:20-alpine

# Set the working directory to the app
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the application
COPY . .

# Build the Next.js application (placeholder env vars for page data collection only)
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=mongodb://localhost:27017/placeholder
ENV AUTH_SECRET=build-time-placeholder-min-32-chars-long
RUN npm run build

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose the port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
