const { MongoClient } = require("mongodb");
const config = require("./config")

const mongoUrl = config.mongoUrl;
const client = new MongoClient(mongoUrl);
const dbName = config.dbName
const reviewCollectionName = config.reviewCollectionName
const acceptedCollectionName = config.acceptedCollectionName

async function run() {
    try {
      // Connect the client to the server
      await client.connect();
      // Establish and verify connection
      await client.db("raw").command({ ping: 1 });
      console.log("Connected successfully to server");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

async function getPlants() {
    var plants = [];
    try {

        await client.connect();
    
        const database = client.db(dbName);

    
        const imagesForReview = database.collection(reviewCollectionName);
        
        const query = {};
    
        const options = {
        
          projection: { _id: 0, id: 1, url: 1, plantName: 1 },
    
        };
    
        const cursor = imagesForReview.find(query, options);
        
        if ((await cursor.count()) === 0) {
    
          console.log("No documents found!");
    
        }
        
        await cursor.forEach(x => {
          plants.push(x)
        });
    
      } finally {
        
        await client.close();
        return plants;
      }
  }

async function getPlantsByName(name) {
    var plants = [];
    try {

        await client.connect();
    
        const database = client.db(dbName);
    
        const imagesForReview = database.collection(reviewCollectionName);
    
        // query for movies that have a runtime less than 15 minutes
    
        const query = { plantName: name };
    
        const options = {
    
          // sort returned documents in ascending order by title (A->Z)
    
          sort: { title: 1 },
    
          // Include only the `title` and `imdb` fields in each returned document
    
          projection: { _id: 0 },
    
        };
    
        const cursor = imagesForReview.find(query, options);
    
        // print a message if no documents were found
    
        if ((await cursor.count()) === 0) {
    
          console.log("No documents found!");
    
        }
    
        // replace console.dir with your callback to access individual elements
    
        await cursor.forEach(x => {
          // console.log(x)
          plants.push(x)
        });
    
      } finally {
        
        await client.close();
        return plants;
      }
  }

async function deletePlantById(id) {
  var acknowledged = false;
    try {

        await client.connect();
    
        const database = client.db(dbName);
    
        const imagesForReview = database.collection(reviewCollectionName);
    
        const query = {id: id}

        console.log(query)

        const existingDoc = imagesForReview.findOne(query)
        console.log(`existing doc: ${(await existingDoc).id}`)
        
        const result = await imagesForReview.deleteOne(query)
        console.log(result)
    
        // print a message if no documents were found
    
        if (result.deletedCount === 1) {
          console.log(`Deleted item ${id}`);
        }
        acknowledged = result.acknowledged;
  
      } finally {
        
        await client.close();
        return acknowledged;
      }
}

async function getPlantById(id) {
  var plant;
  try {

    await client.connect();

    const database = client.db(dbName);

    const imagesForReview = database.collection(reviewCollectionName);
    const query = {id: id};

    const options = {
    
      projection: { _id: 0},

    };

    plant = await imagesForReview.findOne(query, options);

    if (await plant === null) {
      console.log("Plant not found");

    }

  } finally {
    
    await client.close();
    return plant;
  }
}

async function insertPlantToAcceptedCol(plant) {
  var result;
  try {

    await client.connect();

    const database = client.db(dbName);

    const acceptedCol = database.collection(acceptedCollectionName);

    result = await acceptedCol.insertOne(plant)

  } finally {
    
    await client.close();
    return result;
  }
}

  module.exports = {run, getPlants, getPlantsByName, deletePlantById, getPlantById, insertPlantToAcceptedCol}

