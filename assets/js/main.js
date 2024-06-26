const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "CALENDAR";

const headerTime = $(`.header__time`);
const headerMerid = $(`.header__merid`);
const headerDate = $(`.header__date`);

const contentDate = $(`.content__date`);
const calendar = $(`.content__main`);
const prevBtn = $(`.content__arrow-up`);
const nextBtn = $(`.content__arrow-down`);
const contentWeek = $(`.content__weekday`);
const monthBox = $(`.content__month-box`);
const yearBox = $(`.content__year-box`);

const footerDate = $(`.footer__date`)


const app = {
    currentStartYear: Math.floor(new Date().getFullYear() / 10) * 10,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    daysOfWeek: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    monthsInBox: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // Render current time in header
    displayCurrentTime: function () {
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
    },
    // Render current date in header
    displayCurrentHeaderDate: function () {
        const today = new Date();

        const weekDay = this.daysOfWeek[today.getDay()];
        const day = today.getDate();
        const month = this.months[today.getMonth()];
        const year = today.getFullYear();

        const currentHeaderDate = `${weekDay}, ${month} ${day}, ${year}`;
        const currentContentDate = `${month} ${year}`;

        headerDate.textContent = currentHeaderDate;
        contentDate.textContent = currentContentDate;
    },
    // Render current date in footer
    displayCurrentFooterDate: function () {
        footerDate.textContent = 'Today';
    },
    // generate calendar
    generateCalendar: function (year, month) {
        const currentDate = new Date();
        const today = currentDate.getDate();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const firstDayIndex = firstDay.getDay();
        const lastDayDate = lastDay.getDate();

        const prevLastDay = new Date(year, month, 0).getDate();

        const daysInCalendar = 42;
        const daysInPrevMonth = firstDayIndex;
        const daysInNextMonth = daysInCalendar - (lastDayDate + daysInPrevMonth);

        let htmls = '';

        for (let i = daysInPrevMonth; i > 0; i--) {
            let className = "content__day none-active"
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
            let className = "content__day none-active"
            htmls += `<li class="${className}">${i}</li>`;
        }

        calendar.innerHTML = htmls;

        calendar.style.display = 'flex';
        contentWeek.style.display = 'flex';
        yearBox.style.display = 'none';
        monthBox.style.display = 'none';

        this.dayClickEvent();
    },
    // display current calendar
    displayCurrentCalendar: function () {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        this.generateCalendar(currentYear, currentMonth);
    },
    // generate month box layout
    generateMonthBox: function () {
        let html = '';
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const isCurrentYear = (contentDate.textContent === currentYear.toString());

        for (let i = 0; i < 16; i++) {
            const monthIndex = i % 12;
            const monthName = this.monthsInBox[monthIndex];
            const clasName00 = 'content__month'
            const className01 = (isCurrentYear && monthIndex === currentMonthIndex) ? 'sub-active' : '';
            const className02 = (i > 11) ? 'none-active' : '';

            html += `<li class="${clasName00} ${className01} ${className02}">${monthName}</li>`;
        }

        monthBox.innerHTML = html;
        calendar.style.display = 'none';
        contentWeek.style.display = 'none';
        yearBox.style.display = 'none';
        monthBox.style.display = 'flex';

        this.monthClickEvent();
    },
    // generate year box layout
    generateYearBox: function (startYear) {
        let html = '';
        
        const endYear = startYear + 9;
        const startDecadeYear = startYear

        if ((startYear / 10) % 2 === 0) {
            startYear = startYear;
        } else {
            startYear = startYear - 2;
        }

        for (let i = 0; i < 16; i++) {
            if ((startYear / 10) % 2 === 0) {
                const year = startYear + i;
                const clasName00 = 'content__year'
                const className01 = (year === new Date().getFullYear()) ? 'sub-active' : '';
                const className02 = (i > 9) ? 'none-active' : '';
                html += `<li class="${clasName00} ${className01} ${className02}">${year}</li>`;    
            } else {
                const year = startYear + i;
                const clasName10 = 'content__year'
                const className11 = (year === new Date().getFullYear()) ? 'sub-active' : '';
                const className12 = (i < 2 || i > 11) ? 'none-active' : '';
                html += `<li class="${clasName10} ${className11} ${className12}">${year}</li>`;    
            }
        }

        yearBox.innerHTML = html;

        monthBox.style.display = 'none';
        yearBox.style.display = 'flex';

        this.yearClickEvent();

        contentDate.textContent = `${startDecadeYear}-${endYear}`;
    },
    // event day when click
    dayClickEvent: function () {
        const _this = this;
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const days = $$('.content__day');

        days.forEach(day => {
            day.addEventListener('click', function () {
                if (_this.prevDayClick) {
                    _this.prevDayClick.classList.remove('hover-active');
                }

                day.classList.add('hover-active');

                _this.prevDayClick = day;
                const dayOfMonth = parseInt(day.textContent);
                let month = currentMonth;
                let year = currentYear;

                if (day.classList.contains('none-active')) {
                    const currentDate = contentDate.textContent.split(' ');
                    const currentMonthIndex = _this.months.indexOf(currentDate[0]);
                    const displayYear = parseInt(currentDate[1]);

                    if (dayOfMonth < 15) {
                        month = currentMonthIndex + 1;
                        if (month > 11) {
                            month = 0;
                            year = displayYear + 1;
                        }
                    } else {
                        month = currentMonthIndex - 1;
                        if (month < 0) {
                            month = 11;
                            year = displayYear - 1;
                        }
                    }
                } else {
                    const currentDate = contentDate.textContent.split(' ');
                    month = _this.months.indexOf(currentDate[0]);
                    year = parseInt(currentDate[1]);
                }

                const clickDate = new Date(year, month, dayOfMonth);
                const clickWeekday = _this.daysOfWeek[clickDate.getDay()];
                let textFooterDate = `${clickWeekday} ${dayOfMonth}`;

                const isCurrentMonth = !day.classList.contains('none-active');
                if (isCurrentMonth && dayOfMonth === currentDay) {
                    textFooterDate = 'Today';
                }

                footerDate.textContent = textFooterDate;
            });
        });
    },
    // event month when click
    monthClickEvent: function () {
        const _this = this;
        const months = $$('.content__month');

        months.forEach(month => {
            month.addEventListener('click', function () {
                const monthIndex = _this.monthsInBox.indexOf(month.textContent);
                const currentYear = parseInt(contentDate.textContent);
                _this.generateCalendar(currentYear, monthIndex);
                contentDate.textContent = `${_this.months[monthIndex]} ${currentYear}`;
            });
        });

    },
    // event year when click
    yearClickEvent: function () {
        const _this = this;
        const years = $$('.content__year');

        years.forEach(year => {
            year.addEventListener('click', function () {
                const currentYear = parseInt(year.textContent);
                _this.generateMonthBox();
                contentDate.textContent = currentYear.toString();
            });
        });

    },
    // event handling
    handleEvent: function () {
        const _this = this;

        // previous month calendar
        function showPreviousMonth(year, month) {
            let monthIndex = _this.months.indexOf(month);
            monthIndex--;
            if (monthIndex < 0) {
                monthIndex = 11;
                year--;
            }
            _this.generateCalendar(year, monthIndex);
            contentDate.textContent = _this.months[monthIndex] + " " + year;
        };

        // next month calendar
        function showNextMonth(year, month) {
            let monthIndex = _this.months.indexOf(month);
            monthIndex++;
            if (monthIndex > 11) {
                monthIndex = 0;
                year++;
            }
            _this.generateCalendar(year, monthIndex);
            contentDate.textContent = _this.months[monthIndex] + " " + year;
        };

        // prev month box 
        function showPrevMonthBox() {
            const currentYear = parseInt(contentDate.textContent);
            const previousYear = currentYear - 1;
            contentDate.textContent = previousYear.toString();
            _this.generateMonthBox();
        }

        // next month box
        function showNextMonthBox() {
            const currentYear = parseInt(contentDate.textContent);
            const nextYear = currentYear + 1;
            contentDate.textContent = nextYear.toString();
            _this.generateMonthBox();
        }

        // prev year box
        function showPreviousDecade() {
            _this.currentStartYear -= 10;
            _this.generateYearBox(_this.currentStartYear);
        };

        // next year box
        function showNextDecade() {
            _this.currentStartYear += 10;
            _this.generateYearBox(_this.currentStartYear);
        };

        // previous button click event
        prevBtn.addEventListener('click', function () {
            if (calendar.style.display === 'flex') {
                let currentTime = contentDate.textContent;
                let text = currentTime.split(' ');
                let currentYear = Number(text[1]);
                let currentMonth = text[0];
                showPreviousMonth(currentYear, currentMonth);
            } else if (yearBox.style.display === 'flex') {
                showPreviousDecade();
            } else {
                showPrevMonthBox();
            }
        }),

        // next button click event
        nextBtn.addEventListener('click', function () {
            if (calendar.style.display === 'flex') {
                let currentTime = contentDate.textContent;
                let text = currentTime.split(' ');
                let currentYear = Number(text[1]);
                let currentMonth = text[0];
                showNextMonth(currentYear, currentMonth);
            } else if (yearBox.style.display === 'flex') {
                showNextDecade();
            } else {
                showNextMonthBox();
            }
        }),

        // date in content when click
        contentDate.addEventListener('click', function () {
            if (calendar.style.display === 'flex') {
                let currentTime = contentDate.textContent;
                let text = currentTime.split(' ');
                let currentYear = Number(text[1]);
                contentDate.textContent = currentYear.toString();
                _this.generateMonthBox();
            } else if (monthBox.style.display === 'flex') {
                let currentYear = Number(contentDate.textContent);
                const startYear = Math.floor(currentYear / 10) * 10;
                const endYear = startYear + 9;
                contentDate.textContent = `${startYear}-${endYear}`;
                _this.generateYearBox(startYear);
            }
        }),
        // header date click event
        headerDate.addEventListener('click', function () {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            contentDate.textContent = `${_this.months[currentDate.getMonth()]} ${currentYear}`;
            footerDate.textContent = 'Today';
            _this.generateCalendar(currentYear, currentMonth);
        })
    },
    start: function () {
        setInterval(this.displayCurrentTime, 1000);

        this.displayCurrentHeaderDate();

        this.displayCurrentCalendar();

        this.displayCurrentFooterDate();

        this.handleEvent();

    }
};

app.start();