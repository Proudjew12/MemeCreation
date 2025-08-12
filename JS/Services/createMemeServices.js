'use strict'

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function addLine(txt) {
    const line = { txt, size: 20, color: 'red', x: 40, y: 40 }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    return line
}

function updateLinePos(idx, x, y) {
    if (!gMeme.lines[idx]) return
    gMeme.lines[idx].x = x
    gMeme.lines[idx].y = y
}

window.getMeme = getMeme
window.addLine = addLine
window.updateLinePos = updateLinePos
