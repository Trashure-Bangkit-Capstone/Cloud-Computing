# pull the official node.js runtime as a parent image
FROM node:20-alpine

# set the working directory
WORKDIR /app

# install dependencies
COPY package* . 
RUN npm install

# copy the application files
COPY . .

# expose the port that the app runs on
EXPOSE 8080

# start the application
CMD ["npm", "start"]