var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var result_disp;
var result_cb;
// Wait for PhoneGap to connect with the device
//

// PhoneGap is ready to be used!
//
function init_camera() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}
// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Get image handle
  //
  var smallImage = document.getElementById("image_ghost");
  // Unhide image elements
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  smallImage.src = "data:image/jpeg;base64," + imageData;
  $('#' + result_disp).css('background-image', 'url(data:image/jpeg;base64,' + imageData + ')');
  result_cb();
}

// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
  // Get image handle
  //console.log(JSON.stringify(imageData));

  // Get image handle
  //
  var smallImage = document.getElementById('image_ghost');
  // Unhide image elements
  //
  //smallImage.style.display = 'block';
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = imageData;
  $('#' + result_disp).css('background-image', 'url(' + imageData + ')');
  $('#' + result_disp).css("width", $(window).width() + "px");
  $('#' + result_disp).css("height", $(window).width() * 1.333333333333 + "px");
  result_cb();
  //$('#' + result_disp).css('background-image', 'url(' + imageData + ')');
}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);
  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');
  // Unhide image elements
  //
  largeImage.style.display = 'block';
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}
// A button will call this function
//
function capturePhotoWithData(cb_id, cb) {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 75, correctOrientation: true });
  result_disp = cb_id;
  result_cb = cb;
}

function capturePhotoWithFile(cb_id, cb) {
    navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 75, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
    result_disp = cb_id;
    result_cb = cb;
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 75,
    destinationType: destinationType.FILE_URI,
    sourceType: source,
    correctOrientation: true });
}
// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

/*

<button onclick="capturePhotoWithData();">Capture Photo With Image Data</button> <br>
<button onclick="capturePhotoWithFile();">Capture Photo With Image File URI</button> <br>
<button onclick="getPhoto(pictureSource.PHOTOLIBRARY);">From Photo Library</button><br>
<button onclick="getPhoto(pictureSource.SAVEDPHOTOALBUM);">From Photo Album</button><br>

<img style="display:none;width:60px;height:60px;" id="smallImage" src="" />
<img style="display:none;" id="largeImage" src="" />

*/
