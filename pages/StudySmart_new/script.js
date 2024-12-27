// Load Data
let data = [];
fetch("model_predictions.json")
    .then(response => response.json())
    .then(json => {
        data = json;
        populateFilters();
        displayData(data);
    });

// Populate Filter Options
function populateFilters() {
    const modelPredictionSet = new Set();
    const sourceSet = new Set();

    data.forEach(item => {
        if (item.Model_Prediction) modelPredictionSet.add(item.Model_Prediction);
        if (item.Source) sourceSet.add(item.Source);
    });

    const modelPredictions = Array.from(modelPredictionSet).sort(); // Sort alphabetically
    const sources = Array.from(sourceSet).sort().reverse(); // Sort reverse alphabetically

    const modelPredictionSelect = document.getElementById("model_prediction");
    const sourceSelect = document.getElementById("source");

    modelPredictions.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        modelPredictionSelect.appendChild(option);
    });

    sources.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        sourceSelect.appendChild(option);
    });
}

// Display Data in Table
function displayData(filteredData) {
    const tableBody = document.getElementById("results").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        Object.values(row).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Filter Data
// V1: exact match
// document.getElementById("filter").addEventListener("click", () => {
//     const modelPrediction = document.getElementById("model_prediction").value;
//     const source = document.getElementById("source").value;
//     const query = document.getElementById("query").value.toLowerCase();

//     const filteredData = data.filter(item => {
//         return (
//             (!modelPrediction || item.Model_Prediction === modelPrediction) &&
//             (!source || item.Source === source) &&
//             (!query || item.Text.toLowerCase().includes(query))
//         );
//     });

//     displayData(filteredData);
// });

// Boolean Text
document.getElementById("filter").addEventListener("click", () => {
    const modelPrediction = document.getElementById("model_prediction").value;
    const source = document.getElementById("source").value;
    const query = document.getElementById("query").value.toLowerCase().trim();

    const filteredData = data.filter(item => {
        // Normalize text and query for search
        const normalizedText = item.Text.toLowerCase().replace(/[-]/g, " "); // Replace dashes with spaces
        const terms = query.split(/\s+/); // Split query into words

        // Check if all terms are present in the text
        const matchesQuery = terms.every(term => normalizedText.includes(term));

        return (
            (!modelPrediction || item.Model_Prediction === modelPrediction) &&
            (!source || item.Source === source) &&
            (!query || matchesQuery)
        );
    });

    displayData(filteredData);
});

