const express = require('express');
const app = express();
const {pool} = require("./dbconfig");
const bcrypt = require('bcrypt');
const cors = require('cors')


const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs');
// app.use(cors)

app.get('/', (req, res) =>{
    res.render("index")
})

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
                
                }
            }
        )
    }
})

app.get('/users/login', (req,res) => {
    res.render("login")
})

app.post('/users/login', async (req,res) => {
    let {name, password } = req.body;

    console.log({
        name,
        password
    })

    let errors = [];

    res.render('dashboard')
})
app.get('/users/dashboard', (req,res) => {
    res.render("dashboard", {user: 'nima'})
})
app.post('/users/registerplot/', (req,res)=>{
    // res.render('dashboard')
    res.redirect('/users/dashboard')
})


app.get('/users/registerplot/:id', (req, res) => {
    let { d_status, coverage, setbacks,onsiteparking} = req.body;
    const {id} = req.params;
    console.log({
        id,
        d_status,
        coverage,
        setbacks,
        onsiteparking
    })
    res.render('registerplot',{plot:id});
})


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})