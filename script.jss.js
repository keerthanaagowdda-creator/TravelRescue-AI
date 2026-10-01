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
let reason = "";

if (disruption === "weather") {

    alternative = "Indoor Cultural / Museum Visit";
    cost = 300;
    duration = 2;
    reason = "Outdoor activities may be affected by extreme weather.";

}
else if (disruption === "road") {

    alternative = "Nearby Alternative Attraction";
    cost = 200;
    duration = 1.5;
    reason = "The original route is affected by a road closure.";

}
else if (disruption === "delay") {

    alternative = "Nearby Short Activity";
    cost = 150;
    duration = 1;
    reason = "A shorter nearby activity helps reduce the impact of the transport delay.";

}
else if (disruption === "availability") {

    alternative = "Alternative Local Attraction";
    cost = 250;
    duration = 2;
    reason = "The original activity is no longer available.";

}
else if (disruption === "cancelled") {

    if (preference === "nature") {
        alternative = "Nearby Nature / Park Visit";
        cost = 200;
        duration = 2;
        reason = "the original activity was cancelled,so an alternative matching the travel prference was selected.";
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
}
    // Adjust according to budget
   if (cost > budget) {
    alternative = "Free Alternative Activity";
    cost = 0;
}

if (duration > time) {
    alternative = "Short Nearby Activity";
    duration = 1;
}

let remainingBudget = budget - cost;
let remainingTime = time - duration;

    // Replace the first suitable itinerary activity
   let activityFound = false;

activities = activities.map(item => {

    if (item.toLowerCase().includes(affectedActivity.toLowerCase())) {

        activityFound = true;

        return item + " → Replaced with " + alternative;
    }

    return item;
});
if (!activityFound) {
    result.innerHTML = `
        <h2>⚠️ Activity Not Found</h2>

        <p>
            The affected activity
            <strong>${affectedActivity}</strong>
            was not found in the itinerary.
        </p>

        <p>
            Please check the activity name and try again.
        </p>
    `;

    return;
}

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
    <p>
    💰 <strong>Remaining Budget:</strong>
    ₹${remainingBudget}
</p>

<p>
    ⏱️ <strong>Remaining Time:</strong>
    ${remainingTime} hours
</p>
<p>
    💡 <strong>Why this alternative?</strong>
    ${reason}
</p>
    <h3>📅 Revised Itinerary</h3>

    <p>
        ${activities.join("<br>")}
    </p>
    `;
}
