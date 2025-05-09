<template>
<div class="chatbot" :class="{ open: isOpen, maximized: isMaximized, minimized: !isMaximized && isOpen }">

    <!-- Title bar -->
    <div class="title-bar">
      <div class="title">Chatbot</div>
      <div class="buttons">
        <button @click="minimizeChatbot">-</button>
        <button @click="toggleMaximize">{{ maximizeIcon }}</button>
        <button @click="closeChatbot">x</button>
      </div>
    </div>


    <div :class="['welcome-message', { 'welcome-message-maximized': isMaximized, 'welcome-message-minimized': !isMaximized }]" ref="welcomeMessage">
  <div class="welcome-content">
    <div class="welcome-image-container">
      <q-img :src="Drona_White" alt="Ved" :class="['welcome-image', { 'welcome-image-maximized': isMaximized }]" />
    </div>
    <div>
      <p class="welcome-text">Hi! I am Ved, your AI virtual assistant.<br>Ask me about Fintech!</p>
    </div>
  </div>
</div>



    <q-img :src="Character_Drona" alt="" class="monk-image"/>
    <div class="chat-container-wrapper">
      <div class="chat-container" v-scroll-bottom>

        <!-- Messages -->
        <div class="messages">
  <div v-for="message in messages" :key="message.id" :class="message.type">
    <div class="message-label" v-if="message.type === 'incoming'">Ved</div>
    <div class="message-label" v-else>You</div>

    <div class="message-container">
      <!-- Code block messages -->
      <template v-if="message.containsCode" class="monk_icon">
        <div class="code-block-container">
          <q-btn class="copy-button" @click="copyCode(message.text)">copy code</q-btn>
          <div class="code-block" v-html="formattedCodeBlocks(message.text)"></div>
        </div>
      </template>

      <!-- Standard text messages -->
      <div v-else>
        <span>{{ message.text }}</span>
        <q-btn v-if="message.type === 'incoming'" class="copy-button" @click="copyText(message.text)">copy</q-btn>
      </div>
    </div>
  </div>

  <div v-if="isTyping" class="typing-preloader">
    <!-- <div class="message-label">Ved</div> -->
    <div class="type-anim">
  <span>T</span>
  <span>y</span>
  <span>p</span>
  <span>i</span>
  <span>n</span>
  <span>g</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
</div>
  </div>
</div>

      </div>
    </div>
    <!-- Input field for user to type messages -->
    <div class="input-container">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Enter your Query..." class="input-field">
      <button @click="sendMessage" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 14l11 -11" />
          <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
        </svg>
      </button>
    </div>

    <!-- Button to toggle chatbot visibility -->
    <button class="toggle-button" @click="toggleChatbot" ref="toggle_button" @mousedown="startDragging">
      <template v-if="isOpen">
        <q-img class="toggle-button-img" :src="isOpen ? 'Drona_Blue' : 'Drona_Blue'" alt="Monk Icon" style="background-color: red;"/>
      </template>
      <template v-else>
        <q-img class="toggle-button-img" :src="Drona_Blue" alt="Person Icon" style="transform: scaleX(-1);"/>
      </template>
    </button>
  </div>
</template>



 <script>
 import copy_code from "../../assets/copy_code.png";
 import code from "../../assets/copy.png"
 import Character_Drona from "../../assets/Character_Drona.png"
 import Character_half_Drona from "../../assets/Character_half_Drona.png"
 import Drona_White from "../../assets/Drona_White.png"
 import Drona_Blue from "../../assets/Drona_Blue.png"
