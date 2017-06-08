$(document).ready(function() {
    var city = "phoenix";
    var occupation = "junior+web+developer";
    var email = "";
    var password = "";
    var userId = "anonymous";
    var ListOfCities = ["Phoenix",
        "Albuquerque", "Anchorage", "Asheville", "Atlanta", "Austin",
        "Birmingham, AL", "Boise", "Boston", "Boulder", "Bozeman",
        "Buffalo", "Charleston", "Charlotte", "Chattanooga",
        "Chicago", "Cincinnati", "Cleveland", "Colorado Springs", "Columbus",
        "Dallas", "Denver", "Des Moines", "Detroit", "Eugene", "Fort Collins",
        "Honolulu", "Houston", "Indianapolis",
        "Jacksonville", "Kansas City", "Knoxville", "Las Vegas",
        "Los Angeles", "Louisville", "Madison", "Memphis",
        "Miami", "Milwaukee", "Minneapolis-Saint Paul", "Nashville",
        "New Orleans", "New York", "Oklahoma City", "Omaha",
        "Orlando", "Palo Alto", "Philadelphia",
        "Pittsburgh", "Portland, ME", "Portland, OR",
        "Providence", "Raleigh", "Richmond", "Rochester",
        "Salt Lake City", "San Antonio", "San Diego", "San Francisco Bay Area",
        "San Juan", "San Luis Obispo", "Seattle",
        "St Louis", "Tampa Bay Area", "Washington DC",
    ];

    var cityCategoryTitles = []; // pushed from teleport
    var cityData = []; // also from teleport
    var barColorArray = []; // to hold rgb values for chartjs
    var borderColorArray = []; // holds rgb values for the border color of each bar in chart
    var unformattedCity = "Phoenix";

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



    // when a user logs on, the email username (before the @) is stored in firebase as userId
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            // $('#username').html(user.email);
            email = user.email;
            userId = email.split("@")[0];
            database.ref('users').update({
                userId: userId
            });
            console.log("logged in");
        } else {
            // No user is signed in.
            // $('#username').html("No user logged in");
        }
    });


    // firebase.auth().onAuthStateChanged(function(user) {
    //     if(user){
    //     var x = firebase.auth().currentUser.email;
    //     $("#userEmail").html("Welcome, " + x + "    <button class='btn btn-default' id='signOut'>Sign Out</button>");   
    //     user=email.split("@")[0];
    //     // $('#username').html(user);
    //     console.log(user);
    //     }
    // });

    //when the userId in firebase is updated above....
    database.ref('users').on("child_changed", function(response) {
        // local userId is updated with the firebase userId
        userId = response.val();
        console.log("userId in users child added    " + userId);
        $('#savedJobs').empty();
        getJobsFromFirebase();

        //the savedJobs div is updated with the userId's saved jobs from firebase
        // database.ref('jobs/' + userId + '/').on("child_added", function(snapshot) {
        //     console.log(userId);
        //     var storedJobs = snapshot.val();
        //     //sets the firebase generated pushID to FbKey
        //     var FbKey = snapshot.key;
        //     var storedJobTitle = storedJobs.jobTitle;
        //     // console.log(FbKey);
        //     console.log("fbkey inside jobs child added   " + FbKey);
        //     var newJobWell = $('<div class="well"></div>');
        //     // newJobWell.html(storedJobs);
        //     newJobWell.html(storedJobTitle);
        //     //adds a remove button to each jobwell
        //     var removeButton = $('<br><button class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
        //     newJobWell.append(removeButton);
        //     //gets the firebase key so we can remove the jobwell
        //     // var FbKey = snapshot.key;
        //     newJobWell.attr('value', FbKey);
        //     $('#savedJobs').append(newJobWell);
        // });
    });

    function getJobsFromFirebase() {
        database.ref('jobs/' + userId + '/').on("child_added", function(snapshot) {
            console.log(userId);
            var storedJobs = snapshot.val();
            //sets the firebase generated pushID to FbKey
            var FbKey = snapshot.key;
            var storedJobTitle = storedJobs.jobTitle;
            // console.log(FbKey);
            console.log("fbkey inside jobs child added   " + FbKey);
            var newJobWell = $('<div class="well"></div>');
            // newJobWell.html(storedJobs);
            newJobWell.html(storedJobTitle);
            //adds a remove button to each jobwell
            var removeButton = $('<br><button class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
            newJobWell.append(removeButton);
            //gets the firebase key so we can remove the jobwell
            // var FbKey = snapshot.key;
            newJobWell.attr('value', FbKey);
            $('#savedJobs').append(newJobWell);
        });
    }


    $("#logIn").on("click", function() {
        email = $("#email").val().trim();
        password = $("#password").val().trim();
        //logs in to firebase
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
        $("#email").val("");
        $("#password").val("");
        $('#signIn').hide();
        $('#signOut').show();
    });

    // $("#logOut").on("click", function() {
    //     $('#savedJobs').empty();

    //     firebase.auth().signOut();
    // });

    $("#signOut").on("click", "#signOutButton", function() {
        // firebase.auth().signOut().then(function(){
        //Sign-out successful.
       signOutFromFirebase();

        // }).catch(function(error){});
    });

    function signOutFromFirebase() {
         $('#savedJobs').empty();
         database.ref('users').update({
                userId: "anonymous"
            });
        firebase.auth().signOut();
        $('#signIn').show();
        $('#signOut').hide();
    }


    //******************************Dragula code*****************************************
    dragula([document.getElementById('resultsTwo'), document.getElementById('savedJobs')])
        .on('drop', function(el, target, source) {
            if (target != source && source === document.getElementById('resultsTwo')) {
                var draggedWell = $(el).html();

                database.ref('jobs/' + userId + '/').push({
                    jobTitle: draggedWell
                });

                $(el).remove();
            }
        });
    //*****************************************************************************************


    // return firebase.database().ref('/users/').once('value').then(function(response) {
    //     userId = response.val();
    //     console.log(userId);
    //     // ...
    //     // userId = "fV3LfEQFqfVFyfvYm9Q8QRBo1nq1";
    //     // database.ref('jobs/' + userId + '/').on("child_added", function(snapshot) {
    //     //     console.log(userId);
    //     //     var storedJobs = snapshot.val();
    //     //     console.log(storedJobs);
    //     //     var FbKey = snapshot.key;
    //     //     var storedJobTitle = storedJobs.jobTitle;
    //     //     // console.log(FbKey);
    //     //     console.log("fbkey inside jobs child added   " + FbKey);
    //     //     var newJobWell = $('<div class="well"></div>');
    //     //     // newJobWell.html(storedJobs);
    //     //     newJobWell.html(storedJobTitle);
    //     //     //adds a remove button to each jobwell
    //     //     var removeButton = $('<br><button class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
    //     //     newJobWell.append(removeButton);
    //     //     //gets the firebase key so we can remove the jobwell
    //     //     // var FbKey = snapshot.key;
    //     //     newJobWell.attr('value', FbKey);
    //     //     $('#savedJobs').append(newJobWell);
    //     // });
    // });

    //  Remove saved jobs from firebase and from the 'savedJobs' container
    // 'this' is the button clicked
    $("#savedJobs").on("click", '.remove', function() {
        var parentWell = $(this).parent();
        console.log(parentWell);
        var FirebaseKey = parentWell.attr('value');
        console.log('jobs/' + userId + '/');
        console.log('jobs/' + userId + '/' + FirebaseKey);
        database.ref('jobs/' + userId + '/' + FirebaseKey).remove();
        parentWell.remove();

    });


    function makeIndeedAjaxRequest() {
        // this URL has james's Indeed.com publisher key
        // you need format=json, and the version v=2 in the URL
        // I set the # of results to 5 but we can change it
        // if you get ERR_BLOCKED_BY_CLIENT it is probably because of adblockers
        newQueryURL = "https://api.indeed.com/ads/apisearch?publisher=1107022713091933&format=json&q=" + occupation + "&l=" + city + "&limit=5&v=2";
        $.ajax({
            url: newQueryURL,
            method: "GET",
            //without the dataType key and value, the response is not a json object that we can use
            dataType: 'jsonp',
            // this crossDomain key eliminated the need for the cross origin chrome extension
            crossDomain: true
        }).done(function(response) {
            // console.log(response);

            $('.resultsTwo').empty()
            for (var i = 0; i < 5; i++) {
                var jobTitle = response.results[i].jobtitle;
                var company = response.results[i].company;
                var jobUrl = response.results[i].url;
                var snippet = response.results[i].snippet;
                var IndeedCity = response.results[i].city;
                var IndeedState = response.results[i].state;

                //create a bootstrap well
                var newWell = $('<div class="well"></div>');
                //put the jobtitle in the well
                // newWell.html(jobTitle).val(jobTitle);
                newWell.html("<strong>Title: </strong>" + jobTitle);
                newWell.append("<br>" + "<strong>Company: </strong>" + company);
                newWell.append("<br>" + "<a href=" + jobUrl + ' target="_blank">Link to job' + "</a>");
                newWell.append("<br>" + "<strong>Description: </strong>" + snippet);
                newWell.append("<br>" + "<strong>Location:  </strong>" + IndeedCity + ", " + IndeedState);

                //put the well in the results container
                $('.resultsTwo').append(newWell);
            }
        });
    }

    //*************************************************************************************************************
    $("#searches").on('click', function() {
        unformattedCity = $("#searchInput option:selected").text();
        lowercaseCity = unformattedCity.toLowerCase();
        cityX = lowercaseCity.replace(/ /g, "-");
        city = cityX.replace(/,/g, "");
        occupation = "junior+web+developer";
        makeTeleportAjaxRequest();
        makeIndeedAjaxRequest();
        makeSalaryAjaxRequest();
        getPriceOfBeer();
        getImage();
        $("#toggle").show();
        $("#cityInfo").show();
    });

    //******************************************************************************************************************

    function makeTeleportAjaxRequest() {
        // this api gets the city scores from teleport - no key needed
        var cityscoresURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";
        $('#myChart').empty();
        //resets the arrays 
        cityCategoryTitles.length = 0;
        cityData.length = 0;
        barColorArray.length = 0;
        borderColorArray.length = 0;
        $.ajax({
            url: cityscoresURL,
            method: "GET"
        }).done(function(response) {
            // console.log(response);
            //empties the containing div
            $('#resultsOne').empty();
            //loops through the categories and formats the scores
            for (var j = 0; j < response.categories.length; j++) {
                var categoryTitle = response.categories[j].name;
                cityCategoryTitles.push(categoryTitle);
                var categoryScore = response.categories[j].score_out_of_10;
                var newCatScore = categoryScore.toFixed(1);
                cityData.push(newCatScore);
                //************************************************************************************************  
                //pushes rgb codes to an array for each score              
                if (newCatScore > 6.9) {
                    barColorArray.push('rgb(183, 249, 154)');
                    borderColorArray.push('rgb(34, 137, 98)');
                } else if (newCatScore < 4.0) {
                    barColorArray.push('rgb(255,177,193)');
                    borderColorArray.push('rgb(109, 1, 17)');
                } else {
                    barColorArray.push('rgb(154,208,245)');
                    borderColorArray.push('rgb(9, 75, 122)');
                }
                //******************************************************************************************************************
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
            //I used the position in the array for web developer             
            var newJobTitle = response.salaries[51].job.title;
            var salary = response.salaries[51].salary_percentiles.percentile_50;
            var roundedSalary = salary.toFixed(0);
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
            // console.log(response);
            var beerArray = response.categories[3].data;
            for (var z = 0; z < beerArray.length; z++) {
                if (beerArray[z].id === "COST-IMPORT-BEER") {
                    var beerPriceX = beerArray[z].currency_dollar_value;
                    var beerPrice = beerPriceX.toFixed(2);
                    $('#beer').html("Avg. Price of Beer:  $" + beerPrice);
                }
            }

            var tempArray = response.categories[2].data;
            for (var x = 0; x < tempArray.length; x++) {
                if (tempArray[x].id === "WEATHER-AVERAGE-HIGH") {
                    var avgHighC = response.categories[2].data[x].string_value;
                    var avgHighF = Math.round(avgHighC * 9 / 5 + 32);
                    $('#temp').html("Avg. Temperature High: " + avgHighF + " " + String.fromCharCode(176) + "F");
                }

            }



        });
    }

    function getImage() {
        //gets a city image from teleport and puts it in the header
        var imageURL = "https://api.teleport.org/api/urban_areas/slug:" + city + "/images/"
        $.ajax({
            url: imageURL,
            method: "GET"
        }).done(function(response) {
            // console.log(response);
            var picURL = response.photos[0].image.web;
            $('.header').css('background-image', 'url(' + picURL + ')');
        });
    }
    //**************Chartjs******************************
    //had to reset the canvas to get rid of flicker
    function makeChart() {
        $('#chart').empty().show();
        var newCanvas = $('<canvas id="myChart" height="60px"></canvas>');
        $('#chart').html(newCanvas);
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            data: {
                labels: cityCategoryTitles,
                datasets: [{
                    label: unformattedCity,
                    backgroundColor: barColorArray,
                    borderColor: borderColorArray,
                    borderWidth: 1,
                    data: cityData,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false
                                // this will make the x axis start at 0
                                // beginAtZero: true
                        },
                        barPercentage: 0.7
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


    //FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    //Code from Firebase to add functionality to allow users to signup w/email & password
    // function toggleSignIn() {
    //     if (firebase.auth().currentUser) {
    //         // [START signout]
    //         firebase.auth().signOut();
    //         // [END signout]
    //     } else {
    //         var email = document.getElementById('email').value;
    //         console.log(email);
    //         var password = document.getElementById('password').value;
    //         if (email.length < 2) {
    //             alert('Please enter an email address.');
    //             return;
    //         }
    //         if (password.length < 2) {
    //             alert('Please enter a password.');
    //             return;
    //         }
    //         // Sign in with email and pass.
    //         // [START authwithemail]
    //         firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //             // Handle Errors here.
    //             var errorCode = error.code;
    //             var errorMessage = error.message;
    //             // [START_EXCLUDE]
    //             if (errorCode === 'auth/wrong-password') {
    //                 alert('Wrong password.');
    //             } else {
    //                 alert(errorMessage);
    //             }
    //             console.log(error);
    //             document.getElementById('quickstart-sign-in').disabled = false;
    //         });
    //     }
    // }

    // function handleSignUp() {
    //     // var email = document.getElementById('email').value;
    //     // var password = document.getElementById('password').value;
    //     if (email.length < 4) {
    //         alert('Please enter an email address.');
    //         return;
    //     }
    //     if (password.length < 4) {
    //         alert('Please enter a password.');
    //         return;
    //     }
    //     // Sign in with email and pass.
    //     // [START createwithemail]
    //     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //         // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         // [START_EXCLUDE]
    //         if (errorCode == 'auth/weak-password') {
    //             alert('The password is too weak.');
    //         } else {
    //             alert(errorMessage);
    //         }
    //         console.log(error);
    //         // [END_EXCLUDE]
    //     })
    // };

    //Show the search options/button once user is logged in
    // $("#logIn").on("click", function() {
    //     // $(".search").show();
    //     // $(".logIn").hide();
    //     email = $("#email").val().trim();
    //     password = $("#password").val().trim();

    //     //  user=email.split("@")[0];
    //     // console.log(user);
    //     console.log("email: " + email);
    //     console.log("password: " + password);
    //     // toggleSignIn();
    //     // login();

    // });



    // $("#userEmail").on("click", "#signOut", function(){
    //      // firebase.auth().signOut().then(function(){
    //          //Sign-out successful.
    //          firebase.auth().signOut();
    //          var z = firebase.auth().currentUser.email;
    //          console.log("logged Out");
    //          console.log(z);
    //      // }).catch(function(error){});
    //  });


    //FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    for (k = 0; k < ListOfCities.length; k++) {
        var newOptions = $("<option></option>");
        newOptions.attr("value", ListOfCities[k]);
        newOptions.html(ListOfCities[k]);
        $("#searchInput").append(newOptions);
    };
    //****************************************************************

    //      //Show/Hide the city info with the button created once the search on click runs
    $("#toggle").on('click', function() {
        if ($("#cityInfo").is(":visible")) {
            $("#cityInfo").hide();
            $('#jobInfo').show();
        } else {
            $("#cityInfo").show();
            $('#jobInfo').hide();
        };
    });

    $('#cityInfo').hide();
    $('#jobInfo').show();
    $('#signOut').hide();

    // firebase.auth().signOut(); //signs out any user when page loads
    signOutFromFirebase();
    getJobsFromFirebase();
    makeTeleportAjaxRequest();
    makeIndeedAjaxRequest();
    makeSalaryAjaxRequest();
    getPriceOfBeer();
    getImage();

});
