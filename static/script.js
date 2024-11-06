let currentJoke = "";
let jokeHistory = []; // Массив для хранения истории анекдотов
let currentJokeIndex = -1; // Индекс текущего анекдота

// Функция для получения анекдота
function fetchJoke() {
    fetch("/api/get_joke")
        .then(response => response.json())
        .then(data => {
            const joke = data.joke;
            jokeHistory.push(joke); // Добавляем новый анекдот в историю
            currentJokeIndex = jokeHistory.length - 1; // Обновляем текущий индекс
            displayJoke(joke); // Показываем анекдот
        })
        .catch(error => console.error("Ошибка при загрузке анекдота:", error));
}

// Функция для отображения анекдота на странице
function displayJoke(joke) {
    document.getElementById("joke").innerText = joke;
    document.getElementById("like-count").innerText = "Лайков: 0";
    document.getElementById("dislike-count").innerText = "Дизлайков: 0";
    currentJoke = joke;
}

// Функция для перехода к предыдущему анекдоту
function fetchPreviousJoke() {
    if (currentJokeIndex > 0) { // Проверка, если есть предыдущий анекдот
        currentJokeIndex--; // Переход к предыдущему анекдоту
        displayJoke(jokeHistory[currentJokeIndex]); // Показываем предыдущий анекдот
    }
}

// Функция для лайка анекдота с проверкой
function likeJoke() {
    const joke = jokeHistory[currentJokeIndex];
    fetch("/api/like_joke", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ joke })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    alert(data.error); // Выводим ошибку, если IP уже оценил анекдот
                    throw new Error(data.error);
                });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("like-count").innerText = `Лайков: ${data.likes}`;
            document.getElementById("dislike-count").innerText = `Дизлайков: ${data.dislikes}`;
            fetchTopJokes(); // Обновляем топ-10 шуток после лайка
        })
        .catch(error => console.error("Ошибка при лайке анекдота:", error));
}

// Функция для дизлайка анекдота с проверкой
function dislikeJoke() {
    const joke = jokeHistory[currentJokeIndex];
    fetch("/api/dislike_joke", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ joke })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    alert(data.error); // Выводим ошибку, если IP уже оценил анекдот
                    throw new Error(data.error);
                });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("like-count").innerText = `Лайков: ${data.likes}`;
            document.getElementById("dislike-count").innerText = `Дизлайков: ${data.dislikes}`;
            fetchTopJokes(); // Обновляем топ-10 шуток после дизлайка
        })
        .catch(error => console.error("Ошибка при дизлайке анекдота:", error));
}

// Функция для получения топ-10 шуток
function fetchTopJokes() {
    fetch("/api/top_jokes")
        .then(response => response.json())
        .then(data => {
            const topJokesList = document.getElementById("top-jokes-list");
            topJokesList.innerHTML = "";
            data.forEach((joke, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${joke.joke} — Лайков: ${joke.likes}, Дизлайков: ${joke.dislikes}`;
                topJokesList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Ошибка при получении топ-10 шуток:", error));
}

// Загрузка анекдота при открытии страницы
document.addEventListener("DOMContentLoaded", () => {
    fetchJoke();
    fetchTopJokes();
});

// Функция для анимации глаз, чтобы они следовали за мышью
document.addEventListener("mousemove", (event) => {
    const eyes = document.querySelectorAll(".eye");
    eyes.forEach((eye) => {
        const pupil = eye.querySelector(".pupil");
        const eyeRect = eye.getBoundingClientRect();

        // Находим центр глаза
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        // Вычисляем угол движения зрачка
        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);

        // Устанавливаем смещение для зрачка
        const maxOffset = 15; // Максимальное смещение зрачка от центра глаза
        const pupilX = Math.cos(angle) * maxOffset;
        const pupilY = Math.sin(angle) * maxOffset;

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
});





