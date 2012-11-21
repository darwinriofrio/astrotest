window.fbAsyncInit = function() {  
    FB.init({appId:"260258167381597", status:true, cookie:true, xfbml:true, channelUrl:"http://www.carlos-garcia.es/misproyectos/seeLikesFaster/channel.php"});  
  
    FB.getLoginStatus(function(response) {  
        if (response.status === 'connected') {  
            userIsLogged();  
            initFacebookFriendSelect();  
        } else {    
            userIsNotLogged();  
        }  
    });  
};  
        
        
$(document).ready(function() {  
    $("#ajaxActivityIndicator").hide();  
    $("#tabs").tabs();    
    $("#loginFacebook").click(facebookLogin);  
      
    $("#likes").change(function(){  
        showCurrentPage($(this).val(), "externalWebPreviewLikes");  
        $("#previewLink").attr("href", $(this).val());    
        return false;  
    });  
      
    $("#posts").change(function(){  
        var theURL = $(this).find("option:selected").text();  
        showCurrentPage(theURL, "externalWebPreviewPost");  
        $("#postLink").attr("href", "http://facebook.com/" + $(this).val());      
        return false;  
    });  
  
    $("#friendList").change(function(){  
        // Obtenemos el id de la persona que ha seleccionado el usuario  
        var selectedUserID = $("#friendList").val();  
          
        // Inicializamos el combo con los gustos del usuario seleccionado  
        facebookLikesByUserID(selectedUserID);  
        facebookPostsByUserID(selectedUserID);    
        facebookStatusByUserID(selectedUserID);  
                          
        return false;  
    });  
});   
  
function clearAllOptions(controlID){  
    $("#" + controlID).find('option').remove().end();  
}  
  
function getURLParameter(urlPage, param){  
  var name   = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( urlPage );  
  var toReturn = "";  
    
  if (results != null){  
      toReturn = results[1];  
  }  
  
  return toReturn;  
}  
  
function isYouTubeURL(urlPage){  
    return (urlPage.indexOf("http://www.youtube") != -1);  
}  
      
function userIsNotLogged(){  
    $("#logged_actions").show();  
    $("#user_information").hide();    
    $("#loaded_user").show();  
}  
  
function userIsLogged(){  
    $("#logged_actions").hide();  
    $("#user_information").show();  
      
    FB.api('/me', function(user) {  
        $("#user_information").html("<h3>Bienvenido " + user.name + "<h3>");  
    });  
}  
  
function facebookLoginCallBack(response){  
      if (response.status === 'connected') {  
          userIsLogged();  
      } else if (response.status === 'not_authorized') {  
          userIsNotLogged();  
      } else {  
          userIsNotLogged();  
      }  
}  
  
// Logamos al usuario en facebook en caso de que no lo está ya  
function facebookLogin(){  
    FB.getLoginStatus(function(response) {  
        if (response.status === 'connected') {  
            userIsLogged();  
            initFacebookFriendSelect();  
        } else {    
            if (response.status === 'not_authorized') {        
                // El usuario ya esta logado Facebook pero la aplicación no está conectada a Facebook  
                userIsNotLogged();  
            }  
            FB.login(facebookLoginCallBack, {scope: 'user_likes,friends_likes,read_stream'});   
        }  
    });  
}  
  
/** 
 * Inicializa la lista de tus amigos 
 */  
function initFacebookFriendSelect(){  
    clearAllOptions("friendList");  
    $("#friendList").append($('<option></option>').val("#").html("Seleccione.."));  
          
    FB.api('/me', function(user) {  
        $("#friendList").append($('<option></option>').val(user.id).html(user.name));  
    });  
  
    $("#ajaxActivityIndicator").show();       
    var fql1 = FB.Data.query("SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) order by name asc");  
    fql1.wait(function(rows) {  
        jQuery.each($(rows), function(idx, ofriend) {   
            $("#friendList").append($('<option></option>').val(ofriend.uid).html(ofriend.name));  
        });  
        $("#ajaxActivityIndicator").hide();   
    });  
}  
  
function facebookLikesByUserID(user_id){  
    clearAllOptions("likes");  
  
    $("#ajaxActivityIndicator").show();  
  
    var fql1 = FB.Data.query("SELECT url FROM url_like WHERE user_id=" + user_id);  
    fql1.wait(function(rows) {  
        $('#likes').append($('<option></option>').val("#").html("Seleccione.."));  
       
        jQuery.each($(rows), function(idx, olike) {   
            $('#likes').append($('<option></option>').val(olike.url).html(olike.url));  
        });  
        $("#ajaxActivityIndicator").hide();   
    });  
}  
  
  
function facebookPostsByUserID(user_id){  
    clearAllOptions("posts");  
  
    $("#ajaxActivityIndicator").show();   
    var fql1 = FB.Data.query("SELECT link_id, owner, owner_comment, created_time, title, summary, url, picture, image_urls FROM link WHERE owner=" + user_id + " order by created_time desc");  
    fql1.wait(function(rows) {  
        $('#posts').append($('<option></option>').val("#").html("Seleccione.."));  
        jQuery.each($(rows), function(idx, opost) {   
            $('#posts').append($('<option></option>').val(opost.link_id).html(opost.url));  
        });  
        $("#ajaxActivityIndicator").hide();   
    });  
}  
  
function facebookStatusByUserID(user_id){  
    $("#status").find('li').remove().end();  
  
    $("#ajaxActivityIndicator").show();   
    var fql1 = FB.Data.query("SELECT status_id, time, message FROM status WHERE uid=" + user_id + " order by time desc");  
    fql1.wait(function(rows) {  
        jQuery.each($(rows), function(idx, ostatus) {   
            $("#status").append($("<li></li>").html("<a href='http://www.facebook.com/" + ostatus.status_id + "' target='_blank'>" + ostatus.message + "</a>"));  
        });  
        $("#ajaxActivityIndicator").hide();   
    });  
}  
  
function showCurrentPage(comboURL, target){  
    var frameURL = comboURL;  
    if (isYouTubeURL(comboURL)){  
        frameURL = "http://www.youtube.com/embed/" + getURLParameter(comboURL, "v");  
    }  
    $("#" + target).attr("src",  frameURL); 
}