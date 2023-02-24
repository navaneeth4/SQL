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
    res.render('1')
  })

app.post("/ind",(req,res)=>{
    res.render('index')
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

    request.query(`DELETE FROM test WHERE id=${id}`, (err, result) => {
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

    request.query(`SELECT * FROM test WHERE id=${id}`, (err, result) => {
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

    request.query(`UPDATE test SET name='${name}', email='${email}', message='${message}' WHERE id=${id}`, (err, result) => {
      if (err) throw err

      console.log('Updated')
      res.redirect('/res')
    })
  })
})

app.listen(8000, () => {
    console.log('Server up')
})