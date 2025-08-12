'use strict'

let gElBoard, gElInput
let gDrag = { isDown: false, startX: 0, startY: 0, el: null, lineIdx: -1 }
let gOverlayEls = []

function onInitMeme() {
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')

    document.getElementById('btn-add')?.addEventListener('click', onAddLine)
    document.getElementById('btn-delete')?.addEventListener('click', onDeleteLine)

    document.getElementById('fill-color')
        .addEventListener('input', onColorChange)

    document.getElementById('btn-align-left')
        .addEventListener('click', () => onAlignChange('left'))

    document.getElementById('btn-align-center')
        .addEventListener('click', () => onAlignChange('center'))

    document.getElementById('btn-align-right')
        .addEventListener('click', () => onAlignChange('right'))

    document.getElementById('btn-size-plus')
        .addEventListener('click', () => onSizeChange(2))

    document.getElementById('btn-size-minus')
        .addEventListener('click', () => onSizeChange(-2))

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
    const color = document.getElementById('fill-color').value
    addLine(txt, color)
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
        disableSizeButtons()
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
    el.style.color = line.color
    el.style.fontSize = line.size + 'px'
    el.style.textAlign = line.align || 'center'

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

    document.getElementById('fill-color').value = meme.lines[idx]?.color || '#ffffff'
    gElInput.value = meme.lines[idx]?.txt || ''

    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
    if (idx >= 0) {
        const el = gOverlayEls[idx]
        if (el) el.style.outline = '2px solid rgba(255,255,255,.65)'
        enableSizeButtons()
    }
}

function onDeselectLine() {
    const meme = getMeme()
    meme.selectedLineIdx = -1
    gElInput.value = ''
    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
    disableSizeButtons()
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

function onColorChange(e) {
    const meme = getMeme()
    const color = e.target.value
    const idx = meme.selectedLineIdx
    if (idx === -1) return

    updateLineColor(color, idx)

    const el = gOverlayEls[idx]
    if (el) el.style.color = color
}

function onSizeChange(delta) {
    const meme = getMeme()
    const idx = meme.selectedLineIdx

    if (idx === -1 || !meme.lines[idx]) return

    updateLineSize(delta, idx)

    const el = gOverlayEls[idx]
    if (el) el.style.fontSize = meme.lines[idx].size + 'px'
}

function onAlignChange(align) {
    const meme = getMeme()
    const idx = meme.selectedLineIdx
    if (idx === -1 || !meme.lines[idx]) return

    updateLineAlign(align, idx)

    const el = gOverlayEls[idx]
    if (el) el.style.textAlign = align
}

function enableSizeButtons() {
    document.getElementById('btn-size-plus').disabled = false
    document.getElementById('btn-size-minus').disabled = false
}

function disableSizeButtons() {
    document.getElementById('btn-size-plus').disabled = true
    document.getElementById('btn-size-minus').disabled = true
}

window.onInitMeme = onInitMeme
