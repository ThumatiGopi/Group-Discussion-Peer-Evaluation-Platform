// Navigation between sections
document.getElementById("instructorBtn").addEventListener("click", function () {
  var pwd = prompt("Enter the instructor password:");
  if (pwd === "Wingardium") {
    document.getElementById("instructorSection").classList.remove("hidden");
    document.getElementById("studentSection").classList.add("hidden");
    document.getElementById("reportSection").classList.add("hidden");
    document.getElementById("peerReportSection").classList.add("hidden");
  }
});

document.getElementById("studentBtn").addEventListener("click", function () {
  document.getElementById("studentSection").classList.remove("hidden");
  document.getElementById("instructorSection").classList.add("hidden");
  document.getElementById("reportSection").classList.add("hidden");
  document.getElementById("peerReportSection").classList.add("hidden");

  // Call the function to render groups for student section
  renderGroupsForStudent();
});

document.querySelectorAll("#backBtn").forEach(button => {
  button.addEventListener("click", function () {
    document.getElementById("instructorSection").classList.remove("hidden");
    document.getElementById("reportSection").classList.add("hidden");
  });
});

document.querySelectorAll("#peerBackBtn").forEach(button => {
  button.addEventListener("click", function () {
    document.getElementById("instructorSection").classList.remove("hidden");
    document.getElementById("peerReportSection").classList.add("hidden");
  });
});

// Group management logic
let groups = [];
document.getElementById("groupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const groupName = document.getElementById("groupName").value;
  const students = document.getElementById("students").value.split(",").map(s => s.trim());
  groups.push({ groupName, students });
  renderGroups();
  saveReport();
  e.target.reset();
});

function renderGroups() {
  const list = document.getElementById("groupsList");
  list.innerHTML = "";
  groups.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "group";
    div.innerHTML = "<h4>" + group.groupName + "</h4>" +
      "<p>" + group.students.join(", ") + "</p>" +
      "<button onclick='deleteGroup(" + index + ")'>Delete</button>";
    list.appendChild(div);
  });
}

function renderGroupsForStudent() {
  const list = document.getElementById("studentGroupsList");
  list.innerHTML = "";
  groups.forEach(group => {
    const div = document.createElement("div");
    div.className = "group";
    div.innerHTML = "<h4>" + group.groupName + "</h4>" +
      "<p>" + group.students.join(", ") + "</p>";
    list.appendChild(div);
  });
}

function deleteGroup(index) {
  groups.splice(index, 1);
  renderGroups();
  saveReport();
}

// Instructor evaluation logic
let instructorEvaluations = {};
document.getElementById("instructorEvalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const participant = document.getElementById("participantName").value;
  const criteriaIds = ["instr_articulation", "instr_relevance", "instr_leadership", "instr_nonverbal", "instr_impression"];
  let sum = 0;
  criteriaIds.forEach(id => {
    sum += parseFloat(document.getElementById(id).value);
  });
  const average = sum / criteriaIds.length;
  instructorEvaluations[participant] = average;
  alert("Instructor evaluation submitted for " + participant + ". Average: " + average.toFixed(2));
  saveReport();
  e.target.reset();
});

// Peer evaluation logic
let peerEvalRecords = [];
document.getElementById("peerEvalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const participant = document.getElementById("participant").value;
  const peer = document.getElementById("peer").value;
  const articulation = parseFloat(document.getElementById("articulation").value) || 0;
  const relevance = parseFloat(document.getElementById("relevance").value) || 0;
  const leadership = parseFloat(document.getElementById("leadership").value) || 0;
  const nonverbal = parseFloat(document.getElementById("nonverbal").value) || 0;
  const impression = parseFloat(document.getElementById("impression").value) || 0;
  const averageScore = (articulation + relevance + leadership + nonverbal + impression) / 5;
  const timestamp = new Date().toLocaleString();

  peerEvalRecords.push({
    participant,
    peer,
    articulation,
    relevance,
    leadership,
    nonverbal,
    impression,
    average: averageScore,
    timestamp: timestamp
  });

  alert("Peer evaluation submitted for " + participant + " by peer " + peer + ". Average: " + averageScore.toFixed(2));
  saveReport();
  e.target.reset();
});

