const ids = [
    "equipment",
    "license",
    "inventory",
    "misc",
    "daysPerWeek",
    "salesPerDay",
    "pricePerSale",
    "costPerSale",

    // Weekly operating costs
    "weeklyFuel",
    "weeklyOther",

    // Monthly operating costs
    "monthlyInsurance",
    "monthlyPhone",
    "monthlyStorage",
    "monthlySoftware",
    "monthlyOther"
];

const inputs = {};

ids.forEach(id => {
    inputs[id] = document.getElementById(id);
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

const businessCards = document.querySelectorAll(".business-card");


/* =========================================================
   INPUT HELPERS
========================================================= */

function value(id) {

    const input = inputs[id];

    if (!input) {
        return 0;
    }

    const number = parseFloat(input.value);

    return Number.isFinite(number) ? number : 0;
}


function money(number) {

    if (!Number.isFinite(number)) {
        number = 0;
    }

    return number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });
}


function hasRequiredInputs() {

    return (
        value("daysPerWeek") > 0 &&
        value("salesPerDay") >= 0 &&
        value("pricePerSale") > 0 &&
        value("costPerSale") >= 0
    );
}


/* =========================================================
   CALCULATOR INPUT LISTENERS
========================================================= */

ids.forEach(id => {

    const input = inputs[id];

    if (!input) {
        return;
    }

    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);

});


/* =========================================================
   BUSINESS TYPE BUTTONS
========================================================= */

businessCards.forEach(card => {

    card.addEventListener("click", () => {

        businessCards.forEach(item => {
            item.classList.remove("active");
        });

        card.classList.add("active");

    });

});


/* =========================================================
   CALCULATOR
========================================================= */

function calculate() {

    const startup =
        value("equipment") +
        value("license") +
        value("inventory") +
        value("misc");


    /*
        Do not show a Launch Score until the
        core revenue inputs have been entered.
    */

    if (!hasRequiredInputs()) {

        potentialPercent.textContent = "—";

        progressFill.style.width = "0%";

        potentialText.textContent =
            "Enter your numbers to calculate your Launch Score™";

        /*
            Startup costs can still be displayed
            even before the score is calculated.
        */

        startupTotal.textContent =
            money(startup);

        dailyProfit.textContent =
            "$0";

        weeklyProfit.textContent =
            "$0";

        monthlyProfit.textContent =
            "$0";

        annualProfit.textContent =
            "$0";

        payback.textContent =
            "--";

        return;
    }


    const sales = value("salesPerDay");
    const price = value("pricePerSale");
    const cost = value("costPerSale");
    const daysPerWeek = value("daysPerWeek");


    /*
        COGS

        Average COGS per sale already includes:
        - Ingredients
        - Products
        - Packaging
        - Other direct sale costs
    */

    const profitPerSale =
        price - cost;

    const profitMargin =
        price > 0
            ? profitPerSale / price
            : 0;


    /*
        REVENUE
    */

    const grossDaily =
        sales * profitPerSale;

    const grossWeekly =
        grossDaily * daysPerWeek;

    const grossAnnual =
        grossWeekly * 52;


    /*
        OPERATING COSTS

        These are costs that are NOT already included
        in COGS.
    */

    const weeklyOperatingCosts =
        value("weeklyFuel") +
        value("weeklyOther");

    const monthlyOperatingCosts =
        value("monthlyInsurance") +
        value("monthlyPhone") +
        value("monthlyStorage") +
        value("monthlySoftware") +
        value("monthlyOther");


    /*
        NET PROFIT
    */

    const annualNetProfit =
        grossAnnual -
        (weeklyOperatingCosts * 52) -
        (monthlyOperatingCosts * 12);

    const monthlyNetProfit =
        annualNetProfit / 12;

    const weeklyNetProfit =
        annualNetProfit / 52;

    const dailyNetProfit =
        daysPerWeek > 0
            ? weeklyNetProfit / daysPerWeek
            : 0;


    /*
        DISPLAY RESULTS
    */

    startupTotal.textContent =
        money(startup);

    dailyProfit.textContent =
        money(dailyNetProfit);

    weeklyProfit.textContent =
        money(weeklyNetProfit);

    monthlyProfit.textContent =
        money(monthlyNetProfit);

    annualProfit.textContent =
        money(annualNetProfit);


    /*
        PAYBACK PERIOD

        Measured in actual operating days.
    */

    if (dailyNetProfit > 0) {

        const days =
            Math.ceil(startup / dailyNetProfit);

        payback.textContent =
            days + " Operating Days";

    } else {

        payback.textContent =
            "Not Profitable";

    }


    /*
        LAUNCH SCORE
    */

    updatePotential(
        startup,
        dailyNetProfit,
        annualNetProfit,
        profitMargin,
        daysPerWeek
    );

}

/* =========================================================
   LAUNCH SCORE
========================================================= */

