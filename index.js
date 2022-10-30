const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// DB_USER=cardoctor
// DB_PASS=abcd1234

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gme9trc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client.db("carDoctor").collection("services");
    const orderCollection = client.db("carDoctor").collection("orders");

    // place an order
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

    // sort by price ascending
    app.get('/sortedServices', async (req, res) => {
      let result = await servicesCollection.find({}).sort({ price: 1 }).toArray();
      res.send(result);
    });

    // find by range
    app.get('/findByRange', async (req, res) => {
      const ll = parseInt(req.query.ll);
      const ul = parseInt(req.query.ul);
      // console.log(ll, ul);
      let result = await servicesCollection.find({ price: { $gte: ll, $lte: ul } }).sort({ price: 1 }).toArray()
      res.send(result)
    });


    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.get("/service/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const data = await servicesCollection.findOne(query);
      res.send(data);
    });

    // place an order
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.get("/myOrder", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { userEmail: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // Delete a single service
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // console.log(client)
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Genius Car Server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
