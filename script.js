var mdata;
var overrides;
var updatedAt;
var currentState;
var allBoredLinks = ["https://theuselessweb.com/","http://run3online.com/","https://zh.y8.com/games/slope"];
var boredLinks = allBoredLinks.slice(0); // clone allBoredLinks
var shortcutMode = 0;
var lunches = [];
//var messages = {constant:[{message:"Schemat har ändrats men den här sidan har fortfarande det gamla. Ska lägga in det nya snart",backcolor:"pink",bordercolor:"red"}],date:[{date:[8,6],message:"Idag börjar profilerna"}]}

 // First index of date is month, second is date
var messages = {constant:[],date:[/*{date:[6,13], message:"Skolavslutning, \"Sommaravslutning i aulan kl: 09:00-09:30/45. Alla klasser träffas i klassrummen kl 0845 och går gemensamt till aulan kl 0900, därefter betygsutdelning i klassrummen.\", från kalender i infomentor"},*/{date:[6,12],message:"Hemkunskapen börjar 12:10 istället för 11:45"}]}

var state = Object.freeze({
    "SCHOOL_OVER" : Symbol("SCHOOL_OVER"),
    "WEEKEND"     : Symbol("WEEKEND"),
    "IN_LESSON"   : Symbol("IN_LESSON"),
    "BREAK"       : Symbol("BREAK")
});
var dayNames = [
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag"
];
console.log("Starting calcSeconds interval");
var calcSecondsIntervalId = setInterval(calcSeconds, 1000);
//var fakeNowTime = 560;
var fakeNowTime;
function nowTime() {
  var date = new Date();
  if (!fakeNowTime) return date.getHours() * 60 + date.getMinutes();
  else return fakeNowTime;
}
var day = new Date().getDay()-1;
var lunchDay = day;
if ((lunchDay > 4) || (lunchDay < 0)) lunchDay = 4;
//var day = 4;
//var lunchDay = 4;
Node.prototype.addSafeText = function(text) {
    var toAdd = document.createTextNode(text);
    this.appendChild(toAdd);
    return this;
};
Node.prototype.setSafeText = function(text) {
    this.innerHTML = "";
    this.addSafeText(text);
    return this;
};
Node.prototype.addSafeElement = function(tag, text) {
    var toAdd = document.createElement(tag);
    if (tag != "br") toAdd.addSafeText(text);
    this.appendChild(toAdd);
    return this;
};

(function() {
    var scheduleLoaded = false;
    var overridesLoaded = false;

    function checkIfDone() {
        if (scheduleLoaded && overridesLoaded) {
            console.log("All requests finished at document ready state "+ document.readyState);

            if (document.readyState == "interactive" || document.readyState == "complete") {
                load();
            } else {
                window.addEventListener("DOMContentLoaded", load);
            }
        }
    }

    var scheduleXhr = new XMLHttpRequest();
    scheduleXhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            mdata = JSON.parse(this.responseText);
            scheduleLoaded = true;
            console.log("Loaded schedule");
            checkIfDone();
        }
    }
    scheduleXhr.open("GET", "schedule.json");
    scheduleXhr.send();

    var overridesXhr = new XMLHttpRequest();
    overridesXhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            overrides = JSON.parse(this.responseText);
            overridesLoaded = true;
            console.log("Loaded overrides");
            checkIfDone();
        }
    }
    overridesXhr.open("GET", "overrides.json");
    overridesXhr.send();
})();

window.onkeydown = function(e) {
  function initShortcut() {
    document.getElementById("shortcut").style.display = "block";
    document.getElementById("shortcutSmall1").innerHTML = "";
    document.getElementById("shortcutBig1").innerHTML = "";
    document.getElementById("shortcutSmall2").innerHTML = "";
    document.getElementById("shortcutBig2").innerHTML = "";
  }
  var path = typeof e.composedPath == "function" ? e.composedPath() : [];
  if ((!path.length || !path[0] || !path[0] instanceof Element) || (path.length && path[0] instanceof Element && path[0].tagName != "INPUT")) {

    if (e.key == "r") {
  
      newDay();
      calcMinutes();
    
    } else if (e.key == "a") {
      initShortcut();
      shortcutMode = 1;
      var big1 = document.getElementById("shortcutBig1");
      var toAdd = document.createElement("span");
      toAdd.id = "shortcutBig1Minutes";
      big1.appendChild(toAdd);
      var toAdd2 = document.createElement("span");
      toAdd2.id = "shortcutBig1Seconds";
      big1.appendChild(toAdd2);
      calcSeconds();
      calcMinutes();
    } else if (e.key == "b") {
      initShortcut();
      shortcutMode = 2;
      newDay();
      var length = mdata[day].lessons.length;
      document.getElementById("shortcutBig1").setSafeText(toClockTime(mdata[day].lessons[length - 1].end));
      document.getElementById("shortcutSmall1").setSafeText("Idag slutar vi klockan");
      if (day == 1 || day == 2) {
        document.getElementById("shortcutBig2").setSafeText(toClockTime(mdata[day].lessons[length - 2].end));
        document.getElementById("shortcutSmall2").setSafeText("Eller om du inte behöver gå på studieverkstad, slutar du klockan");
      }
    }
  }
  
}

