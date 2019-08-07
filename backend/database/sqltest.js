const Sequelize = require('sequelize');
const path = require("path");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname,"test.sqlite")
});


const User = sequelize.define('users',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

const Blog = sequelize.define('blogs',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
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
    },
    likes: {
        type: Sequelize.INTEGER,
        defaultValue : 0
    },
    dislikes: {
        type: Sequelize.INTEGER,
        defaultValue : 0
    }
});

const Like = sequelize.define('likes',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    }
});

const Dislike = sequelize.define('dislikes',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    }
});

const Comment = sequelize.define('comments',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    comment : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
})


Blog.belongsTo(User);
User.belongsToMany(Blog, { through: Like })
Blog.belongsToMany(User, { through: Like })

User.belongsToMany(Blog, { through: Dislike })
Blog.belongsToMany(User, { through: Dislike })

Blog.hasMany(Comment);
Comment.belongsTo(User);


module.exports = {
    User : User,
    Blog : Blog,
    Like : Like,
    Dislike : Dislike,
    Comment : Comment,
}


sequelize.sync()
.then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occurred' ,error));
