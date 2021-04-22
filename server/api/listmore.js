var express = require('express');
var router = express.Router();
var https = require('https');
var mysql = require('mysql');
var $sql = require('../sqlMap');
var models = require('../db');
var fs= require('fs');

var conn = mysql.createConnection(models.mysql);
conn.connect();

//中间件
var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.send('err')
  } else {
    res.send(ret)
  }
};
// hello页面列表数据
router.get('/more', (req, res) => {
  var request =  https.request({
    hostname:'m.lagou.com',
    port:'443',
    path:'/listmore.json?'+req._parsedUrl.query,
    method:'GET'
  },(resp)=>{
    let results = '';
    //监听接受数据
    resp.on('data',(dataObj)=>{
      results += dataObj;
    })
    //监听关闭
    resp.on('end',()=>{
      jsonWrite(res, results)
    })
  })
  // 发送请求
  request.end();

});

router.get('/getModelList', (req, res) => {
  console.log(req.query);
  console.log('开始执行getModelList');
  let sqlString ;
  console.log('req.query.type:' + req.query.type)
  if(req.query.type == undefined)
    sqlString = "SELECT * FROM model;";
  else sqlString = "SELECT * FROM model WHERE modelTab = '" + req.query.type +"';";
  console.log(sqlString);
  conn.query(sqlString, function(err, result)
  {
    if (err) {
      console.log('大错特错');
      console.log(err)
    }
    if (result) {
      console.log('有了');
      console.log(result);
      jsonWrite(res, result)
    } else {
      res.send('-1')
    }

  })
});

router.get('/getUserModelList', (req, res) => {
  console.log('开始执行getUserModelList');
  let userName = req.query.author;
  console.log("req.query.author:"+ req.query.author);
  let queryString2 = "SELECT * FROM model WHERE modelAuthor='" + userName+"'";
  conn.query(queryString2, function(err, result)
  {
    if (err) {
      console.log('大错特错');
      console.log(err)
    }
    if (result) {
      console.log('有了');
      console.log(result);
      jsonWrite(res, result)
    } else {
      res.send('-1')
    }

  })
});

router.get('/getCollectModelList', (req, res) => {
  console.log('开始执行getCollectModelList');
  let userName = req.query.author;
  console.log("req.query.author:"+ req.query.author);
  let queryString2 = "SELECT * FROM model WHERE modelId IN (SELECT modelId FROM collectmodel WHERE userName = '" + userName+"');";
  conn.query(queryString2, function(err, result)
  {
    if (err) {
      console.log('大错特错');
      console.log(err)
    }
    if (result) {
      console.log('有了');
      console.log(result);
      jsonWrite(res, result)
    } else {
      res.send('-1')
    }

  })
});


router.get('/UserModel', (req,res) => {
  console.log()
  console.log('开始执行UserModel')
  console.log(req);
  console.log(req.query.id);
  let queryString = "SELECT * FROM model WHERE modelId = "+req.query.id;
  console.log(queryString);
  conn.query(queryString, function (err,result) {
    if (err) {
      console.log('大错特错');
      console.log(err)
    }
    if (result) {
      console.log('有了');
      console.log(result);
      jsonWrite(res, result)
    } else {
      res.send('-1')
    }

  })

});

router.get('/getTrainList',(req,res)=>{
  let sqlStringS = "SELECT * FROM trainrequest;";
  conn.query(sqlStringS, function(err, result)
  {
    if (err) {
      console.log('大错特错');
      console.log(err)
    }
    if (result) {
      console.log('有了');
      console.log(result);
      jsonWrite(res, result)
    } else {
      res.send('-1')
    }

  })
});

router.get('/getRecord',(req,res)=>{
  let sqlString = "SELECT * FROM colorrecord where user='" + req.query.user+"'";
  conn.query(sqlString, function (err,result) {
    if(err)
      console.log(err);
    jsonWrite(res,result);

  })
});

router.get('/getTrainRecord',(req,res)=>{
  let sqlString = "SELECT * FROM trainrequest where user='" + req.query.user+"'";
  conn.query(sqlString, function (err,result) {
    if(err)
      console.log(err);
    jsonWrite(res,result);

  })
});


router.get('/getSimpleTrainSet',(req,res)=>{
  console.log('查询输出');
  console.log(req.query);
});

router.get('/getPicSrc',(req,res)=>{
  let sqlString = "SELECT rawPicture,resPicture FROM colorrecord WHERE recordId='"+req.query.recordId+"';";
  let jsonPut = {};
  conn.query(sqlString,function(err,result){
    console.log('result:');
      console.log(result);
      result = result[0];
      console.log(result.rawPicture);
    fs.readFile(result.rawPicture, 'binary', function (err1,data) {
      if(err1){
        console.log(err1)
      }
      else console.log('raw图片读取成功');
      const buffer = new Buffer(data, 'binary');
      console.log(jsonPut);
      //jsonPut.pdf = jsonPut.resPicLocal;
      jsonPut.rawPic = 'data:image/png' +';base64,' + buffer.toString('base64');
      fs.readFile(result.resPicture, 'binary', function (err2,data) {
        if(err2){
          console.log(err2)
        }
        else console.log('res图片读取成功');
        const buffer = new Buffer(data, 'binary');
        console.log(jsonPut);
        //jsonPut.pdf = jsonPut.resPicLocal;
        jsonPut.resPic = 'data:image/png' +';base64,' + buffer.toString('base64');
        console.log(jsonPut);
        res.send(jsonPut);
      });
    });
  });
});



module.exports = router;
