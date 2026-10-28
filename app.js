// Sample Mock Database
const mockData = {
  "PMK123456": { scheme: "PM-Kisan", status: "Approved", message: "Aapki 16th kist process ho chuki hai." },
  "KCC987654": { scheme: "Kisan Credit Card", status: "Rejected", message: "Land Seeding status NO hai. Khasra verification pending." },
  "PMF554433": { scheme: "PM Fasal Bima", status: "In Progress", message: "Bank level verification undergoing." }
};

// Check Status Function
function checkStatus() {
  const id = document.getElementById('appId').value.trim();
  const resDiv = document.getElementById('statusResult');
  
  if (!id) {
    alert("Kripya Application ID daalein!");
    return;
  }

  resDiv.style.display = "block";
  if (mockData[id]) {
    const data = mockData[id];
    resDiv.innerHTML = `<strong>Scheme:</strong> ${data.scheme}<br><strong>Status:</strong> ${data.status}<br><strong>Details:</strong> ${data.message}`;
  } else {
    resDiv.innerHTML = `<strong>Status:</strong> Application ID not found. Kripya sahi ID enter karein.`;
  }
}

// Backend Express + Ollama AI API Integration
async function diagnoseIssue() {
  const schemeName = document.getElementById('schemeSelect').value;
  const rejectionReason = document.getElementById('rejectionInput').value.trim();
  const resDiv = document.getElementById('aiResult');

  if (!rejectionReason) {
    alert("Kripya rejection reason ya issue enter karein!");
    return;
  }

  resDiv.style.display = "block";
  resDiv.innerHTML = "⏳ Local Ollama Gemma AI se connect ho raha hai... Solution load ho raha hai...";

  try {
    const response = await fetch('http://localhost:5000/api/ai/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeName, rejectionReason })
    });

    const data = await response.json();

    if (data.success) {
      resDiv.innerHTML = `<strong>💡 AI Recommended Fix:</strong>\n\n${data.analysis}`;
    } else {
      resDiv.innerHTML = `❌ Error: ${data.error}`;
    }
  } catch (err) {
    resDiv.innerHTML = "❌ Server se connect nahi ho paya! Make sure `node server.js` run ho raha hai.";
  }
}