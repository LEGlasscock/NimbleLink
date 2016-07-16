//Modified by Luke Glasscock from Apache Cordova API Cookbook

var btnText = "Continue";
function takePhoto() {
  console.log("Entering takePhoto");
  navigator.camera.getPicture(cameraSuccess, cameraError);
  console.log("Leaving takePhoto");
}
function cameraSuccess(imageURL) {
  console.log("Entering cameraSuccess");
  navigator.notification.alert(imageURL, null, "Photo Results", btnText);
  console.log("Leaving cameraSuccess");
}
function cameraError(errObj) {
  console.log("Entering cameraError");
  console.error(JSON.stringify(errObj));
  navigator.notification.alert("Error: " + JSON.stringify(errObj), null, "Camera Error", btnText);
  console.log("Leaving cameraError");
}
//Chrome workaround; Chrome will not allow onclick in html to work
document.getElementById("take-photo").addEventListener("click", takePhoto);