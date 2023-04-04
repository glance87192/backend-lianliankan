//demo.js

//导入express模块
const express = require('express')
//创建服务器
const app = express.Router()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

//定义中间件
app.get("/get_data",(req,res,next) => {
  req.name = '张三'
  next(); //向下执行
})
app.get("/get_data",(req,res) => {
  res.send(req.name);
})

app.post("/post_data",(req,res)=>{
  console.log(req.body);
  for(let i in req.body){
    console.log(i,req.body[i]);
  }
  res.send({"a":1,"b":2,"c":3})
});

module.exports = app;