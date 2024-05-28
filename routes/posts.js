const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require("../middleware/authMiddleware");
const Post = require("../models/Post");
const User = require("../models/User");


//POST api/posts          @route
//Create a post           @desc
//private                 @access
router.post('/',[
    auth,
    [
        check('title','Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()]
    ], async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        };

        try{
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                title:req.body.title,
                content:req.body.content,
                author:user.id
            });
            const post = await newPost.save();

            res.json(post);
        }catch(err){
            console.error(err.message);
            res.status(500).json({msg:"Something went wrong"})
        }
    }
);

//GET api/posts                 @route
//Get all post                  @desc
//public                        @access
router.get('/',async(req,res)=>{
    try{
        const posts = await Post.find().sort({date:-1}).populate(
            'author',['name']
        );
        res.json(posts)
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:'Something went wrong'})
    }
});


//GET api/posts/:id             @route
//Get post by ID                @desc
//public                        @access
router.get('/:id',async(req,res)=>{
    try{
        const posts = await Post.findById(req.params.id).populate(
            'author',['name']
        );
        res.json(posts)
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:'Something went wrong'})
    }
});

//DELETE api/posts/:id        @route
//Delete a post               @desc
//private                     @access
router.delete('/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }

        if(post.author.toString() !== req.user.id){
            return res.status(401).json({
                msg:"User not authorized"
            });
        }
        await post.deleteOne();
        res.json({msg:"Post removed successfully"});
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
});

//PUT api/posts/:id           @route
//Update a post               @desc
//private                     @access
router.put('/:id',auth,[
    check('title','Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()]
    ,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }

        if(post.author.toString() !== req.user.id){
            return res.status(401).json({
                msg:"User not authorized"
            });
        }

        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();
        res.json({msg:"Post updated successfully",post});
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
});


//PUT api/posts/like/:id         @route
//Like a post                    @desc
//private                        @access
router.put('/like/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like=>like.toString() === req.user.id).length > 0){
            return res.status(400).json({msg:"Post already liked"});
        }
        post.likes.unshift(req.user.id);

        await post.save();

        res.json(post.likes);
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
});

//PUT api/posts/unlike/:id       @route
//Unlike a post                  @desc
//private                        @access
router.put('/unlike/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like=>like.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:"Post has not yet been liked"});
        }

        const removeIndex = post.likes.map(like => like.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
});

module.exports = router;