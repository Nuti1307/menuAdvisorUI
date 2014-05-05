// https://nodejs-menuadvisor.rhcloud.com/api/menulist?restaurantid=xyz
// assuming json return to have something link below
// {
//  "name" :
// }
//$("#discoverbutton").click(function(evt)
function handleDiscover(evt){
     setSelectedRestaurant();
     getAllDishFromDB(globalData.restaurantLocuId);
    // $('#discover').click();//("#menu_listing"); 
}//);
function getAllDishFromDB(restaurentLocuId) {
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/menulist?restaurantid=";
    url += 'xyz'; // TODO: Remove later
    $.ajax({
        datatype: "jsonp",
        url: url,
        callbackData: {restaurentLocuId: restaurentLocuId},
        success: getAllDishFromDBSuccessCallback
    });
}

// do not call locu if we get N already from DB
function getAllDishFromDBSuccessCallback(data) {
    var numToDisplayInDiscoverPage = 10;
    for (var i = 0; i < data.length; i++)
    {
        data[i].isLocu = 0;
        insertMenuItemInUIList(data[i]);
    }

    if (data.length < 10) {
        // if we do not get atleast numToDisplayInDiscoverPage from DB then display everything that we get from locu
        getMenu(this.callbackData.restaurentLocuId, getMenuFromLocuSuccessCallback);
    }
    
}
                
function getMenuFromLocuSuccessCallback(data) {
    var dishList = getDishNames(data);
    var menuItem = new Object();
    for (var i = 0; i < dishList.length; i++)
    {
        menuItem.name = dishList[i];
        menuItem.isLocu = 1;
        insertMenuItemInUIList(menuItem);
    }
}
function resizePicture2Thumbnail() {
    maxheight=100;
    maxwidth= 100;
    imgs=document.getElementsByTagName("img");
    for (p=0; p<imgs.length; p++) {

        w=parseInt(imgs[p].width);
        h=parseInt(imgs[p].height);
        if (parseInt(imgs[p].width)>maxwidth) {
            imgs[p].style.cursor="pointer";
            //imgs[p].onclick=new Function("iw=window.open(this.src,'ImageViewer','resizable=1');iw.focus()");
            imgs[p].height=(maxwidth/imgs[p].width)*imgs[p].height;
            imgs[p].width=maxwidth;
        }
        if (parseInt(imgs[p].height)>maxheight) {
            imgs[p].style.cursor="pointer";
            //imgs[p].onclick=new
            //Function("iw=window.open(this.src,'ImageViewer','resizable=1');iw.focus()");
            imgs[p].width=(maxheight/imgs[p].height)*imgs[p].width;
            imgs[p].height=maxheight;
        }

    }
}

function getPictureHTML(menuItem)
{
    var url = 'https://nodejs-menuadvisor.rhcloud.com/api/menu?menuid='+menuItem.id;
    var ret = '';
    $.ajax({
      url: url,
      async: false,
      dataType: 'json',
      success: function (data) {
        ret += '<img src="https://nodejs-menuadvisor.rhcloud.com/' + data[0].picture + '" onload="resizePicture2Thumbnail()"/>';    
      }
    });
    
    return ret;
}

function populateRatingMenuItem(event)
{
    if (!e) {
        var e=window.event;
    }
    if (e.target) {
        targ=e.target;
    }
    else if (e.srcElement) {
        targ=e.srcElement;
    }
    //var tname=targ.tagName;
    var menuItemName = targ.getAttribute('data-menuitemsdata-name');
    //globalData.menuItem = menuItem;
    
    var selectBoxOption = document.createElement("option");
    selectBoxOption.value = menuItemName;
    selectBoxOption.text = menuItemName;
    document.getElementById("rate_menuList").remove();
    document.getElementById("rate_menuList").add(selectBoxOption, null);
}
var i=0;
function insertMenuItemInUIList(menuItem)
{
    var menuListElement = document.getElementById("discoverPageMenuList");
    var a = document.createElement("a");
    var li = document.createElement("li");    
    a.innerHTML = "<p style='font-size:15px'>"+menuItem.name+"</p>";
    
    //li.data('menuitemsdata', menuItem.name);
    li.id=++i;
    a.setAttribute('data-menuitemsdata-name', menuItem.name);
    a.setAttribute('data-menuitemsdata-id', menuItem.id);
    if (typeof menuItem.avg_rating != "undefined") {
        a.innerHTML += "<br />";    
        a.innerHTML += "<p>Rating: "+ menuItem.avg_rating + "</p>";   
        
        //a.innerHTML += "<br />";
        a.innerHTML += getPictureHTML(menuItem);       
        
        a.addEventListener("mousedown", function(e) { 
            var targ;
            if (e.target) {
                targ=e.target;
            }
            else if (e.srcElement) {
                targ=e.srcElement;
            }
            var menuItemName = targ.getAttribute('data-menuitemsdata-name');
            var menuItemId = targ.getAttribute('data-menuitemsdata-id');
            
            populateMenuComments(menuItemId, menuItemName);
            activate_subpage("#menu_detail");
        });
        
    }
    else {
        a.innerHTML += "<br />";    
        a.innerHTML += '<p style="color:red;">Write a review.</p>';   
        /*a.onclick = function(event) { 
            var selectBoxOption = document.createElement("option");
            selectBoxOption.value = event.target;
            selectBoxOption.text = event.target;
            alert(event.target);
            document.getElementById("rate_menuList").add(selectBoxOption, null);
            getMenu(globalData.restaurantLocuId, getMenuCallback);
            activate_subpage("#rate_screen");
        };*/        
        a.addEventListener("mousedown", function(event) { 
            populateRatingMenuItem(event);
            activate_subpage("#rate_screen");
        });
    }
    
    li.appendChild(a);
    menuListElement.appendChild(li);
    //resizePicture2Thumbnail();
}

/*$('input').keyup(function() {
    alert("got");
    filter(this); 
});*/

function filter(element) {
    var value = $(element).val();
    $("#discoverPageMenuList > li").each(function () {
        var menuname = $(this).text();
        
        if (menuname.indexOf(value) > -1) {
            $(this).show();
            
        } else {
            $(this).hide();            
        }
    });
}
function displayMenuComment(data) {
    
    var menuListElement = document.getElementById("commentslist");
    //menuListElement.children().remove(); // TODO: Remove existing elements before adding new items(remove is not working)
    for (var i = 0; i < data.length; i++)
    {
        var a = document.createElement("a");
        var li = document.createElement("li");    

        a.innerHTML += '<img src="https://nodejs-menuadvisor.rhcloud.com/' + data[i].picture + '" onload="resizePicture2Thumbnail()"/>';       
        a.innerHTML += "<p style='font-size:15px'>"+data[i].rating+"</p>";
        a.innerHTML += "<p style='font-size:12px'>"+data[i].comments+"</p>";
        
        li.addEventListener("mousedown", function(e) { 
            
        });
        
        li.appendChild(a);
        menuListElement.appendChild(li);        
    }
    
}
function populateMenuComments(menuid, name)
{
    var url = 'https://nodejs-menuadvisor.rhcloud.com/api/menu?menuid='+menuid;
    //var menuName = document.getElementById("menu_detail_name");    
    //menuName.innerHTML = "<p>"+name+"</p>";
    
    var menutitle = document.getElementById("menu_detail_name");
    menutitle.innerHTML = name;
    
    $.ajax({
      url: url,
      async: true,
      dataType: 'json',
      success: function (data) {
            displayMenuComment(data);
      }
    });
}