const socket= io('/');
const videoGrid= document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted= true

var peer = new Peer()

const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})
const peers= {}
//get user video and audio
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
  addVideoStream(myVideo, stream)

  socket.on('user-connected', userId => {
    console.log('new user connect '+userId);
    connectToNewUser(userId, stream)
    })

  peer.on('call', (call) => {
      call.answer(stream)
       const video = document.createElement('video')
       call.on('stream', (userVideoStream) => {
          addVideoStream(video, userVideoStream)
       })
  })

  let text = $('input');

      $('html').keydown((e) =>  {
          if(e.which == 13 && text.val().length !== 0){ // 13 is a enter key id
          //console.log(text.val());
          socket.emit('message', text.val()); //sending to sender-client only
          text.val('');//afte send blank input box
          }
      });

      socket.on('createMessage', (message, userId) => {
          //console.log('This is comming from sever', message);
          $('.messages').append(`<li class="message"><b>${userId}</b><br/>${message}</li>`);
          scrollToBottom();
      })


})

socket.on('user-disconnected', (userId) => {
    console.log(userId)
    if(peers[userId]) peer[userId].close()
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})
//new user connection
function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    //console.log(call);
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    //console.log(video);
    videoGrid.append(video) //append video into video grid
}

const scrollToBottom = () => {
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//mute unmute video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();  
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML= html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML= html;
}

const copylink = () =>{
    //console.log('copylink')
    const textToCopy = $(location).attr("href");
   navigator.clipboard.writeText(textToCopy)
  .then(() => { alert(`Copied!`) })
  .catch((error) => { alert(`Copy failed! ${error}`) })
    
}

const openChat = () =>{
    console.log('openchat')
    $('.main__right').toggle();
}

const leaveMetting = () =>{
    console.log('leaverroom');
    document.location.href = "leave_room";
}
//stop video
const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();  
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}

const setStopVideo = () => {
    const html = `
     <i class="fas fa-video"></i>
     <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
     <i class="stop fas fa-video-slash"></i>
     <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}