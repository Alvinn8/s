function aprilfools() {
    document.body.insertAdjacentHTML("beforeend", "\n<style>\n.schedule {\n    animation: a 50s linear infinite;\n    animation-origin: bottom middle;\n}\n@keyframes a {\n    0% {\n        transform: rotate(0deg) scaleX(1);\n    }\n    25% {\n        transform: rotate(10deg) scaleX(0.8);\n    }\n    50% {\n        transform: rotate(0deg) scaleX(1);\n    }\n    75% {\n        transform: rotate(-10deg) scaleX(1.2);\n    }\n    100% {\n        transform: rotate(0deg)\n    }\n}\nbutton{z-index: 100; outline: 0;} h2::after,h3::after {content:'?';}</style>\n");

    changeGameLink = function() {};
    stateChanged = function() {};
    document.getElementById("killTime").href = "https://youtu.be/dQw4w9WgXcQ";
    document.getElementById("killTimeText").insertAdjacentHTML("beforeend", ". Fungerar nu även <strong>på lektionstid!</strong> Orkar du inte med mera SO, Musik, NO, Svenska, eller helt enkelt skolan generellt? Ta en paus och spela lite.");

    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(e) {
            e.target.style.position = "absolute";
            e.target.style.left = window.innerWidth * Math.random() + "px";
            e.target.style.top = window.innerHeight * Math.random() + "px";
            e.target.blur();
        });
    }

    function setupFlip(tag) {
        var elements = document.getElementsByTagName(tag);
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function (e) {
                if (!e.target.flipped) {
                    e.target.style.transform = "scaleY(-1)";
                    e.target.flipped = true;
                } else {
                    e.target.style.transform = "scaleY(1)";
                    e.target.flipped = false;
                }
            });
        }
    }
    setupFlip("p");
    setupFlip("h2");
    setupFlip("h3");
    setupFlip("td");
};

window.addEventListener("DOMContentLoaded", function() {
    if (new Date().getDate() == 1 && new Date().getMonth() == 3) {
        aprilfools();
    }
});