const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//MiddleWare
app.use(express.json());
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 5000;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmunj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect((err) => {
  const collection = client.db(process.env.DB_NAME).collection("product");
  console.log("database connected success");

  // Product Read Form MongoDB
  app.get('/allProduct', (req, res) => {
    collection.find({}).toArray()
      .then(data => {
        res.send(data)
      })
  })

  // Product Read Form MongoDB
  app.get('/pro/:id', (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) }
    collection.findOne(query)
      .then(data => {
        res.send(data)
      })
  })

  //Product Post in MongoDB 
  app.post('/allProduct', (req, res) => {
    const addProduct = req.body;
    collection.insertOne(addProduct)
      .then(data => {
        res.send(data)
      })
  })

  //Product Delete from MogoDB 
  app.delete('/product/:id', (req, res) => {
    const removeId = req.params.id;
    const removeProduct = { _id: ObjectId(removeId) };
    collection.deleteOne(removeProduct)
      .then(result => {
        res.send(result)
      })
  })

  // Product Update from MongoDB 
  app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const options = { upsert: true };
    const updateProduct = req.body;
    const filData = { _id: ObjectId(id) }
    const newUp = {
      $set: {

        price: updateProduct.price,
        quantity: updateProduct.quantity

      }
    }
    collection.updateOne(filData, newUp, options)
      .then(result => {
        res.send(result)
      })
  })


});

app.get("/", (req, res) => {
  res.send("Server is Working");
});

app.listen(port, () => {
  console.log("server start success done");
});