//  import monk from "../assets/monk.png"
//  import monk_half from "../assets/monk_half.png"
//  import monk_small from "../assets/monk_small.png"
 import { useSessionStore } from "src/stores/session";
 export default {
   data() {
     return {
       isOpen: false,
       isMaximized: false,
      //  monk:monk,
      //  monk_half:monk_half,
      //  monk_small:monk_small,
       copy_code:copy_code,
       code:code,
       newMessage: '',
       maximizeIcon: '□',
       messages: [],
       isDragging: false,
       xOffset: 0,
       yOffset: 0,
       isTyping: false,
       Character_Drona:Character_Drona,
       Drona_Blue:Drona_Blue,
       Drona_White:Drona_White,
       Character_half_Drona:Character_half_Drona,
      //  originalWelcomeMessage: "Hi! I am Drona, your AI virtual assistant.<br>Ask me about Fintech?",
       minimizedWelcomeMessage: "Hi! I am Ved, your AI virtual assistant.<br>Ask me about Fintech!"

     };
   },

   mounted() {
  window.addEventListener("resize", this.handleResize);
},
beforeDestroy() {
  window.removeEventListener("resize", this.handleResize);
},
   methods: {
    handleResize() {
    this.$forceUpdate(); // Forces re-render when screen resizes
  },
    toggleChatbot() {
      this.isOpen = !this.isOpen;
 // Add a welcome message when the chat is opened and no messages exist
 if (this.isOpen && this.messages.length === 0) {
      this.showTypingIndicator();  // Show typing indicator first
    }
      if (this.isMaximized) {
        this.isMaximized = false;
        document.body.classList.remove('no-scroll');
      }
    },
    showTypingIndicator() {
    // Show the typing indicator for the welcome message
    this.isTyping = true;

    // After a short delay, hide typing and show the welcome message
    setTimeout(() => {
      this.isTyping = false;
      this.addWelcomeMessage();
    }, 1000);
  },
  addWelcomeMessage() {
    const welcomeMessage = {
      text: "Hello! How can I help you today?",
      type: "incoming",
      id: Date.now()
    };
    this.messages.push(welcomeMessage);
    this.$nextTick(() => {
      const chatContainer = this.$el.querySelector('.chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  },
    minimizeChatbot() {
      this.isMaximized = false;
      this.isOpen = false;
    },
    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      this.maximizeIcon = this.isMaximized ? '▢' : '□';
      document.body.classList.toggle('no-scroll', this.isMaximized);
    },
    closeChatbot() {
      this.isOpen = false;
      this.isMaximized = false;
      document.body.classList.remove('no-scroll');
      this.messages = [];
    },
  sendMessage() {
    const message = this.newMessage.trim();
    if (!message) return;

    this.isTyping = message.length > 0;

    // Push the outgoing message to the messages array immediately
    const outgoingMessage = { text: message, type: 'outgoing', id: Date.now() };
    this.messages.push(outgoingMessage);
    // console.log('Outgoing message:', outgoingMessage);
    // Log outgoing message
    this.newMessage = ''; // Clear the input field
    this.$nextTick(() => {
      const chatContainer = this.$el.querySelector('.chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    // Send the message to the API
    const formData = new FormData();
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';

    const chatBotUrl = baseUrl + 'api/bot/query';
    formData.append('query', message); // Append the query parameter
    formData.append('source', 'WEBSITE'); // Append the source parameter
    fetch(chatBotUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData // Send form data
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
  let responseData = data.data.replace(/drona/gi, 'Ved'); // Replace "drona" with "Ved"
  const containsCode = responseData.includes('```');
  const formattedMessage = containsCode
    ? responseData.replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>')
    : responseData;

  const incomingMessage = { text: formattedMessage, type: 'incoming', id: Date.now(), containsCode };
  this.messages.push(incomingMessage);
  this.isTyping = false;

  this.$nextTick(() => {
    const chatContainer = this.$el.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
})
    .catch(error => {
      // console.error('There was a problem with the fetch operation:', error);
      const errorMessage = { text: 'Error sending message', type: 'incoming', id: Date.now() };
      this.messages.push(errorMessage);
      // console.log('Error message:', errorMessage); // Log error message
      this.isTyping = false;
    });
  },
  copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard');
    }).catch(err => {
      // console.error('Failed to copy text: ', err);
    });
  },
  copyCode(htmlText) {
    // Create a temporary container to parse the HTML and extract code blocks
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;

    // Extract all code blocks
    const codeBlocks = Array.from(tempDiv.querySelectorAll('.code-block'));

    // Combine all code blocks' text content into a single string
    const codeTexts = codeBlocks.map(codeBlock => codeBlock.textContent || codeBlock.innerText).join('\n\n');

    // Copy the combined code to clipboard
    navigator.clipboard.writeText(codeTexts).then(() => {
      alert('Code copied to clipboard!');
    }).catch(err => {
      // console.error('Failed to copy code: ', err);
    });
  },
  formattedCodeBlocks(htmlText) {
    // Format code blocks for display
    return htmlText.replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>');
  },
     startDragging(event) {
      event.preventDefault();
       this.isDragging = true;
       const touchEvent = event.type.startsWith('touch') ? event.touches[0] : event;
       const chatbot = this.$refs.toggle_button;
       const boundingBox = chatbot.getBoundingClientRect();
       this.xOffset = event.clientX - boundingBox.left;
       this.yOffset = event.clientY - boundingBox.top;
       document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.stopDragging);
    document.addEventListener('touchmove', this.drag);
    document.addEventListener('touchend', this.stopDragging);
     },
     drag(event) {
       if (this.isDragging) {
         const chatbot = this.$refs.toggle_button;
         const touchEvent = event.type.startsWith('touch') ? event.touches[0] : event;
         chatbot.style.left = event.clientX - this.xOffset + 'px';
         chatbot.style.top = event.clientY - this.yOffset + 'px';
       }
     },
     stopDragging() {
       this.isDragging = false;
       document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('touchend', this.stopDragging);
     }
   },
   directives: {
     'v-scroll-bottom': {
       updated: function(el) {
         el.scrollTop = el.scrollHeight;
       }
     }
   }
 };
 </script>

 <style scoped>
  .codeBlock {
  background-color: black;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid black !important;
  z-index: 100;
  white-space: pre-wrap; /* Preserve whitespace and line breaks */
  overflow: auto; /* Ensure scroll if content is too large */
  margin: 5px 0; /* Optional: Add some margin for better spacing */
}
.message-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}
.no-scroll {
  overflow: hidden;
}
.message-container img, .message-container svg {
  margin-right: 10px;
}
 .title-bar {
   background-color:#5479f7;
   color: #fff;
   display: none;
   justify-content: flex-end;
   align-items: center;
   padding: 0px 0px;
   border-top-left-radius: 20px;
   border-top-right-radius: 20px;
 }
 .title {
   display: none;
 }
 .chatbot.open.maximized .title-bar{
   background-color: #5479f7;
 }
 .chatbot.open.maximized .buttons button {
   background-color: #5479f7;
   border: none;
   color: #ffff;
   font-size: 16px;
   cursor: pointer;
   padding: 0;
   margin-left: 8px;
 }
 .buttons button {
   background-color: transparent;
   border: none;
   color: #ffff;
   font-size: 16px;
   cursor: pointer;
   padding: 0;
   margin-left: 8px;
 }

 .buttons button:hover {
   opacity: 0.8;
 }
 .chatbot {
   position: fixed;
   bottom: 0px;
   right: 0px;
   z-index: 9999;
 }
 .chatbot.open.maximized {
   width: 100%;
   height: 100%;
   bottom: 0;
   right: 0;
 }
 .chatbot.open.maximized .chat-container{
   min-width: 100vw;
   min-height: 84vh;
   padding-bottom: 80px;
   /* border: 2px solid black; */
   /* max-height: 90vh; */
 }
 /* .chatbot.open.maximized .welcome-message {
   padding-top: 0px;
   margin-bottom: 0px;
   text-align: center;
   background-color: #5479f7;
   color: #fff;
   font-weight: 600;
   position: fixed;
   width: 100vw;
   font-size: 32px;
 } */

 .chatbot.open .title-bar{
   display: flex;

   padding: 2px 4px;
 }
 .chatbot.open .toggle-button{
   display: none;
 }
 .chat-container {
   background-color: #fff;
   border: 2px solid #5479f7;;
   display: none;
   max-height: 400px;
   height: 500px;
   overflow-y: auto;
   width: 300px;
   position: relative;
 }

 .chatbot.open .chat-container {
   display: block;
 }
 .chatbot.open .monk-image{
   display: block;
 }
 .chatbot.open  .welcome-message{
  display: block;
 }
 .chatbot.open .input-container{
  display: flex;
 }

 .welcome-message {
  font-size: 12px;
  text-align: center;
  font-weight: 600;
  background-color: #5479f7;
  color: #ffff;
  padding: 1%;
  display: none;
}

/*
 .welcome-message {
   padding-top: 0px;
   text-align: center;
   background-color: #5479f7;
   color: #fff;
   font-weight: 600;
   display: block;
   width: 300px;
 }
  */
 .messages {
   margin-bottom: 10px;
   margin-top: 10px;
   overflow-x: hidden;
 }
 .message-content {
  display: flex;
  align-items: center ;
  margin-bottom: 10px;
}
.user-icon img {
  width: 30px; /* Adjust size as needed */
  height: 30px; /* Adjust size as needed */
  border-radius: 50%;
  margin-right: 10px;
}

.text {
  flex: 1;
   /* Adjust as needed */
}

.monk-icon img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 10px;
}

/* Adjustments for maximized screen */
.chatbot.open.maximized .text {
  max-width: calc(100% - 150px); /* Adjust as needed based on the width of user icon and monk icon */
}
 .messages div {
   margin: 5px 0;
   padding: 5px 10px;
   border-radius: 5px;
 }

.messages .incoming,
.messages .outgoing {
  position: relative;
  padding: 14px 16px;
  margin: 10px;
  border-radius: 14px;
  width: 90%;
  color: white;
  font-size: 14px;
  line-height: 18px;
}
.messages .outgoing {
  background-color: #9db1f1;
  color: #333;
  align-self: flex-end; /* Align outgoing messages to the right */
  margin-left: auto !important;
  display: flex;
  flex-direction: row-reverse; /* Ensure the message text starts from the right */
  position: relative;
  padding: 14px 16px;
  margin: 10px;
  margin-right: 20px;
  border-radius: 14px;
  width: 90%;
  max-width: 100%;
}

.messages .outgoing .message-label {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 12px;
  font-weight: bold;
  color: white;


}

.messages .outgoing{
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: left;
  margin-top: 20px;
  word-break: break-word;
  max-width: 100%;
}



.messages .incoming {
  background-color: #007bff;
  margin-right: auto;
  margin-left: 20px;
}

.messages .outgoing,
.messages .incoming {
  margin-bottom: 30px;
  position: relative;
}

.messages .outgoing::before,
.messages .incoming::before {
  position: absolute;
  bottom: -17px;
  font-size: 20px;
  color: white;
  background-color: #007bff;
  border: 1px dashed #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.messages .incoming::before {
  content: "\1F916"; /* Robot emoji */
  background-color: #9db1f1;
  bottom: -17px;
  left: -7px;
}

.messages .outgoing::before {
  content: "\1F464"; /* Bust emoji */
  bottom: -17px;
  right: -10px;
}

 .toggle-button {
   position: fixed;
   bottom: 20px;
   right: 20px;
   width: 80px;
   height: 70px;
   background-color: transparent;
   border: none;
   cursor: pointer;
   z-index: 9999999;
 }

 /* .toggle-button-img {
   width: 100%;
   height: 100%;
   border-radius: 50%;
   background-color: #007bff;

 } */

 .toggle-button-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #007bff;
  box-shadow: 0px 0px 12px 4px rgba(30, 100, 255, 0.6); /* Full, bold blue shadow around */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Enhanced hover effect */
.toggle-button-img:hover {
  transform: scale(1.1); /* Slight scale-up on hover */
  box-shadow: 0px 0px 16px 6px rgba(30, 100, 255, 0.8);
}

 .toggle-button:focus {
   outline: none;
 }
 .chatbot.open.maximized  .input-container{
    min-height: 6vh;
    max-height: 6vh;
   min-width: 100vw;
   margin: 0px 0px;
   display: flex;
   position: fixed;
   bottom: 0;
   /* margin-left: 1.1%; */


 }
 .chatbot.open.maximized .input-field{

   border-radius: 0px;


 }
 .chatbot.open.maximized .messages .incoming{
  margin-bottom: 40px;
  margin-top: 30px;
 }
 .chatbot.open.maximized .messages .outgoing{
  margin-bottom: 40px;
  margin-top:30px;
 }
 .chatbot.open.maximized .welcome-message{
  font-size: 32px;
  padding: 1%;
 }

 .chatbot.open.maximized .chat-container-wrapper {
   /* Space for scrollbar */
   overflow: hidden; /* Hide overflow */
 }

 .chatbot.open.maximized .chat-container::-webkit-scrollbar {
   width: 8px; /* Width of the scrollbar */
   height: 8px; /* Height of the scrollbar */
 }

 /* Track */
 .chatbot.open.maximized .chat-container::-webkit-scrollbar-track {
   background: #f1f1f1; /* Color of the track */
   border-radius: 20px; /* Rounded corners */
 }



 /* Handle */
 .chatbot.open.maximized .chat-container::-webkit-scrollbar-thumb {
   background: #7f9af3; /* Color of the handle */
   border-radius: 20px; /* Rounded corners */
 }

 /* Handle on hover */
 .chatbot.open.maximized .chat-container::-webkit-scrollbar-thumb:hover {
   background: #5479F7; /* Darker handle color on hover */
 }


 .chatbot.open.maximized .send-button{
  border-radius: 0px;

 }
 .chatbot.open.maximized .monk-image{
   display: none;
 }
 .input-container {

   width: 300px;
   bottom: 0; /* Align to the bottom */
   margin: 0px 0px; /* Add margin for better spacing */
   display: none; /* Use flexbox for layout */
   border-bottom-left-radius: 20px;
   border-bottom-right-radius: 20px;
 }
 .typing-preloader {
  font-style: italic;
  color: white;
  margin-bottom: 30px;
  position: relative;
  padding: 14px 16px;
  background: #007bff;
  display: flex;
  align-items: center;
  margin-left: 4%;
}

.type-anim {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  gap: 2px;
}

/* Define the bounce animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px); /* Moves up */
  }
}

