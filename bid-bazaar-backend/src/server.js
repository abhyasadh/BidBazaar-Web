const { inject, errorHandler } = require("express-custom-error");
inject();

//Requirements
const db = require("./database/database.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const csrf = require("csurf");
const cloudinary = require("cloudinary");
const multiparty = require("connect-multiparty");
const { Server } = require("socket.io");

const logger = require("./util/logger.js");
const { socketHandler } = require("./socket/socket.js");
const { rateLimiter } = require("./util/rateLimiter.js");
const MySQLStore = require("express-mysql-session")(session);

//.env Variables
require("mandatoryenv").load([
  "PORT",
  "SECRET",
  "SESSION_SECRET",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
]);
const { PORT } = process.env;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//App
const app = express();
const server = require("http").createServer(app);
app.use(express.json());
app.use(multiparty());

//Log and Limit
app.use(logger.dev, logger.combined);
// app.use(rateLimiter);

//Security
const corsPolicy = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
const sessionStore = new MySQLStore({}, db);
const csrfProtection = csrf({ cookie: true });

app.use(cors(corsPolicy));
app.use(cookieParser());
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 30000 * 60 * 60 * 24, // 30 Days
    },
  })
);
app.use(csrfProtection);

//App Routes
app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/category", require("./routes/categoryRoutes.js"));
app.use("/api/product", require("./routes/productRoutes.js"));
app.use("/api/contact", require("./routes/contactRoutes.js"));
app.use("/api/report", require("./routes/reportRoutes.js"));
app.use("/api/bid", require("./routes/bidRoutes.js"));

//Error Handling
// app.use(errorHandler());

//Socket Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

//Listen to the Port
server.listen(PORT, () => console.info("Server listening on port: ", PORT));
