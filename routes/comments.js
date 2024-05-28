const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');


//POST api/posts/:postId/comments         @route
//Comment a post                          @desc
//private                                 @access
router.post('/:postId/comments',[
    auth, [
        check('content','Content is required').not().isEmpty()
    ]
], async(req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    };

    try{
        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }

        const user = await User.findById(req.user.id).select('-password');

        const newComment = new Comment({
            content:req.body.content,
            author:user.id,
            post:post.id
        });

        const comment = await newComment.save();
        post.comments.unshift(comment.id);
        await post.save();
        res.json(comment);
    }catch(err){
        console.error(err.message);
        res.status(500).json("something went wrong")
    }
});

//DELETE /api/posts/:postId/comments/:commentId       @route
//Delete comment                                      @desc
//private                                             @access
router.delete('/:postId/comments/:commentId', auth, async(req,res)=>{
    try{
    const post = await Post.findById(req.params.postId);
    if(!post){
        return res.status(400).json({
            msg:'Post do not found'
        })
    }
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
        return res.status(400).json({
            msg:'Comment do not exist'
        })
    }
    console.log(comment.author)
    if(comment.author.toString() !== req.user.id){
        return res.status(401).json({
            msg:'Unauthorized user'
        })
    }
    const removeIndex = post.comments.map(cmt=>cmt.toString()).indexOf(req.params.commentId);
    post.comments.slice(removeIndex,1);
    await post.save();
    await comment.deleteOne();
    res.json({msg:"Comment removed successfully"});
  }catch(err){
    console.error(err.message);
    res.status(500).json({msg:"Something went wrong"})
  }
  
})

module.exports = router;