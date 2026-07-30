// ==============================
// YOVIK Launch Calculator
// ==============================

const ids = [
    "equipment",
    "license",
    "inventory",
    "misc",
    "daysPerWeek",
    "salesPerDay",
    "pricePerSale",
    "costPerSale"
];

const inputs = {};

ids.forEach(id => {
    inputs[id] = document.getElementById(id);

    if (inputs[id]) {
        inputs[id].addEventListener("input", calculate);
    }
});

const startupTotal = document.getElementById("startupTotal");
const dailyProfit = document.getElementById("dailyProfit");
const weeklyProfit = document.getElementById("weeklyProfit");
const monthlyProfit = document.getElementById("monthlyProfit");
const annualProfit = document.getElementById("annualProfit");
const payback = document.getElementById("payback");

const potentialPercent = document.getElementById("potentialPercent");
const progressFill = document.getElementById("progressFill");
const potentialText = document.getElementById("potentialText");

function value(id) {
    return Number(inputs[id].value) || 0;
}

function money(amount) {
    return "$" + amount.toLocaleString(undefined, {
        maximumFractionDigits: 0
    });
}

function calculate() {

    const startup =
        value("equipment") +
        value("license") +
        value("inventory") +
        value("misc");

    const profitPerSale =
        value("pricePerSale") -
        value("costPerSale");

    const profitMargin =
        value("pricePerSale") > 0
            ? profitPerSale / value("pricePerSale")
            : 0;    

    const daily =
        value("salesPerDay") *
        profitPerSale;

    const weekly =
        daily * value("daysPerWeek");

    const yearly =
        weekly * 52;

    const monthly =
        yearly / 12;

    startupTotal.textContent = money(startup);
    dailyProfit.textContent = money(daily);
    weeklyProfit.textContent = money(weekly);
    monthlyProfit.textContent = money(monthly);
    annualProfit.textContent = money(yearly);

    if (daily > 0) {

        const days =
            Math.ceil(startup / daily);

        payback.textContent =
            days + " Days";

    } else {

        payback.textContent = "--";

    }

    updatePotential(
        startup,
        daily,
        profitPerSale,
        profitMargin
    );

}

calculate();
function updatePotential(
    startup,
    dailyProfit,
    profitPerSale,
    profitMargin
) {

    let score = 0;

    // Startup Efficiency (0–25 points)

    let startupScore = 25;

    if (startup > 0 && dailyProfit > 0) {

        const paybackDays = startup / dailyProfit;

        startupScore = Math.max(
            0,
            25 - (paybackDays / 4)
    );

}

score += startupScore;

    // Daily Profit Score (0–40 points)

    let dailyScore = 0;

    if (dailyProfit > 0) {

        dailyScore = Math.min(
            40,
            dailyProfit / 12.5
        );

    }

    score += dailyScore;

    // Profit Margin (0–35 points)

    let marginScore = 0;

    if (profitMargin > 0) {

        marginScore = Math.min(
            35,
            profitMargin * 50
        );

    }

    score += marginScore;

    if (score > 100) score = 100;

    potentialPercent.textContent = score + "%";
    progressFill.style.width = score + "%";

    if (score >= 90) {

        potentialText.textContent =
            "★★★★★ Outstanding launch opportunity.";

    } else if (score >= 80) {

        potentialText.textContent =
            "★★★★☆ Strong launch opportunity.";

    } else if (score >= 65) {

        potentialText.textContent =
            "★★★☆☆ Good potential with room to improve.";

    } else if (score >= 50) {

        potentialText.textContent =
            "★★☆☆☆ High risk. Improve your numbers before launching.";

    } else {

        potentialText.textContent =
            "★☆☆☆☆ Not recommended based on the current inputs.";

    }

}
