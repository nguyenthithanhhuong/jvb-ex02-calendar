const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const headerTime = $(`.header__time`);
const headerMerid = $(`.header__merid`);

const headerDate = $(`.header__date`);
const contentDate = $(`.content__date`);

const calendar = $(`.content__main`);
const prevMonthBtn = $(`.content__arrow-up`);
const nextMonthBtn = $(`.content__arrow-down`);

const contentWeek = $(`.content__weekday`);
const monthBox = $(`.content__month-box`);
const yearBox = $(`.content__year-box`);

// Render current time in header
function displayCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;


    hours = String(hours).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');

    let currentTime = `${hours}:${minutes}:${seconds}`;

    headerTime.textContent = currentTime;
    headerMerid.textContent = meridiem;
}

displayCurrentTime();

setInterval(displayCurrentTime, 1000);

// Render month and year in content
function currentDate() {
    const today = new Date();

    const weekDay = daysOfWeek[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
  
    const currentHeaderDate = `${weekDay}, ${month} ${day}, ${year}`;
    const currentContentDate = `${month} ${year}`;
    
    headerDate.textContent = currentHeaderDate;
    contentDate.textContent = currentContentDate;
}

currentDate();

function generateCalendar(year, month) {
    const currentDate = new Date();
    const today = currentDate.getDate();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();

    const prevLastDay = new Date(year, month, 0).getDate();

    const daysInCalendar = 42;
    const daysInPrevMonth = firstDayIndex;
    const daysInNextMonth = daysInCalendar - (lastDayDate + daysInPrevMonth);

    let htmls = '';

    for (let i = daysInPrevMonth; i > 0; i--) {
        let className = "content__day not-current-month"
        htmls += `<li class="${className}">
                  ${prevLastDay - i + 1}
                 </li>`;
    }

    for (let i = 1; i <= lastDayDate; i++) {
        let className = 'content__day';
        if (i === today && month === currentDate.getMonth() 
            && year === currentDate.getFullYear()) {
            className += ' active';
        }
        htmls += `<li class="${className}">${i}</li>`;
    }

    for (let i = 1; i <= daysInNextMonth; i++) {
        let className = "content__day not-current-month"
        htmls += `<li class="${className}">${i}</li>`;
    }

    calendar.innerHTML = htmls;
}

function showPreviousMonth(year, month) {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    generateCalendar(year, month);
}

function showNextMonth(year, month) {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    generateCalendar(year, month);
}

function handleCalendar() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    generateCalendar(currentYear, currentMonth);

    prevMonthBtn.onclick = function() {
        showPreviousMonth(currentYear, currentMonth);
    }

    nextMonthBtn.onclick = function() {
        showNextMonth(currentYear, currentMonth);
    }
}

handleCalendar();
// showNextMonth(2024, 5)

// generateCalendar();

let countClick = 0;

contentDate.onclick = function() {
    countClick++;

    if (countClick === 1) {
        monthBox.style.display = 'flex';
        calendar.style.display = 'none';
        contentWeek.style.display = 'none';
    } else if (countClick === 2) {
        monthBox.style.display = 'none';
        yearBox.style.display = 'flex';
    } else {
        calendar.removeEvenListener('click');
    }
}