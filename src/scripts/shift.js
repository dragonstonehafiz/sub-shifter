/** @type {boolean} */
let isFileInputShiftValid = false;
/** @type {boolean} */
let isShiftInputAmtValid = true;

const fileInputShift = document.getElementById("shift-file");
fileInputShift.addEventListener("change", function() {
    const btn = document.getElementById("shift-button")
    const file = this.files[0];
    if (!isFileValid(file)) {
        alert("Either file is not selected or not valid, please try another file.")
        this.value = ""
        isFileInputShiftValid = false;
    }
    else {
        isFileInputShiftValid = true;
    }
    enableShiftButton();
})

const inputShiftValue = document.getElementById("shift-value");
inputShiftValue.addEventListener("change", function() {
    isShiftInputAmtValid = !isNaN(parseFloat(this.value));
    enableShiftButton();
})

/**
 * Enable or disable the shift button based on input validation
 * @returns {void}
 */
function enableShiftButton() {
    const btn = document.getElementById("shift-button")
    if (isFileInputShiftValid && isShiftInputAmtValid) {
        btn.disabled = false;
    }
    else {
        btn.disabled = true;
    }
}

const shiftButton = document.getElementById("shift-button");
shiftButton.addEventListener("click", async function() {
    if (!isFileInputShiftValid || !isShiftInputAmtValid)
        return;

    let file = fileInputShift.files[0];
    let shiftAmt = parseFloat(inputShiftValue.value);
    let ext = file.name.split(".").pop();
    let text = await file.text();

    if (ext === "srt") {
        let subs = readSRTFile(text);
        let outputText = retimeSRTFile(subs, shiftAmt);
        downloadTextFile(outputText, file.name);
    }
    else if (ext === "ass") {
        const {header, subs} = readASSFile(text);
        let outputText = retimeASSFile(header, subs, shiftAmt);
        downloadTextFile(outputText, file.name);
    }
})