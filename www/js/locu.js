
var apiKey = '3a21b14ad98faef37dbc4b8b5eda6056427fe040';

// https://api.locu.com/v1_0/venue/f079dc1e5d89c15f12c5/?api_key=3a21b14ad98faef37dbc4b8b5eda6056427fe040

function getMenu(restaurentLocuId, callbackFuncName) { 
    var url = "https://api.locu.com/v1_0/venue/";
    url += restaurentLocuId;
    url += "/?api_key="+ apiKey;
    $.ajax({
      dataType: "jsonp",
      url: url,
      success: callbackFuncName
    });
}



function getDishNames(jsonObject)
{
    var dishList = new Array();
    if(jsonObject.objects[0].has_menu)	{
	    for(var menuIndex = 0; menuIndex < jsonObject.objects[0].menus.length; menuIndex++)
		{
		    var menu = jsonObject.objects[0].menus[menuIndex];
		    for(var sectionIndex = 0; sectionIndex < menu.sections.length; sectionIndex++)
			{
			    var section = menu.sections[sectionIndex];
			    for (var subsectionIndex = 0; subsectionIndex < section.subsections.length; subsectionIndex++)
				{
				    var subsection = section.subsections[subsectionIndex];
				    for(var itemIndex = 0; itemIndex < subsection.contents.length; itemIndex++)
                    {
					    var item = subsection.contents[itemIndex];
					    dishList.push(item.name);
                    }					 
				}
			}
		}
	} else {
	    alert("restaurent does not have menu");
	}
	return dishList;
}

function getMenuCallback(data) {
    try{
		var dishList = getDishNames(data);
        for (var i = 0; i < dishList.length ; i++) {
            var selectBoxOption = document.createElement("option");
            selectBoxOption.value = dishList[i];
            selectBoxOption.text = dishList[i];
            document.getElementById("rate_menuList").add(selectBoxOption, null);
        }

    } catch(ex) {
        alert("Json data parsing failed");  
	}
}