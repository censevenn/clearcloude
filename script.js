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
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    // Добавляем Storage
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

    const firebaseConfig = {
        // ТВОЙ КОНФИГ ЗДЕСЬ
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    const provider = new GoogleAuthProvider();

    let currentUser = null;

    // Следим за входом пользователя
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            console.log("Готов к загрузке для:", user.displayName);
        }
    });

    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');

    // 1. При клике на красивую кнопку — имитируем клик по скрытому инпуту
    uploadBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Сначала подключите Google!");
            return;
        }
        fileInput.click();
    });

    // 2. Когда файл выбран — начинаем загрузку
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Создаем путь: users / ID-пользователя / имя-файла
        const storageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadBtn.innerText = "Загрузка...";
        uploadBtn.disabled = true;

        uploadTask.on('state_changed', 
            null, 
            (error) => {
                console.error("Ошибка:", error);
                alert("Ошибка загрузки: " + error.message);
                uploadBtn.innerText = "Загрузить медиа";
                uploadBtn.disabled = false;
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('Файл доступен по адресу:', downloadURL);
                    alert("Файл успешно загружен!");
                    uploadBtn.innerText = "Загрузить медиа";
                    uploadBtn.disabled = false;
                });
            }
        );
    });
</script>
