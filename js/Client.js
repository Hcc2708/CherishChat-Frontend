const socket = io('https://live-chat-hcc.glitch.me')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var audio = new Audio('MessageTone.mp3')
const append = (message, position)=>{
    const messageElement  = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('msg');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position === 'left')
    {
        audio.play();
    }
}
const name  = prompt("Enter your name to join");

socket.emit('new-user-joined', name);

socket.on('user-joined', name=>{
append(`${name} joined the chat`, 'left')
})
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = messageInput.value;
    append(`You : ${msg}`, 'right');
    socket.emit('send', msg);
    messageInput.value = '';
})
socket.on('receive', message =>{
    append(`${message.name} : ${message.message}`, 'left')
})

socket.on('left', name=>{
    append(`${name} has left the chat`, 'left');
})