'use strict'

let gElBoard, gElInput
let gDrag = { isDown: false, startX: 0, startY: 0, el: null, lineIdx: -1 }
let gOverlayEls = []

function onInitMeme() {
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')

    const savedImgUrl = loadFromStorage('selected-img')
    if (savedImgUrl) {
        const imgEl = document.getElementById('meme-image')
        imgEl.src = savedImgUrl
        imgEl.onload = () => {
            memeService.drawImageOnCanvas(imgEl)
            removeFromStorage('selected-img')
        }
    }

    bindEditorEvents()
    onRebuildOverlays()
}



function bindEditorEvents() {
    document.getElementById('btn-add').addEventListener('click', onAddLine)
    document.getElementById('btn-delete').addEventListener('click', onDeleteLine)
    document.getElementById('fill-color').addEventListener('input', onColorChange)
    document.getElementById('btn-align-left').addEventListener('click', () => onAlignChange('left'))
    document.getElementById('btn-align-center').addEventListener('click', () => onAlignChange('center'))
    document.getElementById('btn-align-right').addEventListener('click', () => onAlignChange('right'))
    document.getElementById('btn-size-plus').addEventListener('click', () => onSizeChange(2))
    document.getElementById('btn-size-minus').addEventListener('click', () => onSizeChange(-2))
    document.getElementById('btn-download').addEventListener('click', onDownloadMeme)
    document.getElementById('btn-share').addEventListener('click', onShareMeme)
    gElInput.addEventListener('input', onInputChange)
    document.getElementById('font-family').addEventListener('input', onFontChange)
    gElBoard.addEventListener('click', ev => {
        if (!ev.target.classList.contains('overlay-text')) onDeselectLine()
    })
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)
}

function onAddLine() {
    const txt = gElInput.value.trim()
    if (!txt) return
    memeService.addLine(txt, document.getElementById('fill-color').value, document.getElementById('font-family').value)
    onRebuildOverlays()
    onSelectLine(memeService.getMeme().selectedLineIdx)
    gElInput.focus(); gElInput.select()
}

function onDeleteLine() {
    const meme = memeService.getMeme()
    if (!meme.lines.length) return
    memeService.removeLine(meme.selectedLineIdx)
    onRebuildOverlays()
    meme.lines.length ? onSelectLine(meme.selectedLineIdx) : (gElInput.value = '', onDisableSizeButtons())
}

function onInputChange(e) {
    const meme = memeService.getMeme()
    if (!meme.lines.length) return
    memeService.updateLineTxt(e.target.value, meme.selectedLineIdx)
    const el = gOverlayEls[meme.selectedLineIdx]
    if (el) el.textContent = e.target.value
}

function onRebuildOverlays() {
    gOverlayEls.forEach(el => el && el.remove())
    gOverlayEls = []
    memeService.getMeme().lines.forEach((line, idx) => onCreateFloating(line, idx))
}

function onCreateFloating(line, idx) {
    const el = document.createElement('div')
    el.className = 'overlay-text'
    el.textContent = line.txt
    el.style.left = (line.x || 40) + 'px'
    el.style.top = (line.y || 40) + 'px'
    el.style.color = line.color
    el.style.fontSize = line.size + 'px'
    el.style.fontFamily = line.font || 'impact'
    el.style.textAlign = line.align || 'center'
    el.style.position = 'absolute'
    el.style.cursor = 'move'
    el.addEventListener('mousedown', ev => { ev.preventDefault(); onDragStart(ev, el, idx) })
    gElBoard.appendChild(el)
    gOverlayEls[idx] = el
}

function onSelectLine(idx) {
    memeService.setSelectedLineIdx(idx)
    const meme = memeService.getMeme()
    document.getElementById('font-family').value = meme.lines[idx]?.font || 'impact'
    document.getElementById('fill-color').value = meme.lines[idx]?.color || '#ffffff'
    gElInput.value = meme.lines[idx]?.txt || ''
    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
    if (idx >= 0) { const el = gOverlayEls[idx]; if (el) el.style.outline = '2px solid rgba(255,255,255,.65)'; onEnableSizeButtons() }
}

