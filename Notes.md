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
