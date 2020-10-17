function formatMs(time) {
    return time < 10 ? `00${time}` : (time < 100 ? `0${time}` : time);
}
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}
/**************************************************/
//countdown functionality
const cd_seconds_e = document.querySelector('#cd_seconds');
const cd_minutes_e = document.querySelector('#cd_minutes');
const cd_hours_e = document.querySelector('#cd_hours');
const cd_ms_e = document.querySelector('#cd_milliseconds');
//###
const cd_keypad = document.querySelector('.cd_keypad');
cd_keypad.addEventListener('click', keypad);
let input;
let v = 0;
let cd_seconds_v = 0;
let cd_minutes_v = 0;
let cd_hours_v = 0;
let cd_seconds_final = 0;
let cd_minutes_final = 0;
let cd_hours_final = 0;
let cd_seconds = 0;
let cd_minutes = 0;
let cd_hours = 0;
let cd_milliseconds = 0;
const cd_btns = document.querySelector('.cd-btns');
function keypad(event) {
    if (event.target.nodeName === "SPAN") {
        input = event.target.textContent;
        let isnum = /^\d+$/.test(input);
        if (isnum && (Number(cd_hours_e.textContent) < 10)) {
            input = Number(input);
            v = (v * 10) + input;
            cd_seconds_v = v % 100;
            cd_minutes_v = Math.floor(v / 100) % 100;
            cd_hours_v = Math.floor(v / 10000) % 100;

            cd_seconds_e.innerHTML = formatTime(cd_seconds_v);
            cd_minutes_e.innerHTML = formatTime(cd_minutes_v);
            cd_hours_e.innerHTML = formatTime(cd_hours_v);
        }
        else if (input == "Clear") {
            cd_seconds_e.innerHTML = "00";
            cd_minutes_e.innerHTML = "00";
            cd_hours_e.innerHTML = "00";
            v = 0;
            cd_seconds_v = cd_minutes_v = cd_hours_v = 0;

        }
        else if (input == "Set") {
            cd_seconds_final = cd_seconds_v % 60;
            cd_minutes_final = (cd_minutes_v % 60) + Math.floor(cd_seconds_v / 60);
            cd_hours_final = cd_hours_v + Math.floor(cd_minutes_v / 60);
            cd_seconds_e.innerHTML = formatTime(cd_seconds_final);
            cd_minutes_e.innerHTML = formatTime(cd_minutes_final);
            cd_hours_e.innerHTML = formatTime(cd_hours_final);
            v = 0;
            cd_seconds = cd_seconds_final;
            cd_minutes = cd_minutes_final;
            cd_hours = cd_hours_final;
            cd_seconds_v = cd_minutes_v = cd_hours_v = 0;

            cd_keypad.style.display = "none";
            cd_btns.style.display = "flex";
            if ((cd_seconds_final == 0) && (cd_minutes_final == 0) && (cd_hours_final == 0)) {
                cd_seconds_e.innerHTML = "10";
                cd_seconds = cd_seconds_final = 10;
            }
        }
    }
}
//######
const start_cd = document.querySelector('#start_cd');
const clear_cd = document.querySelector('#clear_cd');
const back_cd = document.querySelector('#back_cd');
//##
back_cd.addEventListener('click', () => {
    //clear countdown timer
    clearInterval(cd_counter);
    cd_seconds_e.innerHTML = cd_minutes_e.innerHTML = cd_hours_e.innerHTML = "00";
    cd_ms_e.innerHTML = "000";
    //
    start_cd.innerHTML = "Start";
    start_cd.style.backgroundColor = "green";
    //
    cd_btns.style.display = "none";
    cd_keypad.style.display = "grid";

});

clear_cd.addEventListener('click', () => {
    clearInterval(cd_counter);
    cd_seconds_e.innerHTML = formatTime(cd_seconds_final);
    cd_minutes_e.innerHTML = formatTime(cd_minutes_final);
    cd_hours_e.innerHTML = formatTime(cd_hours_final);
    cd_ms_e.innerHTML = "000";
    cd_seconds = cd_seconds_final;
    cd_minutes = cd_minutes_final;
    cd_hours = cd_hours_final;
    //
    start_cd.innerHTML = "Start";
    start_cd.style.backgroundColor = "green";
});
let cd_counter;

