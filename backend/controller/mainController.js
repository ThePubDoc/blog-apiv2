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
        const userId = req.session.user.userId
        console.log("like ke andar ka ",blogId);
        console.log("like ke andar ka ",req.session.user)
        Like.create({
            blogId,
            userId
        })
        .then(likes => {
            console.log("Like first call")
            Dislike.destroy({
                where : {
                    blogId : blogId,
                    userId : userId,
                }
            })
            .then(result => {
                console.log("Destroy ",result)
                if(result === 1){
                    Blog.findOne({
                        where : {
                            id : blogId
                        }
                    })
                    .then(blog => {
                        let totalLikes = blog.likes+1;
                        let totalDislikes = blog.dislikes-1;
                        Blog.update({
                            likes : totalLikes,
                            dislikes : totalDislikes
                        }, {
                            where : {
                                id : blogId
                            }
                        })
                        .then(finalResult => {
                            res.json(result)
                        })
                    })
                }
                else{
                    Blog.findOne({
                        where : {
                            id : blogId
                        }
                    })
                    .then(blog => {
                        let totalLikes = blog.likes+1;
                        Blog.update({
                            likes : totalLikes,
                        }, {
                            where : {
                                id : blogId
                            }
                        })
                        .then(finalResult => {
                            res.json(result)
                        })
                    })
                }
            })
        })
    }
}

function dislikePost(req,res){
    if(req.session.user){
        const blogId = req.body.blogId;
        const userId = req.session.user.userId
        console.log("dislike ke andar ka ",blogId);
        console.log("dislike ke andar ka ",req.session.user)
        Dislike.create({
            blogId,
            userId
        })
        .then(dislikes => {
            Like.destroy({
                where : {
                    blogId : blogId,
                    userId : userId,
                }
            })
            .then(result => {
                if(result === 1){
                    Blog.findOne({
                        where : {
                            id : blogId
                        }
                    })
                    .then(blog => {
                        let totalLikes = blog.likes-1;
                        let totalDislikes = blog.dislikes+1;
                        Blog.update({
                            likes : totalLikes,
                            dislikes : totalDislikes
                        }, {
                            where : {
                                id : blogId
                            }
                        })
                        .then(finalResult => {
                            res.json(result)
                        })
                    })
                }
                else{
                    Blog.findOne({
                        where : {
                            id : blogId
                        }
                    })
                    .then(blog => {
                        let totalDislikes = blog.dislikes+1;
                        Blog.update({
                            dislikes: totalDislikes
                        }, {
                            where : {
                                id : blogId
                            }
                        })
                        .then(finalResult => {
                            res.json(result)
                        })
                    })
                }
                
            })
        })
    }
}

function createComment(req,res){
    if(req.session.user){
        const userId = req.session.user.userId;
        const blogId = req.body.blogId;
        const comment = req.body.comm;
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
                comm : comm,
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
}