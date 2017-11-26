var active_view = 0;
var view_history = [];

function load_view(nr) {
    $('#View_0'+active_view).hide();
    view_history.push(active_view);
    $('#View_0'+nr).show();
    if ($("#View_0"+nr).html() == "") {
        $("#View_0"+nr).load("View_0"+nr+".html");
    }
    active_view = nr;
}

function init_nav() {
  load_view(0);
  $("#View_00").load("View_00.html");
  $("#View_01").load("View_01.html");
  $("#View_02").load("View_02.html");
  $("#View_03").load("View_03.html");
  $("#View_04").load("View_04.html");
  $("#View_010").load("View_010.html");
  $("#View_011").load("View_011.html");
  $("#View_012").load("View_012.html");
}

function nav_go_back() {
  if (active_view > 0) {
    load_view(view_history.pop());
  }
}
