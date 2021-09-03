const router = require('express').Router();
const { User, Post, Comments } = require('../../models');

// Get all users
router.get('/', (req, res) => {
        // Access our User model and run .findAll() method)
        User.findAll({
                attributes: {exclude: ['password'] }
        })
                .then(dbUserData => res.json(dbUserData))
                .catch(err => {
                        res.status(500).json(err);
                });
});

// Get a single user
router.get('/:id', (req, res) => {
        User.findOne({
                attributes: { exclude: ['password'] },
                where: {
                        id: req.params.id
                },
                include: [
                        {
                                model: Post,
                                attributes: ['id', 'title', 'post_body', 'created_at']
                        },
                        {
                                model: Comments,
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
                                res.status(404).json({ message: 'No user found with this id' });
                                return;
                        }
                        res.json(dbUserData);
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                });
});

// Create a user
router.post('/', (req, res) => {
        console.log(req.body);

        User.create({ 
                user_name: req.body.user_name,
                password: req.body.password
        })
                .then(dbUserData => {
                        req.session.save(() => {
                                req.session.user_id = dbUserData.id;
                                req.session.user_name = dbUserData.user_name;
                                req.session.loggedIn = true;

                                res.json(dbUserData);
                        });
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                });
});

// Login Route
router.post('/login', (req, res) => {

        console.log(req.body);
        
        User.findOne({
                where: {
                        user_name: req.body.user_name,
                }
        }).then(dbUserData => {
                if (!dbUserData) {
                        res.status(400).json({ message: 'No user with that username!' });
                        return;
                }

                const validPassword = dbUserData.checkPassword(req.body.password);

                if (!validPassword) {
                        res.status(400).json({ message: 'Incorrect password!' });
                        return;
                }
                
                req.session.save(() => {
                        req.session.user_id = dbUserData.id;
                        req.session.user_name = dbUserData.user_name;
                        req.session.loggedIn = true;
                        console.log("yo");
                        res.redirect("/");
                });
        });
});

// Logout Route
router.post('/logout', (req, res) => {
        if (req.session.loggedIn) {
                req.session.destroy(() => {
                        res.status(204).end();
                });
        }
        else {
                res.status(404).end();
        }
});

// Update User info
router.put('/:id', (req,res) => {
        User.update(req.body, {
                inidividualHooks: true,
                where: {
                        id: req.params.id
                }
        })
                .then(dbUserData => {
                        if (!dbUserData[0]) {
                                res.status(404).json({ message: 'No user found with this id' });
                                return;
                        }
                        res.json(dbUserData);
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                });
});


// Delete a user
router.delete('/:id', (req, res) => {
        User.destroy({
                where: {
                        id: req.params.id
                }
        })
                .then(dbUserData => {
                        if (!dbUserData) {
                                res.status(404).json({ message: 'No user found with this id' });
                                return;
                        }
                        res.json(dbUserData);
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                });
});

module.exports = router;