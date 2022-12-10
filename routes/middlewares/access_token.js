require("dotenv").config();

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send({ message: "Access Denied" });

    if (token === process.env.ACCESS_TOKEN) next();
    else res.status(401).send({ message: "Access Denied, wrong token" });
}