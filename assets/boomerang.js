console.log("linked");

//Global Vars
var search = $("#search")
var resultsOne = $("#resultsOne");
var resultsTwo = $("#resultsTwo");
var resultsArray

//from Tarmin
var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Sushi+in+Chandler&key=AIzaSyCa3IZ4N1iANJxaS0D63fOT3PfkDQsmb8Y";

$.ajax({
          url: queryURL,
          method: "GET",
          type: 'json'
        }).done(function(response) {

            console.log(response.results[0])
            $(".restaurants").html(response.results[0].photos[0].html_attributions[0]);

        	})

//Creates the wells in the resultsOne for the search
$(search).on("click", function({

}))


