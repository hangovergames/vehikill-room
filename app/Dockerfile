ARG NODE_IMAGE=node:16

FROM $NODE_IMAGE
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN npm install --pure-lockfile
COPY ./app.iml ./tsconfig.json ./

EXPOSE 3000
CMD [ "npm", "start" ]
