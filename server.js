const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

const db = "mongodb://localhost:27017/DACS2";

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

app.use("/uploads", express.static("uploads"));
app.use("/api/account", require("./routers/Account"));
app.use("/api/recruitment", require("./routers/Recruitment"));
app.use("/api/city", require("./routers/City"));
app.use("/api/career", require("./routers/Career"));
app.use("/api/profile", require("./routers/Profile"));
app.use("/api/cv", require("./routers/CV"));
app.use("/api/admin", require("./routers/Admin"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server Run With Port ${PORT}`));
