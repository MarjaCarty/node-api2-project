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

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  try {
    const updatedPost = await Post.update(id, req.body);
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.delete(id);
    if (deletedPost) {
      res.status(200).json({ message: "The post was removed" });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res.status(500).json({ error: "The post could not be removed" });
  }
});
router.get("/:id/comments", (req, res) => {});
router.post("/:id/comments", (req, res) => {});

module.exports = router;
