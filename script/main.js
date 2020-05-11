// API Vars
var apiUrl = 'http://157.230.17.132:3019/todos';
var settingsGET = { url: apiUrl, method: 'GET' }
var settingsPOST = { url: apiUrl, method: 'POST', data: { text: '' } }
var settingsDELETE = { url: apiUrl, method: 'DELETE' }

$(document).ready(function() {

    // Refs
    var app = $('#app');
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

    app.on('click','.remove', function() {
        deleteToDo($(this), template, list);    
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

// CRud - Add new element
function addToDo(newValue, template, list) {    
    settingsPOST.data = { text: newValue };
    $.ajax(settingsPOST)
        .done(data  => { populate(template, list); })
        .fail(error => { console.log('fail' + error); });
}

// cruD - Delete element
function deleteToDo(self, template, list) {
    var selfId = self.parents('li.item').data('id');
    settingsDELETE.url += '/' + selfId;

    $.ajax(settingsDELETE)
        .done(data  => { populate(template, list); })
        .fail(error => { console.log('fail' + error); })
        .always(()  => { settingsDELETE.url = apiUrl; });
}