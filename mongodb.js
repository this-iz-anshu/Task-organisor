//will perform crude operation

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;


 const{ MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const databaseName = 'taskManager1'; //database name

MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log(error);
    }
    
    console.log('connection successful');
        const db = client.db('task-manager');
    // db.collection('user1').findOne({ name: 'anshu' }, (error, result) => {
    //     console.log(result);
    // })

    db.collection('users').updateMany({
       age:20
    }, {
        $inc: {
           age:1
       }
    }).then((result) => {
       console.log(result)
   }).catch((error)=>{console.log(error)})
});
