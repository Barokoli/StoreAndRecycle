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
}

function nav_go_back() {
  if (active_view > 0) {
    load_view(view_history.pop());
  }
}
