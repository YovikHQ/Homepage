/* =========================================================
   YOVIK TOOLPAGE JAVASCRIPT
   Business Launch Checklist™
   Desktop + Mobile
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
       OPEN CHECKLIST
       Desktop + Mobile
    ========================== */

    if (checklistTrigger && checklistOverlay) {

        function openChecklist(event) {

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            checklistOverlay.classList.add("active");

        }


        /* Desktop mouse click */
        checklistTrigger.addEventListener(
            "click",
            openChecklist
        );


        /* Mobile touch */
        checklistTrigger.addEventListener(
            "touchend",
            openChecklist,
            { passive: false }
        );

    }


    /* ==========================
       CLOSE CHECKLIST
       X Button
       Desktop + Mobile
    ========================== */

    if (checklistClose && checklistOverlay) {

        function closeChecklist(event) {

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            checklistOverlay.classList.remove("active");

        }


        /* Desktop */
        checklistClose.addEventListener(
            "click",
            closeChecklist
        );


        /* Mobile */
        checklistClose.addEventListener(
            "touchend",
            closeChecklist,
            { passive: false }
        );

    }


    /* ==========================
       CLOSE BY CLICKING OUTSIDE
    ========================== */

    if (checklistOverlay) {

        checklistOverlay.addEventListener(
            "click",
            function (event) {

                if (event.target === checklistOverlay) {

                    checklistOverlay.classList.remove("active");

                }

            }
        );


        /* Mobile outside tap */
        checklistOverlay.addEventListener(
            "touchend",
            function (event) {

                if (event.target === checklistOverlay) {

                    checklistOverlay.classList.remove("active");

                }

            },
            { passive: false }
        );

    }


    /* ==========================
       CHECKLIST FORM
    ========================== */

    if (
        checklistForm &&
        checklistSubmit &&
        checklistSuccess
    ) {

        checklistForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                checklistSubmit.disabled = true;

                checklistSubmit.textContent = "SENDING...";


                setTimeout(function () {

                    checklistForm.style.display = "none";

                    checklistSuccess.style.display = "block";

                }, 1000);

            }
        );

    }

});

