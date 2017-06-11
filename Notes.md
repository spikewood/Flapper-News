This file contains notes on the things learned while working on the Flapper-News app
# Creating Shell Scripts

Create the following script in the home directory in a file named "hello_world.sh"
> #!/bin/sh  
> echo "Hello, world!"  

Then in the terminal run:
> chmod u+x hello_world.sh  
> ./hello_world.sh  

## Breakdown
In the script:
> #!/bin/sh  
This is the the call to get the correct interpreter. Most likely always this.
> echo "Hello, world!"  
This echo command will write the words "Hello, world!" to the command line, sans the quotes

In the terminal:
> chmod u+x file  
This means change the mode of the file to allow the user to execute it. More details on chmod here: https://en.wikipedia.org/wiki/Chmod  

> ./hello_world.sh  
Tells the terminal to run the shell script, resulting in "Hello, world!"

# GREP
regular expressions engine for the terminal
> grep regex -modifier file.ext  
The grep command takes in a regular expression, an optional modifier and the file(s) to look in

# Building an express server
1. make sure you have the express generator installed
> $ npm install express-generator  
2. navigate to the parent folder for your server
3. Create an express project
> $ express --ejs project-name  
4. Install the npm modules to allow the server to run
> $ npm install  
5. Install mongoose for the mongo db
> $ npm install --save mongoose  
6. we need a folder for the mongoose models, so create that folder
> $ mkdir models

# Mongoose
## Models
1. the models are found in the '/model' directory and build out how information should be stored in the mongo db - these are formalized schema to store data
2. we route the data to the models in the '/routes/index.js'

# Angular
1. the angular app lives in '/public/javascripts/angularApp.js'
