// hide old -- open new

$("#calculateBtn").click(function () {
  $("#firstTable").addClass("displayOff");
  $("#secondTable").addClass("displayOn");
});

// hide them in the other file

var vesselName = document.getElementById("vesselName");
var calculateBtn = document.getElementById("calculateBtn");
var vesselOut = document.getElementById("vessel");
var startDate = document.getElementById("startDate");
var startOut = document.getElementById("started");
var duration = document.getElementById("duration");
var durationOut = document.getElementById("durationOut");
var endAtOut = document.getElementById("endAtOut");
var new_vessel_name = document.getElementById("new_ves");
var new_start = document.getElementById("new_start");
var new_duration = document.getElementById("new_dur");

function replaceRightSide() {
  vesselOut.innerHTML = new_vessel_name.value;
  startOut.innerText = "Start date: " + new_start.value;
  var d = new Date(new_start.value);
  var endDate = new Date(d.setMonth(d.getMonth() + new_duration.valueAsNumber));
  var offset = endDate.getTimezoneOffset();
  endDate = new Date(endDate.getTime() - offset * 60 * 1000);
  endAtOut.innerText = "End at: " + endDate.toISOString().split("T")[0];
  if (new_duration.valueAsNumber == 1) {
    durationOut.innerHTML =
      "Duration: " + new_duration.valueAsNumber + " Month";
  } else {
    durationOut.innerHTML =
      "Duration: " + new_duration.valueAsNumber + " Months";
  }
}

function replaceLeftSide() {
  new_vessel_name.value = vesselName.value;
  new_start.value = startDate.value;
  new_duration.value = duration.value;
}

function clickOnRecalculate() {
  replaceRightSide();
}
recalculateBtn.addEventListener("click", clickOnRecalculate);

function clickOnCalculate() {
  replaceLeftSide();
  replaceRightSide();
}
calculateBtn.addEventListener("click", clickOnCalculate);

// reset

$("#reset").click(function () {
  document.location.reload(true);
});
