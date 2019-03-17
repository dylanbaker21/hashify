const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const cors = require("cors");

const DB_CRED = require("./db");

// port to run server on
const API_PORT = 3001;

// use cors to bypass cross-origin security
const app = express();
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const router = express.Router();

// this is our MongoDB database
const dbRoute = `mongodb+srv://${DB_CRED.USER}:${
  DB_CRED.PASS
}@cluster0-zjtwu.mongodb.net/test?retryWrites=true`;

// connects our backend code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("Database Connected"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only used for logging and
// parsing the request body to be readable json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json(data);
  });
});

// overwrites existing data in our database
router.post("/updateData", (req, res) => {
  let id1 = req.body.id;
  let tx1 = req.body.tx;
  let fromAddress1 = req.body.fromAddress;
  console.log(
    "Sent from eth address: " +
      fromAddress1 +
      "/n" +
      " With id: " +
      id1 +
      "/n" +
      " Eth transaction hash: " +
      tx1
  );
  db.collection("datas").updateOne(
    { id: id1 },
    { $set: { tx: tx1, fromAddress: fromAddress1 } }
  );
  err => {
    if (err) return res.json({ success: false, error: err });
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json(data);
    });
  };
});

// this method removes existing data from the database
router.delete("/deleteData:id", (req, res) => {
  let id2 = req.params.id;
  console.log("Item with id to delete: " + id2);
  Data.findOneAndDelete({ id: id2 }, err => {
    if (err) return res.send(err);
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json(data);
    });
  });
});

// adds new data to the database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, fromAddress, hash, tx } = req.body.newHashItem;

  if ((!id && id !== 0) || !hash) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  data.hash = hash;
  data.id = id;
  data.fromAddress = fromAddress;
  data.tx = tx;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json(data);
    });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
