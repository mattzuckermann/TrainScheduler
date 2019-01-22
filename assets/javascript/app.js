// Initialize Firebase
var config = {
    apiKey: "AIzaSyAIfRrL-7coY9zDaYSVgtkj2sueapTayNw",
    authDomain: "mz-train-scheduler2.firebaseapp.com",
    databaseURL: "https://mz-train-scheduler2.firebaseio.com",
    projectId: "mz-train-scheduler2",
    storageBucket: "mz-train-scheduler2.appspot.com",
    messagingSenderId: "89347452395"
};
firebase.initializeApp(config);

//=============
//FIREBASE LINK
//=============
//https://mz-train-scheduler2.firebaseio.com


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

    var firstTimeConverterString = firstTimeConverter.toString();

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
            trainFirstTime: firstTimeConverterString
        });
    }
    //RETURN TEXT FORM BOXES TO PLACEHOLDER TEXT
    $("#inputName").val("");
    $("#inputDestination").val("");
    $("#inputTime").val("");
    $("#inputFrequency").val("");
});


database.ref().on("child_added", function (childSnapshot) {

    var currentTime = moment();

    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().trainDestination;
    var trainFrequency = childSnapshot.val().trainFrequency;

    var trainFirstTime = childSnapshot.val().trainFirstTime;

    var diffTime = currentTime.diff(moment(trainFirstTime), "minutes");
    var remainder = diffTime % trainFrequency;
    var minutesTillTrain = trainFrequency - remainder;
    var nextArrival = currentTime.add(minutesTillTrain, "minutes");
    var nextArrivalFormatted = moment(nextArrival).format("HH:mm");

    var trainNextArrival = nextArrivalFormatted;
    var trainMinutesAway = minutesTillTrain;

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

setInterval(function () {
    database.ref().on("value", function (childSnapshot) {
        var currentTime = moment();

        var trainName = childSnapshot.val().trainName;
        var trainDestination = childSnapshot.val().trainDestination;
        var trainFrequency = childSnapshot.val().trainFrequency;

        var trainFirstTime = childSnapshot.val().trainFirstTime;

        var diffTime = currentTime.diff(moment(trainFirstTime), "minutes");
        var remainder = diffTime % trainFrequency;
        var minutesTillTrain = trainFrequency - remainder;
        var nextArrival = currentTime.add(minutesTillTrain, "minutes");
        var nextArrivalFormatted = moment(nextArrival).format("HH:mm");

        var trainNextArrival = nextArrivalFormatted;
        var trainMinutesAway = minutesTillTrain;

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
}, 600000);