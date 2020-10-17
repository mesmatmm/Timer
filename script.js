

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}
/**************************************************/
/**************************************************/
/**************************************************/

const current_time = document.getElementById("current-time");
let time_now = setInterval(currentTime, 1000);

function currentTime() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    current_time.innerHTML = t;
}
/**************************************************/

const r_seconds = document.getElementById("r_seconds");
const r_mins = document.getElementById("r_mins");
const r_hours = document.getElementById("r_hours");
const r_days = document.getElementById("r_days");
const r_months = document.getElementById("r_months");
const r_years = document.getElementById("r_years");

const e_seconds = document.getElementById("e_seconds");
const e_mins = document.getElementById("e_mins");
const e_hours = document.getElementById("e_hours");
const e_days = document.getElementById("e_days");
const e_months = document.getElementById("e_months");
const e_years = document.getElementById("e_years");

const nextBirthday = "31 Aug 2021";
const myBirthday = "31 Aug 1991";

//calculate the remaining time util the given date
function remainingTime(date) {
    const newDate = new Date(date);
    const currentDate = new Date();
    const totalSeconds = (newDate - currentDate) / 1000;

    const seconds = Math.floor(totalSeconds) % 60;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    /*  const days = Math.floor(totalSeconds / 3600 / 24) % 30;
     const months = Math.floor(totalSeconds / 3600 / 24 / 30) % 12;
     const years = Math.floor(totalSeconds / 3600 / 24 / 30 / 12); */
    const days = Math.abs(newDate.getDate() - currentDate.getDate());
    let years = newDate.getFullYear() - currentDate.getFullYear();
    let totalMonths = (years * 12) + (newDate.getMonth() - currentDate.getMonth());
    if (totalMonths < 12) {
        years = 0;
    }
    const months = totalMonths % 12;


    r_seconds.innerHTML = formatTime(seconds);
    r_mins.innerHTML = formatTime(mins);
    r_hours.innerHTML = formatTime(hours);
    r_days.innerHTML = days;
    r_months.innerHTML = months;
    r_years.innerHTML = formatTime(years);
}

//calculate the elapsed time util the given date
function elapsedTime(date) {
    const oldDate = new Date(date);
    const currentDate = new Date();
    const totalSeconds = (currentDate - oldDate) / 1000;

    const seconds = Math.floor(totalSeconds) % 60;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.abs(currentDate.getDate() - oldDate.getDate());
    let years = currentDate.getFullYear() - oldDate.getFullYear();
    let totalMonths = (years * 12) + (currentDate.getMonth() - oldDate.getMonth());
    if (totalMonths < 12) {
        years = 0;
    }
    const months = totalMonths % 12;


    e_seconds.innerHTML = formatTime(seconds);
    e_mins.innerHTML = formatTime(mins);
    e_hours.innerHTML = formatTime(hours);
    e_days.innerHTML = days;
    e_months.innerHTML = months;
    e_years.innerHTML = formatTime(years);
}

const seconds_b = document.getElementById("seconds_b");
const mins_b = document.getElementById("mins_b");
const hours_b = document.getElementById("hours_b");
const days_b = document.getElementById("days_b");
const months_b = document.getElementById("months_b");
const years_b = document.getElementById("years_b");

function elapsedTime_b(birthday) {
    const oldDate = new Date(birthday);
    const currentDate = new Date();
    const totalSeconds = (currentDate - oldDate) / 1000;

    const seconds = Math.floor(totalSeconds) % 60;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.abs(currentDate.getDate() - oldDate.getDate());
    let years = currentDate.getFullYear() - oldDate.getFullYear();
    let totalMonths = (years * 12) + (currentDate.getMonth() - oldDate.getMonth());
    if (totalMonths < 12) {
        years = 0;
    }
    const months = totalMonths % 12;


    seconds_b.innerHTML = formatTime(seconds);
    mins_b.innerHTML = formatTime(mins);
    hours_b.innerHTML = formatTime(hours);
    days_b.innerHTML = days;
    months_b.innerHTML = months;
    years_b.innerHTML = formatTime(years);
}

let birthday = new Date(document.getElementById("birthday").value);
birthday.setHours(0, 0, 0, 0);
//Add 'click' listener to 'generate' btn
document.querySelector('#generate').addEventListener('click', performAction);
{
    // initial call
    elapsedTime_b(birthday);
    //update timer
    myVar = setInterval(
        function () {
            elapsedTime_b(birthday);
        }
        ,
        1000
    );
}

function performAction() {
    let myVar;
    clearInterval(myVar);
    birthday = new Date(document.getElementById("birthday").value);
    birthday.setHours(0, 0, 0, 0);
    //console.log(birthday.toLocaleString());
    // initial call
    elapsedTime_b(birthday);
    //update timer
    myVar = setInterval(
        function () {
            elapsedTime_b(birthday);
        }
        ,
        1000
    );
}
// initial call
remainingTime(nextBirthday);
elapsedTime(myBirthday);

//update timer
setInterval(
    function () {
        remainingTime(nextBirthday);
        elapsedTime(myBirthday);
    }
    ,
    1000
);

