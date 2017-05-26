 $(document).ready(function() {

     var city = "phoenix";
     var occupation = "junior+web+developer";
     

     function makeAjaxRequest() {
         // this URL has james's Indeed.com publisher key
         // you need format=json, and the version v=2 in the URL
         // I set the # of results to 5 but we can change it
         // if you get ERR_BLOCKED_BY_CLIENT it is probably because of adblockers
         newQueryURL = "http://api.indeed.com/ads/apisearch?publisher=1107022713091933&format=json&q=" + occupation + "&l=" + city + "&limit=5&v=2";
         $.ajax({
             url: newQueryURL,
             method: "GET",
             //without the dataType key and value, the response is not a json object that we can use
             dataType: 'jsonp',
             // this crossDomain key eliminated the need for the cross origin chrome extension
             crossDomain: true
         }).done(function(response) {
             // console.log(response);
             // I only got the jobtitle for now
             // I would imagine we'll also want the company(.company),
             // the description (.snippet), and the url (.url)
             // console.log(response.results[0].jobtitle);
             //empties the container of whatever was in it before - maybe we don't do this?
             // but then we'll have to prepend below instead of appending
             $('.resultsTwo').empty()
                 // I made the loop iteratation equal to the # of results specified above
             for (var i = 0; i < 5; i++) {
                 var jobTitle = response.results[i].jobtitle;
                 //create a bootstrap well
                 var newWell = $('<div class="well"></div>');
                 //put the jobtitle in the well
                 newWell.html(jobTitle);
                 //put the well in the results container
                 $('.resultsTwo').append(newWell);
             }
         });
     }

     $("#search").on('click', function() {
         city = $('#searchInput').val().trim();
         occupation = "junior+web+developer";
         makeTeleportAjaxRequest();
         makeAjaxRequest();
         makeSalaryAjaxRequest();
         getPriceOfBeer();
         getImage();
     });

     function makeTeleportAjaxRequest() {
     		// this api gets the city scores from teleport - no key needed
         var cityscoresURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";

         $.ajax({
             url: cityscoresURL,
             method: "GET"

         }).done(function(response) {
             // console.log(response);
             //empties the containing div
             $('#resultsOne').empty();
             //loops through the categories and makes a well for each- we should maybe get rid of some of these
             for (var j = 0; j < response.categories.length; j++) {
                 var categoryTitle = response.categories[j].name;
                 var categoryScore = response.categories[j].score_out_of_10;
                 var newWell = $('<div class="well"></div>');
                 var newH = $('<h3></h3>');
                 //need to cut off most of the decimal places of categoryScore
                 newH.html(categoryTitle + ":   " + categoryScore);                 
                 newWell.addClass('text-center').append(newH);
                 $('#resultsOne').append(newWell);
             }


         });
     }


     function makeSalaryAjaxRequest() {
     	//teleport has a separate api for salaries
         var salaryURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/salaries/";

         $.ajax({
             url: salaryURL,
             method: "GET"

         }).done(function(response) {
             // console.log(response);
             //I used the position in the array for web developer             
             var newJobTitle = response.salaries[51].job.title;
             var salary = response.salaries[51].salary_percentiles.percentile_50;
             var roundedSalary = Math.round(salary);
             // console.log(roundedSalary);
       		$('#salary').html(newJobTitle + ":   $" + roundedSalary);

         });
     }

     function getPriceOfBeer() {
            var beerURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/details/";
         $.ajax({
             url: beerURL,
             method: "GET"

         }).done(function(response) {
             // console.log(response);
             var beerPrice = response.categories[3].data[6].currency_dollar_value;
             $('#beer').html("Avg. price of beer:  $" + beerPrice);                      
            
            // $('#salary').html(newJobTitle + ":   $" + roundedSalary);

         });

     }

     function getImage() {
        var imageURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/images/"
        $.ajax({
             url: imageURL,
             method: "GET"

         }).done(function(response) {
             console.log(response);
             var picURL = response.photos[0].image.web;
             var backImg = "url(" + picURL + ")";
             // $('.jumbotron').css('background-image', backImg);
             $('.jumbotron').css('background-image', 'url(' + picURL + ')');
             

         });

     }




 });
