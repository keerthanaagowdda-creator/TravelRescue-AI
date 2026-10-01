async function generatePlan() {

    const location = document.getElementById("location").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const budget = Number(document.getElementById("budget").value);
    const time = Number(document.getElementById("time").value);
    const preference = document.getElementById("preference").value;
    const disruption = document.getElementById("disruption").value;
    const affectedActivity = document.getElementById("affectedActivity").value.trim();
    const itinerary = document.getElementById("itinerary").value.trim();

    const result = document.getElementById("result");
        // Send travel information to the Travel Rescue API
    try {

        const response = await fetch("/api/recover", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location: location,
                destination: destination,
                budget: budget,
                time: time,
                preference: preference,
                disruption: disruption,
                affectedActivity: affectedActivity,
                itinerary: itinerary
            })
        });

        const data = await response.json();

        if (!response.ok) {
            result.innerHTML = `
                <h2>⚠️ Error</h2>
                <p>${data.message}</p>
            `;
            return;
        }

        const plan = data.recoveryPlan;

        result.innerHTML = `
            <h2>🤖 Alternative Travel Plan</h2>

            <div class="status-badge">
                ✅ Recovery Plan Generated
            </div>

            <p>
                📍 <strong>Current Location:</strong>
                ${plan.location}
            </p>

            <p>
                🎯 <strong>Destination:</strong>
                ${plan.destination}
            </p>

            <p>
                🚨 <strong>Affected Activity:</strong>
                ${plan.affectedActivity}
            </p>

            <p>
                🔄 <strong>New Alternative:</strong>
                ${plan.alternative}
            </p>

            <p>
                💰 <strong>Remaining Budget:</strong>
                ₹${plan.remainingBudget}
            </p>

            <p>
                ⏱️ <strong>Remaining Time:</strong>
                ${plan.remainingTime} hours
            </p>

            <p>
                💡 <strong>Why this alternative?</strong>
                ${plan.reason}
            </p>

            <h3>📅 Revised Itinerary</h3>

            <div class="itinerary">
                ${plan.itinerary.split("\n").map(item => `
                    <div class="itinerary-item">
                        ${item}
                    </div>
                `).join("")}

                <div class="itinerary-item">
                    🔄 Alternative: ${plan.alternative}
                </div>
            </div>
        `;

        return;

    } catch (error) {

        result.innerHTML = `
            <h2>⚠️ Connection Error</h2>
            <p>
                Travel Rescue could not connect to the recovery server.
                Please make sure the server is running.
            </p>
        `;

        return;
    }

    // Check required information
    if (
        location === "" ||
        destination === "" ||
        budget <= 0 ||
        time <= 0 ||
        affectedActivity === "" ||
        itinerary === ""
    ) {
        result.innerHTML = `
            <h2>⚠️ Missing Information</h2>

            <p>
                Please enter all required details, including your location,
                destination, budget, time, affected activity, and remaining itinerary.
            </p>
        `;
        return;
    }

    // Convert itinerary into separate activities
    let activities = itinerary
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");


    // ---------------------------------------------
    // NORMALIZE ACTIVITY NAME
    // ---------------------------------------------

    function normalizeActivity(text) {

        return text
            .toLowerCase()
            .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi, "")
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    // ---------------------------------------------
    // CHECK WHETHER ACTIVITY EXISTS
    // ---------------------------------------------

    let activityFound = false;

    const searchActivity = normalizeActivity(affectedActivity);


    // ---------------------------------------------
    // ACTIVITY BASED ALTERNATIVE
    // ---------------------------------------------

    let alternative = "";
    let cost = 0;
    let duration = 0;
    let reason = "";

    const activity = affectedActivity.toLowerCase();


    // BOAT / WATER ACTIVITIES
    if (
        activity.includes("boat") ||
        activity.includes("boating") ||
        activity.includes("lake") ||
        activity.includes("water") ||
        activity.includes("river")
    ) {

        if (preference === "adventure") {

            alternative = "Kayaking or Short Adventure Activity";
            cost = 500;
            duration = 2;

            reason =
                "The original water activity was disrupted, so another adventure activity was selected.";

        }
        else if (preference === "nature") {

            alternative = "Lakeside Nature Walk";
            cost = 100;
            duration = 1.5;

            reason =
                "A nearby nature experience was selected to replace the affected water activity.";

        }
        else {

            alternative = "Nearby Scenic Viewpoint";
            cost = 100;
            duration = 1;

            reason =
                "A nearby scenic attraction was selected to reduce disruption to the journey.";
        }
    }


    // MUSEUM / PALACE / TEMPLE / HISTORICAL
    else if (
        activity.includes("museum") ||
        activity.includes("palace") ||
        activity.includes("fort") ||
        activity.includes("temple") ||
        activity.includes("historical") ||
        activity.includes("heritage")
    ) {

        if (preference === "culture") {

            alternative = "Nearby Historical / Cultural Attraction";
            cost = 200;
            duration = 1.5;

            reason =
                "Another cultural attraction was selected because it matches your interest in history and culture.";

        }
        else {

            alternative = "Local Heritage Walk";
            cost = 100;
            duration = 1;

            reason =
                "A nearby heritage experience was selected as an alternative.";
        }
    }


    // FOOD / RESTAURANT
    else if (
        activity.includes("restaurant") ||
        activity.includes("dinner") ||
        activity.includes("lunch") ||
        activity.includes("food") ||
        activity.includes("cafe") ||
        activity.includes("breakfast")
    ) {

        if (preference === "food") {

            alternative = "Nearby Local Food Experience";
            cost = 400;
            duration = 1.5;

            reason =
                "Another local food experience was selected because it matches your food preference.";

        }
        else {

            alternative = "Nearby Local Cafe";
            cost = 250;
            duration = 1;

            reason =
                "A nearby food option was selected to keep the journey practical.";
        }
    }


    // ZOO / PARK / GARDEN / WILDLIFE
    else if (
        activity.includes("zoo") ||
        activity.includes("wildlife") ||
        activity.includes("park") ||
        activity.includes("garden")
    ) {

        if (preference === "nature") {

            alternative = "Nearby Nature Park";
            cost = 150;
            duration = 2;

            reason =
                "Another nearby nature experience was selected based on your preference.";

        }
        else {

            alternative = "Scenic Nature Walk";
            cost = 100;
            duration = 1.5;

            reason =
                "A nearby outdoor attraction was selected as a practical alternative.";
        }
    }


    // SHOPPING
    else if (
        activity.includes("shopping") ||
        activity.includes("mall") ||
        activity.includes("market")
    ) {

        if (preference === "shopping") {

            alternative = "Nearby Local Shopping Market";
            cost = 300;
            duration = 2;

            reason =
                "Another shopping option was selected because it matches your shopping preference.";

        }
        else {

            alternative = "Local Market Visit";
            cost = 200;
            duration = 1.5;

            reason =
                "A nearby market was selected as an alternative.";
        }
    }


    // TREKKING / HIKING / ADVENTURE
    else if (
        activity.includes("trek") ||
        activity.includes("trekking") ||
        activity.includes("hiking") ||
        activity.includes("adventure") ||
        activity.includes("camp")
    ) {

        if (preference === "adventure") {

            alternative = "Short Hiking / Adventure Activity";
            cost = 300;
            duration = 2;

            reason =
                "Another adventure activity was selected to match your travel preference.";

        }
        else {

            alternative = "Nature Walking Trail";
            cost = 100;
            duration = 1.5;

            reason =
                "A nearby walking trail was selected as an outdoor alternative.";
        }
    }


    // ---------------------------------------------
    // DEFAULT FOR ANY OTHER ACTIVITY
    // ---------------------------------------------

    else {

        if (preference === "nature") {

            alternative = "Nearby Nature Attraction";
            cost = 200;
            duration = 1.5;

            reason =
                "A nearby nature attraction was selected based on your travel preference.";
        }

        else if (preference === "food") {

            alternative = "Nearby Local Food Experience";
            cost = 300;
            duration = 1.5;

            reason =
                "A local food experience was selected based on your travel preference.";
        }

        else if (preference === "culture") {

            alternative = "Nearby Cultural Attraction";
            cost = 250;
            duration = 1.5;

            reason =
                "A cultural attraction was selected based on your travel preference.";
        }

        else if (preference === "adventure") {

            alternative = "Nearby Adventure Activity";
            cost = 400;
            duration = 2;

            reason =
                "An adventure activity was selected based on your travel preference.";
        }

        else if (preference === "shopping") {

            alternative = "Nearby Shopping Area";
            cost = 300;
            duration = 1.5;

            reason =
                "A shopping option was selected based on your travel preference.";
        }
    }


    // ---------------------------------------------
    // DISRUPTION HANDLING
    // ---------------------------------------------

    if (disruption === "weather") {

        alternative = "Indoor Cultural / Museum Visit";
        cost = 300;
        duration = 2;

        reason =
            "Extreme weather can affect outdoor activities, so an indoor alternative was selected.";
    }


    else if (disruption === "delay") {

        if (duration > 1) {
            duration = 1;
        }

        reason +=
            " Because of the transport delay, a shorter activity was selected to save time.";
    }


    else if (disruption === "road") {

        alternative = "Nearby Accessible Attraction";
        cost = 200;
        duration = 1;

        reason =
            "The original route is affected by a road closure, so a nearby accessible attraction was selected.";
    }


    else if (disruption === "availability") {

        reason +=
            " The original activity is unavailable, so another suitable option was selected.";
    }


    else if (disruption === "cancelled") {

        reason +=
            " The original activity was cancelled, so a suitable alternative was selected.";
    }


    // ---------------------------------------------
    // BUDGET CHECK
    // ---------------------------------------------

    if (cost > budget) {

        alternative = "Free Nearby Alternative Activity";
        cost = 0;
        duration = 1;

        reason +=
            " The selected option exceeded the remaining budget, so a free alternative was selected.";
    }


    // ---------------------------------------------
    // TIME CHECK
    // ---------------------------------------------

    if (duration > time) {

        alternative = "Short Nearby Activity";
        duration = 1;

        reason +=
            " The selected option required more time than available, so a shorter activity was selected.";
    }


    const remainingBudget = budget - cost;
    const remainingTime = time - duration;


    // ---------------------------------------------
    // FIND ACTIVITY IN ITINERARY
    // ---------------------------------------------

    activities = activities.map(item => {

        const cleanItem = normalizeActivity(item);

        if (
            cleanItem === searchActivity ||
            cleanItem.includes(searchActivity) ||
            searchActivity.includes(cleanItem)
        ) {

            activityFound = true;

            return item + " → Replaced with " + alternative;
        }

        return item;
    });


    // ---------------------------------------------
    // IF ACTIVITY IS NOT IN ITINERARY
    // ADD IT AS A NEW DISRUPTION
    // ---------------------------------------------

    if (!activityFound) {

        activities.unshift(
            "⚠️ " +
            affectedActivity +
            " → Disrupted → Alternative: " +
            alternative
        );
    }


    // ---------------------------------------------
    // FINAL RESULT
    // ---------------------------------------------

    result.innerHTML = `

        <h2>🤖 Alternative Travel Plan</h2>

        <div class="status-badge">
            ✅ Recovery Plan Generated
        </div>

        <p>
            📍 <strong>Current Location:</strong>
            ${location}
        </p>

        <p>
            🎯 <strong>Destination:</strong>
            ${destination}
        </p>

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

        <div class="itinerary">

            ${activities.map(item => `
                <div class="itinerary-item">
                    ${item}
                </div>
            `).join("")}

        </div>
    `;
}