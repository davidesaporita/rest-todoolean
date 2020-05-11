// API Vars
var $apiUrl = 'http://157.230.17.132:3019/todos';
var settingsGET = { url: $apiUrl, method: 'GET' }
var settingsPOST = { url: $apiUrl, method: 'POST', data: { text: '' } }

$(document).ready(function() {

    // Refs
    var list = $('.list-items');
    var input = $('.input-text');

    // Init Handlebars
    var source = $('#item-template').html();
    var template = Handlebars.compile(source);    

    populate(template, list);

    // Event on keyup | input
    input.keyup((e) => {
        if(e.which === 13 || e.keyCode === 13) {
            addToDo(input.val().trim(), template, list);
        }
    });

}); // End of ready function

/*** FUNCTIONS ***/

function populate(template, list){
    $.ajax(settingsGET)
        .done(data  => { printItems(data, template, list); })
        .fail(error => { console.log('fail' + error); });
}

function printItems(data, template, ref) {
    ref.html('');
    data.forEach(item => { ref.append(template(item)); });
}

function addToDo(newValue, template, list) {    
    settingsPOST.data = { text : newValue }
    
    $.ajax(settingsPOST)
        .done(data  => { populate(template, list); })
        .fail(error => { console.log('fail' + error); });
}