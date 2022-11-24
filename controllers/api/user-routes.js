const router = require('express').Router();
const req = require('express/lib/request');
const res = require('express/lib/response');
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findAll({
        attributes: ['id', 'title', 'post_content', 'created_at'],
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]

    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id'});
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        linkedin: req.body.linkedin,
        github: req.body.github
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.linkedin = dbUserData.linkedin;
            req.session.github = dbUserData.github;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    });
});

// LOGIN
router.post('/login', (req, res) => {
    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password' });
            return
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.linkedin = dbUserData.linkedin;
            req.session.github = dbUserData.github;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are logged in!'});
        });
    });
});


router.post('/logout', (req, res) => {
   
})