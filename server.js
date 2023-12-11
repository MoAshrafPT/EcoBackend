const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'EcoDB'
})

app.get('/', (req,res)=>{
 return res.json("from backend");
})

app.get('/members', (req,res)=>{
    const sql = "SELECT * FROM Members";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/teams', (req,res)=>{
    const sql = "SELECT * FROM Teams";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/tasks', (req,res)=>{
    const sql= "";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/login', (req,res)=>{
    console.log(req.body);
    const email = req.body['email'];
    const password = req.body['password'];
    
    
    const sql = `SELECT PasswordM FROM Members WHERE Email = "${email}"`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
          
            console.log(data[0].PasswordM);
            if(password === data[0].PasswordM)
            {
                console.log('User successfully logged in');
                return res.json(true);
            }
            else{
                console.log("Password does not match");
                return res.json(false);
            }
            
        }
        
    })
})

app.listen(8081, ()=>{
    console.log("listening");
})