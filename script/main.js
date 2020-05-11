// API Vars
var apiUrl = 'http://157.230.17.132:3019/todos';
var settingsGET =    { url: apiUrl, method: 'GET' }
var settingsPOST =   { url: apiUrl, method: 'POST', data: { text: '' } }
var settingsDELETE = { url: apiUrl, method: 'DELETE' }
var settingsPUT =    { url: apiUrl, method: 'PUT' }

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

    app.on('click','.edit', function() {
        updateToDo($(this), template, list);    
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

// crUd - Update element
function updateToDo(self, template, list) {
    var selfId = self.parents('li.item').data('id');

    // Refs
    var itemToUpdate = $('.item[data-id=' + selfId + ']');
    var app = $('#app');
    var textToUpdate = itemToUpdate.children('.text');
    var input = itemToUpdate.children('.text-update');

    textToUpdate.toggle();
    input.toggle();

    // Event on keyup | input
    app.on('keyup', '.text-update', function(e) {
        if(e.which === 13 || e.keyCode === 13) {
            var newValue = input.val().trim();

            settingsPUT.url += ('/' + selfId);
            settingsPUT.data = { text: newValue };  
            console.log(settingsPUT);

            $.ajax(settingsPUT)
                .done(data  => { populate(template, list); })
                .fail(error => { console.log('fail' + error); })
                .always(()  => { 
                    textToUpdate.toggle();
                    input.toggle();
                    settingsPUT.url = apiUrl; 
                });
        }
        e.stopPropagation();
    });
}