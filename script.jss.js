function generatePlan() {

    const location = document.getElementById("location").value;
    const destination = document.getElementById("destination").value;
    const budget = document.getElementById("budget").value;
    const time = document.getElementById("time").value;
    const preference = document.getElementById("preference").value;
    const disruption = document.getElementById("disruption").value;
    const itinerary = document.getElementById("itinerary").value;

    const result = document.getElementById("result");

    if (
        location === "" ||
        destination === "" ||
        budget === "" ||
        time === "" ||
        itinerary.trim() === ""
    ) {
        result.innerHTML = `
            <h2>⚠️ Missing Information</h2>
            <p>Please fill all the required details.</p>
        `;
        return;
    }

    let activity;
    let cost;
    let activityTime;

    if (preference === "nature") {
        activity = "Visit a nearby park or nature spot";
        cost = 200;
        activityTime = 2;
    } 
    else if (preference === "food") {
        activity = "Explore a nearby local food destination";
        cost = 400;
        activityTime = 1.5;
    } 
    else if (preference === "culture") {
        activity = "Visit a nearby historical or cultural attraction";
        cost = 300;
        activityTime = 2;
    } 
    else if (preference === "adventure") {
        activity = "Try a nearby adventure activity";
        cost = 600;
        activityTime = 3;
    } 
    else {
        activity = "Explore a nearby shopping area";
        cost = 500;
        activityTime = 2;
    }

    if (cost > Number(budget)) {
        activity = "Choose a nearby low-cost activity";
        cost = 100;
    }

    if (activityTime > Number(time)) {
        activityTime = Number(time);
    }

    let disruptionMessage;

    if (disruption === "cancelled") {
        disruptionMessage = "The cancelled activity has been replaced.";
    } 
    else if (disruption === "delay") {
        disruptionMessage = "The transport delay has been considered.";
    } 
    else if (disruption === "weather") {
        disruptionMessage = "The plan has been adjusted because of extreme weather.";
    } 
    else if (disruption === "road") {
        disruptionMessage = "The plan has been adjusted because of the road closure.";
    } 
    else {
        disruptionMessage = "The unavailable activity has been replaced.";
    }

    result.innerHTML = `
        <h2>🤖 Alternative Plan Generated</h2>

        <p><strong>📍 Journey:</strong> ${location} → ${destination}</p>

        <hr>

        <p>🚨 <strong>Disruption:</strong> ${disruptionMessage}</p>

        <h3>✨ New Recommended Activity</h3>

        <p>📌 ${activity}</p>

        <p>⏱️ Estimated Time: ${activityTime} hours</p>

        <p>💰 Estimated Cost: ₹${cost}</p>

        <p>❤️ Preference: ${preference}</p>

        <hr>

        <h3>📅 Your Remaining Itinerary</h3>

        <p>${itinerary.replace(/\n/g, "<br>")}</p>

        <p>✅ Alternative plan created within your available time and budget.</p>
    `;
}