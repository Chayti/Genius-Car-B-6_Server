const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://cardoctor:abcd1234@cluster0.gme9trc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('carDoctor').collection('services');
        

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        });
        app.get('/service/:id', async (req, res) => {
            const query = {_id:ObjectId(req.params.id)};
            const cursor = await servicesCollection.findOne(query);
            console.log(cursor)
            res.send(cursor);
        });

    }
    finally {
        // console.log(client)
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Genius Car Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})