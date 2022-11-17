const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../..config/connection');
const withAuth = require('../../utils/auth.js');

// get all users
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
    order: [['created_at', 'DESC']],
    include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username', 'twitter', 'github',]
            } 
        },
        {
            model: User,
            attributes: ['username', 'twitter', 'github' ]
        },
    ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});