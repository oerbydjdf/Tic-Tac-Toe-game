'use strict';
let victory;
function createsPlayingField(num) {
    // Удаляем таблицу если она есть
    if (document.querySelector('table')) document.querySelector('table').remove();

    // Создаем таблицу     
    let table = document.createElement('table');
    let playingField = document.querySelector('.playingField');

    // Вставляем строки и столбцы

    for (let i = 0; i < num; i++) {
        let row = table.insertRow(i);
        for (let c = 0; c < num; c++) {
            let cel = row.insertCell(c);

            // Создаем и вставляем в каждую ячейку холст 'canvas'
            let canvas = document.createElement('canvas');
            settingClickEvent(canvas);
            canvas.id = 'canvas';
            canvas.setAttribute('width', '60px');
            canvas.setAttribute('height', '60px');
            cel.append(canvas);
        }
    }
    playingField.append(table);
}
// Вешаем событие клика на канвас

function settingClickEvent(elem) {
    elem.addEventListener('click', function clickOnCanvas() {
        if(victory === 'true') return;
        moveTransition(elem);
        getsResultGame();
        saveRadioLocalStor();
        elem.removeEventListener('click', clickOnCanvas);
        definesDraw();
    });
};

//  Пользователь выбирает количество ячеек
let set_num = document.querySelector('.settings__number');
set_num.oninput = () => createsPlayingField(set_num.value);
createsPlayingField(set_num.value);



// Выбираем цвет, вызов функции в HTML
let colors_O, target_eO;
let colors_X, target_eX;

function selectsColor_O(color, e) {
    if (colors_O) {
        alert('Цвет уже выбран!');
        return;
    }
    colors_O = color;
    target_eO =  e.target.outerHTML;
    e.target.style.border = `4px solid ${color}`;
    deleneMessage(colors_X, colors_O);
};

function selectsColor_X(color, e) {
    if (colors_X) {
        alert('Цвет уже выбран!');
        return;
    }
    colors_X = color;
    target_eX =  e.target.outerHTML;
    e.target.style.border = `4px solid ${color}`;
    deleneMessage(colors_X, colors_O);
};

// function selectsColor(colors, e) {
//     let target = e.target;
    
//     if(target.parentElement.className == 'drawingTools__plyer-O') {
//         if (colors_O) {
//             alert('Цвет уже выбран!');
//             return;
//         }
//         colors_O = colors;
//         target_eO =  e.target.outerHTML;
//         e.target.style.border = `4px solid ${colors}`;
//         deleneMessage(colors_X, colors_O);

//     }
//     if(target.parentElement.className == 'drawingTools__plyer-X') {
//         if (colors_X) {
//             alert('Цвет уже выбран!');
//             return;
//         }
//         colors_X = colors;
//         target_eX =  e.target.outerHTML;
//         e.target.style.border = `4px solid ${colors}`;
//         deleneMessage(colors_X, colors_O);

//     }
// }


