const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
// app.use(express.json());
app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.spl8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const serviceCollection = database.collection("services");

    //get api
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    //get particular service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    //delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);
app.listen(port, () => {
  console.log("listening to the port", port);
});
//npm run start-dev
