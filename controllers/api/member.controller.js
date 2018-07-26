var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/member.service');
var uService = require('services/user.service');
var jsonfile = require('jsonfile')
 


 


// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.get('/count', GetCount);
router.get('/getbyregno/:_reg', getbyregno);
router.get('/backup', GetBackUp);
module.exports = router;

function getbyregno(req, res) {
    console.log(req);
   
    if (!req.params._reg) {
        // can only update own account
        return res.status(401).send('You need to pass registration number');
    }

    userService.getbyregno(req.params._reg)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function GetBackUp(req, res)
{
    //console.log("right Member controller");
    userService.getCount()
        .then(function (user) {
            if (user) {
			console.log(user);
			var dt=new Date();
			var file = './public/tmp/user-'+dt.getTime();
			console.log(file);
			jsonfile.writeFile(file.toString()+".json", user, function (err) {
				console.error(err)
			});
			
			 res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function GetCount(req, res)
{
    console.log("right Member controller");
    userService.getCount()
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}