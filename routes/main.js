module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });

    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);
        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });        
    });
    
    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
    });
    app.post('/bookadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
           // execute sql query
           let newrecord = [req.body.name, req.body.price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
             });
    });    

    
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);
    });     
    app.post('/registered', function (req,res) {
            const bcrypt = require('bcrypt');
            const saltRounds = 10;
            const plainPassword = req.body.password;
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { 
                // saving data in database
                let sqlquery = "INSERT INTO UserDetails (username, hashedPassword, firstname, lastname, email) VALUES (?,?,?,?,?)";
                let newrecord = [req.body.username, req.body.hashedPassword, req.body.first, req.body.last, req.body.email];
                db.query(sqlquery, newrecord, (err, result) => {
                  if (err) {
                    return console.error(err.message);
                 }
                  else
                  result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
                  result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                  res.send(result);                
                });  
            })                                                                
    }); 


    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });

    app.get('/listusers', function (req,res){
        let sqlquery = "SELECT * FROM UserDetails"; // query database to get all the user data
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableUsers:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
         });
    });

    app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20";
        db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
          let newData = Object.assign({}, shopData, {availableBooks:result});
          console.log(newData)
          res.render("bargains.ejs", newData)
        });
    });   
    
    
    

    app.get('/login', function(req,res){
        res.render('login.ejs', shopData);
    });
    app.post('/loggedin', function(req,res){
        let sqlquery = "SELECT * FROM books WHERE username LIKE '%" + req.query.username + "%'";
    });



    app.post('/Useradded', function(req,res){
        let sqlquery = "INSERT INTO UserDetails (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        let newrecord = [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.hashedPassword];
        result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
        result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err, message);
            }
            else
            res.send(result);
        })
    });

    app.get('/deleteuser', function (req, res) {
        res.render('deleteuser.ejs', shopData);     
    });
    app.post('/UserDeleted', function (req,res) {
        //searching in the database
        let query = "DELETE FROM UserDetails WHERE username LIKE '%" + req.body.keyword + "%'";
        // execute delete query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }else {
                res.redirect('./listusers'); 
            }
        });                                                                 
    }); 

}
