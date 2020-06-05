var tick = [];
var container;
var ballonContainer;
var colors = ["lime", "pink", "lightblue", "orange", "yellow"];
class Particle {
    constructor() {
        var rand = Math.floor(Math.random() * 2);
        this.x = rand == 1 ? 0 : window.innerWidth;
        this.y = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.element = document.createElement("div");
        this.element.style.backgroundColor = this.color;
        this.element.style.width = "10px";
        this.element.style.height = "10px";
        this.element.style.borderRadius = "50%";
        this.element.style.position = "fixed";
        this.element.style.zIndex = 10;
        this.element.particle = this;
        container.appendChild(this.element);
        this.velX = ((Math.random() * 8) + 2) * (rand == 1 ? 1 : -1);
        this.velY = Math.random() * 8 + 2;
        this.life = 0;
        tick.push(this);
    }
    draw() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.x += this.velX;
        this.y += this.velY;
        this.life += 1;
        if (this.y > window.innerHeight)
            this.remove();
        if (this.x > window.innerWidth)
            this.remove();
        if (this.life > 100)
            this.remove();
        if (this.x < 0)
            this.remove();
        if (this.y < 0)
            this.remove();
    }
    remove() {
        //tick.splice(tick.indexOf(this), 1);
        this.element.remove();
        this.removed = true;
        //if (!tick.length) container.innerHTML = "";
    }
}
var ballonColors = ["ec2441","2441ec", "ecec41"];
class Ballon {
    constructor() {
        this.x = Math.floor(Math.random()*(window.innerWidth - 56));
        this.y = window.innerHeight;
        this.color = ballonColors[Math.floor(Math.random()* ballonColors.length)];
        this.element = document.createElement("div");
        this.element.style.position = "fixed";
        this.element.style.zIndex = 11;
        this.element.baloon = this;
        this.element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" width="112" height="395" style=""><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/><defs><path d="M354.52 134.88C354.52 179.89 329.45 216.43 298.57 216.43C267.69 216.43 242.62 179.89 242.62 134.88C242.62 89.87 267.69 53.33 298.57 53.33C329.45 53.33 354.52 89.87 354.52 134.88Z" id="cqexvFOH8"/><path d="M300.95 216.43L309.29 236.67L321.19 261.67L324.76 283.1L317.62 302.14L306.9 321.19L296.19 340.24L291.43 361.67L290.24 383.1L290.24 404.52L292.62 425.95L295 448.57" id="b6GEpARhs"/></defs><g class="currentLayer" style=""><title>Layer 1</title><g id="svg_1" class=""><g id="svg_2"><g id="svg_3"><use xlink:href="#cqexvFOH8" opacity="1" fill="#${this.color}" fill-opacity="1" id="svg_4" y="-53.33000183105469" x="-242.6199951171875"/></g><g id="svg_5"><g id="svg_6"><use xlink:href="#b6GEpARhs" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="4" stroke-opacity="1" id="svg_7" y="-53.33000183105469" x="-242.6199951171875"/></g></g></g></g></g></svg>`;
        ballonContainer.appendChild(this.element);
        tick.push(this);
    }
    draw() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.y -= 5;
        if (this.y + this.element.offsetHeight < 0)
            this.remove();
    }
    remove() {
        //tick.splice(tick.indexOf(this), 1);
        this.element.remove();
        this.removed = true;
    }
}
setInterval(function() {
    for (var i = tick.length - 1; i >= 0; i--) {
        var t = tick[i];
        if (!t) continue;
        if (t.removed) continue;
        t.draw();
    }
}, 1000 / 30);

