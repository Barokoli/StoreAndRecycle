var active_view = 0;
var view_history = [];

function load_view(nr) {
    var layer = nr > 9 ? "#View_" + nr : "#View_0" + nr;
    var layer_a = nr > 9 ? "#View_" + active_view : "#View_0" + active_view;
    $(layer_a).hide();
    view_history.push(active_view);
    $(layer).show();
    if ($(layer_a).html() == "") {
        $(layer).load(layer+".html");
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
