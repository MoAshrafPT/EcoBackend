const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser")
const util = require('util');




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
    const sql = "CALL SelectAllMembers";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})
app.get('/teams', (req,res)=>{
    const sql = "SELECT * FROM Teams";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.post('/login', (req,res)=>{
    console.log(req.body);
    const email = req.body['email'];
    const password = req.body['password'];
    
    
    const sql = `SELECT PasswordM , nameM, Mid FROM Members WHERE Email = "${email}"`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
          
            
            if(password === data[0].PasswordM)
            {
                console.log('User successfully logged in');
                console.log(data[0].nameM);
                return res.json({data:true, row:data[0].nameM,id:data[0].Mid});
            }
            else{
                console.log("Password does not match");
                return res.json(false);
            }
            
        }
        
    })
})

app.post('/signup',async (req,res)=>{
    console.log(req.body);
    const email = req.body['email'];
    const password = req.body['password'];
    const name = req.body['name'];
    const major = req.body['major'];
    const gradYear = req.body['gradYear'];
    const position = 'member';
    const dbQueryAsync = util.promisify(db.query).bind(db);


    inUse = false;
    const emailCheck = `SELECT * FROM members WHERE Email ="${email}" `;

   try {
    const data = await dbQueryAsync(emailCheck);
    console.log('executing first query');

    if (data.length > 0) {
        console.log("email already in use");
        inUse = true;
        console.log(inUse, data);
        return res.json(false);
    }

    const sql = `INSERT INTO members (nameM,Admin_ssn,Position,Major,Email,PasswordM,gradyear) VALUES ('${name}',1,'${position}','${major}','${email}','${password}','${gradYear}')`;

    if (!inUse) {
        const insertData = await dbQueryAsync(sql);
        console.log("1 row inserted into 'members'");
        return res.json(true);
    }
} catch (err) {
    return res.json(err);
}
})

app.post('/tasks', (req,res)=>{
    const id = req.body.memberID;
    const sql = `SELECT * FROM tasks WHERE member_id = ${id}`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})


app.listen(8081, ()=>{
    console.log("listening");
})