var globalGroupsLoaded = false;
var globalSelectedGroup = 0;

// Een groep aanmaken
$(document).on('click','#newGroup-btn-create', function() {
	addGroup();
	
})

// Een  groep bekijken
$(document).on('click','.main-btn-group', function() {	
	viewGroup($(this).data("id"));
})


$(document).ready(function(){
	if(checkLogin()){
		loadGroups(); 	
	}
	
});




function addGroup(groupName){
	var newGroupsName = $('#newGroup-text-titel').val()
	if(newGroupsName === ""){
		alert('Vul een groepnaam in');
	}
	else{
		$.ajax( {
				url : 'http://localhost:8000/groups/'+newGroupsName,
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
					globalGroupsLoaded = false;
					loadGroups();
					$.mobile.changePage("#page-main", {transition : "slidedown"});

					console.log('groep gemaakt');
				}
			});
		
	}
}

// Functie om de juiste groep te laden uit de json array groups
function getGroup(groupId){

		console.log();
		console.log("Searching for group "+groupId+ " .......");
		var foundGroup = false;
		for(i = 0; i < groups.length; i++) {
			if(groups[i]._id === groupId)
			{
				console.log("Group found");
				

				$.ajax( {
					url : 'http://localhost:8000/groups/'+groupId+'/orders',
					dataType : 'json',
					type : "get",
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
						console.log("---------ORDEEEEEEEEEEEERS ----------");
						orders = model;
						console.log(model);
						for(i = 0; i < orders.length; i++) {
							var scopeId = orders[i]._id;
							var scopeDate = readAbleDate(orders[i].date);
							console.log(scopeDate);
							var scopeActive = "";
							if(orders[i].active){
								scopeActive = "group-btn-order-active";
							}
							console.log(model);
							addGroups += '<button class="ui-btn  group-btn-order ' + scopeActive + '" data-id="'+scopeId+'">'+ scopeDate + ' - ' + orders[i].creator +'</button>'
						}
						$("#group-list-orders").append(addGroups)
						console.log("---------Group loaded bro ----------");
					}
				});
				return groups[i];

			}
		}
		return false;
}



// Een specifieke groep inladen
function viewGroup(groupId){
	if(groupId !== globalSelectedGroup){
		addGroups = "";
		console.log("removing group view");
		$('#group-list-orders').empty();
		console.log(groupId +" != "+ globalSelectedGroup);
		globalSelectedGroup = groupId;
		// Groeps informatie ophalen
		var groupToLoad = getGroup(groupId);
		console.log(groupToLoad);
		$('#group-title-name').html(groupToLoad.name + " - " + groupToLoad.creator);

		// Bestellingen inladen
		var orders = getOrders(groupId);
		for(i = 0; i < orders.length; i++) {
		addGroups += '<button class="ui-btn  group-btn-order" data-id="'+orders[i].id+'">'+orders[i].name+'</button>'
		}
		$("#group-list-orders").append(addGroups);

	}
	else{
		console.log("Groep was al geopend");
	}
	
	$.mobile.changePage("#page-group", {transition : "slide"});	
}




// De lijst met groepen op de main pagina inladen op basis van de ingelogde user.
function loadGroups(){
	
	// Alleen de groepen inladen als dit nog niet eerder is gebeurd
	if(! globalGroupsLoaded){
		if(globalAuthheader === null || globalAuthheader === ""){
			$.mobile.changePage("#page-login", {transition : "slideup"});
		}
		else{
			console.log('Loading groups - ' + globalAuthheader);

			$.ajax( {
				url : 'http://localhost:8000/groups',
				dataType : 'json',
				type : "get",
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
					$('#main-list-groepen').empty();
					console.log(model);
					$("#main-list-groepen").html();
					groups = model;

					var addGroups = "";
					for(i = 0; i < groups.length; i++) {
						addGroups += '<button class="ui-btn ui-shadow main-btn-group" data-id="'+groups[i]._id+'">'+groups[i].name+'</button>';
					}
					$("#main-list-groepen").append(addGroups);
					globalGroupsLoaded = true;
					console.log("---------Groups loaded bro ----------");
				}
			});
			
		}

	}
	else{
		console.log('groups already loaded');
	}
}

