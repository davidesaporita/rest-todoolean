// API Vars
var $apiUrl = 'http://157.230.17.132:3019/todos';
var settingsGET = { url: $apiUrl, method: 'GET' }
var settingsPOST = { url: $apiUrl, method: 'POST' }

$(document).ready(function() {

    // Refs
    var list = $('.list-items');
    var input = $('.input-text');

    // Init Handlebars
    var source = $('#item-template').html();
    var template = Handlebars.compile(source);    

    populate(template, list);

}); // End of ready function

/*** FUNCTIONS ***/

function populate(template, list){
    $.ajax(settingsGET)
    .done(data  => { printItems(data, template, list); })
    .fail(error => { console.log('fail' + error); });
}

function printItems(data, template, ref) {
    data.forEach(item => { ref.append(template(item)); });
}

