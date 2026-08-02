import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageStudents from './pages/ManageStudents';
import ManageMentors from './pages/ManageMentors';
import ManageHods from './pages/ManageHods';
import StudentDashboard from './pages/StudentDashboard';
import CreateRequest from './pages/CreateRequest';
import ApproverDashboard from './pages/ApproverDashboard';
import RequestDetails from './pages/RequestDetails';
import ApprovalLetter from './pages/ApprovalLetter';
import History from './pages/History';
import Settings from './pages/Settings';
import { useThemeStore } from './store/themeStore';

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside DashboardLayout */}
        <Route element={<DashboardLayout />}>
          
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageStudents />} />
            <Route path="/admin/mentors" element={<ManageMentors />} />
            <Route path="/admin/hods" element={<ManageHods />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/create" element={<CreateRequest />} />
            <Route path="/student/requests" element={<StudentDashboard />} />
            <Route path="/student/request/:id" element={<RequestDetails />} />
            <Route path="/student/request/:id/letter" element={<ApprovalLetter />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_MENTOR']} />}>
            <Route path="/mentor" element={<ApproverDashboard role="mentor" />} />
            <Route path="/mentor/pending" element={<ApproverDashboard role="mentor" />} />
            <Route path="/mentor/request/:id" element={<RequestDetails />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_HOD']} />}>
            <Route path="/hod" element={<ApproverDashboard role="hod" />} />
            <Route path="/hod/pending" element={<ApproverDashboard role="hod" />} />
            <Route path="/hod/request/:id" element={<RequestDetails />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_PRINCIPAL']} />}>
            <Route path="/principal" element={<ApproverDashboard role="principal" />} />
            <Route path="/principal/pending" element={<ApproverDashboard role="principal" />} />
            <Route path="/principal/request/:id" element={<RequestDetails />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
