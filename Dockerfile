FROM node:16.1.0-buster

# docker build --tag hex-spell .
# docker run -p 3000:3000 hex-spell

USER node
WORKDIR /home/node/app

COPY --chown=node:node package.json ./
RUN npm install && npm cache clean --force

COPY --chown=node:node . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
