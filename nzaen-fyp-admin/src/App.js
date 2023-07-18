import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import firebase from 'firebase'
import { projectAuth, projectFirestore } from './firebase/config'

// styles
import './App.css'
import { useLogout } from './hooks/useLogout'
import { useCollection } from './hooks/useCollection';

// pages & components
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Survey from './pages/survey/Survey'
import Profile from './pages/profile/Profile'
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import UserManage from './pages/usermanage/UserManage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import OnlineUsers from './components/OnlineUsers'

function App() {
  const { authIsReady, user } = useAuthContext()
  const { documents: adminUsers } = useCollection('admins', ['role', '==', 'admin']);
  const { logout } = useLogout();

  const { documents } = useCollection('users');

  useEffect(() => {
    if (user && documents) {
      const isAdmin = documents.some(admin => admin.id === user.uid);
      if (isAdmin) {
        logout();
        console.log("help")
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
              <Route path="/profile">
                {!user && <Redirect to="/login" />}
                {user && <Profile />}
              </Route>
              <Route path="/create">
                {!user && <Redirect to="/login" />}
                {user && <Create />}
              </Route>
              <Route path="/usermanage">
                {!user && <Redirect to="/login" />}
                {user && <UserManage />}
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
          <div className='online-users'>
            {user && <OnlineUsers />}
          </div>


        </BrowserRouter>
      )}
    </div>
  );
}

export default App