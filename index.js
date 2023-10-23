const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
// const brandData = require('./brand.json');
const app = express();
const port = process.env.PORT || 5000

// middleware
// const corsOptions = {
//    origin: '*',
//    credentials: true,
//    optionSuccessStatus: 200,
// }

// app.use(cors(corsOptions))
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
   res.send('TechEra Server is going')
})


/* app.get('/brand', (req, res) => {
   res.json(brandData)
})
 */




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8d3p09.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const productsCollection = client.db("productsDB").collection("product");
      const cartCollection = client.db("productsDB").collection("myCart")


      app.get('/productadd', async (req, res) => {
         const cursor = await productsCollection.find().toArray();
         res.send(cursor)
      })


      // load multiple matches product
      app.get('/productadd/:brand', async (req, res) => {
         const brand = req.params.brand;
         const query = { brand: brand }
         const cursor = await productsCollection.find(query).toArray();
         res.send(cursor)
      })


      // load specifiec product
      app.get('/productadd/single/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id);
         const query = { _id: new ObjectId(id) }
         const result = await productsCollection.findOne(query);
         res.send(result);
      })


      app.get('/productadd/update/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await productsCollection.findOne(query);
         res.send(result)
      })


      // load specifiec product for my cart
      app.get('/productadd/cart/:id', (req, res) => {
         const id = req.params.id;
         // console.log(id);
      })


      // add product in databse
      app.post('/productadd', async (req, res) => {
         const product = req.body;
         const result = await productsCollection.insertOne(product);
         res.send(result)
      })


      // update product 
      app.put('/productadd/update/:id', async (req, res) => {
         const id = req.params.id
         const product = req.body;
         console.log(id, product)
         const filter = { _id: new ObjectId(id) }
         const options = { upsert: true }
         const updateDoc = {
            $set: {
               ...product
            }
         }
         const result = await productsCollection.updateOne(filter, updateDoc, options);
         res.send(result);
      })



      //get multiple data for myCart
      app.get('/cartData/products', async (req, res) => {
         const cursor = await cartCollection.find().toArray();
         res.send(cursor);
      })



      // delete a product from myCart
      app.delete('/cartData/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await cartCollection.deleteOne(query);
         res.send(result)
      })


      // add product in databse for myCart
      app.post('/cartData', async (req, res) => {
         const cart = req.body;
         delete cart._id;
         const result = await cartCollection.insertOne(cart);
         res.send(result);
      })


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);



app.listen(port, () => {
   console.log(`TechEra server is running on port: ${port}`)
})