// ==============================
// YOVIK Launch Calculator
// ==============================


// ==============================
// INPUTS
// ==============================

const ids = [
    "equipment",
    "license",
    "inventory",
    "misc",
    "daysPerWeek",
    "salesPerDay",
    "pricePerSale",
    "costPerSale",

    // Weekly recurring costs
    "weeklyInventory",
    "weeklyPackaging",
    "weeklyFuel",
    "weeklyOther",

    // Monthly recurring costs
    "monthlyInsurance",
    "monthlyPhone",
    "monthlyStorage",
    "monthlySoftware",
    "monthlyOther"
];

const inputs = {};

ids.forEach(id => {

    inputs[id] = document.getElementById(id);

    if (inputs[id]) {

        inputs[id].addEventListener("input", calculate);

    }

});


// ==============================
// OUTPUT ELEMENTS
// ==============================

const startupTotal =
    document.getElementById("startupTotal");

const dailyProfit =
    document.getElementById("dailyProfit");

const weeklyProfit =
    document.getElementById("weeklyProfit");

const monthlyProfit =
    document.getElementById("monthlyProfit");

const annualProfit =
    document.getElementById("annualProfit");

const payback =
    document.getElementById("payback");

const potentialPercent =
    document.getElementById("potentialPercent");

const progressFill =
    document.getElementById("progressFill");

const potentialText =
    document.getElementById("potentialText");

const businessButtons =
    document.querySelectorAll(".business-card");


// ==============================
// BUSINESS TYPE
// ==============================

console.log("Found buttons:", businessButtons.length);

let selectedBusiness = "other";


// ==============================
// GET INPUT VALUE
// ==============================

function value(id) {

    if (!inputs[id]) {
        return 0;
    }

    return Number(inputs[id].value) || 0;

}


// ==============================
// CHECK REQUIRED INPUTS
// ==============================

function hasRequiredInputs() {

    const required = [
        "daysPerWeek",
        "salesPerDay",
        "pricePerSale",
        "costPerSale"
    ];

    return required.every(id => {

        return (
            inputs[id] &&
            inputs[id].value.trim() !== ""
        );

    });

}


// ==============================
// FORMAT MONEY
// ==============================

function money(amount) {

    return "$" + amount.toLocaleString(undefined, {

        maximumFractionDigits: 0

    });

}


// ==============================
// CALCULATE
// ==============================

function calculate() {


    // ==========================
    // STARTUP COSTS
    // ==========================

    const startup =
        value("equipment") +
        value("license") +
        value("inventory") +
        value("misc");


    // ==========================
    // REVENUE / COST PER SALE
    // ==========================

    const sales =
        value("salesPerDay");

    const price =
        value("pricePerSale");

    const cost =
        value("costPerSale");

    const daysPerWeek =
        value("daysPerWeek");


    const profitPerSale =
        price - cost;


    const profitMargin =
        price > 0
            ? profitPerSale / price
            : 0;


    // ==========================
    // GROSS PROFIT
    // ==========================

    const grossDaily =
        sales * profitPerSale;


    const grossWeekly =
        grossDaily * daysPerWeek;


    const grossAnnual =
        grossWeekly * 52;


    // ==========================
    // WEEKLY RECURRING COSTS
    // ==========================

    const weeklyRecurring =
        value("weeklyInventory") +
        value("weeklyPackaging") +
        value("weeklyFuel") +
        value("weeklyOther");


    // ==========================
    // MONTHLY RECURRING COSTS
    // ==========================

    const monthlyRecurring =
        value("monthlyInsurance") +
        value("monthlyPhone") +
        value("monthlyStorage") +
        value("monthlySoftware") +
        value("monthlyOther");


    // ==========================
    // CONVERT MONTHLY COSTS
    // TO ANNUAL COST
    // ==========================

    const annualRecurringMonthlyCosts =
        monthlyRecurring * 12;


    // ==========================
    // NET OPERATING PROFIT
    // ==========================

    const annualNetProfit =
        grossAnnual -
        (weeklyRecurring * 52) -
        annualRecurringMonthlyCosts;


    const monthlyNetProfit =
        annualNetProfit / 12;


    const weeklyNetProfit =
        annualNetProfit / 52;


    const dailyNetProfit =
        daysPerWeek > 0
            ? weeklyNetProfit / daysPerWeek
            : 0;


    // ==========================
    // STARTUP INVESTMENT
    // ==========================

    startupTotal.textContent =
        money(startup);


    // ==========================
    // INCOMPLETE CALCULATOR
    // ==========================

    if (!hasRequiredInputs()) {

        dailyProfit.textContent = "--";
        weeklyProfit.textContent = "--";
        monthlyProfit.textContent = "--";
        annualProfit.textContent = "--";
        payback.textContent = "--";

        potentialPercent.textContent = "--";

        progressFill.style.width = "0%";

        potentialText.textContent =
            "Enter your numbers to calculate your Launch Score™";

        return;

    }


    // ==========================
    // DISPLAY PROFITS
    // ==========================

    dailyProfit.textContent =
        money(dailyNetProfit);

    weeklyProfit.textContent =
        money(weeklyNetProfit);

    monthlyProfit.textContent =
        money(monthlyNetProfit);

    annualProfit.textContent =
        money(annualNetProfit);


    // ==========================
    // PAYBACK PERIOD
    // ==========================

    if (dailyNetProfit > 0) {

        const days =
            Math.ceil(startup / dailyNetProfit);

        payback.textContent =
            days + " Days";

    } else {

        payback.textContent =
            "Not Profitable";

    }


    // ==========================
    // LAUNCH SCORE
    // ==========================

    updatePotential(
        startup,
        dailyNetProfit,
        annualNetProfit,
        profitPerSale,
        profitMargin
    );

}


