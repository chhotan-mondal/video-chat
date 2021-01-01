const express = require("express");
const app = express();
const server = require('http').Server(app); // http is a build in module
const io = require('socket.io')(server) // socket.io instance initialization
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const { v4: uuidv4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    //console.log('home');
    res.render('home') 
})

app.get('/create_room', (req, res) => {
    //console.log(uuidv4());
   // var uid= uuidv4(); //uid is a unique roomid
   res.redirect(`/${uuidv4()}`) //this is also suppotable
  // res.redirect('/'+uid) //this is use for better understanding
})

app.get('/leave_room', (req, res) => {
    
    res.render('leave_room') 
})


app.get('/join-meeting', (req, res) => {
    //console.log('home');
    res.render('join_meeting') 
})

//dynamic room ceate
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room }) //go to view page room.ejs and carry with roomid
})

// listen on the connection event for incoming sockets
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        //console.log(roomId, userId)
        socket.join(roomId)  
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('message', (message) => {
            //sconsole.log(userId)
            io.to(roomId).emit('createMessage', message, userId)
        });

         socket.on('disconnect', () => {
             socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
        
    })
})
 

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))