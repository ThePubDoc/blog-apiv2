const Sequelize = require('sequelize');
const path = require("path");

const sequelize_user = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname,"users.sqlite")
});


const sequelize_blog = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname,"blogs.sqlite")
});


const User = sequelize_user.define('users',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Blog = sequelize_blog.define('blogs',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    blog_heading:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    blog: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = {
                    User : User,
                    Blog : Blog
                    };


sequelize_user.sync()
.then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occurred' ,error));


sequelize_blog.sync()
.then(() => console.log('blog table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occurred' ,error));