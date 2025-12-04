const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()

const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d1icoll.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

    await client.connect();
    // connect
    const menuCollection = client.db("cafeDB").collection("menu")
    const reviewsCollection = client.db("cafeDB").collection("reviews")
    const cartCollection = client.db("cafeDB").collection("carts")
    // menuCollection
    app.get('/menu',async(req,res)=>{
      const result = await menuCollection.find().toArray()
      res.send(result)
    })

    // reviews collection
    app.get("/reviews",async(req,res)=>{
      const result = await reviewsCollection.find().toArray()
      res.send(result)
    })
    // cart collection

    app.get('/carts',async(req,res)=>{
      const email = req.query.email;
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts',async(req,res)=>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem)
      res.send(result);
    })

    app.delete("/carts/:id",async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("cafe ali server")
})

app.listen(port, () => {
  console.log(`cafe-ali is running on port ${port}`)
})