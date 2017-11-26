function init() {
    document.addEventListener("deviceready", on_device_ready, false);

    init_nav();
    init_camera();
    init_db();
}
function on_device_ready(){
    console.log("Added back event");
    document.addEventListener("backbutton", backKeyDown, true);
    //boot your app...
}
function backKeyDown() {
    // do something here if you wish
    nav_go_back();
}
