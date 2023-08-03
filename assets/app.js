
var articles = document.getElementsByClassName("casestudies__article");
var closeButtons = document.getElementsByClassName("dialog__close");
var body = document.getElementsByTagName("body")[0];

function openDialog(event) { 
    var article = event.currentTarget;
    var target = article.dataset.target;
    var dialog = document.getElementById(target);
    dialog.classList.add("is-open");
    body.classList.add("is-locked");
}

function closeDialog(event) {
    dialog = event.currentTarget.parentElement;
    dialog.classList.remove("is-open");
    body.classList.remove("is-locked");
}

for (var i = 0; i < articles.length; i++) {
    articles[i].addEventListener("click", openDialog);
}

for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", closeDialog);
}



