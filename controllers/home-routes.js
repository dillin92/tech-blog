const router = require('express').Router();
const { Post, User, Comments } = require('../models');



router.get('/', (req,res) => {
    console.log('======================');
    

    Post.findAll({
        attributes: [
            'id',
            'post_body',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comments,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['user_name']
                }
            },
            { 
                model: User,
                attributes: ['user_name']
            }
        ]
    })
         .then(dbPostData => {
            
             const posts = dbPostData.map(post => post.get({ plain: true }));
                console.log(req.session.loggedIn);
             res.render('homepage', { posts, loggedIn: req.session.loggedIn }); 
         })
         .catch(err => {
             console.log(err);
             res.status(500).json(err);
         });
 });

 router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});


module.exports = router;