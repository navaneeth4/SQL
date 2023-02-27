const express = require("express")
const sql= require('mssql')
const hbs = require('hbs')
const app=express()
const methodOverride = require('method-override')


const dbconfig=require('./db/db')
app.use(methodOverride('_method'))
app.set('view engine','hbs')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index2')
  })

app.post("/ind",(req,res)=>{
    res.render('index')
})


// app.post("/register", (req, res) => {
//   const { username, password , Name} = req.body 

//   sql.connect(dbconfig, (err) => {
//     if (err) console.log(err) 

//     const request = new sql.Request() 

//     request.query(
//       `INSERT INTO users (username, password,Name) VALUES ('${username}', '${password}','${Name}')`,
//       (err, result) => {
//         if (err) console.log(err) 

//         console.log(`User '${username}' registered successfully`) 
//         res.render('index2', { success: "Done..Now log in." }) 

//       }
//     ) 
//   }) 
// }) 

app.post("/register", (req, res) => {
  const { username, password, confirmPassword, Name } = req.body 

  if (password !== confirmPassword) {
    return res.render('index2', { error: "Passwords do not match" }) 
  }

  if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return res.render('index2', { error: "Password must be at least 8 characters long and contain at least one letter and one number" }) 
  }

  sql.connect(dbconfig, (err) => {
    if (err) console.log(err) 

    const request = new sql.Request() 

    request.query(`insert into users (username, password, name) values ('${username}', '${password}', '${Name}')`,(err, result) => {
        if (err) console.log(err) 

        console.log(`User '${username}' registered successfully`) 
        res.render('index2', { success: "Successfully Registered! Now Login." }) 
      }
    ) 
  }) 
}) 


app.post("/login", (req, res) => {
  const { username, password } = req.body 

  sql.connect(dbconfig, (err) => {
    if (err) console.log(err) 

    const request = new sql.Request() 

    request.query(`select * from users where username = '${username}' and password = '${password}'`,(err, result) => {

        if (err) console.log(err) 

        if (result.recordset.length > 0) {
          console.log(`User '${username}' logged in successfully`) 
          res.render('1')
        } else {
          console.log(`Incorrect username or password`) 
         res.render('index2', { error:"Invalid Username or Password" }) 
        }
      }
    ) 
  }) 
}) 



app.post('/submit', (req, res) => {

  const {id, name, email, message } = req.body 

  sql.connect(dbconfig, (err) => {
    if (err) throw err 

    const request = new sql.Request() 

    request.query(`insert into test (id,name, email, message) VALUES ('${id}','${name}', '${email}', '${message}')`, (err, result) => {
      if (err) throw err 

      console.log('Inserted successfully') 
      res.render('index') 
    }) 
  }) 
}) 

app.get('/sub',(req,res)=>{

  sql.connect(dbconfig, (err) => {
    if (err) throw err 

    const request = new sql.Request() 

    request.query(`select * from test`, (err, result) => {
      if (err) throw err 

      res.render('result', { data: result.recordset }) 
    }) 
  })
})

app.get('/res', (req, res) => {

  sql.connect(dbconfig, (err) => {
    if (err) throw err 

    const request = new sql.Request() 

    request.query(`select * from test`, (err, result) => {
      if (err) throw err 

      res.render('result', { data: result.recordset }) 
    }) 
  })
})


app.delete('/res/:id', (req, res) => {
  const id=req.params.id
  sql.connect(dbconfig, (err) => {
    if (err) throw err

    const request = new sql.Request()

    request.query(`delete from test where id=${id}`, (err, result) => {
      if (err) throw err

      console.log('Deleted')
      res.redirect('/res')
    })
  })
})

app.get('/res/:id/edit', (req, res) => {
  
  const id = req.params.id

  sql.connect(dbconfig, (err) => {
    if (err) throw err

    const request = new sql.Request()

    request.query(`select * from test where id=${id}`, (err, result) => {
      if (err) throw err

      res.render('edit', { data: result.recordset[0] })

    })
  })
})

app.put('/res/:id', (req, res) => {
  const id = req.params.id
  const { name, email, message } = req.body

  sql.connect(dbconfig, (err) => {
    if (err) throw err

    const request = new sql.Request()

    request.query(`update test set name='${name}', email='${email}', message='${message}' where id=${id}`, (err, result) => {
      if (err) throw err

      console.log('Updated')
      res.redirect('/res')
    })
  })
})

app.listen(8000, () => {
    console.log('Server up')
})