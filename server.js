const express = require('express');
const app = express();
const {pool} = require("./dbconfig");
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");

const initializePassport = require("./passsportConfig");
initializePassport(passport);

const PORT = process.env.PORT || 3000;

//middle ware section
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





// routes


// app.get('/', (req, res) =>{
//     res.render("index")
// })

app.get('/users/register', (req,res) => {
    res.render("register")
})

app.post('/users/register', async (req, res)=> {
    let {name,email, password, password2} = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if (!name || !email || !password || !password2){
        errors.push({ message: "Please enter all fields" })
    }

    if(password.length < 6) {
        errors.push({message: "Password should be atleast 6 Characters"})
    }

    if (password != password2){
        errors.push({message: "Passwords do not match"})
    }

    if(errors.length > 0){
        res.render('register', { errors  })
    }else{
        //form validation has passed
        let hashedPassword = await bcrypt.hash(password, 4);
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM users 
            WHERE email = $1`, [email], (err,results) => {
                if(err){
                    throw err
                }
                if(results.rows.length > 0){
                    errors.push({message: 'Email Already Registered'})
                  console.log('Email Already Registered')
                    res.render('register', {errors})
                
                }else{
                    pool.query(
                     `INSERT INTO users (name,email,password)
                     VALUES($1,$2,$3)
                     RETURNING id,password`,[name, email, hashedPassword], (err,results)=>{
                         if (err){
                             throw err
                         }
                         console.log(results.rows);
                         req.flash('success_msg', 'You are now registered. Please log in');
                         res.redirect('/users/login')
                     }
                    )
                }
            }
        )
    }
})

app.get(['','/users/login'], (req,res) => {
    res.render("login")
})

app.get('/users/selectzone', (req,res) => {
    res.render("selectzone")
})

app.post('/users/login', passport.authenticate('local', {
    successRedirect: "/users/selectzone",
    failureRedirect:"/users/login/",
    failureFlash: true
    
}) )


app.get('/users/dashboard', (req,res) => {
    res.render("dashboard")
})
app.post('/users/registerplot/:plot_id', (req,res)=>{
    // res.render('dashboard')
    let { d_status, coverage, setbacks,onsiteparking} = req.body;
    const { plot_id } = req.params;
    console.log({plot_id,d_status,coverage,setbacks, onsiteparking})

    pool.query(
        `INSERT INTO plotdetails (plot_id,d_status,coverage,setbacks,parking)
        VALUES($1,$2,$3,$4,$5)
          `,[plot_id, d_status, coverage, setbacks, onsiteparking], (err,results)=>{
            if (err){
                throw err
            }
            console.log(results.rows);
            req.flash('success_msg', 'Plot Details Updated.');
            res.redirect('/users/dashboard/')
        }
       )


    res.redirect('/users/dashboard')
})


app.get('/users/registerplot/:id', (req, res) => {
    const {id} = req.params;
    res.render('registerplot',{plot:id});
})


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})