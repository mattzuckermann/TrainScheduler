var config = {
    apiKey: "AIzaSyC89VjAiS9e9i1AVqNW20UrRDJfuxIfcDA",
    authDomain: "mz-train-scheduler.firebaseapp.com",
    databaseURL: "https://mz-train-scheduler.firebaseio.com",
    projectId: "mz-train-scheduler",
    storageBucket: "mz-train-scheduler.appspot.com",
    messagingSenderId: "863857602498"
};

firebase.initializeApp(config);

//https://mz-train-scheduler.firebaseio.com/

// =========
// VARIABLES
// =========

var database = firebase.database();
var dataArray = [];

// ==============
// EVENT LISTENER
// ==============

$("#submitButton").on("click", function () {
    event.preventDefault();
    var name = $("#inputName").val().trim();
    var destination = $("#inputDestination").val().trim();
    var frequency = $("#inputFrequency").val().trim();
    var time = $("#inputTime").val().trim();
    var minutesAway = "placeholder";

    if (name === "" || destination === "" || time === "" || frequency === "") {
        alert("You need to fill in all the form information!");
    } else {
        //STORE DATA IN FIREBASE
        var trainEntry = database.ref().push({
            trainName: name,
            trainDestination: destination,
            trainFrequency: frequency,
            trainNextArrival: time,
            trainMinutesAway: "placeholder"
        });

        //RETURN TEXT FORM BOXES TO PLACEHOLDER TEXT
        $("#inputName").val("");
        $("#inputDestination").val("");
        $("#inputTime").val("");
        $("#inputFrequency").val("");
    }
});

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().trainDestination);
        console.log(childSnapshot.val().trainFrequency);
        console.log(childSnapshot.val().trainNextArrival);
        console.log(childSnapshot.val().trainMinutesAway);

        //ADD ROW TO TABLE 
        var tableBody = $("tbody");
        var tableRow = $("<tr>");
        for (i = 0; i < 5; i++) {
            var tableData = $("<td>");
            tableData.attr("id", "item-" + i);
            tableRow.append(tableData);
        }
        //PLACE DATA
        tableBody.append(tableRow);
        $("#item-0").text(childSnapshot.val().trainName);
        $("#item-1").text(childSnapshot.val().trainDestination);
        $("#item-2").text(childSnapshot.val().trainFrequency);
        $("#item-3").text(childSnapshot.val().trainNextArrival);
        $("#item-4").text(childSnapshot.val().trainMinutesAway);
        
        // HANDLE THE ERRORS
        function errorsHandled(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    });

















    // var currentDate = moment();
// var dateFormat = "MM/DD/YY";
// var convertedDate = moment(currentDate, dateFormat);

// =========
// FUNCTIONS
// =========


// //TO PUSH WHAT'S BEEN PUT ON FROM PAST WEB VISITS
// function displayTrains(array) {
//     $("#displayTrains tbody").empty();
//     for (let i in array) {
//         $("#displayTrains").append("<tr><td>" + database.ref().get(array[i]));
//     }
// }



// database.ref().once("value").then(function (snapshot) {
//     console.log(snapshot.val());
//     var snap = snapshot.val();

//     for (let i in snap) {
//         console.log(snap[i].name);
//     }
// });

// database.ref().on("child_added", function (snapshot) {
//     displayTrains(dataArray);
// });






// // Assumptions
// var tFrequency = $("#inputFrequency").val().trim();

// // Time is 3:30 AM
// var firstTime = $("#inputTime").val().trim();

// // First Time (pushed back 1 year to make sure it comes before current time)
// var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
// console.log(firstTimeConverted);

// // Current Time
// var currentTime = moment();
// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// // Difference between the times
// var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + diffTime);

// // Time apart (remainder)
// var tRemainder = diffTime % tFrequency;
// console.log(tRemainder);

// // Minute Until Train
// var tMinutesTillTrain = tFrequency - tRemainder;
// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// // Next Train
// var nextTrain = moment().add(tMinutesTillTrain, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));