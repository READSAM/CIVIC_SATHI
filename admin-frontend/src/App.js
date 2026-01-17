// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./lib/firebaseconfig";

// // Component Imports
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';

// // Page Imports
// import DashboardPage from './pages/DashboardPage';
// import IssuesPage from './pages/IssuesPage';
// import IssueDetailsPage from './pages/IssueDetailsPage';
// import MapPage from './pages/MapPage';
// import DepartmentsPage from './pages/DepartmentPage';
// import AnalyticsPage from './pages/AnalyticsPage';
// import ProfilePage from './pages/ProfilePage';
// import ProfilePage from './pages/SettingsPage';

// // Styles
// import './styles.css';

// function App() {
//   const AppContent = () => {
//     const navigate = useNavigate();
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [newIssueCount, setNewIssueCount] = useState(0);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//       const handleResize = () => {
//         const mobile = window.innerWidth < 992;
//         setIsMobile(mobile);
//         if (!mobile) {
//           setSidebarOpen(true);
//         } else {
//           setSidebarOpen(false);
//         }
//       };
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//       const q = query(collection(db, "reports"), where("status", "==", "pending"));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const lastViewed = localStorage.getItem('lastViewedNotifications');
//         const lastViewedTimestamp = lastViewed ? new Date(parseInt(lastViewed)) : new Date(0);
//         const newIssues = querySnapshot.docs.filter(doc => {
//           const createdAtDate = doc.data().createdAt?.toDate();
//           return createdAtDate && createdAtDate > lastViewedTimestamp;
//         });
//         setNewIssueCount(newIssues.length);
//       });
//       return () => unsubscribe();
//     }, []);

//     const toggleSidebar = () => {
//       if (isMobile) {
//         setSidebarOpen(!sidebarOpen);
//       }
//     };
    
//     const handleNotificationClick = () => {
//       localStorage.setItem('lastViewedNotifications', Date.now().toString());
//       setNewIssueCount(0);
//       navigate('/issues');
//     };

//     const isCollapsed = isMobile ? !sidebarOpen : false;

//     return (
//       <div className="d-flex vh-100 vw-100">
//         <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        
//         <div className="main-content-wrapper flex-grow-1 d-flex flex-column">
//           <Header 
//             toggleSidebar={toggleSidebar} 
//             isSidebarOpen={sidebarOpen} 
//             newIssueCount={newIssueCount}
//             onNotificationClick={handleNotificationClick}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
//           <main className="flex-grow-1 dashboard-container">
//             <Routes>
//               <Route path="/" element={<DashboardPage />} />
//               <Route path="/issues" element={<IssuesPage searchTerm={searchTerm} />} />
//               <Route path="/issue/:id" element={<IssueDetailsPage />} />
//               <Route path="/map" element={<MapPage />} />
//               <Route path="/departments" element={<DepartmentsPage />} />
//               <Route path="/analytics" element={<AnalyticsPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     );
//   };
 
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebaseconfig";

// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Page Imports
import DashboardPage from './pages/DashboardPage';
import IssuesPage from './pages/IssuesPage';
import IssueDetailsPage from './pages/IssueDetailsPage';
import MapPage from './pages/MapPage';
import DepartmentsPage from './pages/DepartmentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage'; 

// Styles
import './styles.css';

function App() {
  const AppContent = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newIssueCount, setNewIssueCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 992;
        setIsMobile(mobile);
        if (!mobile) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const q = query(collection(db, "reports"), where("status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lastViewed = localStorage.getItem('lastViewedNotifications');
        const lastViewedTimestamp = lastViewed ? new Date(parseInt(lastViewed)) : new Date(0);
        const newIssues = querySnapshot.docs.filter(doc => {
          const createdAtDate = doc.data().createdAt?.toDate();
          return createdAtDate && createdAtDate > lastViewedTimestamp;
        });
        setNewIssueCount(newIssues.length);
      });
      return () => unsubscribe();
    }, []);

    const toggleSidebar = () => {
      if (isMobile) {
        setSidebarOpen(!sidebarOpen);
      }
    };
    
    const handleNotificationClick = () => {
      localStorage.setItem('lastViewedNotifications', Date.now().toString());
      setNewIssueCount(0);
      navigate('/issues');
    };

    const isCollapsed = isMobile ? !sidebarOpen : false;

    return (
      <div className="d-flex vh-100 vw-100">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        
        <div className="main-content-wrapper flex-grow-1 d-flex flex-column">
          <Header 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={sidebarOpen} 
            newIssueCount={newIssueCount}
            onNotificationClick={handleNotificationClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <main className="flex-grow-1 dashboard-container">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/issues" element={<IssuesPage searchTerm={searchTerm} />} />
              <Route path="/issue/:id" element={<IssueDetailsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} /> 
            </Routes>
          </main>
        </div>
      </div>
    );
  };
 
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
