 $(document).ready(function() {

     var city = "phoenix";
     var occupation = "junior+web+developer";

     var cityCategoryTitles = [];   // pushed from teleport
     var cityData = [];             // also from teleport
     var barColorArray = [];        // to hold rgb values for chartjs
     var email = "";
     var password = "";
     // var cityInfo = document.getElementById('cityInfo'); //pulls in the div for cityInfo for hide/show

     var config = {
         apiKey: "AIzaSyCRKdQPHdR5FR3XJUXwXhlNw7p6ylOsbz8",
         authDomain: "bacon-525e9.firebaseapp.com",
         databaseURL: "https://bacon-525e9.firebaseio.com",
         projectId: "bacon-525e9",
         storageBucket: "bacon-525e9.appspot.com",
         messagingSenderId: "724409226390"
     };
     firebase.initializeApp(config);

     var database = firebase.database();
     $('#chart').hide();
     //I'm having trouble with the Dragula library...
     //I can get the middle column(resultsTwo) to push to firebase even after moving it to the right and back
     //but we need the right column to push
     //and I can't get it to work after you drag a well into it.  The wells that appear in the right column
     // on the load of the page are from my(james) firebase.

     $("#save").on("click", function() {

         var jobTitleFb = $('#resultsTwo div:first-child').html();
         console.log(jobTitleFb); // this always comes back as undefined if you change the above 
         //selector to #savedJobs
         database.ref('jobs').push({
            jobTitle:jobTitleFb
         });
     });


     //This works -- values come back from firebase on to our page
     database.ref('jobs').on("child_added", function(snapshot) {
         var storedJobs = snapshot.val();
         var storedJobTitle = storedJobs.jobTitle;
         var newJobWell = $('<div class="well"></div>');
         newJobWell.html(storedJobTitle);

         $('#savedJobs').append(newJobWell);

     });
     //******************************copied Dragula code*****************************************
     dragula([document.getElementById('resultsTwo'), document.getElementById('savedJobs')])
         .on('drag', function(el) {
             el.className = el.className.replace('ex-moved', '');
         }).on('drop', function(el) {
             el.className += ' ex-moved';
               console.log(el);
             var draggedWell = $(el).html();
             console.log(draggedWell);
             database.ref('jobs').push({
                 jobTitle: draggedWell
             });
             $(el).remove();
             
         }).on('over', function(el, container) {
             container.className += ' ex-over';

             
         }).on('out', function(el, container) {
             container.className = container.className.replace('ex-over', '');

             
         });
     //*****************************************************************************************
     //


     $("#toggle").hide();
     $(".search").hide();

     function makeIndeedAjaxRequest() {
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
             console.log(response);
             // I only got the jobtitle for now
             // I would imagine we'll also want the company(.company),
             // the description (.snippet), and the url (.url)
             // console.log(response.results[0].jobtitle);
             //empties the container of whatever was in it before - maybe we don't do this?
             // but then we'll have to prepend below instead of appending
             $('.resultsTwo').empty();
                 // I made the loop iteratation equal to the # of results specified above
             for (var i = 0; i < 5; i++) {
                 var jobTitle = response.results[i].jobtitle;
                 var company = response.results[i].company;
                 var jobUrl = response.results[i].url;
                 var snippet = response.results[i].snippet;

                 //create a bootstrap well
                 var newWell = $('<div class="well"></div>');
                 //put the job results in the newWell var
                 newWell.html("<strong>Title: </strong>" + jobTitle);
                 newWell.append("<br>" + "<strong>Company: </strong>" + company);
                 newWell.append("<br>" + "<a href=" + jobUrl + ">Link to job" + "</a>");
                 newWell.append("<br>" + "<strong>Description: </strong>" + snippet);


                 $('.resultsTwo').append(newWell);
             }
         });
     }

     $("#search").on('click', function() {
         //commented out the line below for now so I don't have to type in a search term every time
         city = $('#searchInput').val().trim();

         occupation = "junior+web+developer";
         makeTeleportAjaxRequest(city);
         makeIndeedAjaxRequest();
         makeSalaryAjaxRequest();
         getPriceOfBeer();
         getImage();
         $("#toggle").show();
         $("#cityInfo").hide();

         
     	});
     //Show/Hide the city info with the button created once the search on click runs
     $("#toggle").on('click', function(){
    	if ($("#cityInfo").is(":visible")) {
    		$("#cityInfo").hide();
    	} 
    	else {
    		$("#cityInfo").show();
    	};
     });

     //Show the search options/button once user is logged in
     $("#logIn").on("click", function(){
     	$(".search").show();
     	$(".logIn").hide();
     	email = $("#email").val().trim();
     	password = $("#password").val().trim();
     	console.log("email: " + email);
     	console.log("password: " + password);
     	handleSignUp();

     });
     

     //Code from Firebase to add functionality to allow users to signup w/email & password
     function toggleSignIn() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
      });
    }
}
function handleSignUp() {
      // var email = document.getElementById('email').value;
      // var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    })
      };

         
     
     $("#searchInput").keyup(function(event) {
         if (event.keyCode == 13) {
             $("#search").click();
             $('#searchInput').val("");
         }
     });


     function makeTeleportAjaxRequest(city) {
         // this api gets the city scores from teleport - no key needed
         var cityscoresURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";
         $('#myChart').empty();
         //resets the arrays 
         cityCategoryTitles.length = 0;
         cityData.length = 0;
         barColorArray.length = 0;

         $.ajax({
             url: cityscoresURL,
             method: "GET"

         }).done(function(response) {
             // console.log(response);
             //empties the containing div
             $('#resultsOne').empty();
             //loops through the categories and makes a well for each - maybe we should get rid of some of these
             for (var j = 0; j < response.categories.length; j++) {
                 var categoryTitle = response.categories[j].name;
                 cityCategoryTitles.push(categoryTitle);
                 var categoryScore = response.categories[j].score_out_of_10;
                 //this cuts off the decimal places - I don't know if this is the best way
                 var roundedScore = Math.floor(categoryScore * 10);
                 var newCatScore = roundedScore / 10;
                 cityData.push(newCatScore);
                 //************************************************************************************************  
                 //pushes rgb codes to an array for each score              
                 if (newCatScore > 6.9) {
                     barColorArray.push('rgb(69, 244, 66)');
                 } else if (newCatScore < 4.0) {
                     barColorArray.push('rgb(255, 0, 0)');
                 } else {
                     barColorArray.push('rgb(12, 76, 178)');
                 }
                 //******************************************************************************************************************
                 var newWell = $('<div class="well"></div>');
                 var newH = $('<h3></h3>');
                 newH.html(categoryTitle + ":   " + newCatScore);
                 newWell.addClass('text-center').append(newH);
                 // $('#resultsOne').append(newWell);
             }
             makeChart(); //function that makes the chartjs chart


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
             $('#salary').html("Median " + newJobTitle + " Salary:   $" + roundedSalary);
         });
     }

     function getPriceOfBeer() {
         var beerURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/details/";
         $.ajax({
             url: beerURL,
             method: "GET"

         }).done(function(response) {
             console.log(response);
             var beerPrice = response.categories[3].data[6].currency_dollar_value;
             $('#beer').html("Avg. price of beer:  $" + beerPrice);
             var avgHighC = response.categories[2].data[5].string_value;
             var avgHighF = Math.round(avgHighC * 9 / 5 + 32);
             $('#temp').html("Avg. temerature high: " + avgHighF);

         });
     }

     function getImage() {
         //gets a city image from teleport and puts it in the header
         var imageURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/images/"
         $.ajax({
             url: imageURL,
             method: "GET"

         }).done(function(response) {
             console.log(response);
             var picURL = response.photos[0].image.web;
             $('.header').css('background-image', 'url(' + picURL + ')');
         });

     }


     //**************Chartjs******************************
     //had to reset the canvas to get rid of flicker

     function makeChart() {
         $('#chart').empty().show();

         var newCanvas = $('<canvas id="myChart" height="100px"></canvas>');
         //I inserted html - is appending better?
         $('#chart').html(newCanvas);
         var ctx = document.getElementById('myChart').getContext('2d');
         var chart = new Chart(ctx, {
             // The type of chart we want to create
             type: 'bar',

             data: {
                 labels: cityCategoryTitles,
                 datasets: [{
                     label: city,
                     backgroundColor: barColorArray,
                     borderColor: 'rgb(0, 0, 0)',
                     data: cityData,
                 }]
             },

             options: {
                 scales: {
                     xAxes: [{
                         ticks: {
                             // this will make the x axis start at 0
                             // beginAtZero: true
                         },
                         barPercentage: 0.3
                     }],
                     yAxes: [{
                         ticks: {
                             beginAtZero: true
                         }
                     }]
                 }


             }
         });


     }
     //****************************************************************



});





 
