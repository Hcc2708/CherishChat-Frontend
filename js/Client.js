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


// file sharing...

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (file) {
      // Use socket.io-file to upload the selected file
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
  
        // Emit the file information and data to the server
        socket.emit('file-shared', { fileInfo: { name: file.name, type: file.type }, fileData: content });
      };
  
      reader.readAsDataURL(file);
      // Event Listener (onload):

      // The onload event listener is set up to handle the completion of the read operation. When the file content is successfully read in reader.readAsDataURL, this event is triggered.
      // Extracting Content (e.target.result):

      // Inside the event listener, e.target.result contains the result of the read operation, which is the data URL representing the content of the file.
    }
  }
  
  // Listen for shared file information and update UI
  socket.on('file-broadcasted', ({ fileInfo, fileData }) => {
    displaySharedResource(fileInfo, fileData);
  });
  
  // Function to display shared resources in the UI
  function displaySharedResource(fileInfo, fileData) {
    const sharedResourcesContainer = document.createElement('div');
  
    // Create appropriate HTML elements based on file type (image, video, etc.)
    const fileType = fileInfo.type.split('/')[0]; // Extract 'image', 'video', etc.
  
    if (fileType === 'image') {
      const imgElement = document.createElement('img');
      imgElement.src = fileData;
      sharedResourcesContainer.appendChild(imgElement);
    } else if (fileType === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = fileData;
      videoElement.setAttribute('controls', true);
      sharedResourcesContainer.appendChild(videoElement);
    } else {
      // Handle other file types as needed
    }
    sharedResourcesContainer.classList.add('left');
    sharedResourcesContainer.classList.add('image');
    messageContainer.append(sharedResourcesContainer);
  }