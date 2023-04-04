var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function (req, res) {
  console.log('received register info:', req.body);
  console.log(!req.body, !req.body.password, !req.body.username);
  if (!req.body || !req.body.password || !req.body.username) {
    console.log('缺少用户信息');
    res.status(403).json({
      error: '缺少用户信息'
    })
    return;
  }
  console.log('pass check');
  const { username, password, nickName, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name: username,
        password: password,
        nickName: (!!nickName) ? nickName : '高傲的最强王者',// 此处可放生成随机名字的函数
        email: email ?? ''
      }
    })
    console.log('newUser:', newUser);
    res.status(200).json({
      msg: 'success',
      ...newUser
    })
  } catch (error) {
    res.status(200).json({
      msg: 'failed',
      error
    })
  }

})

router.post('/login', async function (req, res) {
  console.log('req.body:', req.body);
  const { username, password } = req.body;
  try {
    queried_user = await prisma.user.findUniqueOrThrow({
      where: {
        name: username
      }
    })
    console.log(queried_user, typeof queried_user);
    if (queried_user.password === password) {
      res.status(200).json({
        msg: 'success',
      })
    } else {
      res.status(200).json({
        msg: 'wrong password'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      msg: 'not exist',
      error
    })
  }
})

router.get('/getusers', async function (req, res) {
  console.log(req.query, 'query===');
  const { page = 1, pageSize = 10 } = req.query;
  queried_data = await prisma.user.findMany({
  });
  res.json({
    data: queried_data.slice((page - 1) * pageSize, page * pageSize),
    count: queried_data.length
  })
})

router.post('/modifyuser', async function (req, res) {
  const body = req.body;
  let modifyParam = { ...body };
  delete modifyParam.id;
  delete modifyParam.name;
  const updatedData = await prisma.user.update({
    where: {
      id: body.id
    },
    data: {
      ...modifyParam
    }
  });
  res.json(updatedData);
})

module.exports = router;
