console.log("JavaScript is connected!");
const wrapper = document.querySelector(".wrapper");
const header = document.querySelector(".header");

wrapper.addEventListener("scroll", (e) => {
    e.target.scrollTop > 30
        ? header.classList.add("header-shadow")
        : header.classList.remove("header-shadow");
});

const toggleButton = document.querySelector(".dark-light");

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

const jobCards = document.querySelectorAll(".job-card");
const logo = document.querySelector(".logo");
const jobLogos = document.querySelector(".job-logos");
const jobDetailTitle = document.querySelector(
    ".job-explain-content .job-card-title"
);
const jobBg = document.querySelector(".job-bg");
// start of detailed view logic
jobCards.forEach((jobCard) => {
    jobCard.addEventListener("click", () => {
        const number = Math.floor(Math.random() * 10);
        const url = `https://unsplash.it/640/425?image=${number}`;
        jobBg.src = url;

        const logo = jobCard.querySelector("svg");
        const bg = logo.style.backgroundColor;
        console.log(bg);
        jobBg.style.background = bg;
        const title = jobCard.querySelector(".job-card-title");
        jobDetailTitle.textContent = title.textContent;
        jobLogos.innerHTML = logo.outerHTML;
        wrapper.classList.add("detail-page");
        wrapper.scrollTop = 0;
    });
});

logo.addEventListener("click", () => {
    wrapper.classList.remove("detail-page");
    wrapper.scrollTop = 0;
    jobBg.style.background = bg;
});
// end of detailed view logic
let jobData = [];  // Массив для хранения всех данных из JSON

// Загружаем данные из JSON при загрузке страницы
fetch('json/jobs.json')
    .then(response => response.json())
    .then(data => {
        jobData = data;  // Сохраняем данные из JSON в массив
        generateJobCards(jobData);  // Отображаем все карточки изначально
    })
    .catch(error => console.error('Error loading job data:', error));

document.addEventListener('DOMContentLoaded', () => {
    // Привязываем функцию addFilter к полю Job Type
    const jobTypeInput = document.querySelector('.search-job input');
    jobTypeInput.addEventListener('keypress', addFilter);

    // Привязываем фильтрацию к удалению фильтров
    const filterContainer = document.getElementById('search-filters');
    filterContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('feather-x')) {
            filterContainer.removeChild(event.target.closest('.search-item'));
            filterJobs();  // Обновляем отображение после удаления фильтра
        }
    });
});

// Добавление фильтра при нажатии Enter
function addFilter(event) {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
        const filterText = event.target.value.trim();
        createFilterElement(filterText);
        event.target.value = '';  // Очистка поля после добавления фильтра
        filterJobs();  // Запускаем фильтрацию сразу после добавления
    }
}

// Функция создания элемента фильтра
function createFilterElement(text) {
    const filterContainer = document.getElementById('search-filters');

    // Проверка на существование фильтра с таким же текстом
    if (Array.from(filterContainer.children).some(child => child.textContent.trim() === text)) {
        return;  // Если фильтр уже существует, не добавляем его снова
    }

    // Создание нового элемента для фильтра
    const filterItem = document.createElement('div');
    filterItem.className = 'search-item';
    filterItem.textContent = text;

    // Добавление кнопки удаления для фильтра
    const removeIcon = document.createElement('svg');
    removeIcon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" />';
    removeIcon.className = 'feather feather-x';
    removeIcon.setAttribute('viewBox', '0 0 24 24');
    filterItem.appendChild(removeIcon);

    filterContainer.appendChild(filterItem);
}

// Функция фильтрации вакансий
function filterJobs() {
    const searchText = document.querySelector(".search-box").value.toLowerCase();
    const selectedFilters = Array.from(document.querySelectorAll(".search-item"))
        .map(item => item.textContent.toLowerCase().trim());
    const locationText = document.querySelector(".search-location-input") ? document.querySelector(".search-location-input").value.toLowerCase() : '';

    const filteredJobs = jobData.filter(job => {
        const matchesText = job.jobTitle.toLowerCase().includes(searchText) ||
            job.jobSubtitle.toLowerCase().includes(searchText);
        const matchesFilters = selectedFilters.every(filter =>
            job.jobType.toLowerCase() === filter ||
            job.experienceLevel.toLowerCase() === filter ||
            job.jobLevel.toLowerCase() === filter
        );
        const matchesLocation = !locationText || job.location.toLowerCase().includes(locationText);

        return matchesText && matchesFilters && matchesLocation;
    });

    generateJobCards(filteredJobs);
}

// Генерация карточек вакансий
function generateJobCards(jobList) {
    const jobListContainer = document.getElementById("job-cards");

    // Очищаем текущие карточки
    jobListContainer.innerHTML = '';

    jobList.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");

        jobCard.innerHTML = `
            <div class="job-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" style="background-color:${job.logoBackgroundColor}">
                    <path d="${job.logoPath1}" fill="${job.logoFillColor1}" transform="scale(2)" data-original="#212121"></path>
                    <path d="${job.logoPath2}" fill="${job.logoFillColor2}" transform="scale(2)" data-original="#f4511e"></path>
                    <div class="menu-dot"></div>               
                </svg>
            </div>
            <div class="job-card-title">${job.jobTitle}</div>
            <div class="job-card-subtitle">${job.jobSubtitle}</div>
            <div class="job-detail-buttons">
                <button class="search-buttons detail-button">${job.jobType}</button>
                <button class="search-buttons detail-button">${job.experienceLevel}</button>
                <button class="search-buttons detail-button">${job.jobLevel}</button>
            </div>
            <div class="job-card-buttons">
                <button class="search-buttons card-buttons" onclick="window.location.href='${job.applyNowLink}'">Apply Now</button>
            </div>
        `;

        jobListContainer.appendChild(jobCard);
    });
}
