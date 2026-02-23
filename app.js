const express = require("express");
require("express-async-errors");
require("dotenv").config();
const flash = require("connect-flash");

const app = express();

// Session config
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO,
  collection: "SessionEjs",
});
store.on("error", function (err) {
  console.log(err);
});

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParams.cookie.secure = true;
}
app.use(session(sessionParams));

app.use(flash());
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// secret word handling
// let secretWord = "syzygy";
app.get("/secretWord", (req, res) => {
  // Set the user session keyword
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("errors");
  res.render("secretWord", {
    secretWord: req.session.secretWord,
  });
});
app.post("/secretWord", (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("errors", "That word won't work");
    req.flash("errors", "You can't use words that start with 'p'.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed");
  }
  res.redirect("/secretWord");
});

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
