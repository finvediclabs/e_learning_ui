<template>
  <div id="chat-page" style="height: 87%;">
    <!-- Image Viewer Modal -->
    <div id="imageView" class="hidden">
      <img id="viewImage" src="" alt="Full Size Image">
      <div id="closeButton" class="close-btn" @click="hideImageView">&times;</div>
    </div>

    <!-- Chat Container -->

      <div ref="chatscrollContainer" class="chat-container">
    <div ref="connectingElement" style="color: green; text-align: center; ">
      Connecting...
    </div>
    <ul
      id="vedichivemessageArea"
      ref="vedichivemessageArea"
      style="background: transparent;height: 100%;overflow-y: auto;"
      class="members2"
    >
      <li
        v-for="(message, index) in messages"
        :key="index"
        class="q-mt-md"
        style="margin-top: 2%;"
        :class="['chat-message', message.username === username ? 'self' : '']"
      >
        <i :style="{ backgroundColor: getAvatarColor(message.username) }">
          {{ message.username[0] }}
        </i>
        <div>
          <div class="message-header">
            <span
              class="username"
              style="font-weight: bold;color: #6787f9;font-size: 1.2rem;"
              >{{ message.username }}</span
            >
            <span class="timestamp" style="font-weight: bold;color: rgb(158, 158, 158);">
              {{ " " + formatTimestamp(message.time) }}
            </span>
          </div>
          <div class="message-body">
            <template v-if="isImage(message)">
              <div class="image-container"></div>
            </template>
            <template v-else-if="isFile(message.message)">
              <div class="file-container" @click="viewFile(message.username, message.message)">
                <i class="fa fa-file-pdf-o"></i>
                <span>{{ extractFileName(message.message) }}</span>
                <button class="download-button" @click="downloadFile(message.username, message.message)">
                  Download
                </button>
              </div>
            </template>
            <template v-else>
              <p class="message-text">{{ message.message }}</p>
            </template>
          </div>
        </div>
        <div v-if="canDeleteMessage(message)" class="emoji-container">
          <span class="emoji-btn" @click="deleteMessage(message.id, $event)" title="Delete Message">
            <span class="material-icons" style="color: red">delete</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
      <!-- llll -->

    <!-- Input Field and Upload Buttons -->
    <div class="input-container">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Message" class="input-field"
        id="message" required />
      <button @click="sendMessage" class="send-button" title="Send Message">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 14l11 -11" />
          <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
        </svg>
      </button>

      <input id="fileInput" name="file" type="file" class="hidden-input" ref="file" @change="onFileChange"
        accept=".jpg,.png" hidden />
      <button class="upload-doc" @click="triggerFileInput" title="Add Image">
        <q-icon name="add_circle" />
      </button>

      <input id="mediaInput" name="file" type="file" class="hidden-input" ref="media" @change="onFileChange"
        accept=".pdf" hidden />
      <button class="upload-assignment" @click="triggerMediaInput" title="Upload File">
        <q-icon name="upload_file" />
      </button>
    </div>
  </div>
</template>


