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
  endAtOut.innerText = endDate.toISOString().split("T")[0];
  if (new_duration.valueAsNumber == 1) {
    durationOut.innerHTML =
      "Duration: " + new_duration.valueAsNumber + " month";
  } else {
    durationOut.innerHTML =
      "Duration: " + new_duration.valueAsNumber + " months";
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
//  save button
document.getElementById("button").addEventListener("click", function (event) {
  event.preventDefault();

  const column1 = document.getElementById("new_ves").value;
  const column2 = document.getElementById("new_start").value;
  const column3 = document.getElementById("endAtOut").innerText;

  fetch("/mainpage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ column1, column2, column3 }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const banner = document.createElement("div");
      banner.innerText = "The contract was successfully saved!";
      banner.style.position = "fixed";
      banner.style.top = "0";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.width = "33%";
      banner.style.background = "#4CAF50";
      banner.style.color = "white";
      banner.style.padding = "10px";
      banner.style.textAlign = "center";
      document.body.appendChild(banner);

      setTimeout(() => {
        banner.remove();
      }, 3000);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
// // reset

// $("#reset").click(function () {
//   document.location.reload(true);
// });
