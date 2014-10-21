function getSelectedMenuItem(evt)
{
    var targetElement = evt.target;
    var elem = document.getElementById("menu_detail_name");
    elem.innerHTML = targetElement.innerHTML;
}