<script>
import { storeToRefs } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '@quasar/extras/material-icons/material-icons.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default {
  name: 'ContainerComponent',
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      token,
      userType,
      user,
    };
  },
  data() {
    return {
      baseUrl: (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/',
      imageSrc: null,
      showFolderContents: false,
      folderFiles: [],
      uploadedFile: null,
      filePreviewUrl: "",
      isOpen: false,
      newMessage: "",
      maximizeIcon: "□",
      messages: [],
      isDragging: false,
      xOffset: 0,
      yOffset: 0,
      originalWelcomeMessage: "FinChat",
      name: "",
      username: null,
      stompClient: null,
      connecting: true,
      isWebSocketOpen: false, // Track WebSocket connection state
    };
  },
  watch: {
    $route(to, from) {
      // Check if the route has changed from #/channel to something else
      if (to.path !== '/channel') {
        this.ondisconnected();
      }
    },
  },
  mounted() {

    this.getUserData();
    this.scrollToBottomWhenVisible();
    this.getAllMessages();
    // this.scrollToBottom();
  },
  updated() {
    // Also scroll on update (e.g., after messages are loaded or added)
    // this.scrollToBottom();
     this.scrollToBottomWhenVisible();
  },
  methods: {
    triggerFileInput() {
      this.$refs.file.click();
    },
    scrollToBottomWhenVisible() {
      const container = this.$refs.chatscrollContainer;
      const messageArea = this.$refs.vedichivemessageArea; // New constant for vedichivemessageArea

      if (container && messageArea && this.isElementInView(container)) {
        container.scrollTop = container.scrollHeight;
        // Scroll vedichivemessageArea to bottom if needed (if it's scrollable)
        messageArea.scrollTop = messageArea.scrollHeight;
      }
    },

    isElementInView(element) {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    },
    triggerMediaInput() {
      this.$refs.media.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFile = file;
        this.filePreviewUrl = URL.createObjectURL(file);

        //console.log(this.uploadedFile)
        this.newMessage = file.name;
      }
    },
    getUserData() {
      this.$api.get(`api/users/${this.user.id}`).then((response) => {
        if (response.data.success) {
          const user = response.data.data;
          this.connect(user.name);
        }
      });
    },

    async getAllMessages() {
      try {
        this.messages = []
        const response = await this.$api.get(`/api/getmessages/${this.groupId}`);
        if (response.data && Array.isArray(response.data)) {
          this.messages = response.data;
          console.log(this.messages)
        }
        else {
          console.log("No Messages")
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    showImageView(url) {
      const imageView = document.getElementById('imageView');
      const viewImage = document.getElementById('viewImage');

      viewImage.src = url;
      imageView.classList.remove('hidden');
    },
    getImage(username, Url) {
      const getImagesUrl = this.baseUrl + 'fs/download';
      const imagePathWithoutPrefix = Url.replace(this.baseUrl + 'fs/download/', '');
      const formData = new FormData();

      formData.append('filename', imagePathWithoutPrefix);
      formData.append('sender', username);

      const imgElement = document.createElement('img');
      imgElement.alt = 'Downloaded Image';
      imgElement.style.maxWidth = '200px';
      imgElement.style.borderRadius = '5px';

      axios.post(getImagesUrl, formData, { responseType: 'blob' })
        .then(downloadResponse => {
          const blob = new Blob([downloadResponse.data]);
          const url = window.URL.createObjectURL(blob);

          // Create the image element
          imgElement.src = url;
          imgElement.className = 'downloaded-image';
          imgElement.addEventListener('click', () => {
              this.showImageView(url);
            });

          // Find the container with the desired class and append the image
          const container = document.querySelector('.image-container');
          container.appendChild(imgElement);
        })
        .catch(error => {
          console.error('Error in image download:', error);
        });
    },
    hideImageView() {
      const imageView = document.getElementById('imageView');
      imageView.classList.add('hidden');
    },

    // Helper to create file element
    formatTimestamp(timestamp) {
      const date = dayjs(timestamp);
      return ` :: ${date.format('DD/MM/YY')} ${date.format('HH:mm')}`;
    },
    isImage(message) {
      //console.log(message)
      if (message.message.includes('fs/download')) {
        this.getImage(message.username,message.message)
        return true;
      };
    },
    isFile(message) {
      return message.includes('ms/download');
    },
    extractFileName(filePath) {
      if (filePath.includes('fs/download')) {
        return filePath.replace(this.baseUrl + 'fs/download/', '')
      } else if (filePath.includes('ms/download')) {
        return filePath.replace(this.baseUrl + 'ms/download/', '');
      }
    },
    canDeleteMessage(message) {
      return message.username === this.username || this.userType === 'Admin';
    },
    viewFile(username, filePathUrl) {

      const getfileUrl = this.baseUrl + 'ms/download';
      const removefilePath = this.baseUrl + 'ms/download/';
      const filePathWithoutPrefix = filePathUrl.replace(removefilePath, '');

      const formData = new FormData();
      formData.append('filename', filePathWithoutPrefix);
      formData.append('sender', username);

      axios.get(getfileUrl, formData, { responseType: 'blob' })
        .then(downloadResponse => {
          const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          window.open(url, '_blank')
        })
        .catch(error => {
          console.error('Error in viewing file:', error);
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },
    // Helper to download file
    downloadFile(username, filePathUrl) {

      const getfileUrl = this.baseUrl + 'ms/download';
      const removefilePath = this.baseUrl + 'ms/download/';
      const filePathWithoutPrefix = filePathUrl.replace(removefilePath, '');

      const formData = new FormData();
      formData.append('filename', filePathWithoutPrefix);
      formData.append('sender', username);

      axios.post(getfileUrl, formData, { responseType: 'blob' })
        .then(downloadResponse => {
          const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filePathWithoutPrefix;
          a.click();
        })
        .catch(error => {
          console.error('Error in file download:', error);
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },
    connect(username) {
      if (username) {
        this.username = username;
        let baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '');
        let wsurl = null;

        if (baseUrl.includes("http:")) {
          baseUrl = baseUrl.replace('http://', '');
          wsurl = 'ws://' + baseUrl + '/websocket';
        } else {
          baseUrl = baseUrl.replace('https://', '');
          wsurl = 'wss://' + baseUrl + '/websocket';
        }

        // console.log(wsurl);

        // Create a new instance of StompClient
        this.stompClient = new Client({
          brokerURL: wsurl.trim(),
          connectHeaders: {
            login: this.username,
          },
          debug: function (str) {
            //console.log(str);
          },
          onConnect: (frame) => {
            console.log('Connected: ' + frame);
            this.isWebSocketOpen = true;
            this.onConnected();
            this.stompClient.subscribe('/topic/public', this.onMessageReceived);
          },
          onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            this.onError();
          },
          onWebSocketClose: (event) => {
            //console.log('WebSocket connection closed: ' + event);
            this.isWebSocketOpen = false;
            this.ondisconnected();
          },
        });

        this.stompClient.activate();
      }
    },
    onConnected() {
      //console.log("STOMP connection established.");
      const joinMessage = JSON.stringify({
        sender: this.username,
        type: "JOIN",
        isActive: true
      });

      // console.log(JSON.stringify(joinMessage))

      if (this.isWebSocketOpen) {
        console.log("Web Socket is open to communicate")
        this.stompClient.publish({ destination: '/app/chat.register', body: joinMessage });
        this.$refs.connectingElement.classList.add("hidden");
      }
    },
    ondisconnected() {
      this.isWebSocketOpen = false;
      const joinMessage = JSON.stringify({
        sender: this.username,
        type: "JOIN",
        isActive: false
      });

      // console.log(JSON.stringify(joinMessage))

      if (!this.isWebSocketOpen) {
        console.log("Web Socket is closed")
        this.stompClient.publish({ destination: '/app/chat.register', body: joinMessage });
      }
    },
    onError(error) {
      console.log("STOMP connection failed.");
      this.$refs.connectingElement.textContent =
        "Unable to connect to STOMP! Please refresh the page and try again or contact the administrator.";
      this.$refs.connectingElement.style.color = "red";
    },
    onMessageReceived() {

      this.getAllMessages()
      this.scrollToBottom();
    },

    async uploadFile(file) {
      if (file.name.endsWith(".jpg") || file.name.endsWith(".png")) {
        try {
          // Check if the file type is JPG or PNG
          const allowedTypes = ['image/jpeg', 'image/png'];
          if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPG and PNG files are allowed.');
          }

          // Proceed with uploading the file if validation passes
          const formData = new FormData();
          formData.append('file', file);

          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          const getFileUrl = baseUrl + 'fs/upload-file';

          const response = await fetch(getFileUrl, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'File upload failed');
          }

          const filePath = data.uri;
          console.log('File uploaded:', filePath);

          const chatMessage = {
            sender: this.username,
            content: filePath,
            groupId: this.groupId, // Assuming the backend returns the file URL
            type: "CHAT",
          };

          if (this.isWebSocketOpen) {
            this.stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
          }

          this.newMessage = ""; // Clear the message input
          filePath = "";

        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        } finally {
          this.loading = false; // Ensure loading is set to false after completion
        }
      }
      else if (file.name.endsWith(".pdf")) {
        try {

          // Proceed with uploading the file if validation passes
          const formData = new FormData();
          formData.append('file', file);

          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          const getFileUrl = baseUrl + 'ms/upload-file';

          const response = await fetch(getFileUrl, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'File upload failed');
          }

          const filePath = data.uri;
          console.log('File uploaded:', filePath);

          const chatMessage = {
            sender: this.username,
            content: filePath,
            groupId: this.groupId, // Assuming the backend returns the file URL
            type: "CHAT",
          };

          if (this.isWebSocketOpen) {
            this.stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
          }

          this.newMessage = ""; // Clear the message input
          filePath = "";

        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        } finally {
          this.loading = false; // Ensure loading is set to false after completion
        }
      }
    },
    sendReaction(sender, message, emoji) {
      const reactionMessage = {
        content: message,
        sender: sender,
        reaction: emoji, // The reaction itself
        type: "REACT", // Message type to differentiate from chat messages
      };

      //console.log(reactionMessage);

      // Send the reaction message over WebSocket
      if (this.isWebSocketOpen) {
        this.stompClient.publish({ destination: '/app/chat.react', body: JSON.stringify(reactionMessage) });
      }
    },
    deleteMessage(messageId, event) {
      const messageElement = event.currentTarget.closest('.chat-message');
      this.$api.delete(`api/deleteMessage/${messageId}`)
        .then(response => {
          if (response.status === 200) {
            this.showMsg(`Message deleted successfully`, 'positive');
            messageElement.remove();
          } else {
            this.showMsg('Failed to delete message', 'negative');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    sendMessage() {
      // console.log(this.uploadedFile)
      if (this.uploadedFile && (this.newMessage.endsWith(".jpg") || this.newMessage.endsWith(".png"))) {
        this.uploadFile(this.uploadedFile)
      }
      else if (this.uploadedFile && (this.newMessage.endsWith(".pdf"))) {
        this.uploadFile(this.uploadedFile)
      }
      else {
        const messageContent = this.newMessage.trim();
        if (messageContent && messageContent !== "") {

          if (this.isWebSocketOpen) {
            const chatMessage = {
              sender: this.username,
              content: messageContent,
              groupId: this.groupId,
              type: "CHAT",
            };

            // console.log(JSON.stringify(chatMessage));

            this.stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
            this.newMessage = ""; // Clear the message input
          }
        }
      }
    },
    getAvatarColor(messageSender) {
      var colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
      ];

      var hash = 0;
      for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
      }

      var index = Math.abs(hash % colors.length);
      return colors[index];
    },
    showMsg(message, type) {
      // this.$q.notify({
      //   message: message || "Something Went Wrong!",
      //   type: type,
      //   position: 'top-right',
      //   actions: [
      //     { icon: 'close', color: 'white', handler: () => { } }
      //   ]
      // });
    },
  }
};
</script>
<style>
.username {
  color: #0056b3;
}

.emoji-container {
  position: absolute;
  bottom: 10px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  display: none;
}

/* Style for the close button */
.close-btn {
  position: relative;
  display: inline-block;
  font-size: 1.5rem;
  text-align: center;
  line-height: 1.5rem;
  /* Aligns the "X" vertically */
  width: 2rem;
  /* Adjust width for circle */
  height: 2rem;
  /* Adjust height for circle */
  border: 1px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  user-select: none;
  padding: 2px;
  margin: 20px;
  background-color: transparent;
  /* Optional: Make background transparent */
}


.close-btn:hover {
  background-color: white;
  color: black;
}

/* Style for each emoji button */
.chat-message .Reactionarea {
  color: grey;
}


.emoji-btn {
  font-size: 1.5rem;
  cursor: pointer;
  margin: 0 2px;
}

.chat-message:hover .emoji-container {
  display: flex;
}

/* Style for the selected emoji (optional) */
.emoji-btn.selected {
  background-color: #f0f0f0;
  border-radius: 5px;
}

/* Style for the hidden view container */
#imageView {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}

/* Hide the container by default */
.hidden {
  display: none;
}

/* Style for the image inside the view */
#viewImage {
  max-width: 80%;
  max-height: 80%;
  margin-top: 75px;
}

#chat-page .chat-message span {
  color: #333;
  font-weight: 600;
}

#chat-page .chat-message p {
  color: #43464b;
}