/* Apply the bounce animation to each letter with staggered delay */
.type-anim span {
  display: inline-block;
  animation: bounce 0.6s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.1s);
}

/* Set custom property for delay on each span */
.type-anim span:nth-child(1) { --index: 0; }
.type-anim span:nth-child(2) { --index: 1; }
.type-anim span:nth-child(3) { --index: 2; }
.type-anim span:nth-child(4) { --index: 3; }
.type-anim span:nth-child(5) { --index: 4; }
.type-anim span:nth-child(6) { --index: 5; }
.type-anim span:nth-child(7) { --index: 6; }
.type-anim span:nth-child(8) { --index: 7; }
.type-anim span:nth-child(9) { --index: 8; }

.typing-preloader .message-label {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
}
 .input-field {
   flex: 1; /* Take remaining space */
   border: 2px solid #5479F7;
   outline: none;
   height: 40px;
   transition: border-color 0.3s ease;
   border-bottom-left-radius: 20px;
 }

 .send-button {
   width: 40px; /* Adjust button width */
   height: 40px;
   background-color: #5479F7;
   border: none;
   color: white;
   cursor: pointer;
   display: flex; /* Use flexbox for layout */
   justify-content: center; /* Center icon horizontally */
   align-items: center; /* Center icon vertically */
   border-bottom-right-radius: 20px;
 }
 .custom-btn_chat{
  padding-top: 0% !important;
  padding-bottom: 0% !important;
  align-items: flex-start;
 }

 .chat-container-wrapper {
   /* Space for scrollbar */
   overflow: hidden; /* Hide overflow */
 }

 .chat-container::-webkit-scrollbar {
   width: 8px; /* Width of the scrollbar */
   height: 8px; /* Height of the scrollbar */
 }

 /* Track */
 .chat-container::-webkit-scrollbar-track {
   background: #f1f1f1; /* Color of the track */
   border-radius: 20px; /* Rounded corners */
 }
 .user-icon{
  background-color: #5479F7;
  border-radius: 50%;
  color: #9db1f1;
  width: 30px;
  height:30px;
 }


 /* Handle */
 .chat-container::-webkit-scrollbar-thumb {
   background: #7f9af3; /* Color of the handle */
   border-radius: 20px; /* Rounded corners */
 }

 /* Handle on hover */
 .chat-container::-webkit-scrollbar-thumb:hover {
   background: #5479F7; /* Darker handle color on hover */
 }

 /* Other styles remain unchanged */


 .monk-image {
   position: absolute;
   display: none;
   bottom: 32px;
   left: 0; /* Position at the horizontal center of the container */
   margin-left: -80px; /* Adjust image width */
   width: 110px;
   transform: scaleX(-1);
   z-index: 3;
   /* Ensure the image is above other content */
 }
 .copy-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: black;
  color: white;
  font-size: 12px;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
