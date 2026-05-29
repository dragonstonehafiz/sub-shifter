/**
 * Validate if file is a supported subtitle format
 * @param {File} file - File object to validate
 * @returns {boolean} True if file is a valid SRT file
 */
function isFileValid(file) {
    if (!file)
        return false;
    let ext = file.name.split(".").pop();
    if (ext !== "srt" && ext !== "ass")
        return false;
    return true;
}

/**
 * Download text content as a file
 * @param {string} content - Text content to download
 * @param {string} filename - Name of file to download as
 * @returns {void}
 */
function downloadTextFile(content, filename) {
const link = document.createElement("a");
    const newFile = new Blob([content], {type: "text/plain"});
    link.href = URL.createObjectURL(newFile);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}