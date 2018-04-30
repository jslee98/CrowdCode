# CrowdCode

CrowdCode allows people from all over the world to code together.

## Authors

* **Jeff Lee**
* **Jack Hall-Tipping**

## Website

http://crowdcode1.s3-website.us-east-2.amazonaws.com/

## Backend API

https://calm-headland-11311.herokuapp.com/

## Built With: Frontend

The frontend was built with React.js, with features from Material UI, Bootstrap, and CodeMirror. It is hosted in an Amazon S3 bucket.

## Built With: Backend

The backend was built by hosting a MongoDB database on an EC2 Amazon Web Server. We then used Node/Express to communicate with the database, and finally hosted the RESTful API using heroku.

## Download/run

Simply clone the repo (node modules are included in the repo) and run

'npm start'

to start the app on http://localhost:3000/

This will launch a pre-build version of the Frontend. To serve, run 'npm run build' and upload it to your s3 bucket. 

