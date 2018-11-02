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

    //=====================================================
    //=====================================================
    var currentTime = moment();
    console.log("CURRENT TIME (UNIX) " + currentTime);
    var convertedCurrentTime = currentTime.format("hh:mm");
    console.log("CURRENT TIME (CONVERTED): " + convertedCurrentTime);
    console.log(currentTime.format("dddd"));
    console.log(currentTime.format("DDD"));

    var laterTime = time;
    var laterTimeFormat = "HH:mm";
    var convertedTime = moment(laterTime, laterTimeFormat);
    var firebaseConvertedTime = convertedTime.format("HH:mm A")
    console.log(firebaseConvertedTime);

    console.log("");
    console.log(convertedTime.format("X"));
    console.log(convertedTime.format("HH:mm"));
    console.log(convertedTime.format("hh:mm a"));
    console.log(convertedTime.format("hh:mm A"));
    //=====================================================
    //=====================================================

    if (name === "" || destination === "" || time === "" || frequency === "") {
        alert("You need to fill in all the form information!");
    } else {
        //STORE DATA IN FIREBASE
        var trainEntry = database.ref().push({
            trainName: name,
            trainDestination: destination,
            trainFrequency: frequency,
            trainNextArrival: firebaseConvertedTime,
            trainMinutesAway: "placeholder"
        });

        //RETURN TEXT FORM BOXES TO PLACEHOLDER TEXT
        $("#inputName").val("");
        $("#inputDestination").val("");
        $("#inputTime").val("");
        $("#inputFrequency").val("");
    }
});

database.ref().on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().trainDestination;
    var trainFrequency = childSnapshot.val().trainFrequency;
    var trainNextArrival = childSnapshot.val().trainNextArrival;
    var trainMinutesAway = childSnapshot.val().trainMinutesAway;

    // Log everything that's coming out of snapshot
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFrequency);
    console.log(trainNextArrival);
    console.log(trainMinutesAway);
    console.log("--------------");

    //ADD ROW TO TABLE 
    var tableBody = $("tbody");
    var tableRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(trainNextArrival),
        $("<td>").text(trainMinutesAway),
    );
    tableBody.append(tableRow);

    // HANDLE THE ERRORS
    function errorsHandled(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }
});





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