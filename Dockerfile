FROM node:5

MAINTAINER Daniel Brown <d.t.brown@outlook.com>

# Set the directory in which the application will reside
WORKDIR trainAPI/

# Bundle source files and install dependencies
ADD src/package.json package.json
RUN npm install
ADD src .

# Make ports used by application avaliable for use
EXPOSE 3000

# Default execution
CMD ["npm", "start"]
