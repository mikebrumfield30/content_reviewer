const express = require('express')
const cors = require('cors');
const fetch = require('node-fetch')
const config = require('./config');
const helper = require('./helper')
const bucketName = config.s3Bucket
const app = express()
app.use(cors({
    origin: '*'
}));
const port = config.port
const AWS = require('aws-sdk');
const mongo = require('./mongoUtil');
// Set the region 
AWS.config.update({region: config.region});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: 'latest'});

app.get('/', (req, res) => {
    res.send('Basic API for reading potential content images from s3 and a variety of free image APIs')
})
  
app.get('/plants', async (req, res) => {
    try {
        var dedupedPlants = []
        var plants = await mongo.getPlants();
        var plantNames = plants.flatMap(plant => (plant.plantName))
        plantNames.forEach(plantName => {
            if(!dedupedPlants.includes(plantName)) {
                dedupedPlants.push(plantName)
            }
        })
        res.status(200).send(dedupedPlants)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

app.get('/plants/:name', async (req, res) => {
    var name = req.params.name
    try {
        var plants = await mongo.getPlantsByName(name)
        res.status(200).send(plants)
    }
    catch(error) {
        res.status(500).send(error)
    }

    
})

app.delete('/plants/:id', async (req, res) => {
    var id = req.params.id

    try {
        var acknowledged = await mongo.deletePlantById(id)
        res.status(201).send({
            "acknowledged": acknowledged
        })
    }
    catch(error) {
        res.status(500).send(error)
    }

})

app.post('/accept/:plantName/:key/:imageId', async (req, res) => {
    var key = req.params.key
    var imgId = req.params.imageId
    var plantName = req.params.plantName.replace(' ', '_')
    var bucketParams = {
        Bucket : bucketName,
        Key: key
      };
    //raw content file...fetch for image by id from json list
    var file = await s3.getObject(bucketParams).promise()
    var readObj = JSON.parse(file?.Body.toString());
    var index = -1;
    for(var i = 0; i < readObj.length; i++) {
        if(readObj[i].id === imgId) {
            index = i;
        }
      }
    if(index === -1) {
        console.log(`${imgId} not found in raw file: ${key}`)
        res.status(404).send(`Image id ${imgId} not found`)
    }
    console.log(`index: ${index}`)

    helper.upsertCreatedFile(plantName, readObj[index])
    var x = await fetch(`http://localhost:3001/plants/${key}/${imgId}`, {method: 'DELETE'})
    res.status(200).send(`success: ${x.text()}`)
})


app.listen(port, async () => {
    mongo.run()
    console.log(`S3 content review api listening at http://localhost:${port}`)
  })