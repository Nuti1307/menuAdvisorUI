function SkipFB()
{
    $( "#popupLogin" ).popup( "close" );
}
function MovetoRatePage()
{
    $.mobile.changePage("#rateit");
}
function AddUserNametoRate()
{
    FB.api('/me', function(response) {
        var label = document.getElementById("labeluser");
        label.innerHTML = "User: " + response.first_name + " " + response.last_name;    
    });  
}
function fbrateicon_click()
{
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
         AddUserNametoRate();
      }           
      else { // User not logged in ask permissions.
            FB.login(function(response) {
           if (response.authResponse) {
             AddUserNametoRate();
             MovetoRatePage();
           } else {
             console.log('User cancelled login or did not fully authorize.');
           }
         });
      }
     });
}
var fb_menu_name;
var fb_menu_id;
function fbShare(e)
{
    var targ;
    if (e.target) {
        targ=e.target;
    }
    else if (e.srcElement) {
        targ=e.srcElement;
    }
	targ = targ.parentNode;
    fb_menu_name = targ.getAttribute('data-menuitemsdata-name');
    fb_menu_id = targ.getAttribute('data-menuitemsdata-id');
	
	var fbLoginSuccess = function (userData) {
			var options = { 
			method: 'feed',
			name: 'Check out this menu.',
			link: 'menuadvisor.azurewebsites.net',
			picture: $('#img'+fb_menu_id).attr('src'),
			caption: 'I have been at ' + globalData.restaurantName + '.',
			description: 'Take a look at' + fb_menu_name +'.',
			message: '' 
			};
            facebookConnectPlugin.showDialog(options,
                function (result) {
                    alert("Posted successfully. ");             
				},
				function (e) {
					//alert("Failed: " + e);
				}
			);
	}
	facebookConnectPlugin.login(["public_profile,email,publish_actions"],
		fbLoginSuccess,
		function (error) { alert("" + error) }
	);
	
}
