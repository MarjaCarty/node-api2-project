const express = require("express");
const cors = require("cors");
const server = express();

const postsRouter = require("./postsRouter");

server.use(cors());
server.use(express.json());

server.use("/api/posts", postsRouter);

module.exports = server;
