// https://nodejs-menuadvisor.rhcloud.com/api/menulist?restaurantid=xyz
// assuming json return to have something link below
// {
//  "name" :
// }
//$("#discoverbutton").click(function(evt)
var globalMenuArray = [];
function handleDiscover(evt){
     
     var elem = document.getElementById("restaurentName");
     
     // Do not re-populate if it's the same restaurant. Otherwise reset everything.
     if (globalData.refresh != true 
         && globalData.currentRestaurantName == globalData.restaurantName)
         return;
     else
     {
         var menuListElement = document.getElementById("discoverPageMenuList");
         var filerMenu = document.getElementById("FilterMenuItems");
         
         menuListElement.innerHTML = "";
         globalData.currentRestaurantName = globalData.restaurantName;
         globalMenuArray = [];
         filerMenu.value = "";
         globalData.refresh = false;
     }
     
     elem.innerHTML = globalData.restaurantName;
     setTimeout(getAllDishFromDB(globalData.restaurantLocuId), 0);   
}
function getAllDishFromDB(restaurentLocuId) {
    var url = "https://nodejs-menuadvisor.rhcloud.com/api/menulist?restaurantid=";
    url += restaurentLocuId;
    $.ajax({
        datatype: "jsonp",
        url: url,
        callbackData: {restaurentLocuId: restaurentLocuId},
        success: getAllDishFromDBSuccessCallback
    });
}

