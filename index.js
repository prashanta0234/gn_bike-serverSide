const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
var cors = require("cors");
const { MongoClient } = require("mongodb");
// const db = require("db");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erhb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("GnBike");
    const bikesCollection = database.collection("bikes");
    const odersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    // get bikes
    app.get("/bikes", async (req, res) => {
      const cursor = bikesCollection.find({});
      const bike = await cursor.toArray();
      res.send(bike);
    });
    // add bikes
    app.post("/bikes", async (req, res) => {
      const newBike = req.body;
      const result = await bikesCollection.insertOne(newBike);
      res.send(result);
    });

    // get bikes with id

    app.get("/bikes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await bikesCollection.findOne(query);
      res.send(user);
    });
    // delate bikes
    app.delete("/bikes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await bikesCollection.deleteOne(query);
      res.send(result);
    });

    // post orders
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await odersCollection.insertOne(newOrder);
      res.send(result);
    });
    // save user in data base
    app.post("/users", async (req, res) => {
      const newuser = req.body;
      const result = await usersCollection.insertOne(newuser);
      res.send(result);
    });
    // get orders using email
    app.get("/emailorders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = odersCollection.find(query);
      const order = await cursor.toArray();
      res.send(order);
    });
    app.get("/orders", async (req, res) => {
      const cursor = odersCollection.find({});
      const order = await cursor.toArray();
      res.send(order);
    });

    // get order e\whith id

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await odersCollection.findOne(query);
      res.send(user);
    });
    // delate orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await odersCollection.deleteOne(query);
      res.send(result);
    });

    // get users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const order = await cursor.toArray();
      res.send(order);
    });

    // add or intigrate admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });

    // review

    // get review
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const bike = await cursor.toArray();
      res.send(bike);
    });

    // post review
    app.post("/reviews", async (req, res) => {
      const newBike = req.body;
      const result = await reviewCollection.insertOne(newBike);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
