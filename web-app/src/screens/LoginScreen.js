import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import AnaNavbar from '../components/AnaNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notifyError = (errorMessage) => {
    toast.error(`Giriş başarısız: ${errorMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      navigate('/ev'); // Başarılı giriş sonrası yönlendirme
    } catch (error) {
      notifyError(error.message);
    }
  };

  const redirectToRegister = () => {
    navigate('/register'); // Kullanıcıyı '/register' yoluna yönlendir
  };

  return (
    <div className="Ana" >
            <ToastContainer />

<AnaNavbar/>

    <div className="containerLogin">
    <h2 style={{color:'#4a90e2'}}>Login</h2>
      <input
        type="email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
      />
      <input
        type="password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
      />
      <button className="button" onClick={handleLogin}>Giriş Yap</button>
      <a onClick={redirectToRegister} className="linkText">
      Hesabiniz yok mu? Kaydolun

</a>
    </div>
    </div>

  );
  
}
