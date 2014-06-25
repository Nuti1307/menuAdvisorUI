// https://api.locu.com/v1_0/venue/search/?location=37.386%2C%20-121.96&radius=50000&api_key=3a21b14ad98faef37dbc4b8b5eda6056427fe040
var globalData = new Object();
globalData.restaurantLocuId = "f079dc1e5d89c15f12c5";
globalData.restaurantName = "testing";
globalData.currentRestaurantName = "";
globalData.refresh = false;
globalData.fbUserId = "";
globalData.fbUserName = "";
globalData.fbUserEmail = "";

var restaurantList = new Array();

function populateAutoCompleteItems()
{
    $(document).ready(function() { 
 
      // Setup the ajax indicator
      $('body').append('<div id="ajaxBusy"><p><img src="images/loading.gif"></p></div>');

      $('#ajaxBusy').css({
        display:"block",
        margin:"0px",
        paddingLeft:"0px",
        paddingRight:"0px",
        paddingTop:"0px",
        paddingBottom:"0px",
        position:"absolute",
        right:"3px",
        top:"3px",
        width:"auto"
      });
    });
    jQuery.ajaxSetup({
        beforeSend: function() {
             $('#ajaxBusy').show(); 
        },
        complete: function(){
             $('#ajaxBusy').hide();
             if($.mobile.activePage[0].id === "splash")
                $.mobile.changePage("#homepage");
        }
    });
    navigator.geolocation.getCurrentPosition(getRestaurant, handleLocationError);
}
function handleLocationError(error)
{
    switch(error.code) 
    {
    case error.PERMISSION_DENIED:      
    case error.POSITION_UNAVAILABLE:
    case error.TIMEOUT:
    case error.UNKNOWN_ERROR:
    var restaurantElem = document.getElementById("restaurantname");
    restaurantElem.value = "Location services unavailable";
    }
    
}

function getRestaurant(location)
{
    setTimeout(setDefaultRestaurantBasedOnCurrentLocation(location.coords.latitude, location.coords.longitude), 0);

    $( "#restaurantname" ).autocomplete(
	{
		 source: function( request, response ) {
            var url = "https://api.locu.com/v1_0/venue/search/?location=";
            url += location.coords.latitude;
            url += "%2C%20";
            url += location.coords.longitude;
            url += "&category=restaurant";
            url += "&has_menu=true";
            url += "&radius=" + "16000"; // approx 10 miles
            url += "&api_key="+ apiKey;
            url += "&name="+request.term;
        $.ajax({
          url: url,
          dataType: "jsonp",          
          success: function( data ) {
              // We read each json result item and collect params we care. 
              // Once the item gets selected, we can retrieve params.
                response( $.map( data.objects, function( item ) { 
                  return {
                    label: item.name + ", " + item.locality,
                    value: item.name + ", " + item.locality,
                    locuid: item.id
                  }
               }));
            }
        });
      },
      minLength: 2,
      select: function( event, ui ) { // This function is invoked when the drop down is selected.
          globalData.restaurantLocuId = ui.item.locuid;
          globalData.restaurantName = ui.item.label;
      }
	});
}

function compare(a,b) 
{
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
function getRestaurantSuccessCallback(data)
{
    var restaurantList = getRestaurantList(data);
    var restaurantNameListElem = [];
    restaurantList.sort(compare);
    for(var i = 0; i < restaurantList.length; i++)
    {
        restaurantNameListElem.push({
            label: restaurantList[i].name,
            value: restaurantList[i].name
        });
    }
    $( "#restaurantname" ).autocomplete(
	{
		 source:restaurantNameListElem
	});
    // set the default restaurant name in search box
}


function getRestaurantList(jsonObject)
{
    restaurantList.length = 0;
    for(var restaurantIndex = 0; restaurantIndex < jsonObject.objects.length; restaurantIndex++)
    {
        var shop = jsonObject.objects[restaurantIndex];
        var isRestaurant = false;
        for(var categoryIndex = 0; categoryIndex < shop.categories.length; categoryIndex++) {
            if(shop.categories[categoryIndex] == "restaurant")
                isRestaurant = true;
        }
        if(isRestaurant == true && shop.has_menu == true) {
            console.log("restaurentName="+shop.name);
            var restaurantObject = new Object();
            restaurantObject.name = shop.name;
            restaurantObject.locuId = shop.id;
            restaurantObject.streetAddress = shop.street_address;
            restaurantList.push(restaurantObject);
        } else {
            console.log("Ignoring shop="+shop.name);
        }
    }
    return restaurantList;
}

function createRestaurantOptionUIElement(restaurantName) {
    var htmlOptionElem = document.createElement("option");
    htmlOptionElem.setAttribute("value", restaurantName);
    return htmlOptionElem;
}
function setSelectedRestaurant()
{
    var restaurantElem = document.getElementById("restaurantname");
    globalData.restaurantName = restaurantElem.value;
    for(var i = 0; i < restaurantList.length; i++)
    {
        if(restaurantList[i].name == globalData.restaurantName)
            globalData.restaurantLocuId = restaurantList[i].locuId;
    }
}
function setDefaultRestaurantCallback(data)
{
    var restaurantList = getRestaurantList(data);
    var restaurantElem = document.getElementById("restaurantname");
    if (restaurantList.length != 0)
    {
        restaurantElem.value = restaurantList[0].name;
        globalData.restaurantName = restaurantList[0].name;
        globalData.restaurantLocuId = restaurantList[i].locuId;
    }
}

function setDefaultRestaurantBasedOnCurrentLocation(lat, longitude)
{
    var url = "https://api.locu.com/v1_0/venue/search/?location=";
    url += lat;
    url += "%2C%20";
    url += longitude;
    url += "&category=restaurant";
    url += "&has_menu=true";
    url += "&radius=" + "50"; // search within 50 meters
    url += "&api_key="+ apiKey;
    $.ajax({
      dataType: "jsonp",
      url: url,
      success: setDefaultRestaurantCallback
    });
}
function Clear(target)
{
    target.value = "";
    $('#restaurantname').attr('placeholder','');
}


function onPageLoad() {
    // check if already logged in
    var showDialog = globalData.fbUserId === "";
    if(showDialog)
    {
        $( "#popupLogin" ).popup();
        $( "#popupLogin" ).popup( "open" );
    }
}