class SubtitleASS {
    /**
     * @param {string} layer
     * @param {TimingASS} startTime - Start time of subtitle
     * @param {TimingASS} endTime - End time of subtitle
     * @param {string} style
     * @param {string} name
     * @param {string} marginL
     * @param {string} marginR
     * @param {string} marginV
     * @param {string} effect
     * @param {string} text
     */
    constructor(
        layer,
        startTime, endTime,
        style, name,
        marginL, marginR, marginV,
        effect, text
    ) {
        this.layer = layer;
        this.startTime = new TimingASS(startTime);
        this.endTime = new TimingASS(endTime);
        this.style = style;
        this.name = name;
        this.marginL = marginL;
        this.marginR = marginR;
        this.marginV = marginV;
        this.effect = effect;
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

    /**
     * @returns {string} - Formatted ASS dialog line
     */
    getString() {
        return `${this.layer},${this.startTime.getString()},${this.endTime.getString()},${this.style},${this.name},${this.marginL},${this.marginR},${this.marginV},${this.effect},${this.text}`;
    }
}
class TimingASS {
    /** @type {number} */
    HH;
    /** @type {number} */
    MM;
    /** @type {number} */
    SS;
    /** @type {number} */
    cc;

    /**
     * @param {string} inputString - Time in HH:MM:SS.CC format
     */
    constructor(inputString) {
        let timings = inputString.split(".");
        this.cc = parseInt(timings.pop());
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
        let totalMs = this.HH * 1000 * 60 * 60 + this.MM * 1000 * 60 + this.SS * 1000 + this.cc * 10;
        let offset = toAdd * 1000;
        totalMs += offset;
        if (totalMs < 0)
            totalMs = 0;

        let HH = Math.floor(totalMs / 3600000);
        totalMs -= (HH * 3600000);
        let MM = Math.floor(totalMs / 60000);
        totalMs -= (MM * 60000);
        let SS = Math.floor(totalMs / 1000);
        let cc = Math.floor((totalMs % 1000) / 10);

        this.HH = HH;
        this.MM = MM;
        this.SS = SS;
        this.cc = cc;
    }

    getSRTTime() {
        let totalMs = this.HH * 1000 * 60 * 60 + this.MM * 1000 * 60 + this.SS * 1000 + this.cc * 10;;

        let HH = Math.floor(totalMs / 3600000);
        totalMs -= (HH * 3600000);
        let MM = Math.floor(totalMs / 60000);
        totalMs -= (MM * 60000);
        let SS = Math.floor(totalMs / 1000);
        let mmm = totalMs % 1000;

        const hh = HH.toString().padStart(2, '0');
        const mm = MM.toString().padStart(2, '0');
        const ss = SS.toString().padStart(2, '0');
        const mmmStr = mmm.toString().padStart(3, '0');
        return `${hh}:${mm}:${ss},${mmmStr}`;
    }

    /**
     * @returns {string} - Formatted time string HH:MM:SS.CC
     */
    getString() {
        let output = "";
        const hh = this.HH.toString();
        const mm = this.MM.toString().padStart(2, '0');
        const ss = this.SS.toString().padStart(2, '0');
        const cc = this.cc.toString().padStart(2, '0');
        return `${hh}:${mm}:${ss}.${cc}`;
    }
}

/**
 * Parse ASS file content into subtitle objects
 * @param {string} text - Raw ASS file content
 * @returns {{header: string, subs: SubtitleASS[]}} Object containing file header and parsed subtitles
 */
function readASSFile(text) {
    const lines = text.split("\n");
    let i = 0;
    let subs = []
    let subStartIndex = -1;

    while (i < lines.length) {
        if (lines[i].substring(0, 9) === "Dialogue:") {
            if (subStartIndex === -1)
                subStartIndex = i;

            let fullLine = lines[i].substring(10);
            let subData = fullLine.split(",");

            let layer = subData[0];
            let startTime = subData[1];
            let endTime = subData[2];
            let style = subData[3];
            let name = subData[4];
            let marginL = subData[5];
            let marginR = subData[6];
            let marginV = subData[7];
            let effect = subData[8];
            let text = subData.slice(9).join(",");

            let sub = new SubtitleASS(layer, startTime, endTime, style, name, marginL, marginR, marginV, effect, text);
            subs.push(sub);
        }
        i++;
    }
    
    header = lines.slice(0, subStartIndex).join("\n");
    return {header, subs};
}

/**
 * Apply time shift to subtitles and format as ASS
 * @param {string} header - ASS file header
 * @param {SubtitleASS[]} subs - Array of subtitle entries
 * @param {number} shiftAmt - Time shift amount in seconds
 * @returns {string} Formatted ASS file content
 */
function retimeASSFile(header, subs, shiftAmt) {
    for (const sub of subs) {
        sub.addTime(shiftAmt);
    }

    return createASSFile(header, subs);
}

function createASSFile(header, subs) {
    let output = `${header}\n`;
    for (const sub of subs) {
        output += `Dialogue: ${sub.getString()}\n`;
    }
    return output;
}