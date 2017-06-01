console.log("linked");

//Global Vars
var search = $("#search")
var resultsOne = $("#resultsOne");
var resultsTwo = $("#resultsTwo");
var resultsArray

//from Tarmin
var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8049341879024120&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2">

$.ajax({
          url: queryURL,
          method: "GET",
          dataType: 'jsonp'

        }).done(function(response) {

            console.log(response)
            

        	})

//Creates the wells in the resultsOne for the search
// $(search).on("click", function({

 
