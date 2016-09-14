var loggedIn = false;

firebase.auth().onAuthStateChanged(function(user) {
    if (user && !loggedIn) {
        console.log("signed in:", user.uid);
        loggedIn = true;
        getStories();
    } else if (!user) {
        console.log("signed out");
        loggedIn = false;
    }
});

firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage, error);
});

function getStories() {
    var images = document.querySelectorAll("img");
    var stories = firebase.database().ref("/stories").once("value").then(function(d) {
        var i, j = 0;
        for (i in d.val()) {
            var imageRef = d.val()[i].imageRef;
            if(imageRef) {
              console.log(i, d.val()[i]);
              firebase.storage().ref().child(imageRef).getDownloadURL().then(function(url) {
                images.item(j++).src = url;
              }).catch(function(error) {
                  console.log(i, imageRef, error);  
              });
            }
        }
    });
}

function ready() {
    var b = document.querySelector("#share");
    if (b) {
        b.onclick = function(e) {
            var fileInput = document.querySelector("#f");
            var file = fileInput.files[0];

            var newPostKey = firebase.database().ref().child('stories').push().key;
            var storyData = {
                imNot: document.querySelector("#notjust").value,
                imAlso: document.querySelector("#also").value,
                story: document.querySelector("#story").value,
                imageRef: "images/" + newPostKey + "/" + file.name
            };

            firebase.storage().ref().child(storyData.imageRef).put(file).then(function(snapshot) {
                console.log('Uploaded a file under ' + storyData.imageRef);
            });

            var key = '/stories/' + newPostKey;
            var updates = {};
            updates[key] = storyData;
            firebase.database().ref().update(updates);
            return false;
        };
    }
}

window.onload = ready;