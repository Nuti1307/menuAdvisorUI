function handleRate(evt){
     setSelectedRestaurant();
     var restaurentNameElem = document.getElementById("rate_restaurentName");
     restaurentNameElem.innerHTML = globalData.restaurantName;
     getMenu(globalData.restaurantLocuId, getMenuCallback);
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
    callSubmitRatingApi(newData, dishName);
}

function callSubmitRatingApi(body, dishName) { 
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/storerating";
    $.ajax({
      type: "POST",
      contentType:'multipart/form-data',
      url: url,
      data: body,
      cache: false,
      contentType: false,
      processData: false,
      callbackData: dishName,
      success: function() {
          // Fix Id Issue. There is no menuId. So add rest api which takes menuName and populates the menuDetails Page
          // Or add a rest api which takes menuName & returns Id. Prefer the first one
          populateMenuComments(1, this.callbackData);
          $.mobile.changePage( $("#menu_detail"), { transition: "slideup", changeHash: false });
      }
    });
}