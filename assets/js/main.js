const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthInBox = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

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
    contentDate.textContent = month + " " + year;
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

function defaultCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    generateCalendar(year, month);
}

function showPreviousMonth(year, month) {
    let monthIndex = months.indexOf(month);
    monthIndex--;
    if (monthIndex < 0) {
        monthIndex = 11;
        year--;
    }
    generateCalendar(year, monthIndex);
    contentDate.textContent = months[monthIndex] + " " + year;
}

function showNextMonth(year, month) {
    let monthIndex = months.indexOf(month);
    monthIndex++;
    if (monthIndex > 11) {
        monthIndex = 0;
        year++;
    }
    generateCalendar(year, monthIndex);
    contentDate.textContent = months[monthIndex] + " " + year;   
}

function generateMonthBox(startMonthIndex) {
    let html = ''; 
    const currentMonthIndex = new Date().getMonth();

    for (let i = startMonthIndex; i < startMonthIndex + 16; i++) {
        const monthIndex = i % 12;
        const monthName = monthInBox[monthIndex];
        const className01 = (monthIndex === currentMonthIndex) ? 'sub-active' : ''; 
        const className02 = (i > 11) ? 'not-current-month' : '';

        html += `<li class="${className01} ${className02}">${monthName}</li>`;
    }

    monthBox.innerHTML = html;
} 

generateMonthBox(0);

let currentStartYear = Math.floor(new Date().getFullYear() / 10) * 10;

function updateContentDate(startYear) {
    const endYear = startYear + 9;
    contentDate.textContent = `${startYear}-${endYear}`;
}

function generateYearBox(startYear) {
    let html = ''; // Khởi tạo chuỗi HTML rỗng

    for (let i = 0; i < 16; i++) {
        const year = startYear + i;
        const className = (year === new Date().getFullYear()) ? 'sub-active' : ''; // Thêm class 'active' nếu là năm hiện tại
        html += `<li class="${className}">${year}</li>`;
    }

    yearBox.innerHTML = html;
    updateContentDate(startYear);
}

generateYearBox(currentStartYear)

function showPreviousDecade() {
    currentStartYear -= 10;
    generateYearBox(currentStartYear);
}

function showNextDecade() {
    currentStartYear += 10;
    generateYearBox(currentStartYear);
}

function handleCalendar() {    
    // Bắt sự kiện khi click vào nút Previous
    prevMonthBtn.onclick = function() {
        let currentTime = contentDate.textContent;
        let text = currentTime.split(' ');
        let currentYear = Number(text[1]); // Chuyển năm sang số nguyên
        let currentMonth = text[0];
        showPreviousMonth(currentYear, currentMonth);
        showPreviousDecade();
    }

    // Bắt sự kiện khi click vào nút Next
    nextMonthBtn.onclick = function() {
        let currentTime = contentDate.textContent;
        let text = currentTime.split(' ');
        let currentYear = Number(text[1]); // Chuyển năm sang số nguyên
        let currentMonth = text[0];
        showNextMonth(currentYear, currentMonth);
        showNextDecade();
    }
}
defaultCalendar();
handleCalendar();

// prevMonthBtn.onclick = function() {
//     const currentFirstMonthIndex = monthInBox.indexOf(monthBox.firstChild.textContent);
//     generateMonthBox(currentFirstMonthIndex - 1);
// }

// nextMonthBtn.onclick = function() {
//     const currentFirstMonthIndex = monthInBox.indexOf(monthBox.firstChild.textContent);
//     generateMonthBox(currentFirstMonthIndex + 1);
// }
// showNextMonth(2024, 5)

// generateCalendar();

let countClick = 0;

contentDate.onclick = function() {
    countClick++;

    if (countClick === 1) {
        monthBox.style.display = 'flex';
        calendar.style.display = 'none';
        contentWeek.style.display = 'none';
        let currentTime = contentDate.textContent;
        let text = currentTime.split(' ');
        let currentYear = Number(text[1]);
        contentDate.textContent = currentYear.toString();
    } else if (countClick === 2) {
        monthBox.style.display = 'none';
        yearBox.style.display = 'flex';
        let currentYear = Number(contentDate.textContent);
        const startYear = Math.floor(currentYear / 10) * 10;
        const endYear = startYear + 9;
        contentDate.textContent = `${startYear}-${endYear}`;
    }
}

const dayInCalendar = $$(`.content__day`);

let prevDayClick = null;

dayInCalendar.forEach(day => {
    day.addEventListener('click', function() {
        if (prevDayClick) {
            prevDayClick.classList.remove('hover-active');
        }

        day.classList.add('hover-active');

        prevDayClick = day;
    });
});

headerDate.onclick = function() {
    countClick = 0;
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    contentDate.textContent = `${currentMonth} ${currentYear}`;
    if (calendar.style.display === 'none' || contentWeek.style.display === 'none') {
        calendar.style.display = 'flex';
        contentWeek.style.display = 'flex';
    }
    if (monthBox.style.display === 'flex' || yearBox.style.display === 'flex') {
        monthBox.style.display = 'none';
        yearBox.style.display = 'none';
    }
    defaultCalendar();
}


