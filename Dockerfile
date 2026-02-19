# Use a lightweight Node.js image as base
FROM node:20-alpine

# Set the working directory to the vault app
WORKDIR /app

# Copy package files from vault
COPY vault/package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the vault application
COPY vault/ .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose the port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
