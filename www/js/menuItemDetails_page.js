function getSelectedMenuItem(evt)
{
    var targetElement = evt.target;
    var detailsPage = document.getElementById("menu_detail");
    var elem = document.createElement("p");
    elem.innerHTML = targetElement.innerHTML;
    detailsPage.appendChild(elem);
}