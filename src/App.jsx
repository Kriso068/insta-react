import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import AuthPage  from "./pages/AuthPage/AuthPage"
import PageLayout from "./Layouts/PageLayout/PageLayout"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import SavedPosts from "./pages/ProfilePage/SavedPosts"
import LikedPosts from "./pages/ProfilePage/LikedPosts"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebase/firebase"


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
      </Routes>
    </PageLayout>
  )
}

export default App
