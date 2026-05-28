const fileInputConvert = document.getElementById("convert-file");
fileInputConvert.addEventListener("change", function() {
    const btn = document.getElementById("convert-button")
    const file = this.files[0];
    if (!isFileValid(file)) {
        alert("Either file is not selected or not valid, please try another file.")
        this.value = ""
        btn.disabled = true;
        return;
    }
    btn.disabled = false;
})