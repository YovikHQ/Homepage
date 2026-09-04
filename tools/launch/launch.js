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

    if (startup === 0 && dailyNetProfit > 0) {

        payback.textContent =
            "Already Recovered";

    } else if (startup > 0 && dailyNetProfit > 0) {

        const days =
            Math.ceil(startup / dailyNetProfit);

        payback.textContent =
            days + " Operating Days";

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
        profitMargin,
        daysPerWeek
    );

}


// ==============================
// YOVIK LAUNCH SCORE
// ==============================

function updatePotential(
    startup,
    dailyProfit,
    yearlyProfit,
    profitMargin,
    daysPerWeek
) {

    let score = 0;


    /*
        YOVIK automatically determines
        the scoring model from the number
        of operating days entered.

        1–2 days  = Side Hustle
        3–4 days  = Growth Business
        5–7 days  = Full-Time Business
    */


    // ==============================
    // SIDE HUSTLE — 1–2 DAYS
    // ==============================

    if (daysPerWeek <= 2) {


        // Annual Profit — 30 points

        const profitScore =
            yearlyProfit > 0
                ? Math.min(
                    30,
                    yearlyProfit / 2500
                )
                : 0;


        // Profit Per Operating Day — 35 points

        const dailyEfficiencyScore =
            Math.min(
                35,
                Math.max(0, dailyProfit) / 8
            );


        // Startup Payback — 20 points

        let paybackScore = 0;


        if (startup === 0 && dailyProfit > 0) {

            paybackScore = 20;

        } else if (startup > 0 && dailyProfit > 0) {

            const paybackDays =
                startup / dailyProfit;


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

        }


        // Profit Margin — 15 points

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


    // ==============================
    // GROWTH BUSINESS — 3–4 DAYS
    // ==============================

    else if (daysPerWeek <= 4) {


        // Annual Profit — 40 points

        const profitScore =
            yearlyProfit > 0
                ? Math.min(
                    40,
                    yearlyProfit / 2500
                )
                : 0;


        // Profit Per Operating Day — 20 points

        const dailyEfficiencyScore =
            Math.min(
                20,
                Math.max(0, dailyProfit) / 10
            );


        // Startup Payback — 20 points

        let paybackScore = 0;


        if (startup === 0 && dailyProfit > 0) {

            paybackScore = 20;

        } else if (startup > 0 && dailyProfit > 0) {

            const paybackDays =
                startup / dailyProfit;


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

        }


        // Profit Margin — 20 points

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


    // ==============================
    // FULL-TIME BUSINESS — 5–7 DAYS
    // ==============================

    else {


        // Annual Profit — 50 points

        const profitScore =
            yearlyProfit > 0
                ? Math.min(
                    50,
                    yearlyProfit / 1750
                )
                : 0;


        // Startup Payback — 25 points

        let paybackScore = 0;


        if (startup === 0 && dailyProfit > 0) {

            paybackScore = 25;

        } else if (startup > 0 && dailyProfit > 0) {

            const paybackDays =
                startup / dailyProfit;


            if (paybackDays <= 90) {

                paybackScore =
                    25 -
                    (paybackDays / 90 * 5);

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

            } else {

                paybackScore = 0;

            }

        }


        // Profit Margin — 25 points

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


    // ==============================
    // FINAL SCORE
    // ==============================

    score =
        Math.max(
            0,
            Math.min(100, score)
        );


    const displayScore =
        Math.round(score);


    // ==============================
    // DISPLAY SCORE
    // ==============================

    potentialPercent.textContent =
        displayScore + "%";


    progressFill.style.width =
        displayScore + "%";


    // ==============================
    // SCORE MESSAGE
    // ==============================

    let result = "";


    if (displayScore >= 90) {

        result =
            "🏆 Exceptional Opportunity — Your numbers show very strong business fundamentals.";

    } else if (displayScore >= 80) {

        result =
            "🚀 Strong Opportunity — Your business has a solid financial foundation.";

    } else if (displayScore >= 70) {

        result =
            "✅ Viable Opportunity — Your numbers show a reasonably sound business model.";

    } else if (displayScore >= 60) {

        result =
            "📈 Needs Improvement — Your business may work, but some numbers should be strengthened.";

    } else if (displayScore >= 40) {

        result =
            "⚠️ High Risk — Your current numbers have some significant weaknesses.";

    } else {

        result =
            "🛑 Poor Outlook — Your current numbers suggest the business model needs significant improvement.";

    }


    // ==============================
    // SCORE EXPLANATION
    // ==============================

    let explanation = "";


    if (yearlyProfit <= 0) {

        explanation =
            "Your projected net profit is currently too low to support a strong score.";

    } else if (dailyProfit < 50) {

        explanation =
            "Your biggest opportunity is increasing the profit earned on each operating day.";

    } else if (profitMargin < 0.20) {

        explanation =
            "Your profit margin is limiting the score. Improving pricing or lowering cost per sale would help.";

    } else if (startup > 0 && dailyProfit > 0) {

        const paybackDays =
            startup / dailyProfit;


        if (paybackDays > 365) {

            explanation =
                "Your biggest weakness is the time required to recover your startup investment.";

        } else if (yearlyProfit < 25000) {

            explanation =
                "Your margins and payback are reasonable, but increasing sales volume would have the biggest impact.";

        } else {

            explanation =
                "Your profit, margins, and startup payback are working together well.";

        }

    } else {

        explanation =
            "Your current numbers provide a useful starting point. Increasing sales or improving margins can strengthen the result.";

    }


    potentialText.textContent =
        `${result} ${explanation}`;

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