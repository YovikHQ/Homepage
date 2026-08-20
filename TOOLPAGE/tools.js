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

