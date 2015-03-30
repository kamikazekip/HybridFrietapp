// Een groep aanmaken
$(document).on('click','#group-button-place-order', function() {
	newOrder();
})

$(document).on('click','#group-button-order', function() {
	console.log(" !!!!!!!!!!!!!_______________---------------------");
	$.mobile.changePage("#page-newOrder", {transition : "slideup"});
})


function newOrder(){
	var r = confirm("Nieuwe bestelling halen ?");
	if (r == true) {
	    $.ajax( {
				url : 'http://localhost:8000/groups/'+globalSelectedGroup+"/order",
				dataType : 'json',
				type : "Post",
				beforeSend : function(xhr) {
			          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
			          //var base64 = Crypto.util.bytesToBase64(bytes);
			          xhr.setRequestHeader("Authorization", globalAuthheader);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					if (thrownError === "Unauthorized"){
						console.log('unauthorized');
					}
					else{
						console.log('Something went wrong');
					}
					// Fout weergeven op login scherm
					$('.message-error').html("Invalid login !");
					$('#login-text-gebruikersnaam').val("");
					$('#login-text-wachtwoord').val("");
					clearMessages();
					
				},
				success : function(model) {
					console.log(model);
					$('#group-list-orders').append('<button class="ui-btn  group-btn-order group-btn-order-active" data-id="'+model.order._id+'">'+ readAbleDate(model.order.date) +' - '+ model.order.creator+'</button>');	
					console.log('Order gemaakt');
				}
			});
	} 
}


// Load orders die bij een groep horen.
function loadOrders(){

}



// Het juiste gerecht krijgen
function getDish(dishId){
	console.log("Searching for dish in dishes "+dishId+ " .......");
	for(x = 0; x < dishes.length; x++) {
		console.log(x + " - "+ dishes.length);
		if(dishes[x].id === dishId)
		{
			console.log("Found dish " + dishes[x].name );
			return dishes[x];

		}
	}
}



function getOrders(groupId){
	console.log();
	var returnArray = [];
	console.log("Searching for orders in group "+groupId+ " .......");
	for(i = 0; i < orders.length; i++) {
		if(orders[i].groups_id === groupId)
		{
			returnArray.push(orders[i]);
			console.log("Found an order for group  "+ groupId);
		}
	}
	return returnArray;

}

function getOrder(orderId){
	console.log("Searching for Order : "+orderId+ " .......");
	for(i = 0; i < orders.length; i++) {
		if(orders[i].id === orderId)
		{
			console.log("Order found ------------- "+orders[i].name);
			return orders[i];
		}
	}
	return false;
}

// Functie om de bestellins inhoud in te laden uit de json array orderDetails
function getOrderDetails(orderId){
	var returnArray = [];
	console.log("Searching for orderDetails in Order "+orderId+ " .......");
	for(i = 0; i < orderDetails.length; i++) {
		if(orderDetails[i].orders_id === orderId)
		{
			returnArray.push(orderDetails[i]);
			console.log("Found");
		}
	}
	return returnArray;
}

function placeOrder(){
	$('.popupOrderProducts-product').each(function(i, obj) {
			console.log("-------------!!!!!!!!!!----");
		    	console.log(obj);
		    //console.log($(obj).data("dishid") + " - " + $(obj).val());
		    orderDetails.push(

		    	{"dishes_id": $(obj).data("dishid"), "orders_id" : 2, "username" : getUsername()}
			);
			var gerecht = getDish($(obj).data("dishid"));
			$('#order-table-orders tbody').append('<tr><td>'+localStorage.getItem("gebruikersnaam") +'</td><td>'+gerecht.name+'</td></tr>');
		});

}