#chat-page ul {
  list-style-type: none;
  background-color: #ffffff;
  margin: 0;
  overflow: auto;
  overflow-y: scroll;
  padding: 0 20px 0px 20px;
  height: calc(100% - 150px);
}

#chat-page ul li {
  line-height: 1.5rem;
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid #f4f4f4;
}

#chat-page ul li p {
  margin: 0;
}

#chat-page .chat-message {
  padding-left: 68px;
  position: relative;
}

#chat-page .chat-message i {
  position: absolute;
  width: 42px;
  height: 42px;
  overflow: hidden;
  left: 10px;
  display: inline-block;
  vertical-align: middle;
  font-size: 18px;
  line-height: 42px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  font-style: normal;
  text-transform: uppercase;
}

#chat-page .chat-message span {
  color: #333;
  font-weight: 600;
}

#chat-page .chat-message p {
  color: #43464b;
}
</style>
<style scoped>
/* Header Styles */

.chat-message {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px 0;
  border-radius: 20px;
  width: 70%;
  background-color: #F7F7FC;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  align-self: flex-start; /* default: others align to left */
}

/* Align self messages to the right */
.chat-message.self {
  align-self: flex-end;
  background-color: #7289da;
  color: #ffff !important; /* Optional: different bg for own message */
}
.chat-message.self .username,
.chat-message.self .timestamp {
  color: white !important;
}
.chat-message.self .message-text {
  color: #F7F7FC !important;
}
#vedichivemessageArea {
  display: flex;
  flex-direction: column;
}
.chat-message i {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}


