// API Vars
var apiUrl = 'http://157.230.17.132:3019/todos';
var settings_GET =    { url: apiUrl, method: 'GET' }
var settings_POST =   { url: apiUrl, method: 'POST', data: { text: '' } }
var settings_DELETE = { url: apiUrl, method: 'DELETE' }
var settings_PUT =    { url: apiUrl, method: 'PUT', data: { text: '' } }

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

    mouseListener();

    app.on('click','.remove', function() {
        deleteToDo($(this), template, list);    
    });

    app.on('click','.edit', function() {
        updateToDo($(this), template, list);
    });

}); // End of ready function

/*** FUNCTIONS ***/

function populate(template, list){
    $.ajax(settings_GET)
        .done(data  => { printItems(data, template, list); })
        .fail(error => { console.log('fail' + error); });
}

function printItems(data, template, ref) {
    ref.html('');
    data.forEach(item => { ref.append(template(item)); });
}

// CRud - Add new element
function addToDo(newValue, template, list) {    
    settings_POST.data = { text: newValue };
    $.ajax(settings_POST)
        .done(data  => { populate(template, list); })
        .fail(error => { console.log('fail' + error); });
}

// cruD - Delete element
function deleteToDo(self, template, list) {
    var selfId = self.parents('li.item').data('id');
    settings_DELETE.url += '/' + selfId;

    $.ajax(settings_DELETE)
        .done(data  => { populate(template, list); })
        .fail(error => { console.log('fail' + error); })
        .always(()  => { settings_DELETE.url = apiUrl; });
}

// crUd - Update element
function updateToDo(self, template, list) {
    var selfId = self.parents('li.item').data('id');

    // Refs
    var itemToUpdate = $('.item[data-id=' + selfId + ']');
    var app = $('#app');
    var textToUpdate = itemToUpdate.children('.text');
    var input = itemToUpdate.children('.text-update');
    var arrow = itemToUpdate.children('.hidden-arrow');
    var otherItems = itemToUpdate.siblings();    

    textToUpdate.toggle();
    input.toggle();
    input.focus();
    arrow.toggle();
    otherItems.toggleClass('opacity');

    app.off('mouseenter');
    app.off('mouseleave');

    // Event on keyup | input
    app.on('keyup', '.text-update', function(e) {
        if(e.which === 13 || e.keyCode === 13) {
            var newValue = input.val().trim();
            settings_PUT.url += ('/' + selfId);
            settings_PUT.data = { text: newValue };  

            $.ajax(settings_PUT)
                .done(data  => { populate(template, list); })
                .fail(error => { console.log('fail' + error); })
                .always(()  => { 
                    textToUpdate.toggle();
                    input.toggle();
                    arrow.toggle();
                    settings_PUT.url = apiUrl;
                    app.off('keyup');
                    mouseListener();
                });
        }
    });
}

function mouseListener() {
    $('#app').on('mouseenter','li', function() {        
        $(this).children('.actions').toggle();
    });

    $('#app').on('mouseleave','li', function() {        
        $(this).children('.actions').toggle();
    });
}