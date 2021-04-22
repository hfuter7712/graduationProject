var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var fs = require('fs');

const exec = require('child_process').exec
const execSync = require('child_process').execSync;


// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

//中间件
var jsonWrite = function(res, ret) {
	if(typeof ret === 'undefined') {
		res.send('err')
	} else {
		res.json(ret);
		// res.send('ok')
	}
};
// 增加用户接口
router.post('/addUser', (req, res) => {
	var sql_name = $sql.user.select_name
	var sql = $sql.user.add;
	var params = req.body;
	console.log(params);
	conn.query(sql_name,params.username,function(err,result) {
		if(err) {
			console.log(err)
		}
		if(result[0]===undefined) {
			conn.query(sql,[params.username,params.password], function(err, result) {
				if(err) {
					console.log(err)
				}
				if(result) {
					jsonWrite(res, result);
					let path = 'user/'+params.username;

          let child1 = path+'/picture';
          let child2 = path+'/model';
          let child3 = path+'/train';
          let child4 = path+'/during'
					fs.mkdir(path, function (err) {
					  if(err)
					    console.log(err);
					  else {
					    console.log('创建用户根目录成功');
              fs.mkdir(child1, function (err) {
                if(err)
                  console.log(err);
                else {
                  console.log('创建子目录1成功');
                }
              });
              fs.mkdir(child2, function (err) {
                if(err)
                  console.log(err);
                else console.log('创建子目录2成功');
              });
              fs.mkdir(child3, function (err) {
                if(err)
                  console.log(err);
                else console.log('创建子目录3成功');
              });
              fs.mkdir(child4, function (err) {
                if(err)
                  console.log(err);
                else console.log('创建子目录4成功');
              });
            }
          })





				}
			})
		}else {
			res.send('-1')
		}
	})

});

//查找用户接口
router.post('/selectUser', (req,res) => {
	var sql_name = $sql.user.select_name;
	var sql_password = $sql.user.select_password;
	var params = req.body;
	conn.query(sql_name,params.username,function(err, result) {
		if(err) {
			console.log(err)
		}
		if(result[0]===undefined) {
			res.send('-1')
		}else {
			conn.query(sql_password,params.password, function(err, result) {
				if(err) {
					console.log(err)
				}
				if(result[0]===undefined) {
					res.send('0')
				}else {
				  // Set-Cookie
          // 如果是https环境必须添加 { secure: true }
				  res.cookie('isAuth', 1, {maxAge: 7 * 24 * 60 * 1000, secure: true, signed: true});
					jsonWrite(res, result);
				}
			})
		}
	})
});

//修改密码 目前未提供页面，可以用接口测试工具测试
router.put('/updateUser', (req,res) => {
  var sql_update = $sql.user.update_password;
  var params = req.body;
  if(req.cookies.isAuth){
    conn.query(sql_update,[params.password,params.id], function(err, result) {
      if(err) {
        console.log(err)
      }
      if(result[0]===undefined) {
        res.send('0')
      }else {
        jsonWrite(res, result);
      }
    })
  }else {
    res.send('no auth')
  }
});

router.post('/upload',(req,res)=>{
  console.log(req);
  console.log('req.data:');

  //console.log(typeof(req.body.picData));
  //console.log((new Buffer(req.body.picData, 'base64').toString()))
  var decode = Buffer(req.body.picData, 'base64').toString()
  let userName = req.body.user;
 // console.log(req.body);
  var dir = 'user/'+userName+'/picture/';
  var fileName =req.body.pictureName;
  var path = dir + fileName;//从app.js级开始找--在我的项目工程里是这样的
  if(req.body.picData)
    res.send({dir:dir, fileName: fileName});
  else res.send('empty!');
  var myFormData =  decode



  var base64 = decode;
  console.log(base64);
  var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
  console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
  fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
    if(err){
      console.log(err);
    }else{
      console.log('写入成功！');
      var queryTest = $sql.user.addPic;
      var Id = userName+ Date.now()
      conn.query(queryTest, [Id, userName, 'test', path],function (err,res) {
        if(err)
          console.log(err);
        else
          console.log('导入完成');

      })

    }
  })

});