.chat-message span {
  color: #999997;
  font-weight: normal;
}

.emoji-container {
  margin-top: 10px;
  right: 15px;
}

.emoji-btn {
  cursor: pointer;
}


.file-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px 0;
  cursor: pointer;
  width: 95%;
}

.file-container i {
  font-size: 24px;
  margin-right: 10px;
}

.file-container button {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
}

.file-container:hover {
  background-color: #eef5ff;
}

img {
  max-width: 200px;
  border-radius: 5px;
  cursor: pointer;
}


.header {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding-top: 40px;
  padding-left: 40px;
  color: #7289da;
  width: 130vh;
  flex-direction: row;
}

.header .channelbtn,
.header .mediabtn {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.header .channelbtn.active,
.header .mediabtn.active {
  background-color: #7289da;
  /* Active tab color */
  color: white;
  border-radius: 20px;
}

.header .channelbtn:hover,
.header .mediabtn:hover {
  background-color: #8899d8;
  /* Hover color */
  color: white;
  border-radius: 20px;
}

/* Channelbox and Mediabox Styles */
.channelbox,
.mediabox {
  flex-grow: 1;
  display: none;
}

.channelbox.active,
.mediabox.active {
  display: block;
}

.container {
  width: 130vh;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  margin: 40px;
  height: 68vh;
  flex-direction: column;
}

.message-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  /* Adjust margin as needed */
}