function updatePotential(
    startup,
    dailyProfit,
    yearlyProfit,
    profitPerSale,
    profitMargin
) {

    let score = 0;


    // ==========================
    // PROFIT — 50 POINTS
    // ==========================

    let profitScore = 0;

    if (yearlyProfit > 0) {

        profitScore = Math.min(
            50,
            yearlyProfit / 2000
        );

    }

    score += profitScore;


    // ==========================
    // STARTUP PAYBACK — 25 POINTS
    // ==========================

    let paybackScore = 0;

    if (startup === 0 && dailyProfit > 0) {

        paybackScore = 25;

    } else if (startup > 0 && dailyProfit > 0) {

        const paybackDays =
            startup / dailyProfit;


        if (paybackDays <= 90) {

            paybackScore =
                25 - (paybackDays / 90 * 5);

        } else if (paybackDays <= 180) {

            paybackScore =
                20 - ((paybackDays - 90) / 90 * 5);

        } else if (paybackDays <= 365) {

            paybackScore =
                15 - ((paybackDays - 180) / 185 * 7.5);

        } else if (paybackDays <= 730) {

            paybackScore =
                7.5 - ((paybackDays - 365) / 365 * 7.5);

        } else {

            paybackScore = 0;

        }

    }

    score += Math.max(0, paybackScore);


    // ==========================
    // PROFIT MARGIN — 25 POINTS
    // ==========================

    let marginScore = 0;

    if (profitMargin > 0) {

        marginScore = Math.min(
            25,
            profitMargin * 50
        );

    }

    score += marginScore;


    // ==========================
    // FINAL SCORE
    // ==========================

    score = Math.max(
        0,
        Math.min(100, score)
    );


    const displayScore =
        Math.round(score);


    // ==========================
    // DISPLAY SCORE
    // ==========================

    potentialPercent.textContent =
        displayScore + "%";

    progressFill.style.width =
        displayScore + "%";


    // ==========================
    // SCORE MESSAGE
    // ==========================

    if (displayScore >= 90) {

        potentialText.textContent =
            "🏆 Exceptional Opportunity — Your business fundamentals are very strong.";

    } else if (displayScore >= 80) {

        potentialText.textContent =
            "🚀 Strong Opportunity — Your business has a solid foundation.";

    } else if (displayScore >= 70) {

        potentialText.textContent =
            "✅ Viable Opportunity — Your numbers show a reasonably sound business model.";

    } else if (displayScore >= 60) {

        potentialText.textContent =
            "📈 Needs Improvement — Your business may work, but some numbers should be strengthened.";

    } else if (displayScore >= 40) {

        potentialText.textContent =
            "⚠️ High Risk — Your current numbers have some significant weaknesses.";

    } else {

        potentialText.textContent =
            "🛑 Poor Outlook — Your current numbers suggest the business model needs significant improvement.";

    }

}


// ==============================
// BUSINESS BUTTONS
// ==============================

businessButtons.forEach(button => {

    button.addEventListener("click", () => {

        businessButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedBusiness =
            button.dataset.business;

        console.log(
            "Selected:",
            selectedBusiness
        );

    });

});


// ==============================
// INITIAL CALCULATION
// ==============================

calculate();

