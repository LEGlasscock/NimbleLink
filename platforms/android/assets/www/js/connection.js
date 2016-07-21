//Modified by Luke Glasscock from Apache Cordova API Cookbook

var states = {};

function onLoad() {
  console.log("connection onLoad");
  document.addEventListener("deviceready", connectionCheck, false);
}

function connectionCheck() {
  console.log("Entering connectionCheck");

  states[Connection.UNKNOWN] = 'Unknown';
  states[Connection.ETHERNET] = 'Ethernet';
  states[Connection.WIFI] = 'Wi-Fi';
  states[Connection.CELL_2G] = 'Cell 2G';
  states[Connection.CELL_3G] = 'Cell 3G';
  states[Connection.CELL_4G] = 'Cell 4G';
  states[Connection.CELL] = 'Cellular';
  states[Connection.NONE] = 'No Network';

  document.addEventListener("online", updateStatus, false);
  document.addEventListener("offline", updateStatus, false);
  updateStatus();
  console.log("Leaving onDeviceReady");
}

function updateStatus() {
  console.log("Entering updateStatus");
  var networkState = navigator.network.connection.type;
  var d = new Date(); //collect date for later implementation
  if (networkState == Connection.NONE) {
    console.log("Offline");
    $('#network-status').text("Offline");
  }
  else {
    console.log("Online");
    $('#network-status').text("Online: " + states[networkState]);
  }
  console.log("Leaving updateStatus");
}

onLoad();
document.getElementById("onload").addEventListener("load", onLoad);