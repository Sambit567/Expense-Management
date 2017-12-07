var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF items
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'Items List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'Items List', 
				data: result
			})
		}
	})
})

// SHOW ADD item FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New item',
		name: '',
		amount: '',
		description: ''		
	})
})

// ADD NEW item POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Item Name is required').notEmpty()           //Validate item name
	req.assert('amount', 'amount is required').notEmpty()             //Validate amount
	req.assert('description', 'Description is required').notEmpty()       //validate description      
	

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			amount: req.sanitize('amount').escape().trim(),
			description: req.sanitize('description').escape().trim()
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('user/add', {
					title: 'Add New items',
					name: user.name,
					amount: user.amount,
					description: user.description					
				})
			} else {				
				req.flash('success', 'Data added successfully!')
				
				// redirect to item list page				
				res.redirect('/users')
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New item',
					name: '',
					amount: '',
					description: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New item',
            name: req.body.name,
            amount: req.body.amount,
            description: req.body.description
        })
    }
})

// SHOW EDIT items FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'Items not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('user/edit', {
				title: 'Edit  items', 
				//data: rows[0],
				id: result[0]._id,
				name: result[0].name,
				amount: result[0].amount,
				description: result[0].description					
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('amount', 'Amount is required').notEmpty()             //Validate amount
    req.assert('description', 'A valid description is required').notEmpty()  //Validate description

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			amount: req.sanitize('amount').escape().trim(),
			description: req.sanitize('description').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('user/edit', {
					title: 'Edit item',
					id: req.params.id,
					name: req.body.name,
					amount: req.body.amount,
					description: req.body.description
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
				
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit item',            
			id: req.params.id, 
			name: req.body.name,
			amount: req.body.amount,
			description: req.body.description
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to item list page
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			// redirect to item list page
			res.redirect('/users')
		}
	})	
})

module.exports = app
