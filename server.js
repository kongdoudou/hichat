var http=require("http");
var express=require("express");
var app=express();

var server=http.createServer(app);
var io=require("socket.io").listen(server);
var users=[];
app.use('/__engine/1/ping',express.static(__dirname+'/www'));
server.listen(3000);
console.log("server started");

io.on('connection',function(socket){
    socket.on('login',function(nickname){
        if(users.indexOf(nickname)>-1){
            socket.emit("nickExisted");
        }
        else{
            socket.suerIndex=users.length;
            socket.nickname=nickname;
            users.push(nickname);
            socket.emit("loginSuccess");
            io.sockets.emit("system",nickname,users.length,'login');
        }
    });
    //断开连接的事件
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    socket.on('postMsg', function(msg) {
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg);
    });
    //接收用户发来的图片
     socket.on('img', function(imgData) {
        //通过一个newImg事件分发到除自己外的每个用户
         socket.broadcast.emit('newImg', socket.nickname, imgData);
     });
});
