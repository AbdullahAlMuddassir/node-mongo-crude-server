const express = require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const  app = express();
const port=5000;
///middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://abdullah:OEYQzI9ijWQGZM4L@cluster0.4j4hf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";// PASSWORD:OEYQzI9ijWQGZM4L
// USER=abdullah
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("Foodmaster");
    const userCollection = database.collection("users");
    ////GET API
    app.get('/users',async(req, res)=>{
      const cursor=userCollection.find({})
      const users=await cursor.toArray();
      res.send(users);
    });
    //update api
    app.put('/users/:id',async(req, res)=>{
      const id=req.params.id;
      const updateUer=req.body;
      const filter={_id:ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
        name:updateUer.name,
        email:updateUer.email
        },
      }
      const result=await userCollection.updateOne(filter,updateDoc,options)
      res.json(result);
    })
    app.get('/users/:id',async(req, res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const user=await userCollection.findOne(query)
      console.log('id vai 2mi acho?',id);
      res.send(user);
    })

    //Create POST API
    app.post('/users',async(req, res)=>{
      const newUser=req.body;
      const result=await userCollection.insertOne(newUser)
      console.log('Hello Bangladesh',req.body);
      res.json(result);
    });
    //DeleteId
    app.delete('/users/:id',async(req, res)=>{
      const id=req.params.id;
      const query={ _id:ObjectId(id) };
      const result=await userCollection.deleteOne(query);
      console.log("delete id:",result);
      res.json(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('hello');
});

app.listen(port,() =>{
    console.log('running projects',port);
});
