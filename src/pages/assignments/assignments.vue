<template>
  <div class="assignments">
    <div class="row col-12 w-100">
      <!-- Left Container -->
      <div class="col-3 row">
        <h3>Assignment List</h3>
      </div>
      <!-- Right Container -->
      <div class="col-9 row">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Course</th>
              <th>File</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, index) in assignments" :key="assignment.id">
              <td>{{ index + 1 }}</td>
              <td>{{ assignment.assignmentTitle }}</td>
              <td>{{ assignment.assignmentDesc }}</td>
              <td>{{ formatDate(assignment.dueDate) }}</td>
              <td>{{ assignment.course }}</td>
              <td>
                <a :href="assignment.file" target="_blank">Download</a>
              </td>
              <td :class="{ 'done': assignment.status === 'Done', 'pending': assignment.status === 'Pending' }">
                {{ assignment.status }}
              </td>
              <td>
                <!-- Action Menu -->
                <q-btn flat round dense icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="viewAssignment(assignment)">
                        <q-item-section>View</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="editAssignment(assignment)">
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";

export default {
  name: "AssignmentsPage",
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const { setUserType, setSessionToken } = session;
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      token,
      userType,
      setUserType,
      setSessionToken,
      user,
    };
  },
  data() {
    return {
      assignments: [],
    };
  },
  methods: {
    async fetchAssignments() {
      try {
        const response = await this.$api.get("api/batch-assignments/batch/1001");
        if (response.data.success) {
          let assignmentsData = response.data.data;
          const studentId = this.user?.id; // Get user ID from store

          // Fetch status for each assignment in parallel
          const statusPromises = assignmentsData.map(async (assignment) => {
            try {
              const url = `api/student-assignments?studentId=${studentId}&assignmentId=${assignment.id}`;
              const statusResponse = await this.$api.get(url);
              assignment.status = statusResponse.data.data.length > 0 ? "Done" : "Pending";
            } catch (error) {
              console.error(`Error fetching status for assignment ${assignment.id}:`, error);
              assignment.status = "Pending";
            }
          });

          await Promise.all(statusPromises);
          this.assignments = assignmentsData;
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    },
    viewAssignment(assignment) {
      console.log("Viewing assignment:", assignment);
      // Implement the view logic later
    },
    editAssignment(assignment) {
      console.log("Editing assignment:", assignment);
      // Implement the edit logic later
    }
  },
  mounted() {
    this.fetchAssignments();
  },
};
</script>

<style scoped>
.assignments {
  text-align: center;
  padding: 20px;
  background-color: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
}

.done {
  color: green;
  font-weight: bold;
}

.pending {
  color: red;
  font-weight: bold;
}
</style>
