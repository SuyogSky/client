import logo from './logo.svg';
import './App.css';
import Register from './components/UserAuth/Register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/UserAuth/Login/Login';
import Landing from './components/Landing/Landing';
import AddWaste from './components/WasteProduct/Add/AddWaste';
import ViewWastes from './components/WasteProduct/View/ViewWaste';
import SingleWaste from './components/WasteProduct/SingleWaste/SingleWaste';
import AddRecycle from './components/RecycledProduct/Add/AddRecycle';

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
        <Route path="/add-recycle" element={<AddRecycle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
