
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/',
    meta: { title: 'Reading Pages', module: 'reading' },
    component: () => import('layouts/DashboardLayout.vue'),
    props:{
        showDrawer: false,
    },
    children: [
      {
        path: 'watch-video',
        component: () => import('components/WatchVideo.vue'),
        meta: { item: '' }
      },
      {
        path: 'read-pdf',
        component: () => import('components/ReadPdf.vue'),
        meta: { item: '' }
      },
      {
        path: 'watch-ppt',
        component: () => import('components/WatchPPT.vue'),
        meta: { item: '' }
      },
    ]
  },
  {
    path: '/login',
    meta: { title: 'landing', module: 'login' },
    component: () => import('layouts/LandingLayout.vue'),
  },
    {
    path: '/signup',
    meta: { title: 'landing', module: 'login' },
    component: () => import('layouts/LandingLayout.vue'),
  },
{
  path: '/course/:id',
  component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'CourseDetail',
        component: () => import('layouts/home/CourseDetail.vue'),
        meta: { title: 'Course Detail', module: 'course' }
      }

    ]
},



  {
    path: '/labs',
    meta: { title: 'Labs', module: 'labs' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/labs/lab.vue'),
        meta: { item: '' }
      },
      // {
      //   path: '',
      //   component: () => import('pages/labs/Index.vue'),
      //   meta: { item: '' }
      // },
      {
        path: 'reports',
        component: () => import('pages/reports/Index.vue'),
        meta: { item: '' }
      },
    ]
  },

  {
    path: '/homeProfile',
    meta: { title: 'Home', module: 'home' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/home/home.vue'),
        meta: { item: '' }
      },
    ]
  },


  {
    path: '/library',
    meta: { title: 'Library', module: 'library' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/libraries/Books.vue'),
        meta: { item: 'books' }
      },
      {
        path: 'books',
        component: () => import('pages/libraries/Books.vue'),
        meta: { item: 'books' }
      },
      {
        path: 'videos',
        component: () => import('pages/libraries/Videos.vue'),
        meta: { item: 'videos' }
      },
      {
        path: 'presentations',
        component: () => import('pages/libraries/Presentations.vue'),
        meta: { item: 'presentations' }
      },
      {
        path: 'assignment',
        component: () => import('pages/libraries/Assignments.vue'),
        meta: { item: 'assignment' }
      },
      {
        path: 'assignments/submit',
        component: () => import('src/pages/assignments/SubmitAssignments.vue'),
        meta: { items: 'submit' }
      },
      {
        path: 'elearning',
        component: () => import('pages/libraries/ElearningCourses.vue'),
        meta: { item: 'elearning' }
      },

    ]
  },
  {
    path: '/reports',
    meta: { title: 'Reports', module: 'reports' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/reports/Index.vue'),
        meta: { item: '' }
      }
    ]
  },
  {
    path: '/assignment',
    meta: { title: 'Assignment', module: 'assignment' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/assignments/assignments.vue'),
        meta: { item: '' }
      }
    ]
  },

  {
    path: '/hackathon',
    meta: { title: 'Hackathon', module: 'Hackathon' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/hackathon/Hackathons.vue'),
        meta: { item: '' }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'home-default',
        component: () => import('layouts/home/Individual.vue'),
        meta: { title: 'Individuals', module: 'home' }
      },
      {
        path: 'corporates',
        name: 'corporates',
        component: () => import('layouts/home/Corporates.vue'),
        meta: { title: 'Corporates', module: 'home' }
      },
      {
        path: 'colleges',
        name: 'coe',
        component: () => import('layouts/home/Coe.vue'),
        meta: { title: 'Colleges', module: 'home' }
      },
      {
        path: 'certificateValidation',
        name: 'certificate-validation',
        component: () => import('layouts/home/CertificateOtpForm.vue'),
        meta: { title: 'Certificate Validation', module: 'certificateValidation' }
      }
    ]
  },

  // Route at `/home` to always show `Individual.vue`
  {
    path: '/home',
    component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'home-landing',
        component: () => import('layouts/home/Individual.vue'),
        meta: { title: 'Home', module: 'home' }
      }
    ]
  },

  {
    path: '/register',
    component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('layouts/home/RegistrationForm.vue'),
        meta: { title: 'Register', module: 'register' }
      }
    ]
  },
  {
    path: '/allCourses',
    component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'all-courses',
        component: () => import('layouts/home/ViewAllCourse.vue'),
        meta: { title: 'All Courses', module: 'allCourses' }
      }
    ]
  },
  {
    path: "/finassociate",
     component: () => import('layouts/home/HomePage.vue'),
    children: [
      {
        path: '',
        name: 'finassociate',
        component: () => import("src/layouts/home/FinAssociate.vue") ,// Adjust path if necessary
        meta: { title: 'Fin Associate', module: 'finassociate' }
      }

    ]


  },


  // {
  //   path: 'assignment',
  //   component: () => import('pages/libraries/Assignments.vue'),
  //   meta: { item: 'assignment' }
  // },
  // {
  //   path: 'assignments/submit',
  //   component: () => import('pages/libraries/SubmitAssignments.vue'),
  //   meta: { items: 'submit' }
  // },

  {
    path: '/elearning',
    meta: { title: 'E-Learning', module: 'elearning' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/libraries/ElearningCourses.vue'),
        meta: { item: '' }
      }
    ]
  },

  {
    path: '/help',
    meta: { title: 'Help', module: 'help' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [

      {
        path: '',
        component: () => import('pages/help/Faq.vue'),
        meta: { item: '' }
      }
    ]
  },

  {
    path: '/class-room',
    meta: { title: 'class-room', module: 'class-room' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [

      {
        path: '',
        component: () => import('pages/libraries/CalenderEvents.vue'),
        meta: { item: '' }
      }
    ]
  },

  {
    path: '/program',
    meta: { title: 'Program', module: 'program' },

    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/program/program.vue'),
        meta: { item: '' },
      },
      {
        path: ':id',
        name: 'ProgramDetails',
        component: () => import('pages/program/CourseDetails.vue'),
        meta: { title: 'Course Details', item: '' },
},
      {
        path: ':courseId/category/:categoryId',
        name: 'CategoryDetails',
        component: () => import('pages/program/CategoryDetails.vue'),
        meta: { title: 'Category Details', item: '' },

 },
    ],
  },
  {
    path: '/courses',
    meta: { title: 'Course', module: 'course' },

    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: ':id',
        component: () => import('pages/courses/courses.vue'),
        meta: { item: '' },
      },
      {
        path: '',
        name: 'AllCourses',
        component: () => import('pages/courses/AllCourses.vue'),
        meta: { item: '' },
      },

    ],
  },
  {
    path: '/channel',
    meta: { title: 'Channel', module: 'channel' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [

      {
        path: '',
        component: () => import('src/pages/channel/Channel.vue'),
        meta: { item: '' }
      }
    ]
  },
  {
    path: '/profile',
    meta: { title: 'profile', module: 'profile' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Profile.vue'),
        meta: { item: '' }
      },

    ]
  },
  {
    path: '/Studentprofile',
    meta: { title: 'Student profile', module: 'Student profile' },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/StudentProfiles/StudentProfile.vue'),
        meta: { item: '' }
      },

    ]
  },

  {
    path: '/Home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/home',
    component: () => import('src/pages/home/profileCard.vue')
  },


]


export default routes
