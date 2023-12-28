# Stage 1: Build the application

FROM node:18-alpine AS build
WORKDIR /usr/app
COPY package.json  ./
COPY package-lock.json  ./
RUN npm cache clean --force && rm -rf node_modules && npm install --legacy-peer-deps
# Copy the source code
COPY . .

# Stage 2: Create a smaller image
FROM node:18-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .
RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start" ]