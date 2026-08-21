const checklistTrigger =
    document.querySelector(".checklist-trigger");

const checklistOverlay =
    document.getElementById("checklistOverlay");

const checklistClose =
    document.getElementById("checklistClose");


checklistTrigger.addEventListener("click", function () {

    checklistOverlay.classList.add("active");

});


checklistClose.addEventListener("click", function () {

    checklistOverlay.classList.remove("active");

});


checklistOverlay.addEventListener("click", function (event) {

    if (event.target === checklistOverlay) {

        checklistOverlay.classList.remove("active");

    }

});

const checklistForm =
    document.getElementById("checklistForm");

const checklistSubmit =
    document.getElementById("checklistSubmit");

const checklistSuccess =
    document.getElementById("checklistSuccess");


checklistForm.addEventListener("submit", function () {

    checklistSubmit.disabled = true;

    checklistSubmit.textContent = "SENDING...";

    setTimeout(function () {

        checklistForm.style.display = "none";

        checklistSuccess.style.display = "block";

    }, 1000);

});

