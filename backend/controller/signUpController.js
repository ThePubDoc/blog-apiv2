const dbConn = require("../database/sqltest.js"); 
const User = dbConn.User; 
var session = require('express-session');


module.exports = {
    signup: signup
};

function signup(req, res) {
    const { name,email, password} = req.body; 
    console.log(name)
    console.log(email)
    console.log(password)
    
    if (!(name && email && password))
        return res.render("signup", {
        msg: "Please enter all the required details"
        });
    else {
        User.create({
        name,
        email,
        password
        })
        .then(user => {
            if (user) {
                console.log("Exists");
                const newUser = {
                                    id: email,
                                    name : name,
                                    userId : user.id
                                };
                console.log(newUser);
                req.session.user = newUser;
                return res.redirect('/');
                return res.render("profile", {
                    msg: "User successfully created",
                    user: user.name,
                    email : user.email
                });
            }
        })
        .catch(err => {
            return res.render("signup");
        });
    }
}