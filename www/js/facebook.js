function SkipFB()
{
    localStorage.skipped = true;
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

function fbShare(e)
{
    var targ;
    if (e.target) {
        targ=e.target;
    }
    else if (e.srcElement) {
        targ=e.srcElement;
    }
    var name = targ.getAttribute('data-menuitemsdata-name');
    var id = targ.getAttribute('data-menuitemsdata-id');
    
    FB.ui(
    {
        method: 'feed',
        name: 'Check out this menu.',
        link: 'menuadvisor.azurewebsites.net',
        picture: $('#img'+id).attr('src'),
        caption: 'I have been at ' + globalData.restaurantName + '.',
        description: 'I tried ' + name +'.',
        message: ''
    });
}
function initFB()
{
    window.fbAsyncInit = function() {
        FB.init({
          appId      : '297630243730832', // App ID
          status     : true, // check login status
          cookie     : true, // enable cookies to allow the server to access the session
          xfbml      : true  // parse XFBML
        });

    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          FB.api('/me', function(response) {
            globalData.fbUserId = response.id;
            globalData.fbUserEmail = response.email;
            globalData.fbUserName = response.first_name + " " + response.last_name;
            $.mobile.changePage("#homepage");
          });
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
            alert("Auth issue");

        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
           alert(response.status);
        }
        
    }

    function checkLoginState() {
        if (typeof FB == "undefined")
        {
            alert("Could not connect to Facebook");
            $.mobile.changePage("#homepage");
            return;
        }

        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
    }

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
    };

      // Load the SDK Asynchronously
      (function(d){
         var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement('script'); js.id = id; js.async = true;
         js.src = "//connect.facebook.net/en_US/all.js";
         ref.parentNode.insertBefore(js, ref);
       }(document));
}
