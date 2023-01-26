const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { query } = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jfl1bty.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const appointmentCollection = client
      .db("localHospital")
      .collection("appointment");
    const usersCollection = client.db("localHospital").collection("users");
    const doctorsCollection = client.db("localHospital").collection("doctors");

    // save all user this api
    app.post("/user", async (req, res) => {
      const user = req.body;
      const filter = {
        email: user.email,
      };
      const alreadyUser = await usersCollection.find(filter).toArray();
      if (alreadyUser.length) {
        const message = `Already have a user this ${user.email}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //get all user this api
    app.get("/allusers", async (req, res) => {
      const allusers = {};
      const result = await usersCollection.find(allusers).toArray();
      res.send(result);
    });

    //deleted user use this api
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    //update user using this api
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      const result = await appointmentCollection.insertOne(appointment);
      res.send(result);
    });

    app.get("/myappointments/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await appointmentCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/myappointment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentCollection.findOne(query);
      res.send(result);
    });

    app.put("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: update.name,
          phone: update.phone,
          email: update.email,
          doctorName: update.doctorName,
          gender: update.gender,
          specialty: update.specialty,
          date: update.date,
          time: update.time,
        },
      };
      const result = await appointmentCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.delete("/myappointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/doctors", async (req, res) => {
      const query = {};
      const result = await doctorsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("local hospital server in running");
});

app.listen(port, () => {
  console.log(`local hospital server on port ${port}`);
});
