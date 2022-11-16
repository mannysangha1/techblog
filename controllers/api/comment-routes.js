const router = require('express').Router();
const req = require('express/lib/request');
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req,res) => {
    Comment.findAll({})
     .then(dbCommentData => res.json(dbCommentData))
     .catch(err => {
         console.log(err)
         res.status(500).json(err);
     });
});

router.post('/', withAuth, (req, res) => {})
