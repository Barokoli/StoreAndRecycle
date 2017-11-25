var active_view = 1;

function load_view(nr) {
    $('#View_0'+active_view).hide();
    $('#View_0'+nr).show();
    if ($("#View_0"+nr).html() == "") {
        $("#View_0"+nr).load("View_0"+nr+".html");
    }
    active_view = nr;
}

function init_nav() {
  load_view(1);
}

function nav_go_back() {
  if (active_view > 1) {
    load_view(active_view - 1);
  }
}