router.post('/color',(req,result)=> {
  console.log(req);
  console.log('req.data:');
  console.log(req.body);
  let queryString = 'SELECT modelLocation,modelAuthor,fileName FROM model WHERE modelId = ' + req.body.modelId;
  conn.query(queryString, function (err,res) {
    if(err)
      console.log(err);
    else
    {
      console.log(res);
      console.log(res[0].modelLocation);
      let dir = 'user/' + req.body.user + '/picture/';
      let modellocal = res[0].modelLocation;
      console.log(modellocal);
      let resPic = "res_"+Date.now()+".png";
      console.log(resPic);
      let resSave = 'user/'+req.body.user+'/picture/'+ resPic;
      let testPython = 'user/python/test.py'
      console.log(dir + " " + resPic + " " + resSave + " "+ testPython);
      let execCode = 'python '+testPython + ' --picdir '+dir+' --picName '+req.body.pictureName+' --modellocal '+res[0].modelLocation +' --targetlocal '+resSave+' --wg '+req.body.whetherGrey;
      console.log(execCode);
      exec(execCode, function (error,stdout, stderr) {
        if(error){
          console.log('stderr:'+stderr);
        }
        console.log('stdout:'+stdout);
        console.log(typeof(stdout))
        let jsonPut =JSON.parse(stdout);
        let testasd = "{resPicLocal:\"user/tql/picture/res_1617370303032.png\", total:0, height:50, width:60, resDir:\""+resSave+ "\"}";

        fs.readFile(jsonPut.resPicLocal, 'binary', function (err,data) {
          if(err){
            console.log(err)
          }
          else console.log('读取成功');
          const buffer = new Buffer(data, 'binary');
          console.log(jsonPut);
          jsonPut.pdf = jsonPut.resPicLocal;
          jsonPut.resPicLocal = 'data:image/png' +';base64,' + buffer.toString('base64');
          console.log(jsonPut);
          result.send(jsonPut);
        });
      });



    }

  })


});

router.post('/recordUp',(req,result)=> {
  console.log(req.body);
  var queryTest = $sql.user.addRecord;
  conn.query(queryTest, [req.body.targetImg, req.body.resImg,req.body.date, req.body.timeCost,req.body.recordId, req.body.user, req.body.model],function (err,res) {
    if(err)
      console.log(err);
    else
      console.log('导入完成');

  });

});

router.post('/trainSup',(req,res)=>{


  //console.log(typeof(req.body.picData));
  //console.log((new Buffer(req.body.picData, 'base64').toString()))
  var decode = Buffer(req.body.picData, 'base64').toString();
  let userName = req.body.user;
  // console.log(req.body);
  var dir = 'user/'+userName+'/picture/';
  var fileName =req.body.pictureName;
  var path = dir + fileName;//从app.js级开始找--在我的项目工程里是这样的
  if(req.body.picData)
    res.send({dir:dir, fileName: fileName});
  else res.send('empty!');
  var myFormData =  decode



  var base64 = decode;
  //console.log(base64);
  var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
  //console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
  fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
    if(err){
      console.log(err);
    }else{
      console.log('写入成功！');
      var queryTest = $sql.user.addTrainPic;
      var Id = userName+ Date.now()
      conn.query(queryTest, [Id, userName, 'train', path,req.body.trainId],function (err,res) {
        if(err)
          console.log(err);
        else
          console.log('导入完成');

      })

    }
  })

});

router.post('/trainReq',(req,res)=>{
  var queryTest = $sql.user.addTrainReq;

  console.log(req);
  conn.query(queryTest,[req.body.trainId, req.body.user, req.body.modelName, req.body.cutSize, req.body.batchSize, req.body.epoch, req.body.trainSetSize,"waiting",req.body.date],function (err,res){
    if(err)
      console.log(err);
    console.log('');
  });
  res.send('done');

});

router.get('/statusChange',(req,res)=>{
  console.log('你大爷输出');
  console.log(req.query);
  let queryString = 'UPDATE trainrequest SET status= "' +req.query.status +'" WHERE trainId="'+req.query.trainId+'"';
  conn.query(queryString,function (err,res) {
if(err)
   console.log(err);

  });
  res.send('done');
});
router.get('/userDetail',(req,res)=>{
 console.log(req.query);
 let querything = 'SELECT * FROM user WHERE username = "'+req.query.id+'";';
  conn.query(querything,function (err,result) {
    if(err)
      console.log(err);
    jsonWrite(res, result);
  });

});

router.post('/infomod',(req,res)=>{


  let varstring2 = "UPDATE user SET "+ "email='"+req.body.email+"', age="+req.body.age+','+"Gender='"+req.body.gender+"',"+"nativePlace='"+req.body.naplace+"',brief='"+req.body.brief+"' WHERE username ='"+req.body.username +"';";

      conn.query(varstring2, function (err2,result2) {
        if(err2)
          console.log(err2);
        res.send('cg!');
      })


  console.log('第二查询：'+varstring2);

});

module.exports = router;