function calcMinutes() {

  updatedAt = nowTime();

  if (new Date().getTime() > new Date("Jun 13 2019 09:00:00").getTime() && new Date().getTime() < new Date("Aug 19 2019").getTime()) celebrateGo();

  var lessons = mdata[0].lessons;

  if ((day > 4) || (day < 0)) {
    currentState = state.WEEKEND;
    stateChanged();
    document.getElementById('nextOrCurLes').setSafeText("Helg!");
    //document.getElementById('recalc').style.display = "none";
    return;
  }
  if (mdata[day] != undefined) {
    lessons = mdata[day].lessons;
  } else {
    console.log('There is no lesson data for this day. Showing lessons for Monday.');
  }
  for (var les in lessons) {
    var less = lessons[les];
    if (less.isDisabled) continue;
    if ((less.start <= nowTime()) && (less.end > nowTime())) {
      currentState = state.IN_LESSON;
      stateChanged();
      document.getElementById('nextOrCurLes').setSafeText("Nuvarande lektion");
      document.getElementById('nextLesTime').setSafeText("Slutar om: ").addSafeElement("b", toHourAndMinute(less.end-nowTime()-1,true));
      document.getElementById('nextLesSubject').setSafeText("Ämne: ").addSafeElement("b", less.subject);
      document.getElementById('nextLesClassroom').setSafeText("Sal: ").addSafeElement("b", less.classroom);
      document.getElementById('nextLesStarted').setSafeText("Började: ").addSafeElement("b", toClockTime(less.start));
      document.getElementById('nextLesEnds').setSafeText("Slutar: ").addSafeElement("b", toClockTime(less.end));
      document.getElementById('nextLesLength').setSafeText("Längd: ").addSafeElement("b", toHourAndMinute(getLessonLength(less)));
      document.getElementById('nextLesExtra').setSafeText("");
      
      if (!calcSecondsIntervalId) {
        console.log("Starting calcSeconds interval");
        calcSecondsIntervalId = setInterval(calcSeconds, 1000);
        
      }
      if (shortcutMode) {
        if (shortcutMode == 1) {
          document.getElementById("shortcutSmall1").setSafeText("Denna lektion slutar om");
          document.getElementById("shortcutBig1Minutes").setSafeText(toHourAndMinute(less.end-nowTime()-1,true));
          document.getElementById("shortcutSmall2").setSafeText("Alltså klockan");
          document.getElementById("shortcutBig2").setSafeText(toClockTime(less.end));
        }
      }
      break;
    }
    if (less.start > nowTime()) {
      currentState = state.BREAK;
      stateChanged();
      document.getElementById('nextOrCurLes').setSafeText("Nästa lektion");
      document.getElementById('nextLesTime').setSafeText("Börjar om: ").addSafeElement("b", toHourAndMinute((less.start-nowTime()-1),true));
      document.getElementById('nextLesSubject').setSafeText("Ämne: ").addSafeElement("b", less.subject);
      document.getElementById('nextLesClassroom').setSafeText("Sal: ").addSafeElement("b", less.classroom);
      document.getElementById('nextLesStarted').setSafeText("Börjar: ").addSafeElement("b", toClockTime(less.start));
      document.getElementById('nextLesEnds').setSafeText("Slutar: ").addSafeElement("b", toClockTime(less.end));
      document.getElementById('nextLesLength').setSafeText("Längd: ").addSafeElement("b", toHourAndMinute(getLessonLength(less)));
      document.getElementById('nextLesExtra').setSafeText("");
      
      if (!calcSecondsIntervalId) {
        console.log("Starting calcSeconds interval");
        calcSecondsIntervalId = setInterval(calcSeconds, 1000);
        
      }
      if (shortcutMode) {
        if (shortcutMode == 1) {
          document.getElementById("shortcutSmall1").setSafeText("Nästa lektion börjar om");
          document.getElementById("shortcutBig1Minutes").setSafeText(toHourAndMinute((less.start-nowTime()-1),true));
          document.getElementById("shortcutSmall2").setSafeText("Alltså klockan");
          document.getElementById("shortcutBig2").setSafeText(toClockTime(less.start));
        }
      }
      break;
    }
    if (les >= lessons.length-1) {
      currentState = state.SCHOOL_OVER;
      stateChanged();
      document.getElementById('nextOrCurLes').setSafeText("Skolan är slut!");
      document.getElementById('nextLesTime').setSafeText("");
      document.getElementById('nextLesSubject').setSafeText("");
      document.getElementById('nextLesClassroom').setSafeText("");
      document.getElementById('nextLesStarted').setSafeText("Började: ").addSafeElement("b", toClockTime(mdata[day].lessons[0].start));
      document.getElementById('nextLesLength').setSafeText("Längd: ").addSafeElement("b", toHourAndMinute((mdata[day].lessons[mdata[day].lessons.length-1].end)-(mdata[day].lessons[0].start)));
      document.getElementById('nextLesEnds').setSafeText("Slutade: ").addSafeElement("b",  toClockTime(mdata[day].lessons[mdata[day].lessons.length-1].end));
      document.getElementById('nextLesExtra').setSafeText("Antal lektioner: ").addSafeElement("b", mdata[day].lessons.length);
      document.getElementById('seconds').setSafeText("");
      
      if (calcSecondsIntervalId) {
        
        clearInterval(calcSecondsIntervalId);
        calcSecondsIntervalId = null;
        
      }
      break;
    }
  }
}
function getLessonLength(lesson) {
  if ((lesson == undefined) || (lesson.start == undefined) || (lesson.end == undefined)) return;
  return lesson.end-lesson.start;
}
function getLunch(day) {
  if (!mdata[day]) return null;
  if (!mdata[day].lunch) return null;

  var lessons_before = mdata[day].lunch;

  if (!mdata[day].lessons[lessons_before-1]) return null;
  if (!mdata[day].lessons[lessons_before]) return null;

  return {
    start  : mdata[day].lessons[lessons_before-1].end,
    end    : mdata[day].lessons[lessons_before].start,
    length : ((mdata[day].lessons[lessons_before].start)-(mdata[day].lessons[lessons_before-1].end))
  }
 }
