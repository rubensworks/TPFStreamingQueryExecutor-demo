process.stdout = {};
process.argv[2]="graphs";
process.env["DEBUG"]="true";
var StreamingClient = require('time-annotated-query/lib/StreamingClient');

var query = "PREFIX t: <http://example.org/train#> SELECT DISTINCT ?delay ?headSign ?routeLabel ?platform ?departureTime WHERE {_:id t:delay ?delay ._:id t:headSign ?headSign ._:id t:routeLabel ?routeLabel ._:id t:platform ?platform ._:id t:departureTime ?departureTime }";
var canCountdown = true;
var counterC = 0;

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

function prefixZero(number) {
	console.log(number);
	return number < 10 ? "0" + number : number;
}

var client = new StreamingClient(query, "http://localhost:3000/train", durationCallback, true);
client.run(function(result, resultID) {
  var date = new Date(Date.parse(unQuote(result["?departureTime"])));
  var delay = unQuote(result["?delay"]);
  delay = parseInt(delay) / 60 || delay;
  var hourDelay = prefixZero(date.getHours()) + ":" + prefixZero(date.getMinutes()) + (delay == 0 ? "" : " <span style='color:red'>+ " + prefixZero(delay) + "</span>");

  var line = unQuote(result["?platform"]) + "\t" + unQuote(result["?headSign"]) + " (" + unQuote(result["?routeLabel"]) + ") \t\t ";
  console.log(line + hourDelay);

  var platform = unQuote(result["?platform"]);
  if(platform == "none") platform = "-";
  console.log(platform)
  var headSign = unQuote(result["?headSign"]);
  var routeLabel = unQuote(result["?routeLabel"]);
  var id = encodeURI((headSign + routeLabel).replace(/[ ()]/g, ''));

  var table = $("#departuresnew").hide();
  var row = table.find("#r" + id);
  if(row.length == 0) {
    row = table.append("<tr id='r" + id + "'><td class='platform'>" + platform + "</td><td class='head' /><td class='delay' /></tr>");
    row = table.find("#r" + id);
  }
  row.find(".head").text(headSign + " (" + routeLabel + ")");
  row.find(".delay").html(hourDelay);

  if(canCountdown) {
    showCounter(10 * 1000, ++counterC);
  }
  canCountdown = false;
});

function unQuote(s) {
  if(!s) return "";
  if(s.indexOf("^^") > 0) s = s.substr(0, s.indexOf("^^"));
  if (s != null && ((s.indexOf("\"") === 0 && s.lastIndexOf("\"") === s.length - 1)
    || (s.indexOf("'") === 0 && s.lastIndexOf("'") === s.length - 1))) {
    s = s.substring(1, s.length - 1);
  }
  return s;
}

function durationCallback(duration) {
  $("#departures").remove();
  $("#departuresnew").attr("id", "departures").show();
  var table = $("body").append("<table id='departuresnew' />");

  $("#lastupdate").text(duration/1000);
  canCountdown = true;
}

$( document ).ajaxSend(function(event, jqxhr, settings) {
  var val = $("#requestsCounter").text();
  $("#requestsCounter").text(parseInt(val) + 1);
  $("#requests").append(settings.url + "<br />");
  var element = document.getElementById("requests");
  element.scrollTop = element.scrollHeight;
});

function showCounter(millisec, c) {
  sec = millisec / 1000;
  $("#nextupdate").text(sec);
  $("#bar").width((10000 - millisec) / 100 + "%");
  if(millisec > 0 && c == counterC) {
    setTimeout(function() {showCounter(millisec - 100, c)}, 100);
  }
}

var hour = 10;
var minute = 30;

function startTime() {
    var h=hour;
    var m=minute;
    g = checkTime(h);
    m = checkTime(m);
    document.getElementById('clock').innerHTML = h+":"+m;
    var t = setTimeout(function(){startTime()},1000);
	minute++;
	if(minute >= 60) {
		minute = 0;
		hour++;
	}
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

$(function() {
	startTime();
});