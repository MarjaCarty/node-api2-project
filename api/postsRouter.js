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
    const newId = await Post.insert(req.body);
    const newPost = await Post.findById(newId.id);
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
      const update = await Post.findById(id);
      res.status(200).json(update);
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
    const deletedPostById = await Post.findById(id);
    const deletedPost = await Post.remove(id);
    if (deletedPost) {
      res.status(200).json(deletedPostById);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Post.findPostComments(id);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res
      .status(500)
      .json({ error: "The comments information could not be retrieved." });
  }
});
router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;

  if (!req.body.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      const newId = await Post.insertComment({ ...req.body, post_id: id });
      const comment = await Post.findCommentById(newId.id);
      res.status(201).json(comment);
    }
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the comment to the database",
      message: err.message,
    });
  }
});

module.exports = router;
