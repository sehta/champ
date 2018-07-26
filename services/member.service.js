﻿var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('members');

var service = {};

//service.authenticate = authenticate;
service.getById = getById;
service.create = create;
//service.update = update;
service.delete = _delete;
service.getCount = getCount; 
service.getbyregno = getbyregno;
module.exports = service;


function getbyregno(_reg) {

    var deferred = Q.defer();

    db.members.findOne({ regno: _reg },function (err, user) {
        console.log(_reg);
        if (err) deferred.reject(err.name + ': ' + err.message);
       
        if (user) {
            // return user (without hashed password)
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

//function authenticate(username, password) {
//	var deferred = Q.defer();

//	db.users.findOne({ username: username }, function (err, user) {
//		if (err) deferred.reject(err.name + ': ' + err.message);

//		if (user && bcrypt.compareSync(password, user.hash)) {
//			// authentication successful
//			deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
//		} else {
//			// authentication failed
//			deferred.resolve();
//		}
//	});

//	return deferred.promise;
//}

function getCount()
{
    
    var deferred = Q.defer();

    db.members.find({ firstname: { $exists: true } }).toArray(function (err, user) {
        console.log(err);
        if (err) deferred.reject(err.name + ': ' + err.message);
       
        if (user.length) {
            // return user (without hashed password)
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function getById(_id) {
	var deferred = Q.defer();

	db.members.findById(_id, function (err, user) {
		if (err) deferred.reject(err.name + ': ' + err.message);

		if (user) {
			// return user (without hashed password)
			deferred.resolve(user);
		} else {
			// user not found
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function create(userParam) {
	var deferred = Q.defer();
	
	// validation
	//db.members.findOne(
    //    { firstname: userParam.firstname },
    //    function (err, user) {
    //    	if (err) deferred.reject(err.name + ': ' + err.message);

    //    	if (user) {
    //    		// username already exists
    //    	    deferred.reject('Member "' + userParam.name + '" is already taken');
    //    	} else {
    //    		createUser();
    //    	}
    //    });
	if (userParam._id) {
	    updateUser();
	}
	else {
	    createUser();
	}
	function createUser() {
	    // set user object to userParam without the cleartext password
	    var user = userParam;


	    db.members.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.firstname + ': ' + err.message);

                deferred.resolve();
            });
	}

	function updateUser() {
	    // set user object to userParam without the cleartext password
	    var user = userParam;
	    var id = user._id;
	    delete user._id;

	    db.members.update(
             { _id: mongo.helper.toObjectID(id) },
             { $set: user },
             function (err, doc) {
                 if (err) deferred.reject(err.name + ': ' + err.message);

                 deferred.resolve();
             });
	}

	return deferred.promise;
}

//function update(_id, userParam) {
//	var deferred = Q.defer();

//	// validation
//	db.users.findById(_id, function (err, user) {
//		if (err) deferred.reject(err.name + ': ' + err.message);

//		if (user.username !== userParam.username) {
//			// username has changed so check if the new username is already taken
//			db.users.findOne(
//                { username: userParam.username },
//                function (err, user) {
//                	if (err) deferred.reject(err.name + ': ' + err.message);

//                	if (user) {
//                		// username already exists
//                		deferred.reject('Username "' + req.body.username + '" is already taken')
//                	} else {
//                		updateUser();
//                	}
//                });
//		} else {
//			updateUser();
//		}
//	});

//	function updateUser() {
//		// fields to update
//		var set = {
//			firstName: userParam.firstName,
//			lastName: userParam.lastName,
//			username: userParam.username,
//		};

//		// update password if it was entered
//		if (userParam.password) {
//			set.hash = bcrypt.hashSync(userParam.password, 10);
//		}

//		db.users.update(
//            { _id: mongo.helper.toObjectID(_id) },
//            { $set: set },
//            function (err, doc) {
//            	if (err) deferred.reject(err.name + ': ' + err.message);

//            	deferred.resolve();
//            });
//	}

//	return deferred.promise;
//}

function _delete(_id) {
	var deferred = Q.defer();

	db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
        	if (err) deferred.reject(err.name + ': ' + err.message);

        	deferred.resolve();
        });

	return deferred.promise;
}