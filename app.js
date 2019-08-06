var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    // Chargement de socket.io
    io = require('socket.io').listen(server)
    favicon = require('serve-favicon'); 

/* routes & attr*/
const HOME = '/todo/home';

//static public folder
app.use(express.static(__dirname + '/public/')) 
.get(HOME,function(req,res){
    res.render("home.ejs");
})
.use(function(req,res,next){
    res.status(404).render('notFound.ejs');
});

/* zone socket */
io.on('connection',function(socket){
    /* verification existence todoList */
    if(typeof(io.todoList) == 'undefined'){
        io.todoList = [];
    }
    //send all task
    socket.emit('welcome',io.todoList);    
    //addNewTask
    socket.on('addNewTask',(data) => {
        io.todoList.push(data);
        //update
        io.emit('refreshData',io.todoList);
    })
    //delete Task
    socket.on('deleteTask',(id) => {
        io.todoList.splice(id, 1);
        //mise a jour globale
        io.emit('refreshData',io.todoList);
    })
})

server.listen(8080, function () {
  console.log('\nVisiter le projet sur (°_°) :\n\t http://127.0.0.1:8080/todo/home/ ')
})