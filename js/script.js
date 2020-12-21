var txtFile = document.getElementById('file');
var txtResponse = document.getElementById('response');
var btnGenerate = document.getElementById('btn-generate');
var historyElement = document.getElementById('history');
var database = 'EXTRACT-CODE-DB';
var historyCode = [];
var clickCount = 0;

function generate(e) {
    e.preventDefault();
    var text = txtFile.value;
    if (text == '') {
        if (clickCount == 2) {
            alert('informe os produtos');
            clickCount = 0;
        } else {
            clickCount++;
        }
        return
    }
    var lines = text.split('\n');
    var response = '';

    for (var line of lines) {
        if (line == '') {
            continue;
        }
        var word = getFirstWordFromLine(line);
        if (word != '') {
            response += word + ',';
        }
    }

    response = formatResponse(response);
    txtResponse.value = response;
    saveGeneration(response);
}

function getFirstWordFromLine(line) {
    var words = line.split(' ');
    return formatProductCode(formatProductCode(words[0]));
}

function formatProductCode(code) {
    var response = '';
    for (var letter of code) {
        if (letter == ' ' || letter == '\t') {
            break;
        }
        response += letter;
    }
    return response;
}

function formatResponse(response) {
    var responseLength = response.length;
    if (response.lastIndexOf(',') == responseLength - 1) {
        return response.slice(0, responseLength - 1);
    }
    return response;
}

function saveGeneration(response) {
    var date = getFormatedDate();
    var idGeneration = Date.now();

    var data = {
        id: idGeneration,
        date: date,
        codes: response
    }

    historyCode.push(data);
    var saveFormatData = JSON.stringify(historyCode);
    localStorage.setItem(database, saveFormatData);
    getHistory();
}

function getFormatedDate() {
    var date = new Date(),
        dia = date.getDate().toString().padStart(2, '0'),
        mes = (date.getMonth() + 1).toString().padStart(2, '0'),
        ano = date.getFullYear(),
        hora = date.getHours(),
        min = date.getMinutes(),
        seg = date.getSeconds();
    return `${dia}/${mes}/${ano} - ${hora}:${min}:${seg}`;
}

function getHistory() {
    var savedData = localStorage.getItem(database);
    var data = JSON.parse(savedData);
    if (data != null) {
        historyCode = data.reverse();
    }
    showSavedData();
}

function createHeaderHistoryElement() {
    var listElement = document.createElement('li');
    var titleElement = document.createElement('h4');
    var descriptionElement = document.createElement('p');
    listElement.setAttribute('class', 'collection-header center');

    listElement.appendChild(titleElement);
    listElement.appendChild(descriptionElement);

    titleElement.innerHTML = 'Histórico';
    descriptionElement.innerHTML = 'Lista dos últimos códigos gerados';
    return listElement;
}

function createDataElement(data) {
    var listElement = document.createElement('li');
    var titleElement = document.createElement('p');
    var codesElement = document.createElement('p');
    listElement.setAttribute('class', 'collection-item');
    titleElement.style.fontWeight = 'bold';

    listElement.appendChild(titleElement);
    listElement.appendChild(codesElement);

    titleElement.innerHTML = data.date;
    codesElement.innerHTML = data.codes;

    listElement.addEventListener('click', () => {
        txtResponse.value = data.codes
    });

    return listElement;
}

function showSavedData() {
    historyElement.innerHTML = '';
    historyElement.appendChild(createHeaderHistoryElement());
    if (historyCode != null) {
        for (var data of historyCode) {
            historyElement.appendChild(createDataElement(data));
        }
    }
}

btnGenerate.addEventListener('click', generate);
addEventListener('load', getHistory);