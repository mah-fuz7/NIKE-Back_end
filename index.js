const express= require('express')
const app=express()
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json())

// userName :nikeproductdb
// password: 3YhQSkBo0weA48dy

const uri = "mongodb+srv://nikeproductdb:3YhQSkBo0weA48dy@cluster0.due0kmg.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/',(req,res) => {
    res.send(`NIKE SNEKERS DATA LOADING >>>>>>>>>`)
})

// run Func
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
// create a database and collection 
const database=client.db('snekersdb');
const snekersColl=database.collection("snekers");
const bidsColl=database.collection("bids")

// post
app.post('/products',async(req,res) =>{
    const newProduct=req.body;
    const result=await snekersColl.insertOne(newProduct);
    res.send(result)
})
// DELETE
app.delete('/products/:id',async(req,res) =>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await snekersColl.deleteOne(query)
  res.send(result)
})


// GET 

app.get('/products',async(req,res) =>{
  // console.log(req.query)

  // query prameter(if client ask for give a category product we use this query parameter)

  const email=req.query.email;
  const location=req.query.location;
  
  const query={}
  if(location ){
    if(location){
      query.location=location;
    }
    if(email){
      query.email=email;
    }
  }

  const result=await snekersColl.find(query).toArray()
  res.send(result)
})


// GEt with limit skip and sort

// app.get('/products',async(req,res) => {
//   const sortField={price_max:-1};
//   const limitNum=5
//   const skipNum=5
//   const cursor=snekersColl.find().sort(sortField).limit(limitNum).skip(skipNum);
//   const result=await cursor.toArray();
//   res.send(result)
// })



// GET specific data from database
app.get("/products/:id",async(req,res) =>{
  const id=req.params.id;

  const query={
    _id:new ObjectId(id)
  }
  const result=await snekersColl.findOne(query)
  res.send(result)
})

// update product data
app.patch('/products/:id',async(req,res) => {
  const id=req.params.id;
  // the product data client give to update
  const updateProduct=req.body;

  const query={_id:new ObjectId(id)}
  const update ={
    $set:{
      name:updateProduct.name,
      price:updateProduct.price,
    }
  }
const result=await snekersColl.updateOne(query,update)
res.send(result)
  
})
// #Bids part Api
app.get('/bids',async(req,res) =>{
  const result=await bidsColl.find().toArray()
  res.send(result)
})
app.get('/bids/:id',async( req,res) => {
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await bidsColl.findOne(query);
  res.send(result)
})

app.post('/bids',async(req,res) => {
  const newBid=req.body;
  const result=await bidsColl.insertOne(newBid);
  res.send(result)
})

app.delete('/bids/:id',async(req,res) => {
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await bidsColl.deleteOne(query);
  res.send(result)
})

app.patch('/bids/:id',async(req,res) =>{
  const id=req.params.id;
  const UpdateBids=req.body;
  const query={
    _id:new ObjectId(id)
  };
const update={
  $set:{
    bid_price:UpdateBids.bid_price,
    status:UpdateBids.status
  }
}
const result=await bidsColl.updateOne(query,update)
res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
app.listen(port ,() => {
    console.log(`NIKE SNEKERS DATA LOADING >>>>>>>>> ${port}`)
})
run().catch(console.dir);