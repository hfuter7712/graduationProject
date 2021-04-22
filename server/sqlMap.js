// sql语句
var sqlMap = {
  // 自动创建数据表
  base: {
    create: 'create database vue_node_mysql_learning'
  },
	// 用户
	user: {
		add: 'insert into user( username , password) values ( ?, ?)',
		select_name: 'SELECT * from user where username = ?',
		select_password : 'SELECT * from user where password = ?',
    update_password : 'update user set password = ? where id = ?',
    addPic: 'insert into userpic(pictureId, user, pictureType, pictureLocal) values(?, ?, ?, ?)',
    addTrainPic: 'insert into userpic(pictureId, user, pictureType, pictureLocal,trainId) values(?, ?, ?, ?,?)',
    addRecord: 'insert into colorrecord(rawPicture, resPicture, time, cost, recordId, user, model) values(?,?,?,?,?,?,?)',
    addTrainReq:'insert into trainrequest(trainId, user, name, cutSize, batchSize, Epoch, trainSetSize, status, reqDate) values(?,?,?,?,?,?,?,?,?)',
    //脚步创建数据库表
    create_user:`CREATE TABLE user(
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(100) NOT NULL,
                password VARCHAR(40) NOT NULL,
                PRIMARY KEY ( id )
                )ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
	}
};
module.exports = sqlMap;