// Рисум крестик 
function drawsCross(canvas) {
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.strokeStyle = colors_X;
    ctx.moveTo(10, 10);
    ctx.lineTo(50, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.lineTo(10, 50);
    ctx.stroke();
}

// Рисуем круг
function drawsCircle(canvas) {
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.strokeStyle = colors_O;
    ctx.beginPath();
    ctx.arc(30, 30, 20, 0, Math.PI * 2, true);
    ctx.stroke();

}
// Начало игры
document.querySelector('.beginningOfGame').onclick = () => startsGame();
function startsGame() {
    showsMessage();    
    removingStartButton(true, '.playingСomputer');
    savesToLocalstorageButtom();
}

// Выводим сообщения игрокам
let message = Array.from(document.querySelectorAll('.message'));
function showsMessage() {
    message.forEach(e => e.classList.add('messageActive'));
};

// Удоляем сообщения
function deleneMessage(a, b) {
    if(a && b) {
        message.forEach(e => e.classList.remove('messageActive'));
        selectSNewPlayer(1, 0);
    }
}

// Право первого хода
let resalt;
function selectSNewPlayer(max, min) {
    resalt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (resalt === 0) {
        showActivePlayer(resalt);
        return resalt;
    } else {
        showActivePlayer(resalt);
        return resalt;
    }
};

// Показываем игрока который ходит
function showActivePlayer(num) {

    let player_X = document.querySelector('.drawingTools__plyer-X');
    let player_O = document.querySelector('.drawingTools__plyer-O');
    let span = Array.from(document.querySelectorAll('span'));
    let radiobuttom = Array.from(document.querySelectorAll('[name="radio__plyer"]'));
    if(num === 1) {
        radiobuttom[1].checked = true;
        player_X.classList.add('plyer-X_Active');
        player_O.classList.remove('plyer-O_Active');
        span[1].classList.add('spanActive');
        span[0].classList.remove('spanActive');
    } else if(num === 0) {
        radiobuttom[0].checked = true;
        player_X.classList.remove('plyer-X_Active');
        player_O.classList.add('plyer-O_Active');
        span[1].classList.remove('spanActive');
        span[0].classList.add('spanActive');
    }
}

// Удоляем выделение игрока при начале игры
function removePlayerSelection() {
    document.querySelector('.drawingTools__plyer-X').classList.remove('plyer-X_Active');
    document.querySelector('.drawingTools__plyer-O').classList.remove('plyer-O_Active');
    Array.from(document.querySelectorAll('span')).forEach(e => e.classList.remove('spanActive'));
}

// Очередность ходов
function moveTransition(canvas) {

    if (resalt === 1){
        drawsCross(canvas);
        showActivePlayer(resalt - 1);

    } 
    if (resalt === 0) {
        drawsCircle(canvas);
        showActivePlayer(resalt + 1);

    } 
    ++resalt;
    if (resalt > 1) resalt = 0;
}

// Создаем двумерный массив с canvas
function getsResultGame() {
    let dablArr = [];
    let table = document.querySelector('table');
    let tr = Array.from(table.rows);
    tr.forEach(e => {
        let td = Array.from(e.children);
        let current = [];
        td.forEach(t => {
            current.push(t.firstChild);
        });
        dablArr.push(current);
    });
    savesToLocalstorage();
    checkingGame(dablArr);
}
// Проверка игрового поля после каждого хода игрока
function checkingGame(arrDabl) {

    // Проверяем горизонтальные строки
    arrDabl.forEach((e) => {
        checksData(e, 0, 30, 60, 30);
    });

    // Проверяем вертикальные строки
    let a = 0;
    while (arrDabl.length > a) {
        let vert = [];
        arrDabl.forEach(e => vert.push(e[a]));
        checksData(vert, 30, 0, 30, 60);
        a++;
    };

    // Проверяем диоганали
    let diogLeft = [];
    let diogRight = [];
    arrDabl.forEach((e, i, arr) => {
        diogLeft.push(e[i]);
        diogRight.push(e[e.length - 1 - i]);

    });
    checksData(diogLeft, 0, 0, 60, 60);
    checksData(diogRight, 60, 0, 0, 60);
}
// Функция проверки
let emptyCell = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAIBJREFUaEPt1AERACAMxLDNv2kE4KALDvjmtnPs7bH/jg/XiyuscGwBpGNBv+8orHBsAaRjQR0tpJGOLYB0LKgrjTTSsQWQjgV1pZFGOrYA0rGgrjTSSMcWQDoW1JVGGunYAkjHgrrSSCMdWwDpWFBXGmmkYwsgHQvqSiONdGyBB/OcAD28PZIvAAAAAElFTkSuQmCC'
function checksData(data, mx, my, lx, ly) {
    let resalt = data.every((el, i, arr) => el.toDataURL() === arr[0].toDataURL() && arr[0].toDataURL() != emptyCell);
    if (resalt) crossField(data, mx, my, lx, ly);
    if (resalt) {
        victory = 'true';
        localStorage.setItem('victory', victory);
    }
    showingWinner();


};
// Зачеркиваем выигрышные поля
function crossField(i, mx, my, lx, ly) {
    let table = document.querySelector('table');
    i.forEach(e => {
        let ctx = e.getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0000CD';
        ctx.moveTo(mx, my);
        ctx.lineTo(lx, ly);
        ctx.stroke();
    });
    savesToLocalstorage();
};

// Показываем окно с победителем
function showingWinner() {
    if(victory == 'true') {
        let winner = document.querySelector('.winner');
        winner.classList.add('winnerActive');        
        namePlayer();
        saveLSWinner();
    }
};

// Удоляем окно с победителем
document.querySelector('.winner__ok').onclick = () => document.querySelector('.winner').classList.remove('winnerActive');

// Показываем в окне победителя кто победил
function namePlayer() {
    let name = document.querySelector('.winner__plyer');
    if(resalt === 1) name.innerHTML = `'O'`;
    if(resalt === 0) name.innerHTML = `'X'`;
}

// Сохраняем в localStorage окно с победителем
function saveLSWinner() {
    let winner = document.querySelector('.winner');
    let winnerPlyer = document.querySelector('.winner__plyer');
    localStorage.setItem('winnerPlyer', winnerPlyer.innerHTML);
    localStorage.setItem('winner', winner.className);
};

// Сохраняем в localStorage  ходы, право первого хода, цвета и все необходимые данные
function savesToLocalstorage() {
    let canvas = Array.from(document.querySelectorAll('canvas'));
    let arrImg = [];
    canvas.forEach(e => arrImg.push(e.toDataURL()));
    localStorage.setItem('url', JSON.stringify(arrImg));
    localStorage.setItem('resalt', resalt);
    localStorage.setItem('colors_O', colors_O);
    localStorage.setItem('colors_X', colors_X);
    localStorage.setItem('target_eO', target_eO);
    localStorage.setItem('target_eX', target_eX);
    localStorage.setItem('victory', victory);

    // Сохраняем классы  игроков
    let drawingTools_X = document.querySelector('.drawingTools__plyer-X');
    let drawingTools_O = document.querySelector('.drawingTools__plyer-O');
    localStorage.setItem('nameClass_X', drawingTools_X.className);
    localStorage.setItem('nameClass_O', drawingTools_O.className);

    // Сохраняем span - "Ваш ход"    
    let span = Array.from(document.querySelectorAll('span'));
    let spanArr = [];
    span.forEach(e => spanArr.push(e.className))
    localStorage.setItem('span', spanArr);   

}

// Сохраняем статус кнопок
function savesToLocalstorageButtom() {
    let buttonComp = document.querySelector('.playingСomputer');
    localStorage.setItem('statusCompBut', buttonComp.hidden);
    
    let buttonOfGame = document.querySelector('.beginningOfGame');
    localStorage.setItem('statusBeginBut', buttonOfGame.hidden);
}

// Сохраняем radioButtom
function saveRadioLocalStor() {
    let radio = Array.from(document.querySelectorAll('[name="radio__plyer"]'));
    let indexChked;
    radio.forEach((e, i) => {
        if(e.checked) indexChked = i;
        
    });
    localStorage.setItem('indexChked', indexChked);
}

// Вставляем  сохраненные результаты
function insertData() {
    let canvas = Array.from(document.querySelectorAll('canvas'));
    if (JSON.parse(localStorage.getItem('url'))) {
        let dataURL = JSON.parse(localStorage.getItem('url'));
        canvas.forEach((e, i) => {
            var img = new Image;
            img.src = dataURL[i];
            img.onload = function () {
                let ctx = e.getContext('2d');
                ctx.drawImage(img, 0, 0);
            };
        })

        // Извлекаем сохраненные данные
        resalt = +localStorage.getItem('resalt');
        colors_O = localStorage.getItem('colors_O');
        colors_X = localStorage.getItem('colors_X');
        target_eO = localStorage.getItem('target_eO');
        target_eX = localStorage.getItem('target_eX');
        victory = localStorage.getItem('victory');
        let img = Array.from(document.querySelectorAll('img'));
        img.forEach(e => {
            if(e.outerHTML === target_eX) e.style.border = `4px solid ${colors_X}`;
            if(e.outerHTML === target_eO) e.style.border = `4px solid ${colors_O}`;
        });

        // Вставляем классы после перезагрузки активному игроку
        let nameClass_X = localStorage.getItem('nameClass_X');
        let nameClass_O = localStorage.getItem('nameClass_O');
        document.querySelector('.drawingTools__plyer-X').className = nameClass_X;
        document.querySelector('.drawingTools__plyer-O').className = nameClass_O;

        // Вставляем span "Ваш ход"
        let span = document.querySelectorAll('span');
        let spanArr = localStorage.getItem('span').split(',');
        span.forEach((e, i) => e.className = spanArr[i]);
        
    }
    // Устанавливаем статусы кнопок
    let statusCompBut = localStorage.getItem('statusCompBut');
    let statusBeginBut = localStorage.getItem('statusBeginBut');
    let playingСomputer = document.querySelector('.playingСomputer');
    let beginningOfGame = document.querySelector('.beginningOfGame');    
    if(statusCompBut === 'true') playingСomputer.hidden = true; 
    if(statusBeginBut === 'true') beginningOfGame.hidden = true;

    // Вставляем radioButtom
    let radio = Array.from(document.querySelectorAll('[name="radio__plyer"]'));
    let indexChked = localStorage.getItem('indexChked');
    if(indexChked === '0' || indexChked === '1') {
        radio.forEach(e => {
            if(localStorage.getItem('compActive') === null) return;
            e.hidden = false;
        });
        radio[indexChked].click();
        // При клике по радиобатен появится сообщение о выборе цвета, скроем его если цвет уже выбран
        if(colors_O !== undefined || colors_X !== undefined) {
            Array.from(document.querySelectorAll('.message')).forEach(e => e.classList.remove('messageActive'));
        }
        determinesProgressComputer();
        if(colors_O === undefined || colors_X === undefined) startsWaitingSelection();
    }

    // Вставляем сохраненный клас окна победителя 'winner'
    if(localStorage.getItem('winner') !== null) {
        let winner = document.querySelector('.winner');
        let winnerPlyer = document.querySelector('.winner__plyer');
        winner.className = localStorage.getItem('winner');       
        winnerPlyer.innerHTML = localStorage.getItem('winnerPlyer');
    }
}   


// Стираем все данные
function erasingData() {
    localStorage.clear();

    resalt = undefined;

    colors_O = undefined, colors_X = undefined;

    createsPlayingField(set_num.value);

    let img = Array.from(document.querySelectorAll('img'));
    img.forEach(e => e.removeAttribute('style'));

    Array.from(document.querySelectorAll('[name="radio__plyer"]'))
    .forEach(e => {
        e.checked = false;
        e.setAttribute('hidden', true);

    });
}

// Играет с компютером
let clear;
let compActive = 'false';

document.querySelector('.playingСomputer').onclick = () => {
    clear = false;
    compActive = 'true';
    localStorage.setItem('compActive', compActive);
    alert('Выбери: "Х" или "О"')
    showsCheckbox();
    startsWaitingSelection();
    determinesProgressComputer();
    removingStartButton(true, '.beginningOfGame');
    savesToLocalstorageButtom();

};
// Вставляем сохраненное значение compActive после перезагрузки
function insertsValue() {
    if( localStorage.getItem('compActive') !== null) {
        compActive = localStorage.getItem('compActive');
    }
}
insertsValue();

// Показываем radiobuttom
function showsCheckbox() {
    let checPlayer = Array.from(document.querySelectorAll('[name="radio__plyer"]'));
    checPlayer.forEach(e => e.removeAttribute('hidden'));
};

// Вешаем событие на чекбоксы
function setСlickСheckbox() {
    if(victory == 'true') return;
    Array.from(document.querySelectorAll('[name="radio__plyer"]'))
    .forEach(e => e.addEventListener('click', function(e) {
        if(compActive === 'false') return;
        definePlayerComputer(e.target)
        saveRadioLocalStor();
        showsMessage();
    }));

}
setСlickСheckbox();

// Определяем чем играет компьютер
let compyter;
function definePlayerComputer(opponent) {
    let plyerX = document.querySelector('.drawingTools__plyer-X');
    let plyerO = document.querySelector('.drawingTools__plyer-O');
    let parent = opponent.parentElement;
    // После выбора выводим сообщение о цвете
    showsMessage();
    return compyter = (parent === plyerX)? plyerO: plyerX;
}

// Компьютер выбирает цвет
function selectsColorComp(color) {
    let img = Array.from(compyter.querySelectorAll('img'));
    img.filter(e => e.getAttribute('onclick').indexOf(color) === -1)[0].click();

}

// Запускаем выбор цвета компьютером после выбора игрока
function startsWaitingSelection() {
    let timerId = setInterval(() => {
        if(colors_O !== undefined) {
            selectsColorComp(colors_O);
            clearInterval(timerId);

        } else if(colors_X !== undefined) {
            selectsColorComp(colors_X);
            clearInterval(timerId);
        }
    }, 2000);
};
// Ходит компьютер
function computerMakesMove() {
    let canvas = Array.from(document.querySelectorAll('canvas'));
    let arrCanvas = canvas.filter(e => e.toDataURL() === emptyCell);
    let num = Math.floor(Math.random() * ((arrCanvas.length - 1) - 0 + 1));
    arrCanvas[num].click();
}

//  Когда ход компьютера
function determinesProgressComputer() {
    let timerId = setInterval(() => { 
        if(!compyter) return;       
        if(compyter.classList.contains('drawingTools__plyer-X')  && resalt === 1) computerMakesMove();
        if(compyter.classList.contains('drawingTools__plyer-O') && resalt === 0) computerMakesMove();
        if(victory == 'true') clearInterval(timerId);
        if(definesDraw() === true) clearInterval(timerId);
        if(clear === true) clearInterval(timerId);
    }, 2000);
}

// Определяем ничью
function definesDraw() {
    let canvas = Array.from(document.querySelectorAll('canvas'));
    let arrCanvas = canvas.filter(e => e.toDataURL() === emptyCell);
    if(arrCanvas.length === 0 && victory != 'true') {
        showMessageDraw();
        return true;
    }
    
}
// Покажем сообщения о ничьей
function showMessageDraw() {
    let winner = document.querySelector('.winner');
    let winnerChild = winner.children;
    winnerChild[1].innerHTML = 'У вас ничья :)'; 
    winnerChild[2].innerHTML = ' ';
    winner.classList.add('winnerActive');
}
// Очищаем поле
document.querySelector('.clearingOfGame').onclick = () => {
    victory = false;
    clear = true;
    erasingData();
    removePlayerSelection();
    removingStartButton(false, '.beginningOfGame');
    removingStartButton(false, '.playingСomputer');
    removeMessage();
}

// Скрываем или показываем кнопку кнопку начать игру есле играем с компьютером
function removingStartButton(bool, selector) {
    let button = document.querySelector(selector);
    button.hidden = bool;
}

// Удоляем сообщение о выборе цвета
function removeMessage() {
    let message = Array.from(document.querySelectorAll('.message'));
    message.forEach(e => e.classList.remove('messageActive'));
};


insertData();