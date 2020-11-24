const express = require('express');
const PostController = require("../controllers/posts.controller")
const checkAuth = require("../middlewales/check-auth");
const router = express();





router.post("", checkAuth, PostController.createPost);
router.put('/:id', checkAuth, PostController.updatePost);
router.get("", PostController.getPosts);
router.get('/:id', PostController.getPost)

router.delete("/:id", checkAuth, PostController.deletePost)

module.exports = router;