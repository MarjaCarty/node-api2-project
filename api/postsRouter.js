const express = require("express");
const Post = require("../data/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});
router.post("/", async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  try {
    const newPost = await Post.insert(req.body);
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  }
});
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});
router.get("/:id/comments", (req, res) => {});
router.post("/:id/comments", (req, res) => {});

module.exports = router;
