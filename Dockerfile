# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Add build-time variables for NEXT_PUBLIC_ env vars
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy only necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 80

ENV PORT 80
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
