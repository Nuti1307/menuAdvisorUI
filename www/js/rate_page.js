function handleRate(evt){
     setSelectedRestaurant();
     var restaurentNameElem = document.getElementById("rate_restaurentName");
     restaurentNameElem.innerHTML = globalData.restaurantName;
     setTimeout(getMenu(globalData.restaurantLocuId, getMenuCallback), 0);
}

function submitRating()
{
    var selectElem = document.getElementById("rate_menuList");
    var dishName = selectElem.options[selectElem.selectedIndex].value;
    var comment = document.getElementById("comment").value;
    var rating = $('#rateit').rateit('value');
    var jsonData = new Object();
    var picture = document.getElementById("picture").files[0];
    var user = document.getElementById("user").value;
    if (user == "")
        user = "Anonymous";
    
    /*var newData = new FormData();
    newData.append("locu_id", globalData.restaurantLocuId);
    newData.append("restaurant_name", globalData.restaurantName);
    newData.append("menu_name", dishName);
    newData.append("rating", rating.toString());
    newData.append("user_id", user);
    newData.append("comment", comment);
    newData.append("upload_file", picture);   
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/storerating";
    $.ajax({
      type: "POST",
      contentType:'multipart/form-data',
      url: url,
      data:  newData,
      cache: false,
      timeout: 5000,
      contentType: false,
      processData: false,
      success: function() {
          globalData.refresh = true;
          handleDiscover();
          document.getElementById('back_rate').click();
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
         handleDiscover();
         document.getElementById('back_rate').click();
      } 
    });*/
}

function HandleRateSubmit()
{
    RatePopulateValues();
    handleDiscover();
    
    //document.getElementById('rate_form').submit();
}

function RateBack()
{
    $.mobile.changePage("#discover");
}
function RatePopulateValues()
{
    var rating = $('#rateit').rateit('value');
    var locuid = document.getElementById('rate_locu_id');
    var restaurant_name = document.getElementById('rate_restaurant_name');
    var rate_rating = document.getElementById('rate_rating');
    rate_rating.value = rating.toString();
    restaurant_name.value = globalData.restaurantName;
    locuid.value = globalData.restaurantLocuId;    
}

function resetRateScreenValues()
{
    $('#rateit').rateit('reset');
    document.getElementById("rate_form").reset();
}