function changeDay(increase) {
  if ((increase == "next") && (lunchDay < 4)) lunchDay++;
  else if ((lunchDay >= 1) && (increase == "prev")) lunchDay--;
  setMats();
  document.getElementById('day').setSafeText(dayNames[lunchDay]);
  if (lunches.length > 9) {
    document.getElementById('lunchFood').setSafeText("Mat: ").addSafeElement("b", lunches[lunchDay*2]);
    document.getElementById('lunchFoodAlt').setSafeText("Alternativ Mat: ").addSafeElement("b", lunches[lunchDay*2+1]);
  }
  var lunch = getLunch(lunchDay);
  if (lunch) {
    document.getElementById('lunchWhen').setSafeText('När: ').addSafeElement("b", toClockTime(lunch.start));
    document.getElementById('lunchEnds').setSafeText('Slutar: ').addSafeElement("b", toClockTime(lunch.end));
    document.getElementById('lunchLength').setSafeText('Längd: ').addSafeElement("b", toHourAndMinute(lunch.length));
  } else {
    document.getElementById('lunchWhen').setSafeText('Error: ').addSafeElement("b", "Lunchtiden kunde inte hämtas");
  }
}
function toTime(hour, min) {
  return hour*60 + min;
}
function load() {
  try {
      displayMessages(messages);
  } catch(e) {
      displayError("Något gick fel när meddelanderna skulle visas, "+ e);
      console.error(e);
  }
  // Load overrides
  try {
    for (var lessonOverride of overrides.lessons) {
      console.log("Loading override "+ lessonOverride.lesson.join(" "), lessonOverride);
      // TODO: add date checking
      //mdata[lessonOverride.lesson[0]].lessons[lessonOverride.lesson[1]]

      if (Object.keys(lessonOverride.overrides).length) {
        mdata[lessonOverride.lesson[0]].lessons[lessonOverride.lesson[1]].beforeOverrides = Object.assign({}, mdata[lessonOverride.lesson[0]].lessons[lessonOverride.lesson[1]]);
        mdata[lessonOverride.lesson[0]].lessons[lessonOverride.lesson[1]].wasOverridden = true;
      }
      for (var override in lessonOverride.overrides) {
        (function(val) {
          Object.defineProperty(mdata[lessonOverride.lesson[0]].lessons[lessonOverride.lesson[1]], override, {
            get: function() {
              return val;
            }
          });
          console.log("Overridden lesson "+ lessonOverride.lesson.join(" ") + ", property "+ override +" with "+ val);
        })(lessonOverride.overrides[override]);
      }
    }
    for (var dayOverride of overrides.days) {
      var date = new Date();
      date.setMonth(dayOverride.date.month - 1);
      date.setDate(dayOverride.date.date);
      var mdataWeekDay = date.getDay() - 1;
      dayOverride.day = mdataWeekDay;
      for (var lesson of mdata[mdataWeekDay].lessons) {
        lesson.isDisabled = true;
        lesson.hideNewOverride = true;
        lesson.wasOverridden = true;
        lesson.beforeOverrides = Object.assign({}, lesson);
      }
      //dayOverride.index = mdata[mdataWeekDay].lessons.push(dayOverride) - 1;
    }
    for (var dayOverride of overrides.days) {
      dayOverride.isOverrider = true;
      mdata[dayOverride.day].lessons.push(dayOverride);
    }
  } catch(e) {
    displayError("Någonting gick fel när överskridningen(overrides) skulle laddas, "+ e);
    console.error(e);
  }
  try {
      var params = getParams();
      if (params) {
        
        if (params.p != undefined) {
          if (params.p == "adam") {
            Object.assign(params,{
              s         : "franska",
              profil    : "Musikprofil",
              profilSal : "N06... kanske? Jag vet inte... var är det någonstans Adam?"
            });
          } else {
            console.warn('Invalid value for URL paramater \'s\'!');
          }
        }

        // TODO: Update these
        /*
        if (params.s != undefined) {
          if (params.s == "franska") {
            changeLesson(1,0,{subject:"Franska",classroom:"G31",material:undefined});
            changeLesson(3,2,{subject:"Franska",classroom:"G31",material:undefined});
            document.getElementById('linkS').value = "Franska";
          } else if (params.s == "tyska") {
            changeLesson(1,0,{subject:"Tyska",classroom:"G19",material:undefined});
            changeLesson(3,2,{subject:"Tyska",classroom:"G19",material:undefined});
            document.getElementById('linkS').value = "Tyska";
          } else if (params.s == "exeng") {
            changeLesson(1,0,{subject:"Extra Engelska",classroom:"G19b",material:undefined});
            changeLesson(3,2,{subject:"Extra Engelska",classroom:"G19b",material:undefined});
            document.getElementById('linkS').value = "Extra Engelska";
          } else {
            console.log('Invalid value for URL paramater \'s\'!');
          }
        }
        */
        /*if (params.sl != undefined) {
          changeLesson(2,2,{subject:"Syslöjd",classroom:"G47b"});
            document.getElementById('linkSl').value = "Syslöjd";
        }*/
        /*
        if (params.profil != undefined) {
          changeLesson(3,4, {subject:decodeURIComponent(params.profil)})
          if (params.profil == "Programmering") {
            document.getElementById('linkProfil').value = "Programmering";
          } else {
            document.getElementById('linkProfil').value = "Annan";
            linkChange();
            document.getElementById('linkProfilName').value = decodeURIComponent(params.profil);
            document.getElementById('linkProfilClassroom').value = decodeURIComponent(params.profilSal);
          }
        }
        if (params.profilSal != undefined) {
          changeLesson(3,4, {classroom:decodeURIComponent(params.profilSal)})
          if (params.profil != "Programmering") {
            document.getElementById('linkProfilClassroom').value = decodeURIComponent(params.profilSal);
          }
        }
        */

        // TODO: Update these
        /*
        if (params.mod != undefined) {
          mdata[4].lessons[4] = {subject:decodeURIComponent(params.mod),classroom:"<span style=\"color:red\">error</span>",start: toTime(14,25), end:toTime(15, 05)}
          document.getElementById('linkMod').value = "Modersmål";
          linkChange();
          document.getElementById('linkModName').value = decodeURIComponent(params.mod);
          document.getElementById('linkModClassroom').value = decodeURIComponent(params.modSal);
        }
        if (params.modSal != undefined) {
          changeLesson(4,4, {classroom:decodeURIComponent(params.modSal)})
          document.getElementById('linkModClassroom').value = decodeURIComponent(params.ModSal);
        }
        */
    
        if (params.gt != undefined) {
          document.getElementById("gt").style.display = "block";
        }

        if (params.color) {
          var style = document.createElement("style");
          style.innerHTML = ".schedule, #lessonInfo, #shortcut { background-color: #"+ params.color +" !important }"; // TODO: Maybe find a way to do this without !important
          document.head.appendChild(style);
          document.getElementById('linkColor').value = "#" + params.color;

        }
      }
  } catch(e) {
      displayError("Något gick fel när url parametrarna skulle laddas, "+ e);
      console.error(e);
  }
  try {
      makeschedule();
  } catch(e) {
      displayError("Något gick fel när schemat skulle laddas, "+ e);
      console.error(e);
  }
  changeDay();
  calcSeconds();
  linkChange();
  
  changeGameLink();
  //if (new Date())
  
  /*document.onscroll = function(e){
    var endsTime = document.getElementById('endsTime');
    var b = document.getElementById('recalc').getBoundingClientRect();
    if ((b.y + b.height) < -11) {
      endsTime.style.position = "fixed";
      endsTime.style.top = "0px";
      endsTime.style.padding = "5px";
      endsTime.style.paddingLeft = "0px";
      endsTime.style.backgroundColor = "white";
      endsTime.style.zIndex = 2;
      document.getElementById('recalc').style.marginBottom = "35px";
    } else {
        endsTime.removeAttribute('style');
        document.getElementById('recalc').style.marginBottom = "16px";
    }
  }*/
  
}
function toClockTime(val) {
  var hour = Math.floor(val/60).toString();
  var min = (val%60).toString();
  if (min.length == 1) {
    min = "0"+ min;
  }
  return hour +":"+ min;
}
function toHourAndMinute(minutes,hasSeconds) {
  if (minutes == 0) return "";
  var hourPlural = "timmar";
  var minPlural = "minuter";
  var and = " och ";
  if ((minutes % 60) == 1) {
    minPlural = "minut";
  }
  if ((Math.floor(minutes/60)) == 1) {
    hourPlural = "timme";
  }
  
  if (hasSeconds) and = ", ";
  if (minutes >= 60) {
    if ((minutes % 60) == 0) {
      return (Math.floor(minutes/60))+" "+ hourPlural;
    } else {
      return (Math.floor(minutes/60))+" "+ hourPlural + and +(minutes%60) +" "+ minPlural;
    }
  } else {
    return minutes +" "+ minPlural;
  }
}
function setMats() {
  var matsContainer = document.getElementById('matsContainer');
  matsContainer.setSafeText("");
  for (var les in mdata[lunchDay].lessons) {
    var less = mdata[lunchDay].lessons[les];
    if (less.material == undefined) {
      continue;
    } else {
      var matToAdd = document.createElement('span');
      if (matsContainer.innerHTML == "") {
        matToAdd.addSafeElement("b", less.material);
      } else {
        matToAdd.setSafeText(", ").addSafeElement("b", less.material);
      }
      matsContainer.appendChild(matToAdd);
    }
  }
}
function makeschedule() {
  var OFFSET = 430; // Was 440
  var totalLessons = 0;
  var len = 515;
  function addElement(less, day, index, overridePath) {
    var toAdd = document.createElement('a');
    if (less.border == true) toAdd.style.top = less.start-OFFSET-1 +"px";
    else toAdd.style.top = less.start-OFFSET +"px";
    toAdd.style.width = "100px";
    toAdd.style.height = getLessonLength(less) +"px";
    toAdd.style.left = 102*day + 2 + "px";
    toAdd.title = less.subject;
    toAdd.className = "schedule";
    toAdd.lesson = less;
    toAdd.href = "javascript:showLessonInfo("+ (!overridePath ? (day +", "+ index) : "null, null, "+ JSON.stringify(overridePath)) +")";
    toAdd.addSafeText(less.subject).addSafeElement("br").addSafeText(less.classroom);
    document.getElementById('scheduleContainer').appendChild(toAdd);
    var fontSize = parseInt(window.getComputedStyle(toAdd, null).getPropertyValue('font-size'));
    var i = 0;
    while (toAdd.scrollHeight > getLessonLength(less) || toAdd.scrollWidth > 100) {
        fontSize--;
        toAdd.style.fontSize = fontSize;
        i++;
        if (i > 100) {
          console.warn("Looped more than 100 times");
          break;
        }
    }
    if (less.end - OFFSET > len) len = less.end - OFFSET;
    return toAdd;
  }
  for (var d in mdata) {
    for (var les in mdata[d].lessons) {
      console.log('Looping through lesson');
      totalLessons++;
      var less = mdata[d].lessons[les];
      if (!less.wasOverridden) addElement(less, d, les);
      else {
        var element = addElement(less.beforeOverrides, d, les);
        element.style.opacity = 0.25;
        if (!less.hideNewOverride) {
          var element = addElement(less, d, les);
          element.style.opacity = 0.6;
        }
      }
    }
  }
  // for (var dayOverride of overrides.days) {
  //   addElement(dayOverride, dayOverride.day, null, ["days", overrides.days.indexOf(dayOverride)]);
  // }
  for (var i = 0; i < mdata.length+1; i++) {
    var toAdd = document.createElement('div');
    toAdd.className = "scheduleDay";
    if (i != mdata.length) toAdd.style.left = 102*i + "px";
    else toAdd.style.left = 102*i-2 + "px";
    if (len != 515) {
        toAdd.style.height = len + "px";
        document.getElementById('scheduleBottom').style.top = len + "px";
        document.getElementById('scheduleContainer').style.height = len + 20 + "px";
    }
    document.getElementById('scheduleContainer').appendChild(toAdd);
  }
  // document.getElementById('showing').setSafeText("Visar "+ totalLessons +"/"+ totalLessons);
  scheduleSearch(); // Updates the "showing" text
}
function scheduleSearch() {
  var scheduleDiv = document.getElementById('scheduleContainer');
  var filter = document.getElementById('searchSchedule').value.toLowerCase();
  var schedules = scheduleDiv.getElementsByClassName('schedule');
  var total = schedules.length;
  // var hasOverrides = false;

  var hideOverrides = document.getElementById("hideOverrides").checked;
  total = 0;
  for (var day of mdata) {
    for (var lesson of day.lessons) {
      if (hideOverrides) {
        if (!lesson.isOverrider) total++;
      } else {
        if (!lesson.wasOverridden) total++;
      }
    }
  }

  var showing = total;

  for (var s in schedules) {
    var schedule = schedules[s];
    if (typeof schedule != "object") {
      continue;
    }
    if (!(schedule.innerText.toLowerCase().includes(filter))) {
      schedule.style.display = "none";
      if (!((hideOverrides && schedule.lesson.isOverrider) || (!hideOverrides && schedule.lesson.wasOverridden))) showing--;
    } else {
      schedule.style.display = "";
    }
  }
  var showingP = document.getElementById('showing');
  showingP.setSafeText("Visar "+ showing +"/"+ total);
}
function showLessonInfo(day, les, overridePath) {
  var less = !overridePath ? mdata[day].lessons[les] : overrides[overridePath[0]][overridePath[1]];
  document.getElementById('lessonInfo').style.display = "block";
  document.getElementById('lessonInfoSubject').setSafeText("Ämne: ").addSafeElement("b", less.subject);
  document.getElementById('lessonInfoClassroom').setSafeText("Sal: ").addSafeElement("b", less.classroom);
  document.getElementById('lessonInfoLength').setSafeText("Längd: ").addSafeElement("b", toHourAndMinute(getLessonLength(less)));
  document.getElementById('lessonInfoStarts').setSafeText("Börjar: ").addSafeElement("b", toClockTime(less.start));
  document.getElementById('lessonInfoEnds').setSafeText("Slutar: ").addSafeElement("b", toClockTime(less.end));
  document.getElementById('lessonInfoDay').setSafeText("Dag: ").addSafeElement("b", dayNames[day]);
  if (less.material == undefined) {
    document.getElementById('lessonInfoMaterial').style.display = "none";
  } else {
    document.getElementById('lessonInfoMaterial').setSafeText("Material: ").addSafeElement("b", less.material);
    document.getElementById('lessonInfoMaterial').style.display = "block";
  }
  if (less.note == undefined) {
    document.getElementById('lessonInfoNote').style.display = "none";
  } else {
    document.getElementById('lessonInfoNote').setSafeText("Info: ").addSafeElement("b", less.note);
    document.getElementById('lessonInfoNote').style.display = "block";
  }
  if (window.innerWidth < 400) {
    document.getElementById('lessonInfo').style.width = "90%";
    document.getElementById('lessonInfo').style.left = null;
    document.getElementById('lessonInfo').style.marginLeft = null;
  } else {
    document.getElementById('lessonInfo').style.width = "300px";
    document.getElementById('lessonInfo').style.left = "50%";
    document.getElementById('lessonInfo').style.marginLeft = "-150px";
  }
}
function newDay() {
  if(day != new Date().getDay()-1) {
    day = new Date().getDay()-1;
  }
}
function getParams() {
  var p = document.URL.split('?');
  //var p = "https://alvinn8.github.io/s/?profil=Programmering&profilSal=%3Cimg%20src%3D%22x%22%20onerror%3D%22console.log('vuln')%22%3E".split('?'); /* fake url paramaters (for local file testing)*/
  var pa;
  if (p[1] == undefined) {
    return;
  } else {
    pa = p[1].split('&');
  }
  var returnObject = {};
  for (var i = 0; i < pa.length; i++) {
    var par = pa[i];
    returnObject[par.split('=')[0]] = par.split('=')[1];
  }
  return returnObject;
}
function changeLesson(day,lesson, newLesson) {
  mdata[day].lessons[lesson] = Object.assign(mdata[day].lessons[lesson],newLesson);
}
function displayMessage(msg, backcolor, bordercolor) {
  var container = document.getElementById('messagesTop');
  var toAdd = document.createElement('div');
  toAdd.addSafeElement("p", msg);
  toAdd.className = "message";
  if (backcolor) toAdd.style.backgroundColor = backcolor;
  if (bordercolor) toAdd.style.border = "2px solid "+ bordercolor;
  container.appendChild(toAdd);
}
/*function displayError(msg) {
    displayMessage(msg, "pink", "red");
}*/
function displayMessages(v) {
  for (var i = 0; i < v.constant.length; i++) {
    var info = v.constant[i];
    displayMessage(info.message, info.backcolor, info.bordercolor);
  }
  for (var i = 0; i < v.date.length; i++) {
    var info = v.date[i];
    if ((new Date().getMonth() + 1 == info.date[0]) && (new Date().getDate() == info.date[1])) {
      displayMessage(info.message, info.backcolor, info.bordercolor);
    }
  }
}
function getLunchFood() {
  document.getElementById('lunchFood').style.display = null;
  document.getElementById('lunchFoodAlt').style.display = null;
  document.getElementById('getLunch').style.display = "none";
  alert('error');
}
function linkChange(reload) {
  var link = "https://alvinn8.github.io/s/";
  var firstParamUsed = false;
  if (document.getElementById('linkS').value != "Spanska") {
    if (document.getElementById('linkS').value != "Extra Engelska") {
      link += "?s="+ document.getElementById('linkS').value.toLowerCase();
      firstParamUsed = true;
    } else {
      link += "?s=exeng";
      firstParamUsed = true;
    }
  }
  if (document.getElementById('linkSl').value != "Träslöjd") {
    if (firstParamUsed) {
      link += "&sl=t";
    } else {
      link +="?sl=t";
      firstParamUsed = true;
    }
  }
  if (document.getElementById('linkProfil').value == "Annan") {
    document.getElementById('linkProfilName').style.display = null;
    document.getElementById('linkProfilClassroom').style.display = null;
    if (firstParamUsed) {
      link += "&profil="+ document.getElementById('linkProfilName').value +"&profilSal="+ document.getElementById('linkProfilClassroom').value;
    } else {
      link +="?profil="+ document.getElementById('linkProfilName').value +"&profilSal="+ document.getElementById('linkProfilClassroom').value;
      firstParamUsed = true;
    }
  } else {
    document.getElementById('linkProfilName').style.display = "none";
    document.getElementById('linkProfilClassroom').style.display = "none";
    if (document.getElementById('linkProfil').value == "Programmering") {
      if (firstParamUsed) {
        link += "&profil=Programmering&profilSal=T19";
      } else {
        link += "?profil=Programmering&profilSal=T19";
      }
    }
  }
  if (document.getElementById('linkMod').value == "Modersmål") {
    document.getElementById('linkModName').style.display =  null;
    document.getElementById('linkModClassroom').style.display =  null;
    if (firstParamUsed) {
      link += "&mod="+ document.getElementById('linkModName').value +"&modSal="+ document.getElementById('linkModClassroom').value;
    } else {
      link += "?mod="+ document.getElementById('linkModName').value +"&modSal="+ document.getElementById('linkModClassroom').value;
      firstParamUsed = true;
    }
  } else {
    document.getElementById('linkModName').style.display =  "none";
    document.getElementById('linkModClassroom').style.display =  "none";
  }
  if (document.getElementById('linkColor').value != "#00ff00") {
    if (firstParamUsed) {
      link += "&color="+ document.getElementById('linkColor').value.substr(1);
    } else {
      link += "?color="+ document.getElementById('linkColor').value.substr(1);
    }
  }

  document.getElementById('linkResult').value = link;
  console.log("New url", link);
  if (!reload && document.getElementById('linkColor').value == "#00ff00" && document.URL != link) history.replaceState(null, null, link.substr("https://alvinn8.github.io/s/".length));
  if (reload) location.replace(link.substr("https://alvinn8.github.io/s/".length));
}

