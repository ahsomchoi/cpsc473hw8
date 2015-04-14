var main = function () {
	$.get("/gettopten", function(response) {
		var i;
		for(i=0; i<10; i++){
			var tempElement = $("<li>").html("Long URL: "+response[i].lURL+"<br>short URL: http://localhost:3000/"+response[i].sURL+"<br>View count:"+response[i].count);
			$("#topten").append(tempElement);			
		}
	});

	$("#submit").on("click", function (event) {
		
		var url = $("#url").val();
		if(url!=="") 
		{

			//gets rid of whitespace
			url = url.trim();

			//if entered url starts with http://localhost:3000/
			if(url.substring(0,22)=="http://localhost:3000/") {
				$.post(url.substring(22), function(response) {
					$("#newurl").text(response.longurl);
					
				});

			} 
			//if entered url starts with localhost:3000/
			else if (url.substring(0,15)=="localhost:3000/") {

				$.post(url.substring(15), function(response) {
					$("#newurl").text(response.longurl);
					
				});

				
			}
			//if entered url is a long url to be shortened
			else {
				$.post("longurl",{longurl:url}, function (response) {
					$("#newurl").text("http://localhost:3000/"+response.shorturl);
					
				});
			}

			//resets the input box
			$("#url").val("");
		}
	});


};

$(document).ready(main);