const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const mainRoutes = require("./backend/route/mainRoutes");
var session = require("express-session");
var cookieParser = require("cookie-parser");

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Your secret key",
    expires: new Date(Date.now() + 30 * 86400 * 1000)
  })
);
app.set("views", __dirname + "/client/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "client")));
app.use(logger("dev"));
app.use("/", mainRoutes);
app.set("port", process.env.PORT || 4000);
app.listen(app.get("port"), () => {
  console.log("Application running in port: " + app.get("port"));
});

module.exports = app;
