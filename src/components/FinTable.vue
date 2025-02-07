<template>
  <div class="full-width fin-table shadow-6 fin-br-8" :class="{ singleData: data.length == 1 }" style="max-height:40vh">
    <table class="table full-width rounded-borders" borders="0">
      <thead style="white-space: nowrap;">
        <tr>
          <th style="width: 50px" v-if="allowSelect"><q-checkbox v-model="allSelect" :val="data" dark /></th>
          <th v-for="(column, j) in columns" :key="column" :style="{ 'text-align': column.align }"
            class="vertical-middle">
            {{ column.label }}
          </th>
          <th v-if="showActions"></th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr class="radius-10">
          <td :colspan="columns.length + 1" class=" radius-10 text-italic">
            <div style="min-height: 250px" class="q-pa-lg text-center row justify-center items-center">
              <q-spinner-ios size="lg" color="black" />
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="!loading && data.length">
        <tr v-for="(item, i) in data">
          <td v-if="allowSelect"><q-checkbox color="cyan" v-model="selectedItemsData" :val="item" /></td>
          <td v-for="(column, j) in columns" :key="column"
            :style="{ 'text-align': column.align, 'min-width': column.width }" class="vertical-middle"
            style="padding-top:10px;padding-bottom: 10px;">
            <span v-if="column.type === 'image'">
              <q-avatar size="40px" class="shadow-1">
                <img :src="item[column.key]" class="fit">
              </q-avatar>
            </span>
            <span v-else>
              {{ item[column.key] }}
            </span>
          </td>
          <td class="text-right" v-if="showActions">
            <q-icon name="more_vert" class="bg- q-px-sm cursor-pointer" size="sm">
              <q-menu style="width:150px;background: transparent!important;" class="shadow-0">
                <div style="background-color: #EAEAEA;opacity:0.99" class="fin-br-8 q-mt-sm">
                  <div class="absolute-top-right" style="margin-top: -19px">
                    <q-icon name="arrow_drop_up" size="xl" style="color: #EAEAEA"></q-icon>
                  </div>
                  <div class="q-py-sm text-weight-bolder">
                    <q-list>

                      <q-item clickable v-close-popup @click="showChaptersList(item)" v-if="showChapters">
                        <q-item-section>
                          <q-item-label>View</q-item-label>
                        </q-item-section>
                      </q-item>
                      <div class="justify-center flex" v-if="showChapters">
                        <q-separator style="width: 70%" />
                      </div>
                      <q-item clickable v-close-popup @click="editItem(item)">
                        <q-item-section>
                          <q-item-label>Edit</q-item-label>
                        </q-item-section>
                      </q-item>
                      <div class="justify-center flex" v-if="allowDelete">
                        <q-separator style="width: 70%" />
                      </div>
                      <q-item clickable v-close-popup @click="deleteItem(item)" v-if="allowDelete">
                        <q-item-section>
                          <q-item-label>Delete</q-item-label>
                        </q-item-section>
                      </q-item>
                
                <q-item clickable @click="handleViewFile(item)" v-if="allowViewFile">
                  <q-item-section>View File</q-item-section>
                </q-item>
                      <q-item clickable v-close-popup @click="deleteCourseItem(item)" v-if="allowCourseDelete">
                        <q-item-section>
                          <q-item-label>Delete</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteEnrollmentItem(item)" v-if="allowEnrollmentDelete">
                        <q-item-section>
                          <q-item-label>Delete Enroll</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteGroupItem(item)" v-if="allowBatchDelete">
                        <q-item-section>
                          <q-item-label>Delete Group</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deletehacakthon(item)" v-if="allowHackathonDelete">
                        <q-item-section>
                          <q-item-label>Delete</q-item-label>
                        </q-item-section>
                      </q-item>
                       <q-item clickable v-close-popup @click="deleteTopicItem(item)" v-if="allowTopicDelete">
                        <q-item-section>
                          <q-item-label>Delete Topic</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteGroupMember(item)" v-if="allowMemberDelete">
                        <q-item-section>
                          <q-item-label>Delete Member</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteCategory(item)" v-if="allowCategoryDelete">
                        <q-item-section>
                          <q-item-label>Delete Category</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteSubCategory(item)" v-if="allowSubCategoryDelete">
                        <q-item-section>
                          <q-item-label>Delete</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteProgram(item)" v-if="allowProgramDelete">
                        <q-item-section>
                          <q-item-label>Delete Program</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>

              </q-menu>
            </q-icon>
          </td>
        </tr>
      </tbody>
      <tbody v-if="!loading && !data.length" class="radius-10">
        <tr class="radius-10">
          <td :colspan="columns.length + 1" class=" radius-10 text-italic">
            <div style="min-height: 250px" class="q-pa-lg">
              No Data Found
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function () { return []; }
    },
    data: {
      type: Array,
      default: function () { return []; }
    },
    allowSelect: {
      type: Boolean,
      default: false,
    },
    deleteUrl: {
      type: String,
      default: null,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    showChapters: {
      type: Boolean,
      default: false
    },
    allowDelete: {
      type: Boolean,
      default: false
    },
    allowCourseDelete:{
      type: Boolean,
      default: false,
    },

    allowProgramDelete:{
      type: Boolean,
      default: false,
    },

    allowHackathonDelete:{
      type: Boolean,
      default: false,
    },
    allowViewFile:{
      type: Boolean,
      default: false,
    },
    allowEnrollmentDelete:{
      type: Boolean,
      default: false,
    },
    allowBatchDelete:{
      type: Boolean,
      default: false,
    },
    allowTopicDelete:{
      type: Boolean,
      default: false,
    },
    allowMemberDelete:{
      type: Boolean,
      default: false,
    },
    allowCategoryDelete :{
      type: Boolean,
      default: false,
    },
    allowSubCategoryDelete :{
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      allSelect: [],
      selectedItem: [],
      selectedItemsData: [],
    }
  },
  watch: {
    allSelect() {
      this.selectedItemsData = this.allSelect.length ? this.allSelect[0] : [];
    }
  },
  methods: {
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
    editItem(item) {
      this.$emit('editFun', item);
    },
    deleteItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
          if (response.data.success) {
            this.showMsg('File Deleted Successfully', 'positive');
            this.$emit('reCall');
          } else {
            this.this.showMsg(response?.data.message, 'negative');
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    handleViewFile(item) {
  // Log the file URL to the console
  console.log('File URL:', item.fileUrl);

  // Handle view file logic based on the file type
},
deleteProgram(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete Program ${item.heading}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.programId).then(response => {
          if (response.data.success) {
            this.showMsg("Program Deleted Successfully", 'positive');
            this.$emit('reCall');
          } else {
            this.showMsg("Failed To Delete Program", 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    deleteCourseItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.name}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.courseid).then(response => {
          if (response.data.success) {
            this.showMsg(response.data.message, 'positive');
            this.$emit('reCall');
          } else {
            this.showMsg(response?.data.message, 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    deleteTopicItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.topicName}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.courseId + "/topic/" + item.topicId).then(response => {
          if (response.data.success) {
            this.showMsg(response.data.message, 'positive');
            this.$emit('reCall');
          } else {
            this.showMsg(response?.data.message, 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    deleteEnrollmentItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.username}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/student/' + item.studentId).then(response => {
          if (response.data.success) {
            this.showMsg(response.data.message, 'positive');
            this.$emit('reCall');
          } else {
            this.showMsg(response?.data.message, 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
// <<<<<<< HEAD
    deleteCategory(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.categoryName}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
      },
      ok: {
          label: 'Yes',
          color: 'red',
      },
    }).onOk(() => {
      this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
        if (response.status===204) {
          this.showMsg("Category Deleted Successfully", 'positive');
          this.$emit('reCall');
        } else {
          this.showMsg(response?.data.message, 'negative');
         
        }
      }).catch(error => {
        this.showMsg(error.response?.data.message || error.message, 'negative');
      });
    });
  },
  deleteSubCategory(item) {
    this.$q.dialog({
      title: 'Confirm',
      message: `Are You sure want to delete ${item.subCategoryName}`,
      persistent: true,
      cancel: {
        label: 'No',
        color: 'black',
        flat: true
      },
      ok: {
        label: 'Yes',
        color: 'red',
      },
    }).onOk(() => {
      this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
        if (response.status===204) {
          this.showMsg("Sub Category Deleted Successfully", 'positive');
          this.$emit('reCall');
        } else {
          this.showMsg(response?.data.message, 'negative');
         
        }
      }).catch(error => {
        this.showMsg(error.response?.data.message || error.message, 'negative');
      });
    });
  },
  deletehacakthon(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.heading}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
          if (response.data.success) {
            this.showMsg("Hackathon Deleted Successfully", 'positive');
            this.$emit('reCall');

          } else {
            this.showMsg(response?.data.message, 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
// =======
//     deletehacakthon(item) {
//       this.$q.dialog({
//         title: 'Confirm',
//         message: `Are You sure want to delete ${item.heading}`,
// >>>>>>> prod_in_domain
//         persistent: true,
//         cancel: {
//           label: 'No',
//           color: 'black',
//           flat: true
//         },
//         ok: {
//           label: 'Yes',
//           color: 'red',
//         },
//       }).onOk(() => {
//         this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
// <<<<<<< HEAD
//          // console.log(response)
//           if (response.status===204) {
//             this.showMsg("Category Deleted Successfully", 'positive');
//             this.$emit('reCall');
//           } else {
//             this.showMsg(response?.data.message, 'negative');
           
//           }
//         }).catch(error => {
//           this.showMsg(error.response?.data.message || error.message, 'negative');
//         });
//       });
//     },
//     deleteSubCategory(item) {
//       this.$q.dialog({
//         title: 'Confirm',
//         message: `Are You sure want to delete ${item.subCategoryName}`,
//         persistent: true,
//         cancel: {
//           label: 'No',
//           color: 'black',
//           flat: true
//         },
//         ok: {
//           label: 'Yes',
//           color: 'red',
//         },
//       }).onOk(() => {
//         this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
//          // console.log(response)
//           if (response.status===204) {
//             this.showMsg("Sub Category Deleted Successfully", 'positive');
//             this.$emit('reCall');
// =======
//           if (response.data.success) {
//             this.showMsg("Hackathon Deleted Successfully", 'positive');
//             this.$emit('reCall');

// >>>>>>> prod_in_domain
//           } else {
//             this.showMsg(response?.data.message, 'negative');
           
//           }
//         }).catch(error => {
//           this.showMsg(error.response?.data.message || error.message, 'negative');
//         });
//       });
//     },

    deleteGroupItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.groupName}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.groupId).then(response => {
          if (response.data.success) {
            this.$api.delete(`api/clearbatchchat/${item.groupId}`);
            this.$api.delete(`api/channelMembers/group/${item.groupId}`);
            this.showMsg("Group Deleted Successfully", 'positive');
            this.$emit('reCall');

          } else {
            this.showMsg(response?.data.message, 'negative');
           
          }
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    showChaptersList(item) {
      this.$emit('show-chapters', item)
    },
    deleteGroupMember(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are You sure want to delete ${item.username}`,
        persistent: true,
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
        },
      }).onOk(() => {
        this.$api.delete(this.deleteUrl + '/' + item.id).then(response => {
          if (response) {
            this.showMsg("Group Member Deleted Successfully", 'positive');
            this.$emit('reCall');
          } 
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      });
    },
    showChaptersList(item) {
      this.$emit('show-chapters', item)
    }
  }
}
</script>
<style>
.fin-table {
  min-height: 400px;
  background-color: #FFFF;
  
  /* scrollbar-width: thin; */
  scrollbar-color: blue transparent;
}
.table-scroll{
  
  border-top-left-radius: 15px;
border-top-right-radius: 10px;
border-bottom-left-radius: 15px;
border-bottom-right-radius: 10px;
}
.table-scroll::-webkit-scrollbar {
  width: 8px;
}
.table-scroll::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #5479F7 0px, #5479F7 10.2%, #E7F0FF 40px); 
  border-top-left-radius: 0px;
  border-top-right-radius: 15px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 15px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color: #5479F7;
  /* padding-top:10px; */
  border-top-left-radius: 0px;
border-top-right-radius: 30px;
border-bottom-left-radius: 0px;
border-bottom-right-radius: 30px;
}

.fin-table .table thead {
  position: sticky !important;
  top: 0;
  z-index:2;
}

.table {
  --bs-table-bg: transparent;
  --bs-table-accent-bg: transparent;
  --bs-table-striped-color: #212529;
  --bs-table-striped-bg: rgba(0, 0, 0, 0.05);
  --bs-table-active-color: #212529;
  --bs-table-active-bg: rgba(0, 0, 0, 0.1);
  --bs-table-hover-color: #212529;
  --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
  width: 100%;
  color: #212529;
  vertical-align: top;
  border-color: #dee2e6;
}

table {
  caption-side: bottom;
  border-collapse: collapse;
}

.table thead {
  overflow: hidden;
  
}

.table>thead {
  vertical-align: bottom;
}

thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  border-radius:0px;
}

thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
  padding-top: 6px;
  padding-bottom: 6px;

}

.table>tbody {
  vertical-align: inherit;
}

tbody,
td,
tfoot,
th,
thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  padding: 10px;
}

td {
  padding: 5px
}

*,
::after,
::before {
  box-sizing: border-box;
}

tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  background-color: #FFFF;
}

.table thead {
  background-color: #5479F7;
  color: #ffffff;
}

.table thead tr th:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.table thead tr th:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.singleData .table tbody tr:first-child td:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}
.table tbody tr:nth-child(even) {
  background-color: #E7F0FF; /* Alternate row background color */
}

.singleData .table tbody tr:first-child td:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.table tbody tr:last-child td:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.table tbody tr:last-child td:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.radius-10 {
  border-radius: 0px !important;
}
</style>