// do not call locu if we get N already from DB
function getAllDishFromDBSuccessCallback(data) {
    for (var i = 0; i < data.length; i++)
    {
        data[i].isLocu = 0;
        insertMenuItemInUIList(data[i]);
    }
    getMenu(globalData.restaurantLocuId, getMenuFromLocuSuccessCallback);
    $('.rateit').rateit();
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

function getPictureHTML(menuItem, id)
{
    var url = 'https://nodejs-menuadvisor.rhcloud.com/api/menu?menuid='+menuItem.id;
    var ret = '';
    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        if (data.length == 0)
            return;
        
        if (data[0].picture == "undefined" || data[0].picture.length < 4)
        {
            ret += '<img src="images/question-mark.jpg"/>';
        }
        else
        {
            var idval = "img"+id;
            ret += '<img id='+idval+' src="https://nodejs-menuadvisor.rhcloud.com/' + data[0].picture + '"/>';
        }
        var menuListElement = document.getElementById(id);            
        menuListElement.innerHTML = ret + menuListElement.innerHTML;
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
function ActivateCommentsList(e) 
{ 
    var targ;
    if (e.target) {
        targ=e.target;
    }
    else if (e.srcElement) {
        targ=e.srcElement;
    }
    var menuItemName = targ.getAttribute('data-menuitemsdata-name');
    var menuItemId = targ.getAttribute('data-menuitemsdata-id');
    var menutitleElem = document.getElementById("menu_detail_name");
    if(menutitleElem.innerHTML !== menuItemName)
    {
        
        if (targ.tagName == "A")
        {
            var menuItem = new Object();
            menuItem.name = menuItemName;
            menuItem.id = menuItemId;
            setTimeout(activateRateScreen(menuItem), 0);
            return;
        }
        populateMenuComments(menuItemId, menuItemName);
    }
}
function activateRateScreen(menuName)
{
    var restaurentNameElem = document.getElementById("rate_restaurentName");
    if(restaurentNameElem.innerHTML !== globalData.restaurantName) 
    {
        restaurentNameElem.innerHTML = globalData.restaurantName;
        for(var i = 0 ; i < globalMenuArray.length ; i++) {
            var selectBoxOption = document.createElement("option");
            selectBoxOption.value = globalMenuArray[i];
            selectBoxOption.text = globalMenuArray[i];
            selectBoxOption.id = globalMenuArray[i];
            document.getElementById("rate_menuList").add(selectBoxOption, null);
        }
    }
    resetRateScreenValues();
    document.getElementById("rate_menuList").selectedIndex = document.getElementById(menuName).index;
    var d = $("#rate_menuList-button > span");
    d[0].innerHTML = menuName;
}

function isDuplicateMenu(menuItem)
{
    for (var i = 0; i < globalMenuArray.length; i++)
    {
        if (globalMenuArray[i] == menuItem.name)
        {
            return true;    
        }
    }
    globalMenuArray.push(menuItem.name);
    return false;
}

function createAttrib(attribname, value, node)
{
    var attr = document.createAttribute (attribname);
    attr.value = value;
    node.setAttributeNode (attr);
}
function insertMenuItemInUIList(menuItem)
{
    if (isDuplicateMenu(menuItem))
        return;

    var menuListElement = document.getElementById("discoverPageMenuList");
    var a = document.createElement("a");
    var li = document.createElement("li");    
    
    if (typeof menuItem.name == "undefined") { 
        return;
    } 
    
    a.innerHTML = "<h4 data-menuitemsdata-name='"+menuItem.name+ "' data-menuitemsdata-id='"+menuItem.id +"' >"+menuItem.name+"</h4>";  
    a.id=++i;
    a.onclick=ActivateCommentsList; 
    
    if (typeof menuItem.avg_rating != "undefined") { 
        a.innerHTML += "<div class=\"rateit\" data-rateit-value=\"" + menuItem.avg_rating +"\" data-rateit-ispreset=\"true\" data-rateit-readonly=\"true\"></div>";    
        getPictureHTML(menuItem, i);
        a.href="#menu_detail";   
        //a.innerHTML += "<br/>";
    }
    else {      
        a.innerHTML = '<img src="images/question-mark.jpg"/>' + a.innerHTML;
        a.href="#rate";
        a.onclick= function() {
            activateRateScreen(a.getElementsByTagName('h4')[0].innerHTML);
        };
    } 
    var innerDiv = document.createElement("div");
    innerDiv.classList.add("innerDiv");
    innerDiv.innerHTML += '<a id="review_button" data-menuitemsdata-name="'+menuItem.name+ '" data-menuitemsdata-id="'+menuItem.id +'" href="#rate" onclick="activateRateScreen(\''+menuItem.name+'\');"><img src="images/writereview1.jpg"/></a>';
    
    var Item = menuItem;
    //innerDiv.innerHTML += '<a href="#" onclick="fbShare(this)" data-menuitemsdata-name="'+menuItem.name+ '" data-menuitemsdata-id="'+menuItem.id +'"><br/>Share</a>';
    var sh = document.createElement("a");
    sh.href = "#";
    sh.onclick = fbShare;
    createAttrib('data-menuitemsdata-name', menuItem.name, sh);
    createAttrib('data-menuitemsdata-id', i, sh);
    
    sh.innerHTML += '<img src="images/share.png"/>';
    innerDiv.appendChild(sh);
    
    var outerDiv = document.createElement("div");
    outerDiv.classList.add("outerDiv");
    outerDiv.appendChild(a);
    outerDiv.appendChild(innerDiv);
    li.appendChild(outerDiv);
    
    menuListElement.appendChild(li); 
}

/*$('input').keyup(function() {
    alert("got");
    filter(this); 
});*/

function filter(element) {
    var value = $(element).val();
    $("#discoverPageMenuList > li").each(function () {
        var menuname = $(this).text();        
        if (menuname.toLowerCase().indexOf(value.toLowerCase()) > -1) {

            $(this).show();
            
        } else {
            $(this).hide();            
        }
    });
}
function displayMenuComment(data) {
    
    var menuListElement = document.getElementById("commentslist");
    menuListElement.innerHTML = "";
    for (var i = 0; i < data.length; i++)
    {
        var a = document.createElement("a");
        var li = document.createElement("li");
        if(data[i].picture) {
            a.innerHTML += '<img src="https://nodejs-menuadvisor.rhcloud.com/' + data[i].picture + '" />';
        }
        a.innerHTML += "<div class=\"rateit\" data-rateit-value=\"" + data[i].rating +"\" data-rateit-ispreset=\"true\" data-rateit-readonly=\"true\"></div>"
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
    
    var menutitle = document.getElementById("menu_detail_name");
    menutitle.innerHTML = name;
    
    $.ajax({
      url: url,
      data: "",
      async: true,
      dataType: 'json',
      success: function (data) {
            displayMenuComment(data);
      }
    });
}