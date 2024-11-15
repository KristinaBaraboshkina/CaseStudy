console.log("JavaScript is connected!");

const wrapper = document.querySelector(".wrapper");
const header = document.querySelector(".header");

// Scroll effect on header
wrapper.addEventListener("scroll", (e) => {
    e.target.scrollTop > 30
        ? header.classList.add("header-shadow")
        : header.classList.remove("header-shadow");
});

// Dark mode toggle
const toggleButton = document.querySelector(".dark-light");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

const jobCards = document.querySelectorAll(".job-card");
const logo = document.querySelector(".logo");
const jobLogos = document.querySelector(".job-logos");
const jobDetailTitle = document.querySelector(".job-explain-content .job-card-title");
const jobBg = document.querySelector(".job-bg");

// Start of detailed view logic
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

// When logo is clicked, return to the main page view
logo.addEventListener("click", () => {
    wrapper.classList.remove("detail-page");
    wrapper.scrollTop = 0;
    jobBg.style.background = bg;
});
// End of detailed view logic

let jobData = []; // Array to store all job data

// Load job data from JSON when the page is loaded
fetch('json/jobs.json')
    .then(response => response.json())
    .then(data => {
        jobData = data;  // Store JSON data in the array
        generateJobCards(jobData);  // Display all job cards initially
    })
    .catch(error => console.error('Error loading job data:', error));

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Bind the addFilter function to the Job Type input field
    const jobTypeInput = document.querySelector('.search-job input');
    jobTypeInput.addEventListener('keypress', addFilter);

    // Bind the removal of filters
    const filterContainer = document.getElementById('search-filters');
    filterContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('feather-x')) {
            filterContainer.removeChild(event.target.closest('.search-item'));
            filterJobs();  // Update display after removing filter
        }
    });
});

// Add filter when the Enter key is pressed
function addFilter(event) {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
        const filterText = event.target.value.trim();
        createFilterElement(filterText);
        event.target.value = '';  // Clear the input field after adding the filter
        filterJobs();  // Run filtering immediately after adding
    }
}
// Function to filter job types based on user input
function filterJobTypes() {
    const input = document.querySelector('#job-type-input');
    const filter = input.value.toLowerCase();
    const listItems = document.querySelectorAll('.job-type-list li');

    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? 'block' : 'none';
    });
}

// Event handler for selecting a job type
document.querySelectorAll('.job-type-list li').forEach(item => {
    item.addEventListener('click', () => {
        const input = document.querySelector('#job-type-input');
        input.value = item.textContent;  // Set the input value to the clicked item

        // Hide the list after selection
        document.querySelector('.job-type-list').style.display = 'none';
    });
});


// Function to create a filter element
//function createFilterElement(text) {
   // const filterContainer = document.getElementById('search-filters');

    // Check if filter with this text already exists
   // if (Array.from(filterContainer.children).some(child => child.textContent.trim() === text)) {
  //      return;  // If the filter already exists, do not add it again
  //  }

    // Create a new filter item
   // const filterItem = document.createElement('div');
    //filterItem.className = 'search-item';
    //filterItem.textContent = text;

    // Create the delete button for the filter
   // const removeIcon = document.createElement('svg');
  //  removeIcon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" />';  // Cross mark icon
  //  removeIcon.className = 'feather feather-x';
  //  removeIcon.setAttribute('viewBox', '0 0 24 24');
  //  filterItem.appendChild(removeIcon);

   // filterContainer.appendChild(filterItem);
//}

// Function to display the job type list
function showJobTypeList() {
    document.querySelector('.job-type-list').style.display = 'block';
}

// Function to hide the job type list when focus is lost
function hideJobTypeList() {
    setTimeout(() => {
        document.querySelector('.job-type-list').style.display = 'none';
    }, 200);
}

// Function to filter job types based on user input
function filterJobTypes() {
    const input = document.querySelector('input');
    const filter = input.value.toLowerCase();
    const listItems = document.querySelectorAll('.job-type-list li');

    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? 'block' : 'none';
    });
}

// Event handler for selecting a job type
document.querySelectorAll('.job-type-list li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('input').value = item.textContent;
        hideJobTypeList();
        // Additional filtering logic can be added here
    });
});

// Filter job listings based on search text and selected filters
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

    generateJobCards(filteredJobs);  // Display filtered jobs
}

// Generate job cards based on the job list
function generateJobCards(jobList) {
    const jobListContainer = document.getElementById("job-cards");

    // Clear current job cards
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
