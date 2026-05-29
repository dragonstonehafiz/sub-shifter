class SubtitleASS {
    constructor(
        layer, 
        startTime, endTime, 
        style, name, 
        marginL, marginR, marginV,
        effect, text
    ) {
        this.layer = layer;
        this.startTime = startTime;
        this.endTime = endTime;
        this.style = style;
        this.name = name;
        this.marginL = marginL;
        this.marginR = marginR;
        this.marginV = marginV;
        this.effect = effect;
        this.text = text;
    }

    addTime(toAdd) {
        this.startTime.addTime(toAdd);
        this.endTime.addTime(toAdd);
    }

    getString() {
        return `${this.layer},${this.startTime.getString()},${this.endTime.getString()},${this.style},${this.name},${this.marginL},${this.marginR},${this.marginV},${this.effect},${this.text}`;
    }
}
class TimingASS {
    constructor(inputString) {
        let timings = inputString.split(".");
        this.cc = parseInt(timings.pop());
        timings = timings[0].split(":");
        this.SS = parseInt(timings.pop());
        this.MM = parseInt(timings.pop());
        this.HH = parseInt(timings.pop());
    }

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

    getString() {
        let output = "";
        const hh = this.HH.toString();
        const mm = this.MM.toString();
        const ss = this.SS.toString();
        const cc = this.cc.toString().padStart(2, '0');
        return `${hh}:${mm}:${ss}.${cc}`;
    }
}

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

            let sub = new SubtitleASS(layer, new TimingASS(startTime), new TimingASS(endTime), style, name, marginL, marginR, marginV, effect, text);
            subs.push(sub);
        }
        i++;
    }
    
    header = lines.slice(0, subStartIndex).join("\n");
    return {header, subs};
}

function retimeASSFile(header, subs, shiftAmt) {
    for (const sub of subs) {
        sub.addTime(shiftAmt);
    }

    let output = `${header}\n`;
    for (const sub of subs) {
        output += `${sub.getString()}\n`;
    }

    return output;
}