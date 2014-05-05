/*
function submitRating()
{
    var selectElem = document.getElementById("rate_menuList");
    var dishName = selectElem.options[selectElem.selectedIndex].value;
    var comment = document.getElementById("comment").value;
    var rating = $('#rateit').rateit('value');
    var jsonData = new Object();
    jsonData.locu_id = globalData.restaurantLocuId;
    jsonData.restaurant_name = globalData.restaurantName,
    jsonData.menu_name = dishName;
    jsonData.rating = rating.toString();
    jsonData.comment = comment;
    jsonData.user_id = "1";
    callSubmitRatingApi(JSON.stringify(jsonData));
}

function callSubmitRatingApi(body) { 
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/storerating";
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: url,
      data: body,
      success: null
    });
}

*/
function handleRate(evt){
     setSelectedRestaurant();
     getMenu(globalData.restaurantLocuId, getMenuCallback);
     activate_subpage("#rate_screen"); 
}

function submitRating()
{
    var selectElem = document.getElementById("rate_menuList");
    var dishName = selectElem.options[selectElem.selectedIndex].value;
    var comment = document.getElementById("comment").value;
    var rating = $('#rateit').rateit('value');
    var jsonData = new Object();
    var picture = document.getElementById("picture").files[0];

    var newData = new FormData();
    newData.append("locu_id", globalData.restaurantLocuId);
    newData.append("restaurant_name", globalData.restaurantName);
    newData.append("menu_name", dishName);
    newData.append("rating", rating.toString());
    newData.append("user_id", "1");
    newData.append("comment", comment);
    newData.append("upload_file", picture);
    callSubmitRatingApi(newData);
}

function callSubmitRatingApi(body) { 
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/storerating";
    $.ajax({
      type: "POST",
      dataType:'json',
      contentType:'multipart/form-data',
      url: url,
      data: body,
      cache: false,
      contentType: false,
      processData: false,
      success: null
    });
}