start_cd.addEventListener('click', () => {
    if (start_cd.innerHTML == "Puase") {
        start_cd.innerHTML = 'Resume';
        start_cd.style.backgroundColor = "rgba(176, 0, 230, 0.493)";
        //clearInterval(ms_counter);
        clearInterval(cd_counter);
    }
    else {
        /*if (start_cd.innerHTML == "Start") {
            //sw_seconds = sw_minutes = sw_hours = sw_milliseconds = 0;
        }*/
        start_cd.innerHTML = "Puase";
        start_cd.style.backgroundColor = "green";
        //
        cd_counter = setInterval(
            function () {
                cd_milliseconds += 111;
                if (cd_milliseconds >= 1000) {
                    cd_milliseconds %= 1000;
                    if (cd_seconds == 0) {
                        if (cd_minutes == 0) {
                            if (cd_hours == 0) {
                                cd_seconds = cd_minutes = cd_hours = 0;
                                cd_milliseconds = 0;
                                clearInterval(cd_counter);
                            }
                            else {
                                cd_hours -= 1;
                                cd_minutes = 59;
                                cd_seconds = 59;
                            }
                            cd_hours_e.innerHTML = formatTime(cd_hours);
                        }
                        else {
                            cd_seconds = 59;
                            cd_minutes -= 1;
                        }
                        cd_minutes_e.innerHTML = formatTime(cd_minutes);
                    }
                    else {
                        cd_seconds -= 1;
                    }
                    cd_seconds_e.innerHTML = formatTime(cd_seconds);
                }
                cd_ms_e.innerHTML = formatMs(cd_milliseconds);
            }
            ,
            111
        );
    }

});

/**************************************************/
//Tabs funactionality
const sw_tab = document.querySelector('#sw_tab');
const sw_div = document.querySelector('#sw_div');
const cd_tab = document.querySelector('#cd_tab');
const cd_div = document.querySelector('#cd_div');
sw_tab.addEventListener('click', () => {
    if (!sw_tab.classList.contains('active_tab')) {
        sw_tab.classList.add('active_tab');
        sw_tab.style.borderBottom = "none";
        sw_div.classList.add('active_div');
        sw_div.style.display = "block";
        cd_tab.classList.remove('active_tab');
        cd_tab.style.borderBottom = "4px solid orange";
        cd_div.classList.remove('active_div');
        cd_div.style.display = "none";

    }
});
cd_tab.addEventListener('click', () => {
    if (!cd_tab.classList.contains('active_tab')) {
        cd_tab.classList.add('active_tab');
        cd_tab.style.borderBottom = "none";
        cd_div.classList.add('active_tab');
        cd_div.style.display = "block";
        sw_tab.classList.remove('active_tab');
        sw_tab.style.borderBottom = "4px solid orange";
        sw_div.classList.remove('active_div');
        sw_div.style.display = "none";
    }
});

/**************************************************/
//stopwatch functionality
const sw_seconds_e = document.querySelector('#stopwatch_seconds');
const sw_minutes_e = document.querySelector('#stopwatch_minutes');
const sw_hours_e = document.querySelector('#stopwatch_hours');
const sw_ms_e = document.querySelector('#stopwatch_milliseconds');
const start_sw = document.querySelector('#start_sw');
const clear_sw = document.querySelector('#clear_sw');
start_sw.addEventListener('click', start_stopwatch);
let sw_seconds = 0;
let sw_minutes = 0;
let sw_hours = 0;
let sw_counter;
let ms_counter;
let sw_milliseconds = 0;
function start_stopwatch() {
    if (start_sw.innerHTML == "Puase") {
        start_sw.innerHTML = 'Resume';
        start_sw.style.backgroundColor = "rgba(176, 0, 230, 0.493)";
        //clearInterval(ms_counter);
        clearInterval(sw_counter);
    }
    else {
        if (start_sw.innerHTML == "Start") {
            sw_seconds = sw_minutes = sw_hours = sw_milliseconds = 0;
        }
        start_sw.innerHTML = "Puase";
        start_sw.style.backgroundColor = "green";

        sw_counter = setInterval(
            function () {
                sw_milliseconds += 111;
                if (sw_milliseconds >= 1000) {
                    sw_milliseconds %= 1000;
                    sw_seconds += 1;
                    if (sw_seconds == 60) {
                        sw_seconds = 0;
                        sw_minutes += 1;
                        if (sw_minutes == 60) {
                            sw_minutes = 0;
                            sw_hours += 1;
                            sw_hours_e.innerHTML = formatTime(sw_hours);
                        }
                        sw_minutes_e.innerHTML = formatTime(sw_minutes);
                    }
                    sw_seconds_e.innerHTML = formatTime(sw_seconds);
                }
                sw_ms_e.innerHTML = formatMs(sw_milliseconds);
            }
            ,
            111
        );
        /*  var start = Date.now();
         ms_counter = setInterval(
             function () {
                 sw_milliseconds += (new date() - start);
                 if (sw_milliseconds == 1000) {
                     sw_milliseconds = 0;
                 }
 
                 sw_ms_e.innerHTML = formatMs(sw_milliseconds);
             }
             , 1
         ); */
    }

}

function formatMs(time) {
    return time < 10 ? `00${time}` : (time < 100 ? `0${time}` : time);
}
clear_sw.addEventListener('click', clear_stopwatch);
function clear_stopwatch() {
    //clearInterval(ms_counter);
    clearInterval(sw_counter);
    sw_ms_e.innerHTML = "000";
    sw_seconds_e.innerHTML = "00";
    sw_minutes_e.innerHTML = "00";
    sw_hours_e.innerHTML = "00";
    start_sw.innerHTML = "Start";
    start_sw.style.backgroundColor = "green";
}