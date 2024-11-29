var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.TOKEN_SECRET_KEY;
  return jwt({
    secret: secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
