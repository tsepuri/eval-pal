# eval-pal

Eval Pal is a website built on the last ten years of Case Western Reserve University's course evaluation data and designed for its students. It is based on the idea of visualizing and analyzing the evaluation data , and making it much more accessible to students. On completion, the website is planned for integration with the [CWRU Student Information System](sis.case.edu). The working website can be found [here](https://evalpal.herokuapp.com/). 


## Getting started

These instructions will tell you how to get the code up and running on your local machine for development and testing, see deployment for notes on how to deploy it on a live server. 


### Prerequisites

You will need to have [Node.js](https://nodejs.org/en/) on your local machine, have a command-line interface, an IDE that can run languages like HTML, CSS and JavaScript, and be able to use UNIX sockets.

You will also need the username and password for the .env file, and a .json key file which will provide the authorization to connect to CloudSQl from your local machine. These can be acquired on discretion, by reaching out to the creators of the project.


### Installing

After installing Node.js, you need to direct yourself to the respository with the project and install the requirements for the project using
```
npm install -g
```

The .env_sample file in the respository has to be replaced with a .env file. The DATABASE_URL field have to be replaced by the ClearDB MySQL database URL that can be obtained by reaching out. 

The code is ready to be deployed


## Deployment

To deploy the code on a live server, you can use
```
node app.js
```
after directing yourself to the main repository. For testing purposes, you can also use
```
nodemon app.js
```
that automatically refreshes the server when a change has been made. 


## Built With

* JavaScript 
* Node.js - Back-End and in implementation of RESTful API 
* [d3.js](https://d3js.org/) - Data Visualization 
* [MDBootstrap](https://mdbootstrap.com/) - User Interface
* MySQL, [ClearDB](https://www.cleardb.com/) and [Heroku](www.heroku.com) - Database and Server
* HTML and CSS

## Authors

* **Tarun Sepuri** - *Back-End, visualization and Ratings interface* - [tsepuri](https://github.com/tsepuri)
* **Alexander Bradley** - *User Interface* - [Alexhb02](https://github.com/Alexhb02)

## Acknowledgments

* My thanks to Professor Donald Feke for coordinating this effort and making the entire thing possible.
