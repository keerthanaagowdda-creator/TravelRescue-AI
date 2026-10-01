function generatePlan() {

    const location = document.getElementById("location").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const budget = Number(document.getElementById("budget").value);
    const time = Number(document.getElementById("time").value);
    const preference = document.getElementById("preference").value;
    const disruption = document.getElementById("disruption").value;
    const affectedActivity = document.getElementById("affectedActivity").value.trim();
    const itinerary = document.getElementById("itinerary").value.trim();

    const result = document.getElementById("result");

    // Check input
    if (
    location === "" ||
    destination === "" ||
    budget <= 0 ||
    time <= 0 ||
    itinerary === "" ||
    affectedActivity === ""
    ) {
        result.innerHTML = `
            <h2>⚠️ Missing Information</h2>
            <p>Please enter your location, destination, budget and remaining itinerary.</p>
        `;
        return;
    }

    // Convert itinerary into separate activities
    let activities = itinerary
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");

    // Find the activity affected by the disruption
    let disruptedActivity = "";

    if (disruption === "cancelled") {
        disruptedActivity = "Cancelled activity";
    }
    else if (disruption === "delay") {
        disruptedActivity = "Transport delay";
    }
    else if (disruption === "weather") {
        disruptedActivity = "Weather affected activity";
    }
    else if (disruption === "road") {
        disruptedActivity = "Road affected activity";
    }
    else if (disruption === "availability") {
        disruptedActivity = "Unavailable activity";
    }

    // Alternative activity based on preference
    let alternative = "";
    let cost = 0;
    let duration = 0;

    if (preference === "nature") {
        alternative = "Nearby Nature / Park Visit";
        cost = 200;
        duration = 2;
    }
    else if (preference === "food") {
        alternative = "Local Food Experience";
        cost = 400;
        duration = 1.5;
    }
    else if (preference === "culture") {
        alternative = "Historical / Cultural Attraction";
        cost = 300;
        duration = 2;
    }
    else if (preference === "adventure") {
        alternative = "Nearby Adventure Activity";
        cost = 600;
        duration = 3;
    }
    else if (preference === "shopping") {
        alternative = "Local Shopping Area";
        cost = 500;
        duration = 2;
    }

    // Adjust according to budget
    if (cost > budget) {
        alternative = "Nearby Low-Cost Activity";
        cost = 100;
    }

    // Adjust according to available time
    if (duration > time) {
        duration = time;
    }

    // Replace the first suitable itinerary activity
   let activityFound = false;

activities = activities.map(item => {

    if (item.toLowerCase().includes(affectedActivity.toLowerCase())) {

        activityFound = true;

        return item + " → Replaced with " + alternative;
    }

    return item;
});

    // Create revised itinerary
    let revisedItinerary = activities
        .map(item => `<li>${item}</li>`)
        .join("");

    result.innerHTML = `
        <h2>🤖 Alternative Travel Plan</h2>

    <p>
        🚨 <strong>Affected Activity:</strong>
        ${affectedActivity}
    </p>

    <p>
        🔄 <strong>New Alternative:</strong>
        ${alternative}
    </p>

    <h3>📅 Revised Itinerary</h3>

    <p>
        ${activities.join("<br>")}
    </p>
    `;
}
