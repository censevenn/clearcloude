// Импорт библиотек
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

// Единая логика для кнопки
window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then((result) => alert("Успешно: " + result.user.displayName))
                .catch((err) => {
                    console.error("Ошибка Firebase:", err);
                    alert("Ошибка входа: " + err.message);
                });
        });
    } else {
        console.error("Кнопка .google-btn не найдена! Проверьте HTML.");
    }
});