.no-scroll {
  overflow: hidden;
}

.message-container img,
.message-container svg {
  margin-right: 10px;
  /* Adjust margin between icon and text */
}

.title-bar {
  background-color: #5479f7;
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

.chatbot.open.maximized .title-bar {
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

.chat-container {
  background-color: transparent;
  /* border:2px solid black; */
  /* border-radius: 20px; */
  visibility: visible;
  height: 90%;
  overflow-y: hidden;
  /* Enable vertical scrolling */
  width: 100%;
  /* Fixed width */
  position: relative;
  /* Establish positioning context */
}

.media-container {
  background-color: transparent;
  border-radius: 20px;
  height: 90vh;
  visibility: visible;
  /* Limit height to enable scrolling */
  overflow-y: auto;
  /* Enable vertical scrolling */
  width: 100%;
  /* Fixed width */
  position: relative;
  /* Establish positioning context */
}

.messages {
  margin-bottom: 10px;
  margin-top: 10px;
}

.message-content {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.text {
  flex: 1;
  /* Adjust as needed */
}


.input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  bottom: 0;
}

.input-field {
  flex: 1;
  border-radius: 20px;
  outline: none;
  height: 40px;
  width: 300px;
  transition: border-color 0.3s ease;
}

.send-button {
  width: 40px;
  /* Adjust button width */
  height: 40px;
  margin: 10px;
  background-color: #5479F7;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  /* Use flexbox for layout */
  justify-content: center;
  /* Center icon horizontally */
  align-items: center;
  /* Center icon vertically */
}

.send-button:hover {
  opacity: 0.8;
}

.upload-doc:hover {
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
  transition: all 0.3s ease-in-out;
}

.upload-assignment:hover {
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
  transition: all 0.3s ease-in-out;
}

.upload-doc {
  width: 40px;
  /* Adjust button width */
  height: 40px;
  border-radius: 50%;
  background-color: #1d3892;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  /* Use flexbox for layout */
  justify-content: center;
  /* Center icon horizontally */
  align-items: center;
  /* Center icon vertically */
}

.upload-assignment {
  width: 40px;
  /* Adjust button width */
  height: 40px;
  border-radius: 50%;
  margin: 10px;
  font-size: 1.5rem;
  background-color: #df6c15;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  /* Use flexbox for layout */
  justify-content: center;
  /* Center icon horizontally */
  align-items: center;
  /* Center icon vertically */
}

.custom-btn_chat {
  padding-top: 0% !important;
  padding-bottom: 0% !important;
  align-items: flex-start;
}



.chat-container::-webkit-scrollbar {
  width: 8px;
  /* Width of the scrollbar */
  height: 8px;
  /* Height of the scrollbar */
}

/* Track */
.chat-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Color of the track */
  border-radius: 20px;
  /* Rounded corners */
}

.user-icon {
  background-color: #5479F7;
  border-radius: 50%;
  color: #9db1f1;
  width: 30px;
  height: 30px;
}


/* Handle */
.chat-container::-webkit-scrollbar-thumb {
  background: #6a8af1;
  /* Color of the handle */
  border-radius: 20px;
  /* Rounded corners */
}

/* Handle on hover */
.chat-container::-webkit-scrollbar-thumb:hover {
  background: #5479F7;
  /* Darker handle color on hover */
}

.download-button {
  position: absolute;
  background-color: #007bff;
  right: 90px;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}


.download-button:hover {
  background-color: #0056b3;
}

.message-header .timestamp {
  visibility: visible;
  /* Show on hover */
  opacity: 1;
  /* Fade in */
}

/* Other styles remain unchanged */
</style>
