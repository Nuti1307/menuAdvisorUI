(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
        populateAutoCompleteItems();
     
         $(".uib_w_2").click(function(evt)
        {
         setSelectedRestaurant();
         getMenu(globalData.restaurantLocuId, getMenuCallback);
         activate_subpage("#rate_screen"); 
        });
        $(".uib_w_6").click(function(evt)
        {
         setSelectedRestaurant();
         getAllDishFromDB(globalData.restaurantLocuId);
         activate_subpage("#menu_listing"); 
        });
        $(".uib_w_5").click(function(evt)
        {
         submitRating();
        });
        $(".uib_w_8").click(function(evt)
        {
         getSelectedMenuItem(evt);
         populateMenuComments();
         activate_subpage("#menu_detail");
        });
}
 //$("#rate_screen").on("pageload",function(event,data){alert("Hi");});
 //$(document).delegate("#rate_screen", "pageinit", function() { alert("Hi");});
 //$("#rate_screen").live("pageinit",function(event){ alert("This page was just enhanced by jQuery Mobile!"); });
 $(document).ready(register_event_handlers);
 //$("#menu_listing").bind ("pagecreate", function () {  alert("Hi"); });

})();
