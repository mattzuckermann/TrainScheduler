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
    var time = $("#inputTime").val().trim();
    var frequency = $("#inputFrequency").val().trim();

    //=====================================================

    var timeFormat = "HH:mm";
    var firstTimeConverter = moment(time, timeFormat);
    var currentTime = moment();
    
    var diffTime = currentTime.diff(moment(firstTimeConverter), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    
    var remainder = diffTime % frequency;
    console.log("Remainder: " + remainder);
    
    var minutesTillTrain = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
    
    var nextArrival = currentTime.add(minutesTillTrain, "minutes");
    var nextArrivalFormatted = moment(nextArrival).format("HH:mm");
    console.log(nextArrivalFormatted);


    //=====================================================
    //=====================================================

    if (name === "" || destination === "" || time === "" || frequency === "") {
        alert("You need to fill in all the form information!");
        // $("#emptyErrorDiv").text("You need to fill in all the form information!");
    } else {
        //STORE DATA IN FIREBASE
        var trainEntry = database.ref().push({
            trainName: name,
            trainDestination: destination,
            trainFrequency: frequency,
            trainNextArrival: nextArrivalFormatted,
            trainMinutesAway: minutesTillTrain
        });
        // $("#emptyErrorDiv").text("");
    }
    //RETURN TEXT FORM BOXES TO PLACEHOLDER TEXT
    $("#inputName").val("");
    $("#inputDestination").val("");
    $("#inputTime").val("");
    $("#inputFrequency").val("");
});

database.ref().on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().trainDestination;
    var trainFrequency = childSnapshot.val().trainFrequency;
    var trainNextArrival = childSnapshot.val().trainNextArrival;
    var trainMinutesAway = childSnapshot.val().trainMinutesAway;

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


//The database must be constantly listening to the change in time as well as the change in time remaining until train arrives