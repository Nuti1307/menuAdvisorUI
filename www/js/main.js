// https://api.locu.com/v1_0/venue/search/?location=37.386%2C%20-121.96&radius=50000&api_key=3a21b14ad98faef37dbc4b8b5eda6056427fe040
var globalData = new Object();
globalData.restaurantLocuId = "f079dc1e5d89c15f12c5";
globalData.restaurantName = "testing";
globalData.currentRestaurantName = "";

var restaurantList = new Array();

function populateAutoCompleteItems()
{
    navigator.geolocation.getCurrentPosition(getRestaurant);
}

function getRestaurant(location)
{
    var url = "https://api.locu.com/v1_0/venue/search/?location=";
    url += location.coords.latitude;
    url += "%2C%20";
    url += location.coords.longitude;
    url += "&category=restaurant";
    url += "&radius=" + "8046"; // approx 5 miles
    url += "&api_key="+ apiKey;
    
    setDefaultRestaurantBasedOnCurrentLocation(location.coords.latitude, location.coords.longitude);

    $.ajax({
      dataType: "jsonp",
      url: url,
      success: getRestaurantSuccessCallback
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
    if (restaurantList.length == 0)
    {
        restaurantElem.value = "Enter restaurant name";
    }
    else
    {
        restaurantElem.value = restaurantList[0].name;
    }
}

function setDefaultRestaurantBasedOnCurrentLocation(lat, longitude)
{
    var url = "https://api.locu.com/v1_0/venue/search/?location=";
    url += lat;
    url += "%2C%20";
    url += longitude;
    url += "&category=restaurant";
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
}