function calcSeconds() {
  var seconds = document.getElementById('seconds');
  var time = 60 - new Date().getSeconds();
  var and = " och ";
  if ((day > 4) || (day < 0)) return;
  
  if (time == 60 || updatedAt != nowTime()) {
    newDay();
    calcMinutes();
  }
  if (currentState == state.SCHOOL_OVER || currentState == state.WEEKEND) return;
  if (!(document.getElementById('nextLesTime').children.length && document.getElementById('nextLesTime').children[0].innerHTML)) and = "";
  var text = and + time + " sekund" + (time == 1 ? "" : "er");
  seconds.setSafeText(text);
  if (shortcutMode) {
      var shortcutBig1 = document.getElementById("shortcutBig1");
      if (shortcutMode == 1) {
          var seconds = document.getElementById("shortcutBig1Seconds");
          seconds.setSafeText(text);
      }
  }
}

function changeGameLink() {
  var linkIndex = parseInt(Math.random()*boredLinks.length);
  document.getElementById('killTime').href = boredLinks[linkIndex];
  boredLinks.splice(linkIndex, 1);
  if (boredLinks.length < 1) boredLinks = allBoredLinks.slice(0);
}
function stateChanged() {
    if (currentState == state.IN_LESSON) {
        document.getElementById("killTimeContainer").style.opacity = 0.5;
        document.getElementById("killTimeContainer").style.pointerEvents = "none";
        document.getElementById("killTimeTitle").style.textDecoration = "line-through";
        document.getElementById("killTimeText").style.textDecoration = "line-through";
        document.getElementById("killTimeDisabled").style.display = "block";
    } else {
        document.getElementById("killTimeContainer").style.opacity = 1;
        document.getElementById("killTimeContainer").style.pointerEvents = "all";
        document.getElementById("killTimeTitle").style.textDecoration = "none";
        document.getElementById("killTimeText").style.textDecoration = "none";
        document.getElementById("killTimeDisabled").style.display = "none";
    }
}
function getWeek() {
    var date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var day = date.getDay() - 1;
    if (day == -1) day = 6; // Sunday, JavaScript date counts sundays as the first day of the week
    date.setTime(date.getTime() - day * 24 * 60 * 60 * 1000);
    
    var now = new Date();
    for (var i = 0; i < 53; i++) {
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (date.getTime() > now.getTime()) {
            return i + 1;
        }
    }
}
function updateHideOverrides() {
  var checked = document.getElementById("hideOverrides").checked;
  var elements = document.getElementById("scheduleContainer").getElementsByClassName("schedule");
  for (var element of elements) {
    if (element.lesson.wasOverridden) {
      element.style.opacity = (checked ? 1 : 0.25);
      element.style.zIndex = (checked ? 2 : 1);

    } else if (element.lesson.isOverrider) {
      element.style.opacity = (checked ? 0.25 : 1);
      element.style.zIndex = (checked ? 1 : 2);
    }
  }
  scheduleSearch();
}
