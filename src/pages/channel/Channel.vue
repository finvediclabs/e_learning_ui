

<template >
<div class="web_view"  >


  <div id="imageView" class="hidden">
    <img id="viewImage" src="" alt="Full Size Image">
    <div id="closeButton" class="close-btn" @click="hideImageView">&times;</div>
  </div>

<div class="row col-12" style="background-color:#F7F7FC !important;">
  <!-- Left Panel: Channels -->
  <div class="col-4 left_group">
    <div class="new_grp_container q-pl-xl q-pr-md">
      <div class="background_container q-mt-xl q-px-sm q-pt-lg members2" style="overflow-y: auto; flex-grow: 1;">
        <span class="grpheader text-h5">Channels</span>
        <div
          v-for="(group, index) in displayedGroups"
          :key="index"
          @click="selectGroup(group)"
        >
          <div class="group-item">
            <p style="font-weight: bold;">{{ group.groupName }}</p>
            <div class="recentmesssage">
              <span class="messagesender">
                {{ group.recentMessage[0]?.username ? group.recentMessage[0].username + ' : ' : '' }}
              </span>
              <span class="message">
                {{
                  group.recentMessage[0]?.message?.includes("fs/download") ||
                  group.recentMessage[0]?.message?.includes("ms/download")
                    ? "Media"
                    : group.recentMessage[0]?.message || "No Messages"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel: Chatbox -->
  <div class="col-8 right_group">
    <div class="new_chatcontainer q-pr-xl q-pl-md">
      <div class="background_container q-mt-xl q-px-sm q-pt-lg " >
        <div v-if="groupId" style="overflow-y: hidden; flex-grow: 1;" class="members2">
          <div class="row items-center justify-between" style="width: 100%;">
  <div class="col-2">
    <q-icon name="arrow_back" @click="goBackToGroupList()" class="back-icon" />
  </div>

  <div class="col-8 text-center">
    <span class="grpname">{{ selectedGroup }}</span>
  </div>

 <div class="col-2 text-right">
  <span style="cursor: pointer;" @click="showGroupInfo = true">Group Info</span>
</div>

<q-dialog v-model="showGroupInfo" persistent>
  <q-card style="min-width: 400px; max-height: 80vh; overflow-y: auto;">
    <q-card-section class="row items-center justify-between">
      <div class="text-h6">Group Members</div>
      <q-btn flat icon="close" round dense @click="showGroupInfo = false" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="members members2 q-pt-lg" style="overflow-y: auto; flex-grow: 1;">
        <ul class="member-list">
          <li v-for="member in grpmembers" :key="member.id" class="member-item q-py-sm">
            <i class="avatar"
              :style="{ backgroundColor: getAvatarColor(member.username[0]) }">{{ member.username[0] }}</i>
            <div class="member-info q-ml-sm">
              <div class="member-name">{{ member.username }}</div>
              <span class="status" :style="{ backgroundColor: member.status ? 'green' : 'red' }"></span>
            </div>
          </li>
        </ul>
      </div>
    </q-card-section>
  </q-card>
</q-dialog>
</div>

          <hr />
          <div class="vedichivebox active" ref="chatboxContainer">
            <Chatbox :groupId="groupId" @chatboxReady="scrollToChatbox" />
          </div>
        </div>
        <div v-else class="q-pa-md text-grey text-center">
          <q-icon name="chat_bubble_outline" size="48px" />
          <div class="text-subtitle1 q-mt-md">Select a group to start chatting</div>
        </div>
      </div>
    </div>
  </div>
</div>



</div>
<div class="mobile_view">
  <channel2 />
</div>
</template>

<script>
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { storeToRefs } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '@quasar/extras/material-icons/material-icons.css';
import channel2 from "./channel2.vue";
import Chatbox from 'pages/channel/ChatBox.vue';

export default {
  name: 'ContainerComponent',
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
  components: {
    FinPortlet,
    FinPortletHeader,
    FinPortletHeading,
    FinPortletItem,
    channel2,
    Chatbox
  },
  data() {
    return {
      header: null,
       showGroupInfo: false,
      selectedGroup: null,
      showFolderContents: false,
      folderFiles: [],
      uploadedFile: null,
      filePreviewUrl: "",
      isOpen: false,
      newMessage: "",
      maximizeIcon: "□",
      messages: [],
      grpmembers: null,
      allmembers: [],
      isDragging: false,
      mobileView: 'groupList',
            xOffset: 0,
      yOffset: 0,
      originalWelcomeMessage: "FinChat",
      name: "",
      username: null,
      useremail: null,
      stompClient: null,
      matchingUser: null,
      batchNumber: 1,
      connecting: true,
      groups: [],
      groupId: null,
      cleargroup: null,
      selectedGroupChat: null,
      isWebSocketOpen: false,
      batchMembersInterval: null,
      isconnected: null
    };
  },
  computed: {
    filteredGroups() {
      const userGroupsSet = new Set(
        this.allmembers
          .filter(member => member.username === this.username)
          .map(member => member.groupId)
      );
      return this.groups.filter(group => userGroupsSet.has(group.groupId));
    },

    displayedGroups() {
      return this.userType === 'Admin' ? this.groups : this.filteredGroups;
    },
    batchOptions() {
      return this.groups.map(group => ({
        grpid: group.groupId,
        label: group.groupName
      }));
    }
  },
  watch: {
    selectedGroupChat(newVal) {
      this.cleargroup = newVal
    },
    $route(to, from) {
      // Check if the route has changed from #/channel to something else
      if (to.path !== '/channel') {
        this.isconnected = false
        this.onconnected();
      }
    },
  },
mounted() {
  if (this.$route.path === '/channel') {
    this.getgroupdata();
    this.getUserData();
    this.getallmembers();
    this.getbatchmembers();
this.updateViewForMobile();

  window.addEventListener('resize', this.updateViewForMobile);
    this.batchMembersInterval = setInterval(() => {
      this.getbatchmembers();
    }, 60000);
  }
},
beforeUnmount() {
  window.removeEventListener('resize', this.updateViewForMobile);
},
  methods: {
    async getallmembers() {
      await this.$api.get(`api/channelMembers/allmembers`).then((response) => {
        this.allmembers = response.data.data;
      })
    },
     updateViewForMobile() {
    if (this.$q.screen.lt.md && this.groupId) {
      this.mobileView = 'chat';
    } else {
      this.mobileView = 'groupList';
    }
  },
     scrollToChatbox() {
    this.$refs.chatboxContainer?.scrollIntoView({ behavior: 'smooth' });
  },
    goBackToGroupList() {
  const currentGroupId = this.groupId; // store before clearing

  this.selectedGroup = null;
  this.grpmembers = null;
  this.getgroupdata();

  this.groupId = null; // now clear it
  // console.log("Cleared groupId:", this.groupId);

  this.getbatchmembers(this.groupId); // pass the stored groupId

  this.header = "Channel Members";
},
    async getrecentmessages(id) {
      try {
        const response = await this.$api.get(`/api/recent-message/${id}`);
        if (response && response.data) {
          //console.log(response.data.message)
          return response.data;
        } else {
          return [{ username: null, message: "No messages" }];
        }
      } catch (error) {
        console.error("Error fetching recent message:", error);
        return "Error fetching message";
      }
    },
    selectGroup(group) {
  // First, reset everything
  this.selectedGroup = null;
  this.grpmembers = null;
  this.groupId = null;

  // Wait until DOM/state is fully updated
  this.$nextTick(() => {
    // Now assign the new group
    this.selectedGroup = group.groupName;
    this.groupId = group.groupId;
    this.header = "Group Members";

    // Load the new group's members
    this.getbatchmembers();
  });
},
    async getgroupdata() {
      await this.$api.get(`api/channel-batches/groups`).then(async (response) => {

        if (response.data.success) {
          this.groups = response.data.data;

          for (const group of this.groups) {
            const recentMessage = await this.getrecentmessages(group.groupId);
            group.recentMessage = recentMessage;
          }

          // console.log(this.groups)
        }
      });
    },
    async getUserData() {
      await this.$api.get(`api/users/${this.user.id}`).then((response) => {
        if (response.data.success) {
          const user = response.data.data;
          this.username = user.name;
          this.useremail = user.email
        }

        if (this.$route.path === '/channel') {
          this.isconnected = true
          this.onconnected()
        }

      });
    },
    async getbatchmembers() {
      try {

        if (this.groupId === null) {
          const response = await this.$api.get(`api/channelMembers/allmembers`);
          this.grpmembers = response.data.data
          this.header = "Channel Members"
          // console.log(response.data)
        }
        else {
          const response = await this.$api.get(`api/channelMembers/${this.groupId}`);
          this.grpmembers = response.data.data
        }

      } catch (error) {
        console.error("Error fetching batch members:", error);
      }
    },
    onconnected() {

      const joinMessage = {
        sender: this.username,
        type: "JOIN",
        isActive: this.isconnected
      };

      // console.log(JSON.stringify(joinMessage))

      this.$api.post('api/channel/setstatus', JSON.stringify(joinMessage), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        // console.log(response.data)
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatcontainer = this.$refs.chatscrollContainer;
        chatcontainer.scrollTop = chatcontainer.scrollHeight;
        const mediacontainer = this.$refs.mediascrollContainer;
        mediacontainer.scrollTop = mediacontainer.scrollHeight;
      });
    },
    showImageView(url) {
      const imageView = document.getElementById('imageView');
      const viewImage = document.getElementById('viewImage');

      viewImage.src = url;
      imageView.classList.remove('hidden');
    },
    hideImageView() {
      const imageView = document.getElementById('imageView');
      imageView.classList.add('hidden');
    },
    clearbatchchat() {
      if (this.cleargroup !== null) {
        const group = this.cleargroup

        let confirmed = confirm(`Are you sure to clear ${group.label} Chat ?`)
        if (confirmed) {
          this.$api.delete(`api/clearbatchchat/${group.grpid}`, {
          })
            .then(response => {
              if (response.status === 200) {
                this.showMsg(`${group.label} Chat Cleared`, 'positive')
                this.getAllMessages();
              } else {
                this.showMsg('Failed to clear the chat!', 'negative')
              }
            })
            .catch(error => {
              console.error('Error clearing chat:', error);
            });
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
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
  }
};
</script>
<style>
.messagesender {
  color: rgb(0, 175, 245);
}
.left_group{
  /* border-right: 2px solid #4E5BF8; */
  height: 90vh !important;
  width: 100%;
}
.right_group{
  height: 90vh !important;
  width: 100%;
}
.new_chatcontainer{
  width: 100%;
  height: 100%;
  /* border: 2px solid red; */
  display: flex;
  flex-direction: column;
}
.new_grp_container{
  width: 100%;
  height: 100%;
  /* padding: 1%; */
  /* border: 2px solid black; */
  display: flex;
  flex-direction: column;
}
.background_container {
  background-color: #FFFF;
   border: 1px solid #C9D4FC;
 box-shadow: 0 5px 14px 2px rgba(201, 212, 252, 0.8);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow-y: auto;
  height: calc(90vh - 60px);
  flex-grow: 1;
}

.members2::-webkit-scrollbar {
  width: 12px;
}

.members2::-webkit-scrollbar-track {
  background: #F7F7FC; /* Track color */
  border-radius: 20px;
}

.members2::-webkit-scrollbar-thumb {
  background-color: #4E5BF8; /* Scrollbar color */
  border-radius: 20px;
  border: 2px solid transparent; /* Optional for padding effect */
  background-clip: content-box;
}

.members2::-webkit-scrollbar-thumb:hover {
  background-color: #4E5BF8;
}

.message {
  color: #737373;
}

.back-icon {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.5rem;
}

.grpname {
  text-align: center;
  font-weight: bold;
  color: #647dd7;
  font-size: 1.4rem;
}

.group-list {
  display: flex;
  height: 100%;
  border: 2px solid blue;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}


.group-item {
  padding: 20px;
  cursor: pointer;
  /* background: #f0f0f0; */

  border-bottom: 2px solid #C9D4FC;
  font-size: 1.2rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.group-item:hover {
  background: #F7F7FC;
  border-radius: 5px;
  color: #333;

}

.group-item:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, #647dd7, #3b4ca7); /* Gradient effect */
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


.channel {
  display: flex;
  width: 100%;
}

.grpcontainer {
  margin-top: 40px;
  width: 40vh;
  height: 68vh;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 20px;
}

.grpheader {
  text-align: left;
  color: #647dd7;
  font-weight: bolder;
  padding-left: 10px;
  padding-top: 1% !important;
}

/* Flexbox for horizontal display */
.member-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.member-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}

/* Member info wrapper */
.member-info {
  display: flex;
  justify-content: space-between;
  /* Space between name and status */
  flex-grow: 1;
  /* Allow to take the remaining space */
  align-items: center;
  /* Center align items vertically */
  margin-left: 10px;
  /* Space between avatar and member name */
}

/* Avatar style: Circle with centered initial */
.avatar {
  display: inline-block;
  width: 40px;
  height: 40px;
  font-weight: bold;
  font-style: normal;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}

/* Status indicator */
.status {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid white;
  /* Optional: white border for better visibility */
}

.member-name {
  font-weight: bold;
  font-size: 16px;
  color: black;
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
.header {
  display: flex;
  justify-content: space-between;
  background-color: white;
  /* padding-top: 40px; */
  padding-left: 40px;
  padding-bottom: 2Px;
  color: #7289da;
  width: 110vh;
  flex-direction: row;
}

.header .vedichivebtn,
.header .mybatchbtn {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.header .vedichivebtn.active,
.header .mybatchbtn.active {
  background-color: #7289da;
  /* Active tab color */
  color: white;
  border-radius: 20px;
}

.header .vedichivebtn:hover,
.header .mybatchbtn:hover {
  background-color: #8899d8;
  /* Hover color */
  color: white;
  border-radius: 20px;
}


.mybatchbox,
.mediabox {
  flex-grow: 1;
}
.vedichivebox{
  height: 92% !important;
  flex-grow: 1;
  overflow-y: hidden;
  /* border: 2px solid black; */
}
.mybatchbox.active,
.vedichivebox.active,
.mediabox.active {
  display: block;
}

.container {
  width: 110vh;
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
.mobile_view{
  display: none;
}
@media (max-width: 768px) {
  .mobile_view{
    display: block;
  }
  .web_view{
    display: none;
  }
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
  border-radius: 20px;
  max-height: 550px;
  visibility: visible;
  height: 1000px;
  /* Limit height to enable scrolling */
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
  max-height: 600px;
  visibility: visible;
  height: 1000px;
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
  width: 100%;
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

.chat-container-wrapper {
  /* Space for scrollbar */
  overflow: hidden;
  /* Hide overflow */
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

.User_heading {
  color: #5479F7;
  margin-left: 4%;
}

/* Handle on hover */
.chat-container::-webkit-scrollbar-thumb:hover {
  background: #5479F7;
  /* Darker handle color on hover */
}

/* Other styles remain unchanged */
</style>
