const mongoose = require("mongoose");

class ConnectMongoDB {
  constructor() {
    this.gfs = null;
  }
  static getConnection() {
    if (!mongoose.connection.readyState) {
      mongoose
        .connect(process.env.MONGODB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
        })
        .then(() => console.log(`DB is connected!`.yellow))
        .catch(() => console.log(`DB is failed to connect!`.red));

      const conn = mongoose.connection;

      conn.once("open", () => {
        this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
          bucketName: process.env.MONGODB_BUCKET,
        });
      });
    }
  }
}

module.exports = ConnectMongoDB;
