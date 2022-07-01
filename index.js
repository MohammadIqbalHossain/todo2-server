const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    }));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztdf7.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const taskCollection = client.db("taskData").collection("tasks");
const completeTaskCollection = client.db("completedTaskData").collection("CompletedTasks");

async function run() {
  try {
    await client.connect();

    app.post('/task', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);

    });


    app.get('/taskData', async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/editTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);

    });

    app.post('/completedTask', async (req, res) => {
      const task = req.body;
      const result = await completeTaskCollection.insertOne(task);
      res.send(result);

    });

    app.get('/allCompletedTask', async (req, res) => {
      const query = {};
      const cursor = completeTaskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    



  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Todo app is running")
})


app.listen(port, () => {
  console.log("Listenning from Todo app", port);
});


