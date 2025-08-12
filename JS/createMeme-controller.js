'use strict'

let gElBoard, gElInput
let gDrag = { isDown: false, startX: 0, startY: 0, el: null, lineIdx: -1 }

function onInitMeme() {
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')

    document.getElementById('btn-add')?.addEventListener('click', onAddLine)

}

function onAddLine() {
    const txt = gElInput.value.trim()
    if (!txt) return
    const line = addLine(txt)
    const idx = getMeme().selectedLineIdx
    onCreateFloating(line.txt, idx, line.x, line.y)
    gElInput.select()
}

function onCreateFloating(txt, idx, x = 40, y = 40) {
    const el = document.createElement('div')
    el.className = 'overlay-text'
    el.textContent = txt
    el.style.position = 'absolute'
    el.style.left = x + 'px'
    el.style.top = y + 'px'
    el.style.cursor = 'move'


    el.addEventListener('mousedown', (ev) => onDragStart(ev, el, idx))
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)


    el.addEventListener('click', () => {
        const meme = getMeme()
        meme.selectedLineIdx = idx
        gElInput.value = meme.lines[idx].txt
        gElInput.focus()
        gElInput.select()
    })


    gElInput.addEventListener('input', () => {
        const meme = getMeme()
        if (meme.selectedLineIdx !== idx) return
        el.textContent = gElInput.value
        meme.lines[idx].txt = gElInput.value
    })

    gElBoard.appendChild(el)
}

function onDragStart(ev, el, idx) {
    gDrag.isDown = true
    gDrag.startX = ev.clientX - el.offsetLeft
    gDrag.startY = ev.clientY - el.offsetTop
    gDrag.el = el
    gDrag.lineIdx = idx
}

function onDragMove(ev) {
    if (!gDrag.isDown || !gDrag.el) return
    const boardRect = gElBoard.getBoundingClientRect()

    let x = ev.clientX - gDrag.startX - boardRect.left
    let y = ev.clientY - gDrag.startY - boardRect.top

    x = Math.max(0, Math.min(x, gElBoard.clientWidth - gDrag.el.offsetWidth))
    y = Math.max(0, Math.min(y, gElBoard.clientHeight - gDrag.el.offsetHeight))

    gDrag.el.style.left = x + 'px'
    gDrag.el.style.top = y + 'px'

    updateLinePos(gDrag.lineIdx, x, y)
}

function onDragEnd() {
    gDrag.isDown = false
    gDrag.el = null
    gDrag.lineIdx = -1
}


function onRenderMeme() { }
