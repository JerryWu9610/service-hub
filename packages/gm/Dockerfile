FROM node:18
RUN npm install -g pnpm@8
RUN apt-get update
RUN apt-get install -y graphicsmagick
RUN gm -version
WORKDIR /app
COPY . /app
RUN pnpm install
EXPOSE 3000
