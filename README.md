# MEAN App for content review

This is a express + react app for content review. 


## Components

 - Database
   - MongoDB running on my local
     - We take regular backups and upload to s3 for durability
 - Server
   - `server.js` - Express server that interfaces with mongo
 - Front-End
   - React app that consumes from Express server 