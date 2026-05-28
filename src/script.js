const fileInputShift = document.getElementById("shift-file");
fileInputShift.addEventListener("change", function() {
    btn = document.getElementById("shift-button")
    btn.disabled = false;
})

const fileInputConvert = document.getElementById("convert-file");
fileInputConvert.addEventListener("change", function() {
    btn = document.getElementById("convert-button")
    btn.disabled = false;
})