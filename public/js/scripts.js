// Zorgen dat de groepen maar een maal worden ingeladen

var globalDishesLoaded = false;

var globalSelectedOrder = 0;

var groups = [
{"_id":1, "name":"Static group", "owner" : "sjaak", "activeOrders" : 4},
];

var dishes = [
{"id":1, "name": "Friet"},
{"id":2, "name": "frikandel"},
{"id":3, "name": "korket"},
{"id":4, "name": "nasibal"},
{"id":5, "name": "kaassoufle"},
{"id":6, "name": "cheeseburger"},
{"id":7, "name": "kipcorn"},
{"id":8, "name": "gehaktbal"},
{"id":9, "name": "viandel"},
{"id":10, "name" : "milkshake"},
{"id":11, "name" : "mayo"},
{"id":12, "name" : "curry"}
];

var orders = [
{"id" :1, "groups_id": 1, "name" : "Op stap", "owner" : "sjaak", "datum" : "2-feb", "active": 1},
{"id" :2, "groups_id": 1, "name" : "Bowlen", "owner" : "jan", "datum" : "1-feb", "active": 1},
{"id" :3, "groups_id": 2, "name" : "Kater",  "owner" : "sjaak", "datum" : "31-jan", "active": 1},
{"id" :4, "groups_id": 3, "name" : "Vakantie", "owner" : "jan", "datum" : "3-jan", "active": 1}
];

var orderDetails = [
{"dishes_id": 1, "orders_id" : 1, "username" : "jan"},
{"dishes_id": 12, "orders_id" : 1, "username" : "sjaak"},
{"dishes_id": 12, "orders_id" : 1, "username" : "sjaak"},
{"dishes_id": 3, "orders_id" : 1, "username" : "sjaak"},
{"dishes_id": 2, "orders_id" : 2, "username" : "sjaak"},
{"dishes_id": 3, "orders_id" : 2, "username" : "sjaak"},
{"dishes_id": 4, "orders_id" : 3, "username" : "jan"},
{"dishes_id": 5, "orders_id" : 3, "username" : "sjaak"},
{"dishes_id": 6, "orders_id" : 4, "username" : "sjaak"},
{"dishes_id": 7, "orders_id" : 5, "username" : "sjaak"}
];

// -----------------   PAGE LOADS -----------------









function loadDishes(){
	if(!globalDishesLoaded){
		for(i = 0; i < dishes.length; i++) {
			$('#popupLogin-dishes').append('<div data-role="fieldcontain"><label for="dishes-slider-'+dishes[i].id+'">'+dishes[i].name+'</label><input type="range" data-dishid="'+ dishes[i].id +'" name="dishes-slider-'+dishes[i].id+'" id="dishes-slider-'+dishes[i].id+'" class="popupOrderProducts-product" value="0" min="0" max="10"  /></div>');
		}
		globalDishesLoaded = true;
	}
	
}


// Hieron wordt bepaald of de gebruiker is ingelogd
// Zo niet redirect naar login, Zo ja redirect naar main
$(document).on('pagebeforeshow','#page-splash', function() {
	if(checkLogin()){
		$.mobile.changePage("#page-main", {transition : "pop"});	
	}
	else{
		$.mobile.changePage("#page-login", {transition : "pop"});	
	}
})

$(document).on('pagebeforeshow', '#popupOrderProducts', function(){    
    // Add a new input element
    alert('test');
});


// -----------------   Button Clicks -----------------



\



// Een bestelling bekijken.
$(document).on('click','.group-btn-order', function() {	
	loadDishes();

	var orderId = $(this).data("id")
	if(order !== globalSelectedOrder){
		console.log("removing order view");
		$('#order-table-orders tbody').empty();
		console.log(orderId +" != "+ globalSelectedOrder);
		globalSelectedOrder = orderId;

		// Groeps informatie ophalen
		var orderToLoad = getOrder(orderId);
		$('#order-title-name').html(orderToLoad.name + " - " + orderToLoad.owner);

		// Bestellingen inladen
		var order = getOrderDetails(orderId);
		for(i = 0; i < order.length; i++) {
			var gerecht = getDish(order[i].dishes_id);
			$('#order-table-orders tbody').append('<tr><td>'+order[i].username +'</td><td>'+gerecht.name+'</td></tr>');
		}

	}
	else{
		console.log("Groep was al geopend");
	}
	
	$.mobile.changePage("#page-order", {transition : "slide"});	
})

$( document ).ready(function() {
	$(document).on('click','#popupOrderProducts-send', function() {
		placeOrder();	
	})
});

$(document).ready(function(){
	$("#table-filter").on("change keyup paste", function(){
	     $('#order-table-orders').trigger('footable_filter', {filter: $("#table-filter").val()});
	})
});




$(document).ready(function(){
	$('.login-text').keypress(function(e) {
    	if(e.which == 13) {
	        login();
	    }
	});

	$('.register-text').keypress(function(e) {
    	if(e.which == 13) {
	        handleRegister();
	    }
	});
});


// Inloggen
$(document).on('click','#login-btn-login', function() {
	login();
})

// Uitloggen
$(document).on('click','#main-btn-logout', function() {
	logout();
})






// Een groep aanmaken
$(document).on('click','#order-button-addProducts', function() {
	alert('Kies producten ' + globalSelectedOrder);
})


// -----------------   FUNCTIES -----------------


function clearMessages(){
	$('message-error').html("");
  $('.message-succes').val("");
}

///  SWIPE EVENTS

$( document ).ready(function() {
	$( document ).on( "swipeleft swiperight", "#page-main", function( e ) {
	// We check if there is no open panel on the page because otherwise
	// a swipe to close the left panel would also open the right panel (and v.v.).
	// We do this by checking the data that the framework stores on the page element (panel: open).
	if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
	    if ( e.type === "swiperight" ) {
	        $( "#myPanel" ).panel( "open" );
	    }
	}
	});
});


function readAbleDate(inputDate){
	var scopeDate = new Date(inputDate);
	var returnDate = scopeDate.toLocaleDateString() ;
	return returnDate;
} 





navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);

function onSuccessGeo(position) {
var element = document.getElementById('geolocation');
element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                    'Longitude: '          + position.coords.longitude             + '<br />' +
                    'Altitude: '           + position.coords.altitude              + '<br />' +
                    'Accuracy: '           + position.coords.accuracy              + '<br />' +
                    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                    'Heading: '            + position.coords.heading               + '<br />' +
                    'Speed: '              + position.coords.speed                 + '<br />' +
                    'Timestamp: '          + position.timestamp                    + '<br />';
                    console.log('location "' + position);

            }
// onError Callback receives a PositionError object
//
function onErrorGeo(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}