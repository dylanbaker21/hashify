const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// database's data structure
const DataSchema = new Schema(
  {
    id: String,
    fromAddress: String,
    hash: String,
    tx: String
  },
  { timestamps: true }
);

// export for use elsewhere
module.exports = mongoose.model("Data", DataSchema);
