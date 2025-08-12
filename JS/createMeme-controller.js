'use strict'

let gElBoard, gElInput
let gDrag = { isDown: false, startX: 0, startY: 0, el: null, lineIdx: -1 }
let gOverlayEls = []

function onInitMeme() {
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')

    document.getElementById('btn-add')?.addEventListener('click', onAddLine)
    document.getElementById('btn-delete')?.addEventListener('click', onDeleteLine)
    gElInput.addEventListener('input', onInputChange)

    onRebuildOverlays()

    gElBoard.addEventListener('click', (ev) => {
        if (!ev.target.classList.contains('overlay-text')) {
            onDeselectLine()
        }
    })
}

function onAddLine() {
    const txt = gElInput.value.trim()
    if (!txt) return
    addLine(txt)
    onRebuildOverlays()
    onSelectLine(getMeme().selectedLineIdx)
    gElInput.focus()
    gElInput.select()
}

function onDeleteLine() {
    const meme = getMeme()
    if (!meme.lines.length) return

    const idx = meme.selectedLineIdx
    removeLine(idx)

    onRebuildOverlays()

    if (meme.lines.length) {
        onSelectLine(meme.selectedLineIdx)
        gElInput.focus()
    } else {
        gElInput.value = ''
    }
}

function onInputChange(e) {
    const meme = getMeme()
    if (!meme.lines.length) return
    updateLineTxt(e.target.value, meme.selectedLineIdx)

    const el = gOverlayEls[meme.selectedLineIdx]
    if (el) el.textContent = e.target.value
}

function onRebuildOverlays() {
    gOverlayEls.forEach(el => el && el.remove())
    gOverlayEls = []

    const meme = getMeme()
    meme.lines.forEach((line, idx) => onCreateFloating(line, idx))
}

function onCreateFloating(line, idx) {
    const el = document.createElement('div')
    el.className = 'overlay-text'
    el.textContent = line.txt
    el.style.position = 'absolute'
    el.style.left = (typeof line.x === 'number' ? line.x : 40) + 'px'
    el.style.top = (typeof line.y === 'number' ? line.y : 40) + 'px'
    el.style.cursor = 'move'

    el.addEventListener('click', () => {
        onSelectLine(idx)
        gElInput.focus()
        gElInput.select()
    })

    el.addEventListener('mousedown', (ev) => onDragStart(ev, el, idx))
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)

    gElBoard.appendChild(el)
    gOverlayEls[idx] = el
}

function onSelectLine(idx) {
    setSelectedLineIdx(idx)
    const meme = getMeme()
    gElInput.value = meme.lines[idx]?.txt || ''
    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
    if (idx >= 0) {
        const el = gOverlayEls[idx]
        if (el) el.style.outline = '2px solid rgba(255,255,255,.65)'
    }
}
function onDeselectLine() {
    const meme = getMeme()
    meme.selectedLineIdx = -1
    gElInput.value = ''
    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
}

function onDragStart(ev, el, idx) {
    gDrag.isDown = true
    gDrag.startX = ev.clientX - el.offsetLeft
    gDrag.startY = ev.clientY - el.offsetTop
    gDrag.el = el
    gDrag.lineIdx = idx
    onSelectLine(idx)
}

function onDragMove(ev) {
    if (!gDrag.isDown || !gDrag.el) return
    const boardRect = gElBoard.getBoundingClientRect()

    let x = ev.clientX - gDrag.startX - boardRect.left
    let y = ev.clientY - gDrag.startY - boardRect.top

    const maxX = gElBoard.clientWidth - gDrag.el.offsetWidth
    const maxY = gElBoard.clientHeight - gDrag.el.offsetHeight
    x = Math.max(0, Math.min(x, maxX))
    y = Math.max(0, Math.min(y, maxY))

    gDrag.el.style.left = x + 'px'
    gDrag.el.style.top = y + 'px'

    updateLinePos(gDrag.lineIdx, x, y)
}

function onDragEnd() {
    gDrag.isDown = false
    gDrag.el = null
    gDrag.lineIdx = -1
}

window.onInitMeme = onInitMeme
