/* =========================================================
   YOVIK TOOLPAGE JAVASCRIPT
   Checklist Popup
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const checklistTrigger =
        document.querySelector(".checklist-trigger");

    const checklistOverlay =
        document.getElementById("checklistOverlay");

    const checklistClose =
        document.getElementById("checklistClose");

    const checklistForm =
        document.getElementById("checklistForm");

    const checklistSubmit =
        document.getElementById("checklistSubmit");

    const checklistSuccess =
        document.getElementById("checklistSuccess");


    /* ==========================
       OPEN / CLOSE CHECKLIST
    ========================== */

    if (checklistTrigger && checklistOverlay) {

        checklistTrigger.addEventListener("click", function (event) {

            event.preventDefault();

            checklistOverlay.classList.add("active");

        });

    }


    if (checklistClose && checklistOverlay) {

        checklistClose.addEventListener("click", function () {

            checklistOverlay.classList.remove("active");

        });

    }


    if (checklistOverlay) {

        checklistOverlay.addEventListener("click", function (event) {

            if (event.target === checklistOverlay) {

                checklistOverlay.classList.remove("active");

            }

        });

    }


    /* ==========================
       CHECKLIST FORM
    ========================== */

    if (
        checklistForm &&
        checklistSubmit &&
        checklistSuccess
    ) {

        checklistForm.addEventListener("submit", function (event) {

            event.preventDefault();

            checklistSubmit.disabled = true;

            checklistSubmit.textContent = "SENDING...";

            setTimeout(function () {

                checklistForm.style.display = "none";

                checklistSuccess.style.display = "block";

            }, 1000);

        });

    }

});