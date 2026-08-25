/* =========================================================
   YOVIK TOOLPAGE JAVASCRIPT
   Checklist Popup + Brevo Submission
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

    const brevoFrame =
        document.querySelector('iframe[name="brevoSubmissionFrame"]');


    /* =====================================================
       OPEN CHECKLIST
    ===================================================== */

    if (checklistTrigger && checklistOverlay) {

        checklistTrigger.addEventListener("click", function (event) {

            event.preventDefault();

            checklistOverlay.classList.add("active");

        });

    }


    /* =====================================================
       CLOSE CHECKLIST
    ===================================================== */

    if (checklistClose && checklistOverlay) {

        checklistClose.addEventListener("click", function () {

            checklistOverlay.classList.remove("active");

        });

    }


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE POPUP
    ===================================================== */

    if (checklistOverlay) {

        checklistOverlay.addEventListener("click", function (event) {

            if (event.target === checklistOverlay) {

                checklistOverlay.classList.remove("active");

            }

        });

    }


    /* =====================================================
       BREVO FORM SUBMISSION
    ===================================================== */

    if (checklistForm && checklistSubmit) {

        let submissionStarted = false;


        checklistForm.addEventListener("submit", function () {

            /*
             * IMPORTANT:
             * DO NOT use event.preventDefault() here.
             *
             * The form must actually submit to Brevo.
             */

            submissionStarted = true;

            checklistSubmit.disabled = true;

            checklistSubmit.textContent = "SENDING...";

        });


        /* =================================================
           BREVO RESPONSE
        ================================================= */

        if (brevoFrame) {

            brevoFrame.addEventListener("load", function () {

                if (!submissionStarted) {
                    return;
                }

                setTimeout(function () {

                    checklistForm.style.display = "none";

                    if (checklistSuccess) {

                        checklistSuccess.style.display = "block";

                    }

                }, 500);

            });

        }

    }

});