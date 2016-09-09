firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    console.log("signed in");
    // getStories();
  } else {
    console.log("sign out");
  }
});

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode, errorMessage, error);
});

function getStories() {
  var stories = firebase.database().ref("/stories").once("value").then(function (d) {
    var i;
    for(i in Object.keys(d.val())) {
      console.log(i);
    }
  });
}

function ready() {
  var b = document.querySelector("#share");
  if(b) {
    b.onclick = function (e) {
      var storyData = {
        "imNot": document.querySelector("#notjust").value,
        "imAlso": document.querySelector("#also").value,
        "story": document.querySelector("#story").value
      };

      var f = document.querySelector("#f");
      var file = f.files[0];
      console.log(file);
      var filename = file.name;
      var storageRef = firebase.storage().ref();
      var imageRef = storageRef.child('images/' + filename);
      imageRef.put(file).then(function(snapshot) {
        console.log('Uploaded a file!');
      });
      var newPostKey = firebase.database().ref().child('stories').push().key;
      var key = '/stories/' + newPostKey;
      var updates = {};
      updates[key] = storyData;

      firebase.database().ref().update(updates);
      return false;
    };
  }
}

window.onload = ready;
