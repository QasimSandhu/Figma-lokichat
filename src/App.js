import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signin from './components/Authentication/Login/index';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Signup from './components/Authentication/Signup/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ForgotPassword from './components/Authentication/ForgotPassword/index';
import NewPassword from './components/Authentication/ForgotPassword/NewPassword';
import ConfirmOPT from './components/Authentication/OTP/index';
import Chat from './components/Dashboard/Chat/index';
import AudioLibrary from './components/Dashboard/AudioLibrary';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Signup />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/forgot_password' element={<ForgotPassword />} />
                <Route path='/confirm_otp' element={<ConfirmOPT />} />
                <Route path='/confirm_new_password' element={<NewPassword />} />
                <Route path='/chat' element={<Chat />} />
                <Route path='/audio-library' element={<AudioLibrary />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
