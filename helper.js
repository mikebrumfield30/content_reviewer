const config = require('./config');
const AWS = require('aws-sdk');
const { useCallback } = require('react');
const { S3 } = require('aws-sdk');
const bucketName = config.s3Bucket
// Set the region 
AWS.config.update({region: config.region});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: 'latest'});

function idExists(newAcceptedItem, acceptedArr) {
  var exists = false
  acceptedArr.forEach(x => {
    if(x.id === newAcceptedItem.id) {
      exists = true
    }
  })
  return exists
}

function upsertCreatedFile(plantName, acceptedItem) {
    var bucketParams = {
        Bucket : bucketName,
        Key: `${config.acceptedDir}/${plantName}.json`
      };

      s3.getObject(bucketParams, function(err, data) {
        if(err) {
          if(err.code.toLowerCase() === 'nosuchkey') {
            s3.putObject({
                Body: JSON.stringify([acceptedItem]),
                Key: `${config.acceptedDir}/${plantName}.json`,
                Bucket: bucketName
            }, function(err, data) {
                  if(err) {
                    console.log('Error putting bucket object')
                  }
                  else {
                    console.log('Successfully created file')
                  }
            })
          }
          else {
            console.log(err.stack)
          }
        }
        else {
          console.log('Do nothing')
          var existingAcceptedFile = JSON.parse(data?.Body.toString())
          console.log(`Type: ${JSON.stringify(existingAcceptedFile)}`)
          if(idExists(acceptedItem, existingAcceptedFile)) {
            console.log(`Item already exists ${acceptedItem.id}`)
          }
          else {
            existingAcceptedFile.push(acceptedItem)
            s3.putObject({
              Body: JSON.stringify(existingAcceptedFile),
              Key: `${config.acceptedDir}/${plantName}.json`,
              Bucket: bucketName
            }, function(err, data) {
              if(err) {
                console.log('Error putting bucket object')
              }
              else {
                console.log('Successfully created file')
              }
        })
          }
        }
      })
}

module.exports = {upsertCreatedFile};