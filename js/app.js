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

// Load job data from JSON
fetch('json/jobs.json')
    .then(response => response.json())
    .then(data => {
        // Generate job cards with data
        generateJobCards(data);
    })
    .catch(error => console.error('Error loading job data:', error));

// Function to generate job cards
function generateJobCards(jobList) {
    const jobListContainer = document.getElementById("job-cards");

    jobList.forEach(job => {
        // Create a new job card element
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");

        // Add HTML for the job card (using job data)
        jobCard.innerHTML = `
            <div class="job-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="background-color:${job.logoBackgroundColor}">
                    <path d="${job.logoPath1}" fill="${job.logoFillColor1}"></path>
                    <path d="${job.logoPath2}" fill="${job.logoFillColor2}"></path>
                </svg>
                <div class="menu-dot"></div>
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

        // Append the job card to the container
        jobListContainer.appendChild(jobCard);
    });
}
