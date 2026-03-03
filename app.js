require("dotenv").config();
require("express-async-errors");
const express = require("express");
const expressSession = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(expressSession);
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const app = express();

app.use(require("body-parser").urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(require("helmet")());
app.use(require("xss-clean")());
app.use(
  require("express-rate-limit").rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(csrf.csrf());

const store = new MongoDBStore({
  uri: process.env.MONGO,
  collection: "SessionEjs",
});

store.on("error", function (err) {
  console.log(err);
});

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParams.cookie.secure = true;
}

app.use(expressSession(sessionParams));

const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));

app.use(csrf.csrf());

app.use((req, res, next) => {
  res.locals._csrf = csrf.getToken(req, res);
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
app.use("/secretWord", auth, require("./routes/secretWord"));
app.use("/jobs", auth, require("./routes/jobs"));

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
    await require("./db/connect")(process.env.MONGO);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