function celebrateGo() {

    var times = 150;
    var interval = setInterval(function() {
        new Particle();
        times--;
        if (times < 0)
            clearInterval(interval);
    }, 1);
    var ballonTimes = 3;
    var ballonInterval = setInterval(function(){
        new Ballon();
        ballonTimes--;
        if (ballonTimes < 0)
            clearInterval(ballonInterval);
    }, 1000);
    container = document.getElementById("particleContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "particleContainer";
        container.style.pointerEvents = "none";
        document.body.appendChild(container);
    }
    ballonContainer = document.getElementById("ballonContainer");
    if (!ballonContainer) {
        ballonContainer = document.createElement("div");
        ballonContainer.id = "ballonContainer";
        ballonContainer.style.pointerEvents = "none";
        document.body.appendChild(ballonContainer);
    }

    if (!document.getElementById("summerHolidayTextContainer")) {

        var toAdd = document.createElement("div");
        toAdd.id = "summerHolidayTextContainer";
        toAdd.style.position = "fixed";
        toAdd.style.top = "0px";
        toAdd.style.left = "50%";
        toAdd.style.marginLeft = "-125px";
        toAdd.style.zIndex = 9;
        toAdd.style.pointerEvents = "none";
        toAdd.innerHTML = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" style="margin: auto;display: block;shape-rendering: auto;" width="290" height="250" preserveAspectRatio="xMidYMid">
<style type="text/css">
  text {
    text-anchor: middle; font-size: 48px; opacity: 0;
  }
</style>
<g transform="translate(145,125)">
  <g transform="translate(0,0)"><g class="path" style="transform-origin: -104.02px -27.8055px; animation: 1s linear -0.6s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M0.62-4.37L4.37-9.55L4.37-9.55Q8.45-5.47 12.53-5.47L12.53-5.47L12.53-5.47Q14.64-5.47 15.91-6.46L15.91-6.46L15.91-6.46Q17.18-7.44 17.18-9L17.18-9L17.18-9Q17.18-10.56 15.65-11.64L15.65-11.64L15.65-11.64Q14.11-12.72 11.93-13.54L11.93-13.54L11.93-13.54Q9.74-14.35 7.58-15.38L7.58-15.38L7.58-15.38Q5.42-16.42 3.89-18.34L3.89-18.34L3.89-18.34Q2.35-20.26 2.35-22.99L2.35-22.99L2.35-22.99Q2.35-27.31 5.95-30.46L5.95-30.46L5.95-30.46Q9.55-33.60 14.50-33.60L14.50-33.60L14.50-33.60Q16.75-33.60 18.86-33.12L18.86-33.12L18.86-33.12Q20.98-32.64 22.94-31.73L22.94-31.73L19.68-24.72L19.68-24.72Q18.34-25.78 16.01-26.66L16.01-26.66L16.01-26.66Q13.68-27.55 11.93-27.55L11.93-27.55L11.93-27.55Q10.18-27.55 9.10-26.71L9.10-26.71L9.10-26.71Q8.02-25.87 8.02-24.48L8.02-24.48L8.02-24.48Q8.02-23.09 9.55-22.01L9.55-22.01L9.55-22.01Q11.09-20.93 13.27-20.11L13.27-20.11L13.27-20.11Q15.46-19.30 17.64-18.31L17.64-18.31L17.64-18.31Q19.82-17.33 21.36-15.41L21.36-15.41L21.36-15.41Q22.90-13.49 22.90-10.75L22.90-10.75L22.90-10.75Q22.90-6.24 19.30-2.86L19.30-2.86L19.30-2.86Q15.70 0.53 10.90 0.53L10.90 0.53L10.90 0.53Q7.30 0.53 4.51-1.20L4.51-1.20L4.51-1.20Q2.06-2.69 1.06-3.84L1.06-3.84L0.62-4.37" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(81, 202, 204);"></path></g><g class="path" style="transform-origin: -80.085px -29.6889px; animation: 1s linear -0.54s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M25.49-10.03L25.49-10.03Q25.49-16.18 28.80-20.45L28.80-20.45L28.80-20.45Q32.11-24.72 36.55-24.72L36.55-24.72L36.55-24.72Q40.99-24.72 43.46-21.84L43.46-21.84L43.46-21.84Q45.94-18.96 45.94-14.21L45.94-14.21L45.94-14.21Q45.94-7.87 42.74-3.67L42.74-3.67L42.74-3.67Q39.55 0.53 34.70 0.53L34.70 0.53L34.70 0.53Q30.72 0.53 28.10-2.47L28.10-2.47L28.10-2.47Q25.49-5.47 25.49-10.03L25.49-10.03zM40.56-11.71L40.56-11.71L40.56-11.71Q40.56-18.67 35.81-18.67L35.81-18.67L35.81-18.67Q30.86-18.67 30.86-12.14L30.86-12.14L30.86-12.14Q30.86-8.74 32.26-6.82L32.26-6.82L32.26-6.82Q33.65-4.90 35.93-4.90L35.93-4.90L35.93-4.90Q38.21-4.90 39.38-6.65L39.38-6.65L39.38-6.65Q40.56-8.40 40.56-11.71" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(157, 248, 113);"></path></g><g class="path" style="transform-origin: -49.365px -33.8486px; animation: 1s linear -0.48s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M63.98-12.14L63.98-12.14Q63.98-15.46 63.41-16.56L63.41-16.56L63.41-16.56Q62.83-17.66 60.72-17.66L60.72-17.66L60.72-17.66Q58.61-17.66 55.92-15.98L55.92-15.98L55.92-12.48L56.45-1.20L50.02 0L50.59-11.66L50.59-11.66Q50.40-18.10 49.54-23.18L49.54-23.18L55.34-24.43L55.34-24.43Q55.68-21.65 55.82-19.01L55.82-19.01L55.82-19.01Q56.54-19.97 57.46-20.90L57.46-20.90L57.46-20.90Q58.37-21.84 60.34-23.02L60.34-23.02L60.34-23.02Q62.30-24.19 64.32-24.19L64.32-24.19L64.32-24.19Q66.34-24.19 67.73-22.90L67.73-22.90L67.73-22.90Q69.12-21.60 69.50-19.34L69.50-19.34L69.50-19.34Q73.49-24.19 77.57-24.19L77.57-24.19L77.57-24.19Q80.11-24.19 81.60-22.49L81.60-22.49L81.60-22.49Q83.09-20.78 83.09-17.86L83.09-17.86L82.80-12.48L83.33-0.96L76.85 0.24L77.42-12.14L77.42-12.14Q77.42-15.46 76.85-16.56L76.85-16.56L76.85-16.56Q76.27-17.66 74.21-17.66L74.21-17.66L74.21-17.66Q72.14-17.66 69.55-16.08L69.55-16.08L69.36-12.48L69.89-0.96L63.41 0.24L63.98-12.14" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(224, 255, 119);"></path></g><g class="path" style="transform-origin: -10.825px -36.6201px; animation: 1s linear -0.42s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M102.53-12.14L102.53-12.14Q102.53-15.46 101.95-16.56L101.95-16.56L101.95-16.56Q101.38-17.66 99.26-17.66L99.26-17.66L99.26-17.66Q97.15-17.66 94.46-15.98L94.46-15.98L94.46-12.48L94.99-1.20L88.56 0L89.14-11.66L89.14-11.66Q88.94-18.10 88.08-23.18L88.08-23.18L93.89-24.43L93.89-24.43Q94.22-21.65 94.37-19.01L94.37-19.01L94.37-19.01Q95.09-19.97 96.00-20.90L96.00-20.90L96.00-20.90Q96.91-21.84 98.88-23.02L98.88-23.02L98.88-23.02Q100.85-24.19 102.86-24.19L102.86-24.19L102.86-24.19Q104.88-24.19 106.27-22.90L106.27-22.90L106.27-22.90Q107.66-21.60 108.05-19.34L108.05-19.34L108.05-19.34Q112.03-24.19 116.11-24.19L116.11-24.19L116.11-24.19Q118.66-24.19 120.14-22.49L120.14-22.49L120.14-22.49Q121.63-20.78 121.63-17.86L121.63-17.86L121.34-12.48L121.87-0.96L115.39 0.24L115.97-12.14L115.97-12.14Q115.97-15.46 115.39-16.56L115.39-16.56L115.39-16.56Q114.82-17.66 112.75-17.66L112.75-17.66L112.75-17.66Q110.69-17.66 108.10-16.08L108.10-16.08L107.90-12.48L108.43-0.96L101.95 0.24L102.53-12.14" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(222, 157, 214);"></path></g><g class="path" style="transform-origin: 19.705px -38.2706px; animation: 1s linear -0.36s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M131.95 0L131.95 0Q129.12 0 127.32-1.80L127.32-1.80L127.32-1.80Q125.52-3.60 125.52-6.65L125.52-6.65L125.52-6.65Q125.52-9.70 128.30-11.93L128.30-11.93L128.30-11.93Q131.09-14.16 135.07-14.16L135.07-14.16L138.34-14.16L138.34-14.98L138.34-14.98Q138.34-17.33 137.38-18.19L137.38-18.19L137.38-18.19Q136.42-19.06 133.78-19.06L133.78-19.06L133.78-19.06Q132.67-19.06 131.16-18.60L131.16-18.60L131.16-18.60Q129.65-18.14 127.78-17.18L127.78-17.18L126.38-20.98L126.38-20.98Q128.45-22.42 131.40-23.57L131.40-23.57L131.40-23.57Q134.35-24.72 136.27-24.72L136.27-24.72L136.27-24.72Q143.81-24.72 143.81-17.42L143.81-17.42L143.81-8.02L143.81-8.02Q143.81-5.33 145.49-2.02L145.49-2.02L140.40 0.14L140.40 0.14Q139.20-2.16 138.62-3.98L138.62-3.98L138.62-3.98Q135.98 0 131.95 0L131.95 0zM133.97-4.90L133.97-4.90L133.97-4.90Q135.89-4.90 138.34-6.86L138.34-6.86L138.34-10.08L138.34-10.08Q135.79-10.66 134.21-10.66L134.21-10.66L134.21-10.66Q131.18-10.66 131.18-7.97L131.18-7.97L131.18-7.97Q131.18-6.58 131.95-5.74L131.95-5.74L131.95-5.74Q132.72-4.90 133.97-4.90" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(255, 112, 142);"></path></g><g class="path" style="transform-origin: 40.635px -36.6659px; animation: 1s linear -0.3s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M149.14-23.18L149.14-23.18L154.94-24.43L154.94-24.43Q155.38-20.74 155.52-17.42L155.52-17.42L155.52-17.42Q159.89-24.19 163.73-24.19L163.73-24.19L163.20-16.70L163.20-16.70Q160.42-16.70 158.81-16.20L158.81-16.20L158.81-16.20Q157.20-15.70 155.52-14.21L155.52-14.21L155.52-12.48L156.05-1.20L149.62 0L150.19-11.66L150.19-11.66Q150.00-18.10 149.14-23.18" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(81, 202, 204);"></path></g><g class="path" style="transform-origin: 54.24px -40.5445px; animation: 1s linear -0.24s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M166.75-35.95L173.33-37.15L172.70-12.48L173.23-1.20L166.75 0L167.33-11.66L166.75-35.95" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(157, 248, 113);"></path></g><g class="path" style="transform-origin: 71.88px -30.0598px; animation: 1s linear -0.18s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M177.46-10.03L177.46-10.03Q177.46-16.18 180.77-20.45L180.77-20.45L180.77-20.45Q184.08-24.72 188.52-24.72L188.52-24.72L188.52-24.72Q192.96-24.72 195.43-21.84L195.43-21.84L195.43-21.84Q197.90-18.96 197.90-14.21L197.90-14.21L197.90-14.21Q197.90-7.87 194.71-3.67L194.71-3.67L194.71-3.67Q191.52 0.53 186.67 0.53L186.67 0.53L186.67 0.53Q182.69 0.53 180.07-2.47L180.07-2.47L180.07-2.47Q177.46-5.47 177.46-10.03L177.46-10.03zM192.53-11.71L192.53-11.71L192.53-11.71Q192.53-18.67 187.78-18.67L187.78-18.67L187.78-18.67Q182.83-18.67 182.83-12.14L182.83-12.14L182.83-12.14Q182.83-8.74 184.22-6.82L184.22-6.82L184.22-6.82Q185.62-4.90 187.90-4.90L187.90-4.90L187.90-4.90Q190.18-4.90 191.35-6.65L191.35-6.65L191.35-6.65Q192.53-8.40 192.53-11.71" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(224, 255, 119);"></path></g><g class="path" style="transform-origin: 94.58px -23.8763px; animation: 1s linear -0.12s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M208.42-13.82L210.19-6L210.82-6L212.40-12.58L214.99-24.43L220.94-23.71L217.34-11.81L214.32-0.58L206.11 0.14L203.28-11.52L199.82-23.18L206.35-24.38L208.42-13.82" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(222, 157, 214);"></path></g><g class="path" style="transform-origin: 110.93px -4.80641px; animation: 1s linear -0.06s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M223.25-3.14L223.25-3.14L223.25-3.14Q223.25-4.75 224.40-5.93L224.40-5.93L224.40-5.93Q225.55-7.10 227.09-7.10L227.09-7.10L227.09-7.10Q228.62-7.10 229.42-6.26L229.42-6.26L229.42-6.26Q230.21-5.42 230.21-3.79L230.21-3.79L230.21-3.79Q230.21-2.16 229.10-0.94L229.10-0.94L229.10-0.94Q228.00 0.29 226.49 0.29L226.49 0.29L226.49 0.29Q224.98 0.29 224.11-0.62L224.11-0.62L224.11-0.62Q223.25-1.54 223.25-3.14" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(255, 112, 142);"></path></g><g class="path" style="transform-origin: 112.8px -8.82462px; animation: 1s linear 0s infinite normal forwards running bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea; transform: matrix(1, 0, 0, 1, 0, 0);"><path d="M224.98-32.40L232.22-33.60L229.54-12.34L224.98-11.66L224.98-32.40" fill="#9df871" stroke="none" stroke-width="none" transform="translate(-115.79998755455017,13.805399723919953)" style="fill: rgb(81, 202, 204);"></path></g></g>
</g>
<style id="bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea" data-anikit="">@keyframes bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea
{
  0% {
    animation-timing-function: cubic-bezier(0.1361,0.2514,0.2175,0.8786);
    transform: translate(0,0px) scaleY(1);
  }
  37% {
    animation-timing-function: cubic-bezier(0.7674,0.1844,0.8382,0.7157);
    transform: translate(0,-39.96px) scaleY(1);
  }
  72% {
    animation-timing-function: cubic-bezier(0.1118,0.2149,0.2172,0.941);
    transform: translate(0,0px) scaleY(1);
  }
  87% {
    animation-timing-function: cubic-bezier(0.7494,0.2259,0.8209,0.6963);
    transform: translate(0,19.900000000000002px) scaleY(0.602);
  }
  100% {
    transform: translate(0,0px) scaleY(1);
  }
}</style><style id="bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea" data-anikit="">@keyframes bounce-a0e5428b-4cfe-47a7-b1e0-0b9bdf46dfea
{
  0% {
    animation-timing-function: cubic-bezier(0.1361,0.2514,0.2175,0.8786);
    transform: translate(0,0px) scaleY(1);
  }
  37% {
    animation-timing-function: cubic-bezier(0.7674,0.1844,0.8382,0.7157);
    transform: translate(0,-39.96px) scaleY(1);
  }
  72% {
    animation-timing-function: cubic-bezier(0.1118,0.2149,0.2172,0.941);
    transform: translate(0,0px) scaleY(1);
  }
  87% {
    animation-timing-function: cubic-bezier(0.7494,0.2259,0.8209,0.6963);
    transform: translate(0,19.900000000000002px) scaleY(0.602);
  }
  100% {
    transform: translate(0,0px) scaleY(1);
  }
    }</style></svg>`;
        document.body.appendChild(toAdd);

    }
}
