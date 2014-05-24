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
    url += "&radius=" + "50000"; // 50km = approx 30 miles
    url += "&api_key="+ apiKey;

    $.ajax({
      dataType: "jsonp",
      url: url,
      success: getRestaurantSuccessCallback
    });
}

function getRestaurantSuccessCallback(data)
{
    var restaurantList = getRestaurantList(data);
    var restaurantNameListElem = [];
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
    setDefaultRestaurantBasedOnCurrentLocation();
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

function setDefaultRestaurantBasedOnCurrentLocation()
{
    globalData.restaurantLocuId = restaurantList[0].locuId;
    globalData.restaurantName = restaurantList[0].name;
    var restaurantElem = document.getElementById("restaurantname");
    restaurantElem.value = globalData.restaurantName;
}
function Clear(target)
{
    target.value = "";
}