function onDeselectLine() {
    memeService.getMeme().selectedLineIdx = -1
    gElInput.value = ''
    gOverlayEls.forEach(el => el && (el.style.outline = 'none'))
    onDisableSizeButtons()
}

function onDragStart(ev, el, idx) {
    gDrag.isDown = true
    const boardRect = gElBoard.getBoundingClientRect()
    gDrag.startX = ev.pageX - boardRect.left - el.offsetLeft
    gDrag.startY = ev.pageY - boardRect.top - el.offsetTop
    gDrag.el = el
    gDrag.lineIdx = idx
    onSelectLine(idx)
}

function onDragMove(ev) {
    if (!gDrag.isDown || !gDrag.el) return
    const boardRect = gElBoard.getBoundingClientRect()
    let x = ev.pageX - boardRect.left - gDrag.startX
    let y = ev.pageY - boardRect.top - gDrag.startY
    const maxX = gElBoard.clientWidth - gDrag.el.offsetWidth
    const maxY = gElBoard.clientHeight - gDrag.el.offsetHeight
    x = Math.max(0, Math.min(x, maxX))
    y = Math.max(0, Math.min(y, maxY))
    gDrag.el.style.left = x + 'px'
    gDrag.el.style.top = y + 'px'
    memeService.updateLinePos(gDrag.lineIdx, x, y)
}

function onDragEnd() { gDrag.isDown = false; gDrag.el = null; gDrag.lineIdx = -1 }

function onColorChange(e) {
    const idx = memeService.getMeme().selectedLineIdx
    if (idx === -1) return
    memeService.updateLineColor(e.target.value, idx)
    const el = gOverlayEls[idx]
    if (el) el.style.color = e.target.value
}

function onSizeChange(delta) {
    const idx = memeService.getMeme().selectedLineIdx
    if (idx === -1) return
    memeService.updateLineSize(delta, idx)
    const el = gOverlayEls[idx]
    if (el) el.style.fontSize = memeService.getMeme().lines[idx].size + 'px'
}

function onAlignChange(align) {
    const idx = memeService.getMeme().selectedLineIdx
    if (idx === -1) return
    memeService.updateLineAlign(align, idx)
    const el = gOverlayEls[idx]
    if (el) el.style.textAlign = align
}

function onFontChange(e) {
    const idx = memeService.getMeme().selectedLineIdx
    if (idx === -1) return
    memeService.updateLineFont(e.target.value, idx)
    const el = gOverlayEls[idx]
    if (el) el.style.fontFamily = e.target.value
}

function onEnableSizeButtons() {
    document.getElementById('btn-size-plus').disabled = false
    document.getElementById('btn-size-minus').disabled = false
}

function onDisableSizeButtons() {
    document.getElementById('btn-size-plus').disabled = true
    document.getElementById('btn-size-minus').disabled = true
}

function onDownloadMeme(ev) {
    ev.preventDefault()
    memeService.exportMeme(canvas => {
        const link = document.createElement('a')
        link.download = 'my-meme.jpg'
        link.href = canvas.toDataURL('image/jpeg')
        link.click()
    })
}

function onShareMeme(ev) {
    ev.preventDefault()

    const elBoard = document.querySelector('.meme-board')
    const canvasEl = document.getElementById('meme-canvas')
    const overlayEls = document.querySelectorAll('.overlay-text')

    canvasEl.style.display = 'none'
    overlayEls.forEach(el => el.classList.add('no-reflection'))

    memeService.exportMeme(canvas => {
        memeService.uploadImg(canvas.toDataURL('image/jpeg', 0.95), url => {
            const encoded = encodeURIComponent(url)
            document.getElementById('share-result').innerHTML = `
        <a href="${url}" target="_blank" class="share-link">View meme</a>
        <button button class="btn btn-facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encoded}', '_blank')">
        Share on Facebook
        </button>`
        })

        canvasEl.style.display = 'block'
        overlayEls.forEach(el => el.classList.remove('no-reflection'))
    })
}


window.onInitMeme = onInitMeme
