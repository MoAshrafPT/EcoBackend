const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser")
const util = require('util');
const { log } = require("console");
const path = require("path");




const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'ecopopulated'
})

app.get('/', (req,res)=>{
 return res.json("from backend");
})

app.get('/members/:name', (req,res)=>{
    let sql = "SELECT members.Mid,nameM, Admin_Ssn, Position,Team_Name,Major from members,member_of,teams where member_of.Mid = members.Mid AND Tid = Team_ID";
    if(req.params.name !== 'All'){
        const sqlExtension = ` AND Team_Name = '${req.params.name}'`;
        sql +=sqlExtension; 
    }
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
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
app.get('/cars', (req,res)=>{
    const sql = "SELECT * FROM cars";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/tools',(req,res)=>{
    const sql = "SELECT * FROM Tools";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/sponsors', (req,res)=>{
    const sql = "SELECT * FROM sponsors";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/incidents', (req,res)=>{
    const sql = "SELECT * FROM race_incidents";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/alumni', (req,res)=>{
    const sql = "SELECT * FROM aumini";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/projects', (req,res)=>{
    const sql = "SELECT * FROM projects";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/races', (req,res)=>{
    const sql = "SELECT * FROM races";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/admins' , (req,res)=>{
    const sql = "SELECT * FROM administrators";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/funds',(req,res)=>{
    const sql = `SELECT * FROM funds WHERE nameF = ${req.body.name}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/myrequests/:id',(req,res)=>{
    const sql = `SELECT * FROM tool_requests WHERE memberID = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/allrequests',(req,res)=>{
    const sql = `SELECT * FROM tool_requests`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/projects/:id', (req,res)=>{
    const id = req.params.id;
    const sql = `SELECT Pid , PName,projects.Mid,admin_id From tasks,projects,members where tasks.member_id = members.Mid AND tasks.Project_id = projects.Pid AND members.Mid = ${id};`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/taskadmin/:id',(req,res)=>{
    const id =req.params.id;
    const sql=`SELECT Task_Number, DescriptionT, Project_id, start_dateT, End_date,member_id,members.nameM,members.Position,members.Major FROM tasks,members WHERE members.Mid=member_id and admin_id=${id}`;
     db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})



app.post('/feedback',(req,res)=>{
    //TODO: user gives feedback on a particular member
})
app.post('/requesttools',(req,res)=>{
    
    const toolName = req.body.tool;
    const quantity = req.body.quantity;
    const ddl = req.body.deadline;
    const id = req.body.memberID;

    const sql = `INSERT INTO tool_requests (memberID, quantity, deadline, toolname) VALUES (${id},${quantity},'${ddl}','${toolName}')`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })

})
app.post('/discipline',(req,res)=>{         // TODO: disciplinary action against users
    const adminID = req.body.admin;
    const memberID = req.body.member;
    const reason = req.body.reason;
    const action = req.body.action;
    const severity = req.body.severity;
    console.log(req.body);

    const sql = `INSERT INTO disciplinary_action (Admin_id, Member_id, Reason, Action, severity, reportDate) VALUES (${adminID}, ${memberID}, '${reason} ', '${action}', ${severity}, current_timestamp());`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.get('/discipmember/:name', (req,res)=>{
    let sql = "SELECT members.Mid,nameM from members,member_of,teams where member_of.Mid = members.Mid AND Tid = Team_ID";
        const sqlExtension = ` AND Team_Name = '${req.params.name}'`;
        sql +=sqlExtension; 
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data);
    })
})

app.get('/adminteams/:id', (req,res)=>{
    const sql = `SELECT Team_Name, Team_ID FROM teams,members WHERE TA_ID = Mid AND Mid= ${req.params.id};`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/taskcount/:id',(req,res)=>{
    const sql = `SELECT COUNT(*) FROM tasks where member_id = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['COUNT(*)']);
    })
})

app.get('/severitysum/:id',(req,res)=>{
    const sql = `SELECT SUM(severity) FROM disciplinary_action where member_id = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['SUM(severity)']);
    })
})
app.get('/projectcount/:id',(req,res)=>{
    const sql = `SELECT COUNT(*) FROM projects where Mid = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['COUNT(*)']);
    })
})

app.get('/totalmembers/:id',(req,res)=>{
    const sql = `SELECT COUNT(*) FROM members where Admin_ssn = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['COUNT(*)']);
    })
})

app.get('/totalseveritiesissued/:id',(req,res)=>{
    const sql = `SELECT COUNT(*) FROM disciplinary_action where Admin_id = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['COUNT(*)']);
    })
})


app.post('/login', (req,res)=>{
    console.log(req.body);
    const email = req.body['email'];
    const password = req.body['password'];
    
    
    const sql = `SELECT PasswordM , nameM, Mid, Position FROM Members WHERE Email = "${email}"`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
          
            
            if(password === data[0].PasswordM)
            {
                console.log('User successfully logged in');
                console.log(data[0].nameM);
                return res.json({data:true, row:data[0].nameM,id:data[0].Mid,role:data[0].Position});
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

    const sql = `INSERT INTO members (nameM,Position,Major,Email,PasswordM,gradyear) VALUES ('${name}','${position}','${major}','${email}','${password}','${gradYear}')`;

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

app.post('/addrace',(req,res)=>{
    const date = req.body.date;
    const member = req.body.member;
    const car = req.body.car;
    const dist = req.body.distance
    const location = req.body.location;
    const sql = `INSERT INTO races VALUES ('${date}',${dist},${car},'${location}',${member})`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})
app.patch('/changeemail/:id', (req,res)=>{
    const sql = `UPDATE members SET Email = '${req.body.email}' WHERE Mid =${req.params.id} `
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})

app.patch('/changepassword/:id', (req,res)=>{
    const sql = `UPDATE members SET PasswordM = '${req.body.password}' WHERE Mid =${req.params.id} `
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})

app.patch('/changemajor/:id', (req,res)=>{
    const sql = `UPDATE members SET Major = '${req.body.major}' WHERE Mid =${req.params.id} `
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})

app.delete('/deleterequest', (req,res)=>{
    console.log(req.query);
    const sql = `DELETE FROM tool_requests WHERE memberID = ${req.query.id} AND toolname = '${req.query.name}'`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
  
})
app.post('/updates',(req,res)=>{
    
    const memberID = req.body.memberID;
    const adminID = req.body.adminID;
    const update = req.body.update
    const sql = `INSERT INTO progressupdates (member_id, admin_id, theUpdate, updateDate) VALUES (${memberID}, ${adminID}, '${update}', current_timestamp());`;
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