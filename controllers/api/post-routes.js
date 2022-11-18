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
     // Comment model here -- attached username to comment    
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

router.get('/:id', (req, res) => {
    post.findAll({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        include: [
            // Comment model here -- attached username to comment
            {
                model: User,
                attributes: ['username', 'twitter', 'github']
            },
            {
                model: Comment,
                attributes: ['id', 'title', 'created_at', 'post_content'],
                include: {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id'})
                return;
            }
            res.json(dbPostData);
    })
        .catch(err => {
                console.log(err);
                res.status(500).json(err);
     });
});

router.post('/', withAuth, (res, req) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json;
        });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_content: req.body.post_content
       },
       {
           where: {
               id: req.params
           }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No Post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});