function updatePotential(
    startup,
    dailyProfitValue,
    yearlyProfit,
    profitMargin,
    daysPerWeek
) {

    /*
        Determine the type of business model
        based on operating frequency.

        1–2 days = Side Hustle
        3–4 days = Growth Business
        5–7 days = Full-Time
    */

    let businessModel;

    if (daysPerWeek <= 2) {

        businessModel = "side";

    } else if (daysPerWeek <= 4) {

        businessModel = "growth";

    } else {

        businessModel = "fulltime";

    }


    let score = 0;


    /*
        PAYBACK

        Startup recovery supports the score
        but does not dominate it.
    */

    let paybackScore = 0;

    if (startup === 0 && dailyProfitValue > 0) {

        paybackScore = 20;

    } else if (startup > 0 && dailyProfitValue > 0) {

        const paybackDays =
            startup / dailyProfitValue;


        if (businessModel === "side") {

            if (paybackDays <= 30) {
                paybackScore = 20;
            } else if (paybackDays <= 90) {
                paybackScore = 17;
            } else if (paybackDays <= 180) {
                paybackScore = 13;
            } else if (paybackDays <= 365) {
                paybackScore = 8;
            } else if (paybackDays <= 730) {
                paybackScore = 4;
            }

        } else {

            if (paybackDays <= 90) {

                paybackScore =
                    25 - (paybackDays / 90 * 5);

            } else if (paybackDays <= 180) {

                paybackScore =
                    20 -
                    ((paybackDays - 90) / 90 * 5);

            } else if (paybackDays <= 365) {

                paybackScore =
                    15 -
                    ((paybackDays - 180) / 185 * 7.5);

            } else if (paybackDays <= 730) {

                paybackScore =
                    7.5 -
                    ((paybackDays - 365) / 365 * 7.5);

            }

        }

    }


    /*
        SIDE HUSTLE
    */

    if (businessModel === "side") {

        /*
            Profit is important, but a side hustle
            does not need to produce full-time income.
        */

        const profitScore =
            yearlyProfit > 0
                ? Math.min(30, yearlyProfit / 900)
                : 0;

        const dailyEfficiencyScore =
            Math.min(
                35,
                Math.max(0, dailyProfitValue) / 8
            );

        const marginScore =
            Math.min(
                15,
                Math.max(0, profitMargin) * 30
            );

        score =
            profitScore +
            dailyEfficiencyScore +
            paybackScore +
            marginScore;

    }


    /*
        GROWTH BUSINESS
    */

    else if (businessModel === "growth") {

        const profitScore =
            yearlyProfit > 0
                ? Math.min(40, yearlyProfit / 2500)
                : 0;

        const dailyEfficiencyScore =
            Math.min(
                20,
                Math.max(0, dailyProfitValue) / 10
            );

        const marginScore =
            Math.min(
                20,
                Math.max(0, profitMargin) * 40
            );

        score =
            profitScore +
            dailyEfficiencyScore +
            paybackScore +
            marginScore;

    }


    /*
        FULL-TIME BUSINESS
    */

    else {

        const profitScore =
            yearlyProfit > 0
                ? Math.min(50, yearlyProfit / 1750)
                : 0;

        const marginScore =
            Math.min(
                25,
                Math.max(0, profitMargin) * 50
            );

        score =
            profitScore +
            paybackScore +
            marginScore;

    }


    /*
        Keep score between 0 and 100.
    */

    score =
        Math.max(
            0,
            Math.min(100, score)
        );


    score = Math.round(score);


    /*
        UPDATE SCORE DISPLAY
    */

    potentialPercent.textContent =
        score + "%";

    progressFill.style.width =
        score + "%";


    /*
        SCORE MESSAGE
    */

    let message;


    if (score >= 90) {

        message =
            "🔥 Exceptional Opportunity — Your numbers show a very strong business model with excellent profit potential.";

    } else if (score >= 80) {

        message =
            "🚀 Strong Opportunity — Your numbers show a strong business model with solid profit potential.";

    } else if (score >= 70) {

        message =
            "✅ Viable Opportunity — Your numbers show a reasonably sound business model. Your profit, margins, and startup payback are working together well.";

    } else if (score >= 60) {

        message =
            "⚠️ Needs Improvement — Your business may be workable, but improving profitability or reducing costs could make a meaningful difference.";

    } else if (score >= 40) {

        message =
            "⚠️ High Risk — Your current numbers have some significant weaknesses. Improving sales volume, margins, or operating costs could change the outlook.";

    } else {

        message =
            "❌ Poor Outlook — Your current numbers suggest the business may struggle to generate enough profit to justify the investment.";

    }


    /*
        ADD SPECIFIC GUIDANCE
    */

    const guidance = [];


    if (yearlyProfit <= 0) {

        guidance.push(
            "Your projected annual net profit is too low."
        );

    }


    if (dailyProfitValue < 50) {

        guidance.push(
            "Increasing the profit earned per operating day would strengthen the model."
        );

    }


    if (profitMargin < 0.20) {

        guidance.push(
            "Your profit margin is low. Consider improving pricing or reducing COGS."
        );

    }


    if (
        startup > 0 &&
        dailyProfitValue > 0 &&
        startup / dailyProfitValue > 365
    ) {

        guidance.push(
            "Your startup investment takes more than a year of operating days to recover."
        );

    }


    if (yearlyProfit > 0 && yearlyProfit < 25000) {

        guidance.push(
            "Increasing sales volume would have the biggest impact on your projected profit."
        );

    }


    if (guidance.length === 0) {

        guidance.push(
            "Your core financial fundamentals are working well together."
        );

    }


    potentialText.innerHTML =
        message +
        "<br><br>" +
        guidance.join(" ");


}


/* =========================================================
   INITIAL CALCULATION
========================================================= */

calculate();