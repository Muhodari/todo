const Post = require("../models/posts.model");

exports.createPost = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(error => {
        res.status(500).json({ message: "creating a post failed" })
    });
}

// update user
exports.updatePost = (req, res, next) => {

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {

        if (result.n > 0) {
            res.status(200).json({ message: "post updated successfuly" });
        } else {
            res.status(401).json({ message: "not Authorized" });
        }
    }).catch(error => {

        res.status(500).json({ message: "updating post failed" })
    });
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    const postQuery = Post.find();

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((documents) => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {

            res.status(500).json({ message: "fetching posts failed" })
        })
}

// post at given id
exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
            if (post) {} else {
                res.status(404).json({ message: " post not found!" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "fetching post failed" })
        });
}


exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "post deleted successfuly" });
        } else {
            res.status(401).json({ message: "not Authorized" });
        }
    }).catch(error => {

        res.status(500).json({ message: "deleting post failed" })
    })
}