const dbConn = require("../database/sqltest.js"); 
const User = dbConn.User; 
const Blog = dbConn.Blog;
const Like = dbConn.Like;
const Dislike = dbConn.Dislike;
const Comment = dbConn.Comment;

function home(req,res){
    if(req.session.user){
        res.redirect("profile")
    }
    else{
        Blog.findAll()
        .then(blogs => {
            res.render("home",{
                blogs : blogs }
            );
        })
    }
}

function login(req,res){
    if(req.session.user){
        res.redirect("profile")
    }
    else{
        res.render("login");
    }
}

function signup(req,res){
    res.render("signup");
}


function createBlog(req,res){
    res.render("createBlog")
}

function profile(req,res){
    let likedPosts = [];
    let dislikedPosts = [];
    if(req.session.user){
        console.log("profile ka redirect pr req header ",req.session.user);
        const email = req.session.user.id;
        const name = req.session.user.name;
        const userId = req.session.user.userId;
        
        let blogComments = [];
        
        Blog.findAll()
        .then(blogs => {
            Like.findAll({
                where : {
                    userId : userId,
                }
            })
            .then(likedPost => {
                for(i in likedPost){
                    likedPosts.push(likedPost[i].blogId)
                }
                
                Dislike.findAll({
                    where : {
                        userId : userId,
                    }
                })
                .then(dislikedPost => {
                    for(i in dislikedPost){
                        dislikedPosts.push(dislikedPost[i].blogId)
                    }
                    console.log(dislikedPosts)
                    
                    Comment.findAll({
                        order: ['blogId']
                    })
                    .then(comments => {
                        blogComments = comments;
                        
                        
                        res.render("profile",{ 
                            id : email,
                            blogs : blogs,
                            name : name,
                            likedPosts : likedPosts,
                            dislikedPosts : dislikedPosts,
                            blogComments : blogComments,
                        });
                    })
                })
            })
        })
    }
    else{
        res.redirect("login");
    }
}

function blog(req,res){
    if(req.session.user){
        let {id} = req.query;
        console.log(id);
        Blog.findOne({
            where : {
                id : id
            }
        })
        .then(blog => {
            Comment.findAll({
                where: {
                    blogId : id,
                }
            })
            .then(result => {
                res.render("blog",{
                    blog : blog,
                    result : result
                })
            })
        })
    }
    else{
        res.redirect("login")
    }
}

function logout(req,res){
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/home');
}

function myBlogs(req,res){
    const email = req.session.user.id;
    const name = req.session.user.name;
    Blog.findAll({
            where : {
                email : email
            }
        })
        .then(my_blogs => {
            res.render("myBlogs",{ 
                id : email,
                my_blogs : my_blogs,
                name : name,
            });
        })
}

function deleteBlog(req,res){
    if(req.session.user){
        const id = req.body.id;
        Blog.destroy({
            where : {
                id : id,
            }
        })
        .then(result => {
            res.redirect("profile")
        })
    }
}

function likePost(req,res){
    if(req.session.user){
        const blogId = req.body.blogId;
        const userId = req.session.user.userId;
        Dislike.destroy({
            where : {
                blogId : blogId,
                userId : userId
            }
        })
        .then(dislike => {
            Dislike.findAll({
                where : {
                    blogId : blogId,
                }
            })
            .then(totalDislikes => {
                Like.findAll({
                    where : {
                        userId : userId,
                        blogId : blogId,
                    }
                })
                .then(like_res => {
                    if(like_res.length === 0){
                        console.log(like_res)
                        Like.create({
                            blogId,
                            userId
                        })
                        .then(like => {
                            Like.findAll({
                                where : {
                                    blogId : blogId
                                }
                            })
                            .then(totalLikes => {
                                Blog.update({
                                    likes : totalLikes.length,
                                    dislikes : totalDislikes.length,
                                }, {
                                    where : {
                                        id : blogId
                                    }
                                })
                                .then(blog => {
                                    let data = {
                                        totalLikes : totalLikes.length,
                                        totalDislikes : totalDislikes.length
                                    }
                                    res.json(data);
                                })
                            })
                        })
                    }
                    else{
                        Like.destroy({
                            where : {
                                blogId : blogId,
                                userId : userId,
                            }
                        })
                        .then(like => {
                            Like.findAll({
                                where : {
                                    blogId : blogId
                                }
                            })
                            .then(totalLikes => {
                                Blog.update({
                                    likes : totalLikes.length,
                                },{
                                    where :{
                                        id : blogId
                                    }
                                })
                                .then(blog => {
                                    let data = {
                                        totalLikes : totalLikes.length,
                                        totalDislikes : totalDislikes.length
                                    }
                                    res.json(data);
                                })
                            })
                        })
                    }
                })
            })
        })
        
    }
}

function dislikePost(req,res){
    if(req.session.user){
        const blogId = req.body.blogId;
        const userId = req.session.user.userId;
        Like.destroy({
            where : {
                blogId : blogId,
                userId : userId
            }
        })
        .then(like => {
            Like.findAll({
                where : {
                    blogId : blogId,
                }
            })
            .then(totalLikes => {
                Dislike.findAll({
                    where : {
                        userId : userId,
                        blogId : blogId,
                    }
                })
                .then(dislike_res => {
                    if(dislike_res.length === 0){
                        console.log(dislike_res)
                        Dislike.create({
                            blogId,
                            userId
                        })
                        .then(dislike => {
                            Dislike.findAll({
                                where : {
                                    blogId : blogId
                                }
                            })
                            .then(totalDislikes => {
                                Blog.update({
                                    dislikes : totalDislikes.length,
                                }, {
                                    where : {
                                        id : blogId
                                    }
                                })
                                .then(blog => {
                                    let data = {
                                        totalLikes : totalLikes.length,
                                        totalDislikes : totalDislikes.length
                                    }
                                    res.json(data);
                                })
                            })
                        })
                    }
                    else{
                        Dislike.destroy({
                            where : {
                                blogId : blogId,
                                userId : userId,
                            }
                        })
                        .then(dislike => {
                            Dislike.findAll({
                                where : {
                                    blogId : blogId
                                }
                            })
                            .then(totalDislikes => {
                                Blog.update({
                                    dislikes : totalDislikes.length,
                                    likes : totalLikes.length,
                                },{
                                    where :{
                                        id : blogId
                                    }
                                })
                                .then(blog => {
                                    let data = {
                                        totalLikes : totalLikes.length,
                                        totalDislikes : totalDislikes.length
                                    }
                                    res.json(data);
                                })
                            })
                        })
                    }
                })
            })
        })
    }
}

function createComment(req,res){
    if(req.session.user){
        const userId = req.session.user.userId;
        const blogId = req.body.blogId;
        const comment = req.body.comment;
        const name = req.session.user.name
        const email = req.session.user.id
        console.log(blogId)
        console.log(comment)
        console.log(req.session.user)
        Comment.create({
            comment,
            name,
            email,
            blogId,
            userId,
        })
        .then(comm => {
            let data = {
                comment : comm,
                name : req.session.user.name,
                email : req.session.user.id,
            }
            res.json(data)
        })
    }
}

module.exports = {
    home : home,
    login : login,
    signup : signup,
    createBlog : createBlog,
    profile : profile,
    logout : logout,
    myBlogs : myBlogs,
    deleteBlog : deleteBlog,
    likePost : likePost,
    dislikePost : dislikePost,
    createComment : createComment,
    blog : blog
}