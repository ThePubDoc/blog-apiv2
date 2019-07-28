const dbConn = require("../database/sqltest.js"); 
const User = dbConn.User; 
const Blog = dbConn.Blog;
const Like = dbConn.Like;
let user_id;

let name = "a"
let email = "a@a.com"
let password = "a"
let blog_heading = "hi"
let blog = "hellloo"

// User.create({
//     name,
//     email,
//     password
// })
// .then(user => {
//     console.log(user);
// })
// .catch(err => {
//     console.log(err)
// });

// let userId = 1;

// Blog.create({
    
//     name,
//     email,
//     blog_heading,
//     blog,
//     userId
// })
// .then(res => {
//     console.log(res)
//     console.log(res.u_id)
// })
// .catch(err => {
//     console.log(err)
// })

Like.findAll({
    where : {
        userId : 2
    }
})
.then(res => {
    for(i in res){
        console.log(res[i].blogId)
    }
})