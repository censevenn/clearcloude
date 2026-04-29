<script type="module">
    // 1. Импорт всех необходимых модулей Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

    // 2. Ваша конфигурация
    const firebaseConfig = {
        apiKey: "AIzaSyB7xpDntHKOobPAnsLkx5VMyCCzQbVMGnM",
        authDomain: "clearcloude.firebaseapp.com",
        projectId: "clearcloude",
        storageBucket: "clearcloude.appspot.com",
        messagingSenderId: "441353799530",
        appId: "1:441353799530:web:bc87678c983966c473c713"
    };

    // 3. Инициализация сервисов
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    const provider = new GoogleAuthProvider();

    // Переменная для хранения данных текущего пользователя
    let currentUser = null;

    // 4. Поиск элементов интерфейса
    const googleBtn = document.querySelector('.google-btn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');

    // 5. Отслеживание состояния авторизации
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            console.log("Пользователь вошел:", user.displayName);
            // Меняем текст кнопки, чтобы показать, что вход выполнен
            if (googleBtn) googleBtn.innerText = `Аккаунт: ${user.displayName.split(' ')[0]}`;
        } else {
            console.log("Пользователь не авторизован");
            if (googleBtn) googleBtn.innerText = "Подключить Google";
        }
    });

    // 6. Логика авторизации через Google
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("Успешный вход!");
                })
                .catch((err) => {
                    console.error("Ошибка Firebase Auth:", err);
                    alert("Ошибка входа: " + err.message);
                });
        });
    }

    // 7. Логика выбора и загрузки файла
    if (uploadBtn && fileInput) {
        // Клик по визуальной кнопке открывает скрытое окно выбора файла
        uploadBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert("Пожалуйста, сначала подключите Google, чтобы иметь доступ к личному облаку.");
                return;
            }
            fileInput.click();
        });

        // Обработка самого процесса загрузки
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file || !currentUser) return;

            // Путь в Storage: users/ID_ПОЛЬЗОВАТЕЛЯ/ИМЯ_ФАЙЛА
            const storageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Визуальная индикация начала загрузки
            uploadBtn.innerText = "Загрузка...";
            uploadBtn.disabled = true;

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Здесь можно рассчитать % загрузки, если нужно
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Загрузка: ' + progress + '%');
                }, 
                (error) => {
                    console.error("Ошибка загрузки:", error);
                    alert("Ошибка при загрузке: " + error.message);
                    uploadBtn.innerText = "Загрузить медиа";
                    uploadBtn.disabled = false;
                }, 
                () => {
                    // Успешное завершение
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('Файл доступен по ссылке:', downloadURL);
                        alert("Файл успешно сохранен в вашем облаке!");
                        uploadBtn.innerText = "Загрузить медиа";
                        uploadBtn.disabled = false;
                        // Сбрасываем инпут, чтобы можно было выбрать тот же файл повторно
                        fileInput.value = ""; 
                    });
                }
            );
        });
    }
</script>
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
    const storage = getStorage(app);
    const provider = new GoogleAuthProvider();

    let currentUser = null;

    // Элементы интерфейса
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');

    // 1. Отслеживание состояния
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // Показываем профиль, скрываем кнопку входа
            loginSection.classList.add('hidden');
            userSection.classList.remove('hidden');
            
            userName.innerText = user.displayName;
            userAvatar.src = user.photoURL;
            console.log("Авторизован:", user.email);
        } else {
            // Показываем кнопку входа, скрываем профиль
            loginSection.classList.remove('hidden');
            userSection.classList.add('hidden');
            console.log("Выход из системы");
        }
    });

    // 2. Вход
    loginSection.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch(err => console.error(err));
    });

    // 3. Выход
    logoutBtn.addEventListener('click', () => {
        if(confirm("Выйти из аккаунта?")) {
            signOut(auth);
        }
    });

    // 4. Загрузка файлов (как и раньше)
    uploadBtn.addEventListener('click', () => {
        if (!currentUser) return alert("Сначала войдите в Google");
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !currentUser) return;

        const storageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadBtn.innerText = "Загрузка...";
        uploadBtn.disabled = true;

        uploadTask.on('state_changed', null, 
            (err) => {
                alert("Ошибка");
                uploadBtn.disabled = false;
                uploadBtn.innerText = "Загрузить медиа";
            }, 
            () => {
                alert("Файл в облаке!");
                uploadBtn.disabled = false;
                uploadBtn.innerText = "Загрузить медиа";
                fileInput.value = "";
            }
        );
    });
</script>
