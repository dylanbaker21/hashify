const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const cors = require("cors");
const ethUtil = require("ethereumjs-util");
const jwt = require("jsonwebtoken");

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

// fetches ONE USERS DATA
router.get("/getData:publicAddress", (req, res) => {
  let pubAddy = req.params.publicAddress;
  console.log(pubAddy);
  db.collection("users").findOne({ publicAddress: pubAddy }, (err, data) => {
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
// ADD NEW USER
router.post("/putData", (req, res) => {
  let data = new Data();
  const publicAddress = req.body.publicAddress;
  console.log(publicAddress);

  // if ((!id && id !== 0) || !hash) {
  //   return res.json({
  //     success: false,
  //     error: "INVALID INPUTS"
  //   });
  // }

  data.publicAddress = publicAddress;
  //data.hashes.push({ id, hash, tx: null });
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json(data);
    // Data.find((err, data) => {
    //   if (err) return res.json({ success: false, error: err });
    //   return res.json(data);
    // });
  });
});

// AUTHENTICATE USER
router.post("/auth", (req, res) => {
  const pubAddy = req.body.publicAddress;
  const signature = req.body.signature;

  console.log(pubAddy + " " + signature);

  // if ((!id && id !== 0) || !hash) {
  //   return res.json({
  //     success: false,
  //     error: "INVALID INPUTS"
  //   });
  // }
  db.collection("users").findOneAndUpdate(
    { publicAddress: pubAddy },
    { $set: { nonce: Math.floor(Math.random() * 1000000) } },
    { new: true },
    (err, data) => {
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        const msg = `Login key: ${data.value.nonce}`;
        console.log(data.value.nonce);
        // We now are in possession of msg, publicAddress and signature. We
        // can perform an elliptic curve signature verification with ecrecover
        const msgBuffer = ethUtil.toBuffer(msg);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
        const publicKey = ethUtil.ecrecover(
          msgHash,
          signatureParams.v,
          signatureParams.r,
          signatureParams.s
        );
        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const address = ethUtil.bufferToHex(addressBuffer);
        console.log(address + " " + data.value.publicAddress);

        // dataSchema.nonce = Math.floor(Math.random() * 10000);
        if (err) return res.json({ success: false, error: err });
        if (address === data.value.publicAddress) {
          jwt.sign(
            { payload: { id: data.value._id, address } },
            DB_CRED.JWT_SECRET,
            (err, token) => {
              if (err) {
                return res.json(err);
              }
              return res.json(token);
            }
          );
        } else {
          return res
            .status(401)
            .send({ error: "Signature verification failed" });
        }
        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
      }
    }
  );
});

router.post("/test", verifyToken, (req, res) => {
  jwt.verify(req.token, DB_CRED.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "SUCCESS :)",
        authData
      });
    }
  });
});

function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    //split token at space
    const bearer = bearerHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken;
    //next middleware
    next();
  } else {
    res.sendStatus(403);
  }
}

// append /api for our http requests
app.use("/api", router);

// launch backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
