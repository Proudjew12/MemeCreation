'use strict'

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [

    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function addLine(txt, color = 'red') {
    const line = { txt, size: 20, color, align: 'center', x: 40, y: 40 }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    return line
}


function removeLine(idx = gMeme.selectedLineIdx) {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(idx, 1)
    gMeme.selectedLineIdx = Math.max(0, Math.min(gMeme.selectedLineIdx, gMeme.lines.length - 1))
}

function setSelectedLineIdx(idx) {
    if (idx >= 0 && idx < gMeme.lines.length) gMeme.selectedLineIdx = idx
}

function updateLineTxt(txt, idx = gMeme.selectedLineIdx) {
    if (!gMeme.lines[idx]) return
    gMeme.lines[idx].txt = txt
}

function updateLinePos(idx, x, y) {
    if (!gMeme.lines[idx]) return
    gMeme.lines[idx].x = x
    gMeme.lines[idx].y = y
}
function updateLineColor(color, idx = gMeme.selectedLineIdx) {
    if (!gMeme.lines[idx]) return
    gMeme.lines[idx].color = color
}
function updateLineSize(delta, idx = gMeme.selectedLineIdx) {
    if (!gMeme.lines[idx]) return
    gMeme.lines[idx].size = Math.max(8, gMeme.lines[idx].size + delta)
}



window.getMeme = getMeme
window.addLine = addLine
window.removeLine = removeLine
window.setSelectedLineIdx = setSelectedLineIdx
window.updateLineTxt = updateLineTxt
window.updateLinePos = updateLinePos
window.updateLineColor = updateLineColor
window.updateLineSize = updateLineSize
