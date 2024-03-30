import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import AnaNavbar from '../components/AnaNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const notifyError = (errorMessage) => {
    toast.error(`Kayıt başarısız: ${errorMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };


  const notify = () => {
    toast(`Kayıt işlemi başarıyla gerçekleştirildi `, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      await setDoc(doc(FIRESTORE_DB, 'users', user.uid), {
        username,
        phoneNumber,
      });
      notify(); // Bildirimi göster
      setTimeout(() => {
        navigate('/ev'); // 5 saniye bekledikten sonra kullanıcıyı giriş sayfasına yönlendir
      }, 2000);
      
    } catch (error) {
      notifyError(error.message);

    }
  };

  const redirectToLogin = () => {
    navigate('/login'); // Kullanıcıyı ana sayfaya yönlendir
  };

  return (
    <div>
                  <ToastContainer />

    <AnaNavbar/>

    <div className="containerLogin" style={{width:"40%"}}>
    <h2 style={{color:'#4a90e2'}}>Register</h2>

      <input
        className="input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Kullanıcı Adı"
      />
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
      />
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
      />
      <input
        className="input"
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Telefon Numarası"
      />
      <button className="button" onClick={signUp}>Kaydol</button>
      <a onClick={redirectToLogin} className="linkText">
      Zaten bir hesabınız var mı? Giriş Yap

</a>
    </div>
    </div>
  );
}
