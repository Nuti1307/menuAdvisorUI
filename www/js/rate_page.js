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

    var newData = new FormData();
    newData.append("locu_id", globalData.restaurantLocuId);
    newData.append("restaurant_name", globalData.restaurantName);
    newData.append("menu_name", dishName);
    newData.append("rating", rating.toString());
    newData.append("user_id", user);
    newData.append("comment", comment);
    newData.append("upload_file", picture);
    callSubmitRatingApi(newData);
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
      success: function() {
          handleDiscover();
          $.mobile.changePage( $("#discover"), { transition: "slideup", changeHash: false });
      }
    });
}