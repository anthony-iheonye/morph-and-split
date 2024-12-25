# Stage 1: Build the application - specify the base image
FROM node:20.15.1-alpine3.20 AS build

# Set working directory (if it is not available, it will be created)
WORKDIR /app


RUN mkdir data

# copy only the package*.json files first, which ensures that Docker can cache this 
# layer effectively if dependencies don't change, speeding up future builds.
COPY package*.json .

# install project dependencies. We use the RUN command to achieve this.
# With RUN, we can execute any command we execute on a terminal session.
RUN npm install

# Copy all the content "." of the current directory (the context directory) 
# into the image's current working directory '.'
COPY . .

# Build the application (optional, if you're using a build step).
# If you’re building a production-ready React app (or any other build process), 
# this step should be uncommented to run the build process and create a production-ready version.
# RUN npm run build


# Stage 2: Run the application
# We are using a fresh node:20.15.1-alpine3.20 image for the runtime stage, 
# which avoids including unnecessary build tools and dependencies from the build stage.
FROM node:20.15.1-alpine3.20

# To avoid security problem, create a user with limited privelleges 
# that will be used to run the application.
# Create a group called "app", then create a user called "app" and assign it to the group called 'app'.
RUN addgroup app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Copy files from the build stage
COPY --from=build /app /app

# Set ownership for the non-root user
RUN chown -R app:app /app

# Switch to non-root user, so that all the commands will executed 
# using this non-root user.
USER  app

# Set Environment variables using the ENV instruction
ENV REACT_APP_API_URL=http://127.0.0.1:5000

# Document network port the container should listen on
EXPOSE 5173

# Provide defaults for an executing container. If an executable is not specified, 
# then ENTRYPOINT must be specified as well. There can only be one CMD instruction in a Dockerfile.
# We start the app on the command line by typing  "docker run react-app npm start". 
# "npm start" executes/starts the app. To ommit "npm start" and start the app
# using "docker run react-app", we save default command "npm start" using the CMD command.

# Interestingly, both the RUN and CMD instruction are used to execute commands. what is the difference?
# RUN is a build-time instruction. It is executed at the time of building the image, eg. when running 
# RUN npm install, we install dependencies that are stored in the image. 
# In contrast the CMD instruction is a runtime instruction. It is executed when starting a container.
# That is why we use it for "CMD ["npm" "start]""

# The command instruction can be presented as 'CMD npm start' or 'CMD ["npm" "start"]. The 2nd option is better,
#  as docker will execute the command in the same working shell, unlike the first form, that will be executed in a
# separate shell.
CMD ["npm", "start"]
