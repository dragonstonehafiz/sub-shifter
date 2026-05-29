class SubtitleSRT {
    /**
     * @param {number} index
     * @param {string} startTime
     * @param {string} endTime
     * @param {string} text
     */
    constructor(index, startTime, endTime, text) {
        this.index = index;
        this.startTime = new TimingSRT(startTime);
        this.endTime = new TimingSRT(endTime);
        this.text = text;
    }

    /**
     * @param {number} toAdd - Time offset in seconds
     * @returns {void}
     */
    addTime(toAdd) {
        this.startTime.addTime(toAdd);
        this.endTime.addTime(toAdd);
    }
}
class TimingSRT {
    /** @type {number} */
    HH;
    /** @type {number} */
    MM;
    /** @type {number} */
    SS;
    /** @type {number} */
    mmm;

    /**
     * @param {string} inputString - Timing string in format HH:MM:SS,mmm
     */
    constructor(inputString) {
        let timings = inputString.split(",");
        this.mmm = parseInt(timings.pop());
        timings = timings[0].split(":");
        this.SS = parseInt(timings.pop());
        this.MM = parseInt(timings.pop());
        this.HH = parseInt(timings.pop());
    }

    /**
     * @param {number} toAdd - Time offset in seconds
     * @returns {void}
     */
    addTime(toAdd) {
        let totalMs = this.HH * 1000 * 60 * 60 + this.MM * 1000 * 60 + this.SS * 1000 + this.mmm;
        let offset = toAdd * 1000;
        totalMs += offset;
        if (totalMs < 0)
            totalMs = 0;

        let HH = Math.floor(totalMs / 3600000);
        totalMs -= (HH * 3600000);
        let MM = Math.floor(totalMs / 60000);
        totalMs -= (MM * 60000);
        let SS = Math.floor(totalMs / 1000);
        let mmm = totalMs % 1000;

        this.HH = HH;
        this.MM = MM;
        this.SS = SS;
        this.mmm = mmm;
    }

    /**
     * @returns {string} Formatted timing string HH:MM:SS,mmm
     */
    getString() {
        let output = "";
        const hh = this.HH.toString().padStart(2, '0');
        const mm = this.MM.toString().padStart(2, '0');
        const ss = this.SS.toString().padStart(2, '0');
        const mmm = this.mmm.toString().padStart(3, '0');
        return `${hh}:${mm}:${ss},${mmm}`;
    }
}

/**
 * Parse SRT file content into subtitle objects
 * @param {string} text - Raw SRT file content
 * @returns {SubtitleSRT[]} Array of parsed subtitles
 */
function readSRTFile(text) {
    const lines = text.split("\n");
    let i = 0;
    let subs = []
    while (i < lines.length) {
        let index = parseInt(lines[i]);
        if (isNaN(index)) {
            i++;
            continue;
        }
        i++;
        let timings = lines[i].split("-->")
        let endTime = timings.pop().trim();
        let startTime = timings.pop().trim();
        i++;
        let subContent = "";
        while (true) {
            subContent += (lines[i] + "\n")
            i++;
            if (i >= lines.length || lines[i].trim() === "") {
                i++;
                break;
            }
        }

        let sub = new SubtitleSRT(index, startTime, endTime, subContent)
        subs.push(sub)
    }
    return subs;
}

/**
 * Apply time shift to subtitles and format as SRT
 * @param {SubtitleSRT[]} subs - Array of subtitles
 * @param {number} shiftAmt - Time shift in seconds
 * @returns {string} Formatted SRT file content
 */
function retimeSRTFile(subs, shiftAmt) {
    for (const sub of subs) {
        sub.addTime(shiftAmt);
    }

    let output = "";
    for (const sub of subs) {
        output += `${sub.index}\n`;
        output += `${sub.startTime.getString()} --> ${sub.endTime.getString()}\n`;
        output += `${sub.text}\n`;
    }

    return output;
}