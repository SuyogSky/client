import './App.css';
import Register from './components/UserAuth/Register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/UserAuth/Login/Login';
import Landing from './components/Landing/Landing';
import AddWaste from './components/WasteProduct/Add/AddWaste';
import ViewWastes from './components/WasteProduct/View/ViewWaste';
import SingleWaste from './components/WasteProduct/SingleWaste/SingleWaste';
import AddRecycle from './components/RecycledProduct/Add/AddRecycle';
import ViewRecycle from './components/RecycledProduct/View/ViewRecycle';
import SingleRecycle from './components/RecycledProduct/SingleRecycle/SingleRecycle';
import Posts from './components/Posts/Posts';
import Profile from './components/Profile/Profile';
import MyPosts from './components/Profile/MyPosts/MyPosts';
import EventDetails from './components/EventDetails/EventDetails';
import AddedProducts from './components/Profile/AddedProducts/AddedProducts';
import Comments from './components/Posts/Comments/Comments';
import Chat from './components/Chat/Chat';
import ViewMultipleWasteMap from './components/WasteProduct/MultipleWastesMap/ViewMultipleWasteMap'
import Journal from './components/Journal/Journal'

function App() {
  const token = sessionStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={token ? <Landing /> : <Register />} />
        <Route path="/login" element={token ? <Landing /> : <Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/add-waste" element={<AddWaste />} />
        <Route path="/view-waste" element={<ViewWastes />} />
        <Route path="/details/:itemId" element={<SingleWaste />} />
        <Route path="/map" element={<ViewMultipleWasteMap />} />
        <Route path="/add-recycle" element={<AddRecycle />} />
        <Route path="/view-recycle" element={<ViewRecycle />} />
        <Route path="/recycleDetails/:itemId" element={<SingleRecycle />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/added-products" element={<AddedProducts />} />
        
        <Route path="/posts" element={<Posts />} />
        <Route path="/comments/:postId" element={<Comments />} />
        <Route path="/events" element={<EventDetails />} />

        <Route path="/chat/:userId" element={<Chat />} />

        <Route path="/journal" element={<Journal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