.copy-button-all {
  position: absolute;
  top: 5px;
  right: 100px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
}

.copy-button:hover {
  background-color: #0056b3;
}

.code-block {
  background-color: black;
  color: white;
  margin-top: 4% !important;
  margin-bottom: 4% !important;
  /* padding: 10px; */

  white-space: pre-wrap;
  overflow-y: auto;
  overflow-x: hidden;
  width: fit-content;

}
.code-block-container{
  margin: 5px 0;
    padding: 5px 10px;
    border-radius: 5px;
    overflow-x: hidden;
  border-radius: 5px;
}
 .welcome-image {
  width:40px;
  height: 40px;
  border-radius: 50%;
  /* background-color: #5479f7; */
  background-color: #ffffff;
  border: 1px solid #dcdcdc;


}

.welcome-image-maximized {
  width: 80px;
  height: 80px;

}

.message-label {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
  margin-left: 4%;
  z-index: 10;
  position: relative;
}

/* Shared styles */
.welcome-content {
  display: flex;
  align-items: center;
}

/* Maximized view styling */
.welcome-message-maximized .welcome-content {
  justify-content: center;
  gap: 20px;
  /* padding: 10px;  */
}

.welcome-message-maximized .welcome-text {
  text-align: center;
  font-size: 25px;
  margin-left: 10px;
}

/* Minimized view styling */
.welcome-message-minimized .welcome-content {
  justify-content: space-evenly;
  gap: 5px;
}

.welcome-message-minimized .welcome-text {
  text-align: center;
  margin-left: 0;
  margin-top: 10px;
}

@media (max-width: 768px) {

  .chatbot.open.maximized .chat-container {
    /* padding-bottom: 90px;  */
    padding-bottom: 20px;
  }

  .welcome-message-maximized .welcome-content {
  justify-content: center;
  gap: 20px;
  /* padding: 10px;  */
}

.welcome-message-maximized .welcome-text {
  text-align: center;
  font-size: 15px;
}
.welcome-message-maximized .welcome-content {
  justify-content: center;
  gap: 0px;
  /* padding: 10px;  */
}

.welcome-message-maximized .welcome-text {
  text-align: center;
  font-size: 15px;
  /* margin-left: 10px;  */
margin-bottom: 2px;
padding: 9px 0px;
}

.welcome-image-maximized {
  width: 50px;
  height: 50px;

}

.toggle-button-img:hover,
.toggle-button-img:focus {
  transform: scale(1.1);
  box-shadow: 0px 0px 16px 6px rgba(30, 100, 255, 0.8);
}


}








 </style>
