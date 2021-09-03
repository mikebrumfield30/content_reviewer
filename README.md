# MEAN App for content review

This is a full-stack app for content review. 


## Components

 - Database
   - MongoDB running on my local
     - We take regular backups and upload to s3 for durability
 - Server
   - `server.js` - Express server that interfaces with mongo
 - Front-End
   - React app that consumes from Express server 