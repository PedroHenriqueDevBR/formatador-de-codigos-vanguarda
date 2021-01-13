var txtFile             = document.getElementById('file');
var txtResponse         = document.getElementById('response');
var btnGenerate         = document.getElementById('btn-generate');
var btnRemoveAll        = document.getElementById('btn-remove-all');
var btnSaveMemoryCodes  = document.getElementById('btn-save-memory-codes');
var historyElement      = document.getElementById('history');
var txtShowDataCodes    = document.getElementById('show-data-codes');
var txtShowDataProducts = document.getElementById('show-data-products');
var txtMemoryCodes      = document.getElementById('memory-codes');
var txtShowDataDate     = document.getElementById('show-data-date');
var database            = 'EXTRACT-CODE-DB';
var memoryDatabase      = 'MEMORY-CODE-DB';
var historyCode         = [];
var clickCount          = 0;

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

    var finalResult = '';    
    for (var letter of response) {
        if (isNaN(Number(letter)) ) {
            finalResult += ',';
        } else {
            finalResult += letter;
        }
    }

    while (finalResult.indexOf(',,') != -1) {
        finalResult = finalResult.replaceAll(',,', ',')
    }

    response = removeFirtsComma(finalResult);
    response = removeLastComma(response);

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

function removeLastComma(response) {
    var responseLength = response.length;
    if (response.lastIndexOf(',') == responseLength - 1) {
        return response.slice(0, responseLength - 1);
    }
    return response;
}

function removeFirtsComma(response) {
    var responseLength = response.length;
    if (response[0] == ',') {
        return response.slice(1, responseLength);
    }
    return response;
}

function saveGeneration(response) {
    var date = getFormatedDate();
    var idGeneration = Date.now();
    var products = txtFile.value;

    var data = {
        id: idGeneration,
        products: products,
        date: date,
        codes: response
    }

    historyCode.push(data);
    var saveFormatData = JSON.stringify(historyCode);
    localStorage.setItem(database, saveFormatData);
    getHistory();
}

function saveData(data) {
    localStorage.setItem(database, data);
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
    return `${dia}/${mes}/${ano} às ${hora}:${min}:${seg}`;
}

function getHistory() {
    var savedData = localStorage.getItem(database);
    if (savedData != null && savedData != '') {
        var data = JSON.parse(savedData);
        if (data != null && data != '') {
            historyCode = data;
            historyCode.sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                if (a.date < b.date) {
                    return 1;
                }
                return 0;
            });
        }
    }
    showSavedData();
}

function createDataElement(data) {
    var listElement = document.createElement('li');
    var titleElement = document.createElement('p');
    var codesElement = document.createElement('p');
    var btnShowElement = document.createElement('button');
    var btnRemoveElement = document.createElement('button');

    listElement.setAttribute('class', 'collection-item');
    titleElement.style.fontWeight = 'bold';
    btnShowElement.setAttribute('class', 'waves-effect waves-light btn-small blue modal-trigger')
    btnShowElement.setAttribute('data-target', 'show-data-modal');
    btnRemoveElement.setAttribute('class', 'waves-effect waves-light btn-small red')
    btnShowElement.style.marginRight = '5px';

    listElement.appendChild(titleElement);
    listElement.appendChild(codesElement);
    listElement.appendChild(btnShowElement);
    listElement.appendChild(btnRemoveElement);

    titleElement.innerHTML = data.date;
    codesElement.innerHTML = data.codes;
    btnShowElement.innerHTML = 'mostrar';
    btnRemoveElement.innerHTML = 'remover';

    btnShowElement.addEventListener('click', () => {
        txtShowDataDate.innerHTML = 'Gerado em: ' + data.date;
        txtShowDataCodes.value = data.codes;
        txtShowDataProducts.value = data.products;
    });

    btnRemoveElement.addEventListener('click', () => {
        removeData(data.id);
    });

    return listElement;
}

function showSavedData() {
    historyElement.innerHTML = '';
    if (historyCode != null) {
        for (var data of historyCode) {
            historyElement.appendChild(createDataElement(data));
        }
    }
}

function removeData(id) {
    var response = [];
    for (var data of historyCode) {
        if (data.id == id) {
            continue;
        }
        response.push(data);
    }
    historyCode = response;
    formatedResponse = JSON.stringify(response);
    saveData(formatedResponse);
}

function removeAll() {
    if (window.confirm('Deseja remover todos os dados?')) {
        localStorage.setItem(database, '');
        historyCode = [];
        getHistory();
    }
}

function saveMemoryCodes() {
    console.log('Dados salvos');
    var memoryCodes = txtMemoryCodes.value;
    localStorage.setItem(memoryDatabase, memoryCodes);
}

function getSavedCodes() {
    var savedMemoryCodes = localStorage.getItem(memoryDatabase);
    txtMemoryCodes.value = savedMemoryCodes;
}

btnGenerate.addEventListener('click', generate);
btnRemoveAll.addEventListener('click', removeAll);
btnSaveMemoryCodes.addEventListener('click', saveMemoryCodes);
addEventListener('load', getHistory);
addEventListener('load', getSavedCodes);
