const express = require('express')
const cors = require('cors');
const config = require('./config');
const mongo = require('./mongoUtil')
const app = express()
app.use(cors({
    origin: '*'
}));
const port = config.port

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

app.post('/plants/accept/:id', async (req, res) => {
    var id = req.params.id
    try {
        var plant = await mongo.getPlantById(id)
        if(plant != null) {
            var result = await mongo.insertPlantToAcceptedCol(plant)
            result = mongo.deletePlantById(plant.id)
        }
        if(result.acknowledged) {
            res.status(201).send(plant.id)
        }
        else {
            res.status(500).send(result)
        } 
    }
    catch(error) {
        res.status(500).send(error)
    }
})


app.listen(port, async () => {
    console.log(`S3 content review api listening at http://localhost:${port}`)
  })