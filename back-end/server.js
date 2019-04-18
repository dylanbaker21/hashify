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

// this is the MongoDB database
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

// NO-AUTH: fetches one user's basic data
router.get("/getUserData:publicAddress", (req, res) => {
  let pubAddy = req.params.publicAddress;
  db.collection("users").findOne({ publicAddress: pubAddy }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    else if (!data) return res.json({ address: null });
    else return res.json({ address: data.publicAddress, nonce: data.nonce });
  });
});

// NO-AUTH: adds new user to the database
router.post("/addUser", (req, res) => {
  let data = new Data();

  data.publicAddress = req.body.publicAddress;

  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json(data);
  });
});

// AUTH: fetches one users hashes
router.get("/getHashes:publicAddress", verifyToken, (req, res) => {
  jwt.verify(req.token, DB_CRED.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let pubAddy = req.params.publicAddress;
      db.collection("users").findOne(
        { publicAddress: pubAddy },
        (err, data) => {
          if (err) return res.json({ success: false, error: err });
          return res.json(data);
        }
      );
    }
  });
});

// AUTH: overwrites existing data in our database
router.post("/addTx", verifyToken, (req, res) => {
  jwt.verify(req.token, DB_CRED.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id1 = req.body.id;
      let tx1 = req.body.tx;
      let fromAddress1 = req.body.fromAddress;

      db
        .collection("users")
        .updateOne(
          { publicAddress: fromAddress1, "hashes.id": `${id1}` },
          { $set: { "hashes.$.tx": tx1 } }
        ),
        (err, data) => {
          if (err) return res.json({ success: false, error: err });
          return res.json(data);
        };
    }
  });
});

// AUTH: this method removes existing data from the database
router.delete("/deleteHash", verifyToken, (req, res) => {
  jwt.verify(req.token, DB_CRED.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let hashID = req.body.id;
      let address = req.body.address;

      db.collection("users").updateOne(
        { publicAddress: address },
        { $pull: { hashes: { id: hashID } } },
        (err, data) => {
          if (err) return res.json({ success: false, error: err });
          return res.json(data);
        }
      );
    }
  });
});

// AUTH: adds new hash to the database
router.post("/putHash", verifyToken, (req, res) => {
  jwt.verify(req.token, DB_CRED.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const pubAddy = req.body.newHashItem.publicAddress;
      const hash = req.body.newHashItem.hash;
      const id = req.body.newHashItem.id;

      db.collection("users").findOneAndUpdate(
        { publicAddress: pubAddy },
        { $push: { hashes: { id, hash, tx: null } } },
        { new: true },
        (err, data) => {
          if (err) {
            return res.json({ success: false, error: err });
          } else {
            return res.json(data);
          }
        }
      );
    }
  });
});

// NO-AUTH: authenticate user
router.post("/auth", (req, res) => {
  const pubAddy = req.body.publicAddress;
  const signature = req.body.signature;

  db.collection("users").findOneAndUpdate(
    // find user by address and set new nonce
    { publicAddress: pubAddy },
    { $set: { nonce: Math.floor(Math.random() * 1000000) } },
    { new: true },
    (err, data) => {
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        const msg = `Login key: ${data.value.nonce}`;
        // We now have msg, publicAddress and signature. We
        // can perform signature verification
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

        if (err) return res.json({ success: false, error: err });
        // if ecrecover returns matching address, issue JWT auth token
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
      }
    }
  );
});

// AUTH: Test Route
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

// middleware to format JWT auth token
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
