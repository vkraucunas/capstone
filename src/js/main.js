$('#module-content').hide();
$('#resources-content').hide();
$('#about-content').hide();

$('#modules').on('click', function() {
    $('#home-content').hide();
    $('#resources-content').hide();
    $('#about-content').hide();
    $('#module-content').fadeIn();
})

$('#resources').on('click', function() {
    $('#home-content').hide();
    $('#about-content').hide();
    $('#module-content').hide();
    $('#resources-content').fadeIn();
})

$('#home').on('click', function() {
    $('#about-content').hide();
    $('#module-content').hide();
    $('#resources-content').hide();
    $('#home-content').fadeIn();
})

// $('#about').on('click', function() {
//     $('#module-content').hide();
//     $('#resources-content').hide();
//     $('#home-content').hide();
//     $('#about-content').fadeIn();
// })