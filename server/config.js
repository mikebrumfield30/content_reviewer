
const config = {
    s3Bucket: '777377719930-synthesis-assests-s3',
    port: 3001,
    region: 'us-east-2',
    acceptedDir: 'accepted_images_from_review',
    mongoUrl: 'mongodb://localhost:27017',
    dbName: 'raw',
    reviewCollectionName: 'images_for_review',
    acceptedCollectionName: 'accepted_images'
}

module.exports = config;