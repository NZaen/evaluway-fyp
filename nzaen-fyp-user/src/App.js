import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCollection } from './hooks/useCollection';
import { useLogout } from './hooks/useLogout';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Survey from './pages/survey/Survey';
import Profile from './pages/profile/Profile';
import Feedback from './pages/feedback/Feedback';
import SurveyHistory from './pages/surveyhistory/SurveyHistory';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { authIsReady, user } = useAuthContext();
  const { documents: adminUsers } = useCollection('admins', ['role', '==', 'admin']);
  const { logout } = useLogout();

  const { documents } = useCollection('admins');

  useEffect(() => {
    if (user && documents) {
      const isAdmin = documents.some(admin => admin.id === user.uid);
      if (isAdmin) {
        logout();
      }
    }
  }, [user, documents, logout]);


  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Switch>
              <Route exact path="/">
                {!user && <Redirect to="/login" />}
                {user && <Dashboard />}
              </Route>
              <Route exact path="/surveyhistory">
                {!user && <Redirect to="/login" />}
                {user && <SurveyHistory />}
              </Route>
              <Route exact path="/feedback">
                {!user && <Redirect to="/login" />}
                {user && <Feedback />}
              </Route>
              <Route path="/profile">
                {!user && <Redirect to="/login" />}
                {user && <Profile />}
              </Route>
              <Route path="/surveys/:id">
                {!user && <Redirect to="/login" />}
                {user && <Survey />}
              </Route>
              <Route path="/login">
                {user && <Redirect to="/" />}
                {!user && <Login />}
              </Route>
              <Route path="/signup">
                {user && user.displayName && <Redirect to="/" />}
                {!user && <Signup />}
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
