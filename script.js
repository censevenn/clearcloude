import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7xpDntHKOobPAnsLkx5VMyCCzQbVMGnM",
  authDomain: "clearcloude.firebaseapp.com",
  projectId: "clearcloude",
  storageBucket: "clearcloude.appspot.com",
  messagingSenderId: "441353799530",
  appId: "1:441353799530:web:bc87678c983966c473c713"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Логика кнопки (убедитесь, что у кнопки в HTML есть класс 'google-btn')
document.querySelector('.google-btn').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Пользователь вошел:", result.user.displayName);
      alert("Успешный вход!");
    })
    .catch((error) => {
      console.error("Ошибка входа:", error);
    });
});
