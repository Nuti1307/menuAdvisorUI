
function fetchMenuList(restaurantId) {
    alert("got it");
    var url = 'https://nodejs-menuadvisor.rhcloud.com/api/menulist?restaurantid='+restaurantId;
    var html = '<hr />';
    
	$.getJSON(url, function (json) {
        var index = 0;
        $.each(json, function(key, val) {
            html += '<div id="box-' + index++ + '"class="box">/>';
            html += ' ' + val.avg_rating + '%';
            html += '<p>' + val.name + '</a></p></div>';
        });
    });
    $("#menu-listings-output").append(html);	
}