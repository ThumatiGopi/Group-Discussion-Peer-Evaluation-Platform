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
  
  // After rendering groups, generate instructor evaluation sections
  generateInstructorEvaluationSections();
}

function generateInstructorEvaluationSections() {
  const container = document.getElementById("instructorEvaluationSections");
  container.innerHTML = "";
  
  // Get all students from all groups
  const allStudents = groups.flatMap(group => group.students);
  
  // Take first 8 students (or all if less than 8)
  const studentsToEvaluate = allStudents.slice(0, 8);
  
  studentsToEvaluate.forEach((student, index) => {
    const section = document.createElement("div");
    section.className = "evaluation-section";
    section.innerHTML = `
      <h3>Participant ${index + 1}</h3>
      <input type="hidden" id="participantName${index}" name="participantName${index}" value="${student}" />
      <p>Evaluating: ${student}</p>
      
      <div class="criteria">
        <h4>Evaluation Criteria (0-10 each)</h4>
        <label for="instr_articulation${index}">Articulation:</label>
        <input type="number" id="instr_articulation${index}" name="instr_articulation${index}" min="0" max="10" required />
        
        <label for="instr_relevance${index}">Relevance:</label>
        <input type="number" id="instr_relevance${index}" name="instr_relevance${index}" min="0" max="10" required />
        
        <label for="instr_leadership${index}">Leadership:</label>
        <input type="number" id="instr_leadership${index}" name="instr_leadership${index}" min="0" max="10" required />
        
        <label for="instr_nonverbal${index}">Non-verbal Comm:</label>
        <input type="number" id="instr_nonverbal${index}" name="instr_nonverbal${index}" min="0" max="10" required />
        
        <label for="instr_impression${index}">Impression:</label>
        <input type="number" id="instr_impression${index}" name="instr_impression${index}" min="0" max="10" required />
      </div>
    `;
    container.appendChild(section);
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

  // After rendering groups, generate evaluation sections
  generateEvaluationSections();
}

function generateEvaluationSections() {
  const container = document.getElementById("evaluationSections");
  container.innerHTML = "";
  
  // Get all students from all groups
  const allStudents = groups.flatMap(group => group.students);
  
  // Take first 8 students (or all if less than 8)
  const studentsToEvaluate = allStudents.slice(0, 8);
  
  studentsToEvaluate.forEach((student, index) => {
    const section = document.createElement("div");
    section.className = "evaluation-section";
    section.innerHTML = `
      <h3>Participant ${index + 1}</h3>
      <input type="hidden" id="participant${index}" name="participant${index}" value="${student}" />
      <p>Evaluating: ${student}</p>
      
      <div class="criteria">
        <h4>Evaluation Criteria (0-10 each)</h4>
        <label for="articulation${index}">Articulation:</label>
        <input type="number" id="articulation${index}" name="articulation${index}" min="0" max="10" required />
        
        <label for="relevance${index}">Relevance:</label>
        <input type="number" id="relevance${index}" name="relevance${index}" min="0" max="10" required />
        
        <label for="leadership${index}">Leadership:</label>
        <input type="number" id="leadership${index}" name="leadership${index}" min="0" max="10" required />
        
        <label for="nonverbal${index}">Non-verbal Comm:</label>
        <input type="number" id="nonverbal${index}" name="nonverbal${index}" min="0" max="10" required />
        
        <label for="impression${index}">Impression:</label>
        <input type="number" id="impression${index}" name="impression${index}" min="0" max="10" required />
      </div>
    `;
    container.appendChild(section);
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
  
  // Get all students from all groups
  const allStudents = groups.flatMap(group => group.students);
  const studentsToEvaluate = allStudents.slice(0, 8);
  
  studentsToEvaluate.forEach((participant, index) => {
    const criteriaIds = [
      `instr_articulation${index}`,
      `instr_relevance${index}`,
      `instr_leadership${index}`,
      `instr_nonverbal${index}`,
      `instr_impression${index}`
    ];
    
    let sum = 0;
    criteriaIds.forEach(id => {
      sum += parseFloat(document.getElementById(id).value);
    });
    const average = sum / criteriaIds.length;
    instructorEvaluations[participant] = average;
  });

  alert("Instructor evaluations submitted successfully for all participants");
  saveReport();
  e.target.reset();
  
  // Regenerate evaluation sections with empty values
  generateInstructorEvaluationSections();
});

// Peer evaluation logic
let peerEvalRecords = [];
document.getElementById("peerEvalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const peer = document.getElementById("peer").value;
  const timestamp = new Date().toLocaleString();
  
  // Get all students from all groups
  const allStudents = groups.flatMap(group => group.students);
  const studentsToEvaluate = allStudents.slice(0, 8);
  
  studentsToEvaluate.forEach((participant, index) => {
    const articulation = parseFloat(document.getElementById(`articulation${index}`).value) || 0;
    const relevance = parseFloat(document.getElementById(`relevance${index}`).value) || 0;
    const leadership = parseFloat(document.getElementById(`leadership${index}`).value) || 0;
    const nonverbal = parseFloat(document.getElementById(`nonverbal${index}`).value) || 0;
    const impression = parseFloat(document.getElementById(`impression${index}`).value) || 0;
    const averageScore = (articulation + relevance + leadership + nonverbal + impression) / 5;

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
  });

  alert("Peer evaluations submitted successfully for all participants");
  saveReport();
  e.target.reset();
  
  // Regenerate evaluation sections with empty values
  generateEvaluationSections();
});

document.getElementById("generatePeerReportBtn").addEventListener("click", function () {
  generatePeerReport();
});

function generatePeerReport(filterEvaluator = "all") {
  let filteredRecords = peerEvalRecords;
  if (filterEvaluator !== "all") {
    filteredRecords = peerEvalRecords.filter(record => record.peer === filterEvaluator);
  }
  updateEvaluatorDropdown();
  let reportHtml = "";
  filteredRecords.forEach((record, index) => {
    reportHtml += "<div class='peer-report-entry'><h4>Participant: " + record.participant +
      " (Evaluated by: " + record.peer + ")</h4>";
    reportHtml += "<p>Articulation: " + record.articulation + "</p>";
    reportHtml += "<p>Relevance: " + record.relevance + "</p>";
    reportHtml += "<p>Leadership: " + record.leadership + "</p>";
    reportHtml += "<p>Non-verbal Comm: " + record.nonverbal + "</p>";
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
function updateEvaluatorDropdown() {
  const evaluatorSelect = document.getElementById("evaluatorSelect");
  const evaluators = new Set(peerEvalRecords.map(record => record.peer));
  evaluatorSelect.innerHTML = '<option value="">Select Evaluator</option>';
  evaluators.forEach(evaluator => {
    const option = document.createElement("option");
    option.value = evaluator;
    option.textContent = evaluator;
    evaluatorSelect.appendChild(option);
  });
}

document.getElementById("filterPeerReport").addEventListener("click", function(){
   const selected = document.getElementById("evaluatorSelect").value;
   generatePeerReport(selected);
});

function deletePeerRecord(index) {
  peerEvalRecords.splice(index, 1);
  generatePeerReport();
  saveReport();
}

// Final report generation logic combining instructor evaluations and peer averages
document.getElementById("generateReportBtn").addEventListener("click", function () {
  generateReport();
});

document.getElementById("downloadReportBtn").addEventListener("click", function() {
  downloadFinalReport();
});

function downloadFinalReport() {
  // Create CSV header
  let csv = "Participant,Peer Average,Instructor Score,Final Score\n";
  
  // Add data rows
  const participants = new Set(Object.keys(instructorEvaluations));
  participants.forEach(participant => {
    const peerScores = peerEvalRecords.filter(r => r.participant === participant).map(r => r.average);
    const peerAverage = peerScores.length ? peerScores.reduce((a, b) => a + b, 0) / peerScores.length : 0;
    const instructorScore = instructorEvaluations[participant] || 0;
    const finalScore = (peerAverage + instructorScore) / 2;
    
    csv += `${participant},${peerAverage.toFixed(2)},${instructorScore.toFixed(2)},${finalScore.toFixed(2)}\n`;
  });
  
  // Create blob and trigger download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'final_report.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

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
