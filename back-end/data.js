const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// hash storage schema
const DataSchema = new Schema(
  {
    id: String,
    hash: String,
    tx: String
  },
  { timestamps: true }
);

// user schema
const UserSchema = new Schema(
  {
    publicAddress: { type: String, index: true, unique: true },
    nonce: { type: String, default: Math.floor(Math.random() * 1000000) },
    hashes: [DataSchema]
  },
  { timestamps: true }
);

// export for use elsewhere
module.exports = mongoose.model("User", UserSchema);
