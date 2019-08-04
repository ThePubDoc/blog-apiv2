const dbConn = require("../database/sqltest.js"); 
const User = dbConn.User; 
const Blog = dbConn.Blog;

function createBlog(req,res){
    const {blog_heading,blog} = req.body;
    const name = req.session.user.name;
    const email = req.session.user.id;
    const userId = req.session.user.userId;
    // console.log(name)
    // console.log(email)
    // console.log(blog_heading)
    // console.log(blog)
    Blog.create ({
        name,
        email,
        blog_heading,
        blog,
        userId
    })
    .then(blog => {
        // alert("Blog Created");
        res.redirect("profile");
    })
}

function editBlog(req,res){
    const {blog_heading,blog,blogId} = req.body;
    console.log("body--",req.body)
    if(req.session.user){
        Blog.update ({
            blog_heading : blog_heading,
            blog : blog
        },{
            where : {
                id : blogId
            }
        })
        .then(result => {
            res.redirect("/profile")
        })
    }
    else{
        res.redirect("/")
    }
}

module.exports = {
    createBlog : createBlog,
    editBlog : editBlog
}