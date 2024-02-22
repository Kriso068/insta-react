import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import AuthPage  from "./pages/AuthPage/AuthPage"
import PageLayout from "./Layouts/PageLayout/PageLayout"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import SavedPosts from "./pages/ProfilePage/SavedPosts"
import LikedPosts from "./pages/ProfilePage/LikedPosts"
import FollowersPage from "./pages/FollowersPage/FollowersPage"
import FollowingsPage from "./pages/FollowingsPage/FollowingsPage"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebase/firebase"
import Chatbox from "./pages/ChatBox/Chatbox"
import MyMessages from "./components/Messages/MyMessages"


function App() {
 
  const [authUser] = useAuthState(auth);
  return (
    <PageLayout>
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/auth" />}/>
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" />}/>
        <Route path='/:username' element={<ProfilePage />}/>
        <Route path='/:username/saves' element={<SavedPosts />}/>
        <Route path='/:username/likes' element={<LikedPosts />}/>
        <Route path='/:username/followers' element={<FollowersPage />}/>
        <Route path='/:username/followings' element={<FollowingsPage />}/>
        <Route path='/:username/messages' element={<MyMessages />}/>
        <Route path='/message/:username/:sender' element={<Chatbox/>}/>
      </Routes>
    </PageLayout>
  )
}

export default App
