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
app.get('/allmembers',(req,res)=>{
    const sql = "Call SelectAllMembers";
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data[0]);
    })
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
    const sql = "Call SelectAllTeams";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})
app.get('/cars', (req,res)=>{
    const sql = "Call SelectAllCars";
    db.query(sql, (err,data)=>{
        console.log(data[0]);
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})
app.get('/tools',(req,res)=>{
    const sql = "Call SelectAllTools";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data[0]);
    })
})
app.get('/sponsors', (req,res)=>{
    const sql = "Call SelectAllSponsors";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})
app.get('/incidents', (req,res)=>{
    const sql = "Call SelectAllIncidents";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})

app.get('/alumni', (req,res)=>{
    const sql = "Call SelectAllAlumni";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})

app.get('/projects', (req,res)=>{
    const sql = "Call SelectAllProjects";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]);
    })
})

app.get('/races', (req,res)=>{
    const sql = "Call SelectAllRaces()";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data[0]);
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

app.get('/changeposition/:id',(req,res)=>{
    const id =req.params.id;
    const sql=`SELECT nameM,Mid from members WHERE Admin_ssn=${id}`
     db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/awards',(req,res)=>{
    const sql="SELECT * FROM awards";
    db.query(sql, (err,data)=>{
            if(err) return res.json(err);
            return res.json(data);
     })
    })

app.patch('/change',(req,res)=>{
    const sql = `UPDATE members set Position='admin',Admin_ssn=NULL where nameM='${req.query.name}' and Admin_ssn=${req.query.id}`
    console.log(sql);
    console.log(req.query);
    db.query(sql, (err,data)=>{
        if(err) 
        return res.json(err);
        else{
            console.log(data.Mid);
            console.log(data);
            return res.json(data);
   }
})
})

app.post('/feedback',(req,res)=>{
    const sql=`INSERT INTO feedback (Feedback_Content,T_ID) VALUES (${req.query.name},${req.query.id})`
   
   console.log(req.query.id);
   db.query(sql, (err,data)=>{
           if(err) return res.json(err);
           return res.json(data);
    })
   })

app.get('/feedbackadmin/:id',(req,res)=>{
    console.log(req.params.id);
    const sql=`SELECT Feedback_Content,FeedBack_Date from feedback,teams where teams.Team_ID=T_ID and teams.TA_ID=${req.params.id}`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
    })

app.get('/feedbackmember/:id',(req,res)=>{
        const sql=`SELECT Feedback_Content,FeedBack_Date from feedback,teams,member_of where teams.Team_ID=T_ID and member_of.Tid=teams.TA_ID and member_of.Mid=${req.params.id}`
        db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
    })    

app.get('/citations/:id',(req,res)=>{
    const sql =`SELECT * FROM disciplinary_action WHERE Member_id = ${req.params.id}`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data);
    })
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

app.get('/teamless',(req,res)=>{
    const sql = "call SelectTeamless";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        console.log(data);
        return res.json(data[0]);
    })
})



app.get('/adminteams/:id', (req,res)=>{
    const sql = `SELECT Team_Name, Team_ID FROM teams,members WHERE TA_ID = Mid AND Mid= ${req.params.id};`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/memberadmin/:id', (req,res)=>{
    const sql = `SELECT Admin_ssn FROM members WHERE Mid= ${req.params.id};`;
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data[0]['Admin_ssn']);
    })
})

app.get('/getupdate/:id', (req,res)=>{
    const sql = `SELECT theUpdate, member_id FROM progressupdates WHERE admin_id = ${req.params.id};`;
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

app.get('/adminmembers/:id', (req,res)=>{
    const sql = `SELECT nameM, Mid from members WHERE Admin_ssn = ${req.params.id}`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/carparts',(req,res)=>{
    const sql = "SELECT * FROM car_parts";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
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
            if(data.length ===0)
                return res.json(false)
            
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
app.post('/addtask', (req,res)=>{
    const descp = req.body.descp;
    console.log(descp);
    const mid = req.body.mid;
    const aid = req.body.aid;
    const pid = req.body.pid;
    const sdate = req.body.sdate;
    const edate = req.body.edate;

    const sql = `INSERT INTO tasks (DescriptionT,member_id,admin_id,Project_id,start_dateT,End_date) VALUES ('${descp}',${mid},${aid},${pid},'${sdate}','${edate}')`

    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
})

app.post('/assignmember',async(req,res)=>{
    const member = req.body.member;
    const team = req.body.team;
    const admin = req.body.admin;
    const memberUpdate = `UPDATE members SET Admin_ssn = ${admin} WHERE Mid = ${member}`;
    const teamInsert = `INSERT INTO member_of (Mid,Tid) VALUES (${member},${team})`
    const dbQueryAsync = util.promisify(db.query).bind(db);
   try{
    await dbQueryAsync(memberUpdate);
    await dbQueryAsync(teamInsert);
   }
   catch(err){
    console.log(err);
   }
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

app.delete('/deletetask/:id', (req,res)=>{
    console.log(req.query);
    const sql = `DELETE from tasks WHERE Task_Number = ${req.params.id}`
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        else{
            console.log(data);
            return res.json(data);
        }

    })
  
})


app.post('/updates',(req,res)=>{         
    const adminID = req.body.admin;
    const memberID = req.body.member;
    const update = req.body.update;
    console.log(req.body);

    const sql = `INSERT INTO progressupdates (member_id, admin_id, theUpdate, updateDate) VALUES (${memberID}, ${adminID}, '${update}', current_timestamp());`;
     
    db.query(sql, (err,data)=>{
         
        if(err) return res.json(err);
        return res.json(data)
        
    })
})



app.listen(8081, ()=>{
    console.log("listening");
})