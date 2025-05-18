FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
# COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY src/ ./src/

# Create .env file (this will be overridden by environment variables)
RUN echo "HELIUS_API_KEY=your_helius_api_key_here\nREDIS_URL=redis://redis:6379\nPORT=3000" > .env

# Expose port
EXPOSE 3000

# Start the server with the existing onchainApi.ts file
CMD ["npm", "run", "dev", "--", "src/server/onchainApi.ts"] 