document.getElementById("generatePeerReportBtn").addEventListener("click", function () {
  generatePeerReport();
});

function generatePeerReport() {
  let reportHtml = "";
  peerEvalRecords.forEach((record, index) => {
    reportHtml += "<div class='peer-report-entry'><h4>Participant: " + record.participant +
      " (Evaluated by: " + record.peer + ")</h4>";
    reportHtml += "<p>Articulation: " + record.articulation + "</p>";
    reportHtml += "<p>Relevance: " + record.relevance + "</p>";
    reportHtml += "<p>Leadership: " + record.leadership + "</p>";
    reportHtml += "<p>Non-verbal Communication: " + record.nonverbal + "</p>";
    reportHtml += "<p>Impression: " + record.impression + "</p>";
    reportHtml += "<p>Average Score: " + record.average.toFixed(2) + "</p>";
    reportHtml += "<p>Submitted on: " + record.timestamp + "</p>";
    reportHtml += "<button onclick='deletePeerRecord(" + index + ")'>Delete</button>";
    reportHtml += "</div>";
  });
  document.getElementById("peerReportContent").innerHTML = reportHtml;
  document.getElementById("peerReportSection").classList.remove("hidden");
  document.getElementById("instructorSection").classList.add("hidden");
}

function deletePeerRecord(index) {
  peerEvalRecords.splice(index, 1);
  generatePeerReport();
  saveReport();
}

// Final report generation logic combining instructor evaluations and peer averages
document.getElementById("generateReportBtn").addEventListener("click", function () {
  generateReport();
});

function generateReport() {
  let reportHtml = "";
  const participants = new Set(Object.keys(instructorEvaluations));
  participants.forEach(participant => {
    const peerScores = peerEvalRecords.filter(r => r.participant === participant).map(r => r.average);
    const peerAverage = peerScores.length ? peerScores.reduce((a, b) => a + b, 0) / peerScores.length : 0;
    const instructorScore = instructorEvaluations[participant] || 0;
    const finalScore = (peerAverage + instructorScore) / 2;
    reportHtml += "<div class='report-entry'><h4>" + participant + "</h4>";
    reportHtml += "<p>Peer Average: " + peerAverage.toFixed(2) + "</p>";
    reportHtml += "<p>Instructor Score: " + instructorScore + "</p>";
    reportHtml += "<p>Final Score: " + finalScore.toFixed(2) + "</p>";
    reportHtml += "<button onclick='deleteFinalReport(\"" + participant + "\")'>Delete</button>";
    reportHtml += "</div>";
  });
  document.getElementById("reportContent").innerHTML = reportHtml;
  document.getElementById("reportSection").classList.remove("hidden");
  document.getElementById("instructorSection").classList.add("hidden");
  document.getElementById("studentSection").classList.add("hidden");
  document.getElementById("peerReportSection").classList.add("hidden");
}

function deleteFinalReport(participant) {
  delete instructorEvaluations[participant];
  saveReport();
  generateReport();
}

// On page load, fetch saved data and restore state
window.addEventListener("load", () => {
  fetch("/api/reports")
    .then(response => response.json())
    .then(data => {
      console.log("Fetched report:", data);
      if (data.groupList) {
        groups = JSON.parse(data.groupList);
        renderGroups();
      }
      if (data.finalReport) {
        instructorEvaluations = JSON.parse(data.finalReport);
      }
      if (data.peerEval) {
        peerEvalRecords = JSON.parse(data.peerEval);
      }
    })
    .catch(err => console.error("Error fetching report:", err));
});

// Save current report data to the server
function saveReport() {
  const reportData = {
    groupList: JSON.stringify(groups),
    finalReport: JSON.stringify(instructorEvaluations),
    peerEval: JSON.stringify(peerEvalRecords)
  };

  fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Report saved:", data);
      alert("Report saved successfully!");
    })
    .catch(err => console.error("Error saving report:", err));
}
