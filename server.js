const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 300;
const cookieExpirySeconds = 86400 * 30 * 1000;

const jwtRefreshExpiry = "30d";

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  refreshToken: {
    type: String
  }
});
const User = mongoose.model("user", user);

const blacklist = new mongoose.Schema({
  token: {
    type: String
  }
});

const Blacklist = mongoose.model("blacklist", blacklist);

app.prepare().then(() => {
  const server = express();
  mongoose.connect("mongodb://localhost:27017/whatever", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(cookieParser());

  //refresh and blacklist middleware

  const refreshBlacklist = () => {
    return async function(req, res, next) {
      const token = req.cookies.token;

      // check blacklist
      let isBlacklist;

      await Blacklist.findOne({ token: token })
        .lean()
        .exec(function(err, user) {
          if (user) {
            isBlacklist = true;
            console.log(user.token);
            console.log("blacklisted");
            req.blacklist = "blacklisted";
            next();
          } else {
            isBlacklist = false;
            console.log("blacklist?" + isBlacklist + "token:" + token);
            if (token && !isBlacklist) {
              jwt.verify(token, jwtKey, async (err, decoded) => {
                if (err && err.name === "TokenExpiredError") {
                  console.log("JWT Is expired");
                  const payload = jwt.verify(token, jwtKey, {
                    ignoreExpiration: true
                  });
                  console.log("payload is" + payload.receivedEmail);
                  await User.findOne({ email: payload.receivedEmail })
                    .lean()
                    .exec(function(err, user) {
                      if (user.refreshToken) {
                        console.log("has Refresh token:" + user.refreshToken);

                        let receivedEmail = payload.receivedEmail;
                        const newToken = jwt.sign({ receivedEmail }, jwtKey, {
                          algorithm: "HS256",
                          expiresIn: jwtExpirySeconds
                        });
                        console.log(" new Token:", newToken);

                        // set the cookie as the token string, with a similar max age as the token
                        // here, the max age is in milliseconds, so we multiply by 1000
                        res.cookie("token", newToken, {
                          maxAge: cookieExpirySeconds
                        });
                        next();
                      } else next();
                    });
                }
                if (decoded) {
                  if (Date.now() >= decoded.exp * 1000) {
                    console.log("JWT Is expired");
                  } else {
                    console.log("jwt is good");
                    next();
                  }
                }
              });
            } else next();
          }

          if (err) {
            console.log("blacklist False");
            isBlacklist = false;
            next();
          }
        });
    };
  };

  server.post("/login", async function(req, res) {
    let receivedEmail = req.body.email;
    let receivedPassword = req.body.password;
    let token = req.cookies.token;
    await User.findOne({ email: receivedEmail })
      .lean()
      .exec(function(err, user) {
        if (err) {
          res.send(JSON.stringify("User Not Found"));
          console.log(err);
        }

        if (user) {
          if (receivedPassword == user.password) {
            const token = jwt.sign({ receivedEmail }, jwtKey, {
              algorithm: "HS256",
              expiresIn: jwtExpirySeconds
            });
            console.log("token:", token);

            // set the cookie as the token string, with a similar max age as the token
            // here, the max age is in milliseconds, so we multiply by 1000
            res.cookie("token", token, { maxAge: cookieExpirySeconds });
            res.send(JSON.stringify("Passwords match"));
          } else res.send(JSON.stringify("Passwords Don't Match"));
        } else {
          res.send(JSON.stringify("User Not Found"));
        }
      });
  });

  server.post("/register", async function(req, res) {
    var email2 = req.body.email;
    var password2 = req.body.password;
    var check = req.body.check;
    console.log(
      "Email = " +
        email2 +
        ", password is " +
        password2 +
        "Agreed to GDPR:" +
        check
    );
    await User.findOne({ email: email2 })
      .lean()
      .exec(async (err, user) => {
        if (err) return console.log(err);
        else {
          console.log(user);
          if (user === null) {
            const refreshToken = jwt.sign({ email2 }, jwtKey, {
              algorithm: "HS256",
              expiresIn: jwtRefreshExpiry
            });
            console.log("token:", refreshToken);
            await User.create({
              email: email2,
              password: password2,
              refreshToken: refreshToken
            });

            res.send("Registered");
          } else res.send("EmailInUse");
        }
      });

    /* if (checkEmail() == null) {
      connect()
        .then(async connection => {
          console.log(email2 + password2);
          await User.create({ email: email2, password: password2 });
        })
        .catch(e => console.error(e));
      res.send("Registered");
    } else {
      res.send("EmailInUse");
    } */
    /*     const token = jwt.sign({ email2 }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    });
    console.log("token:", token);
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 }); */
  });

  server.get("/posts/:id", (req, res) => {
    return app.render(req, res, "/posts", { id: req.params.id });
  });

  server.get("/", refreshBlacklist(), (req, res, next) => {
    const token = req.cookies.token;
    const blacklist = req.blacklist;
    if (blacklist === "blacklisted" && req.url === "/") {
      console.log("ONCE ONLY");
      res.redirect("/login");
      res.end();
    } else {
      var payload;
      try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(token, jwtKey);
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          // if the error thrown is because the JWT is unauthorized, return a 401 error
          if (req.path !== "/login") return res.redirect("/login");
        }
        // otherwise, return a bad request error
        if (req.path !== "/login") return res.status(400).end();
      }
      next();
    }

    // Finally, return the welcome message to the user, along with their
    // username given in the token
  });

  server.get("/login", refreshBlacklist(), async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      await Blacklist.findOne({ token: token })
        .lean()
        .exec(function(err, user) {
          if (user) {
            isBlacklist = true;
            console.log(user);
            console.log("Login blacklisted");
            next();
          } else {
            console.log("user logged in, redirecting");
            var payload;
            try {
              // Parse the JWT string and store the result in `payload`.
              // Note that we are passing the key in this method as well. This method will throw an error
              // if the token is invalid (if it has expired according to the expiry time we set on sign in),
              // or if the signature does not match
              payload = jwt.verify(token, jwtKey, function(err, decodedToken) {
                if (err) {
                  console.log(err);
                  next();
                } else {
                  console.log("/");
                  res.redirect("/");
                }
              });
            } catch (e) {
              if (e instanceof jwt.JsonWebTokenError) {
                // if the error thrown is because the JWT is unauthorized, return a 401 error
                if (req.path !== "/login") return res.redirect("/login");
              }
              // otherwise, return a bad request error
              if (req.path !== "/login") return res.status(400).end();
            }
            next();
          }
        });

      // Finally, return the welcome message to the user, along with their
      // username given in the token
    } else next();
  });

  server.get("/api/userAuth", (req, res) => {
    const token = req.cookies.token;
    var payload;
    try {
      // Parse the JWT string and store the result in `payload`.
      // Note that we are passing the key in this method as well. This method will throw an error
      // if the token is invalid (if it has expired according to the expiry time we set on sign in),
      // or if the signature does not match
      payload = jwt.verify(token, jwtKey);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        console.log("no token");
        if (req.path !== "/login") return res.redirect("/login");
      }
      // otherwise, return a bad request error
      if (req.path !== "/login") return res.status(400).end();
    }
    if (req.path !== "/login") {
      if (Date.now() >= payload.exp * 1000) {
        console.log("JWT Is expired");
      }
      res.end(JSON.stringify(payload.receivedEmail));
    }

    // Finally, return the welcome message to the user, along with their
    // username given in the token
  });
  //refresh

  server.get("/logout", (req, res) => {
    let token = req.cookies.token;
    if (token) {
      jwt.verify(token, jwtKey, async (err, decoded) => {
        if (err && err.name === "TokenExpiredError") {
          console.log("JWT Is expired");
          res.send(400, "not possible");
        }

        if (decoded) {
          console.log(decoded);
          if (Date.now() >= decoded.exp * 1000) {
            console.log("JWT Is expired");
            res.send(400, "not possible");
          } else {
            await Blacklist.create({ token: token });
            res.send(JSON.stringify("Logged Out"));
          }
        } else res.send(400, "not possible");
      });
    } else res.send(400, "not possible");
  });
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
