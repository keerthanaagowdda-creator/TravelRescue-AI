const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your existing Travel Rescue website
app.use(express.static(__dirname));


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        agent: "Travel Rescue",
        status: "running",
        message: "Travel Rescue API is working"
    });
});


// Travel Rescue API
app.post("/api/recover", (req, res) => {

    const {
        location,
        destination,
        budget,
        time,
        preference,
        disruption,
        affectedActivity,
        itinerary
    } = req.body;

    // Check required information
    if (
        !location ||
        !destination ||
        !budget ||
        !time ||
        !affectedActivity ||
        !itinerary
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required travel information."
        });
    }

    let alternative = "";
    let cost = 0;
    let duration = 0;
    let reason = "";

    const activity = affectedActivity.toLowerCase();

    // BOAT / WATER
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
            reason = "Another adventure activity was selected.";
        } else if (preference === "nature") {
            alternative = "Lakeside Nature Walk";
            cost = 100;
            duration = 1.5;
            reason = "A nearby nature experience was selected.";
        } else {
            alternative = "Nearby Scenic Viewpoint";
            cost = 100;
            duration = 1;
            reason = "A nearby scenic attraction was selected.";
        }
    }

    // CULTURE / HISTORY
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
            reason = "Another cultural attraction was selected.";
        } else {
            alternative = "Local Heritage Walk";
            cost = 100;
            duration = 1;
            reason = "A nearby heritage experience was selected.";
        }
    }

    // FOOD
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
            reason = "A local food experience was selected.";
        } else {
            alternative = "Nearby Local Cafe";
            cost = 250;
            duration = 1;
            reason = "A nearby food option was selected.";
        }
    }

    // NATURE
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
            reason = "Another nearby nature experience was selected.";
        } else {
            alternative = "Scenic Nature Walk";
            cost = 100;
            duration = 1.5;
            reason = "A nearby outdoor attraction was selected.";
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
            reason = "Another shopping option was selected.";
        } else {
            alternative = "Local Market Visit";
            cost = 200;
            duration = 1.5;
            reason = "A nearby market was selected.";
        }
    }

    // ADVENTURE
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
            reason = "Another adventure activity was selected.";
        } else {
            alternative = "Nature Walking Trail";
            cost = 100;
            duration = 1.5;
            reason = "A nearby walking trail was selected.";
        }
    }

    // DEFAULT
    else {
        const alternatives = {
            nature: ["Nearby Nature Attraction", 200, 1.5],
            food: ["Nearby Local Food Experience", 300, 1.5],
            culture: ["Nearby Cultural Attraction", 250, 1.5],
            adventure: ["Nearby Adventure Activity", 400, 2],
            shopping: ["Nearby Shopping Area", 300, 1.5]
        };

        const selected = alternatives[preference] ||
            ["Nearby Alternative Activity", 100, 1];

        alternative = selected[0];
        cost = selected[1];
        duration = selected[2];

        reason = "An alternative was selected based on your travel preference.";
    }


    // HANDLE DISRUPTION
    if (disruption === "weather") {
        alternative = "Indoor Cultural / Museum Visit";
        cost = 300;
        duration = 2;
        reason = "Extreme weather can affect outdoor activities, so an indoor alternative was selected.";
    }

    else if (disruption === "delay") {
        if (duration > 1) {
            duration = 1;
        }

        reason += " Because of the transport delay, a shorter activity was selected.";
    }

    else if (disruption === "road") {
        alternative = "Nearby Accessible Attraction";
        cost = 200;
        duration = 1;
        reason = "The original route is affected by a road closure, so a nearby accessible attraction was selected.";
    }

    else if (disruption === "availability") {
        reason += " The original activity is unavailable, so another suitable option was selected.";
    }

    else if (disruption === "cancelled") {
        reason += " The original activity was cancelled, so a suitable alternative was selected.";
    }


    // BUDGET CHECK
    if (cost > Number(budget)) {
        alternative = "Free Nearby Alternative Activity";
        cost = 0;
        duration = 1;

        reason += " The selected option exceeded the remaining budget, so a free alternative was selected.";
    }


    // TIME CHECK
    if (duration > Number(time)) {
        alternative = "Short Nearby Activity";
        duration = 1;

        reason += " The selected option required more time than available, so a shorter activity was selected.";
    }


    const remainingBudget = Number(budget) - cost;
    const remainingTime = Number(time) - duration;


    // Return recovery plan
    res.json({
        success: true,
        agent: "Travel Rescue",
        recoveryPlan: {
            location,
            destination,
            affectedActivity,
            alternative,
            remainingBudget,
            remainingTime,
            reason,
            disruption,
            preference,
            itinerary
        }
    });
});


// Start server
app.listen(PORT,"0.0.0.0", () => {
    console.log(`Travel Rescue is running on port ${PORT}`);
});
