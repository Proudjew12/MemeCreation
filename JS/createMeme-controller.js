'use strict'

let gElBoard, gElInput
let gDrag = { isDown: false, startX: 0, startY: 0, el: null, lineIdx: -1 }
let gOverlayEls = []

function onInitMeme() {
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')
    gElBoard = document.querySelector('.meme-board')
    gElInput = document.getElementById('line-input')

    const savedImgUrl = localStorage.getItem('selected-img')
    if (savedImgUrl) {
        const imgEl = document.getElementById('meme-image')
        imgEl.src = savedImgUrl
        imgEl.onload = () => {
            drawImageOnCanvas(imgEl)
            localStorage.removeItem('selected-img') // Clean up
        }
    }

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

    document.getElementById('btn-download')
        .addEventListener('click', onDownloadMeme)

    document.getElementById('btn-share')
        .addEventListener('click', onShareMeme)

    document.getElementById('btn-share')
        .addEventListener('click', onShareMeme)


    gElInput.addEventListener('input', onInputChange)

    onRebuildOverlays()

    gElBoard.addEventListener('click', (ev) => {
        if (!ev.target.classList.contains('overlay-text')) {
            onDeselectLine()
        }
    })

    document.getElementById('font-family')
        .addEventListener('input', onFontChange)

}

function drawImageOnCanvas(img) {
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    // Match canvas size to the image’s natural size
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Center the image and keep ratio
    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = canvas.width / canvas.height

    let renderWidth, renderHeight, offsetX, offsetY

    if (imgRatio > canvasRatio) {
        // Image is wider → fit width
        renderWidth = canvas.width
        renderHeight = renderWidth / imgRatio
        offsetX = 0
        offsetY = (canvas.height - renderHeight) / 2
    } else {
        // Image is taller → fit height
        renderHeight = canvas.height
        renderWidth = renderHeight * imgRatio
        offsetX = (canvas.width - renderWidth) / 2
        offsetY = 0
    }

    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)
}



function onAddLine() {
    const txt = gElInput.value.trim()
    if (!txt) return
    const color = document.getElementById('fill-color').value
    const font = document.getElementById('font-family').value
    addLine(txt, color, font)
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
    el.style.fontFamily = line.font || 'impact'
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

    document.getElementById('font-family').value = meme.lines[idx]?.font || 'impact'
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

    el.addEventListener('mousedown', ev => {
        ev.preventDefault() // 🛑 stops text highlight
        onDragStart(ev, el, idx)
    })

    gElBoard.appendChild(el)
    gOverlayEls[idx] = el
}

// only attach once
document.addEventListener('mousemove', onDragMove)
document.addEventListener('mouseup', onDragEnd)

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

    // clamp
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
function onFontChange(e) {
    const meme = getMeme()
    const font = e.target.value
    const idx = meme.selectedLineIdx
    if (idx === -1) return

    updateLineFont(font, idx)

    const el = gOverlayEls[idx]
    if (el) el.style.fontFamily = font
}
function onDownloadMeme(ev) {
    ev.preventDefault()

    const elBoard = document.querySelector('.meme-board')
    const canvasEl = document.getElementById('meme-canvas')
    const overlayEls = document.querySelectorAll('.overlay-text')

    // Hide the canvas (we don't want duplicate content)
    canvasEl.style.display = 'none'

    // Make sure overlays don't have any unnecessary styles
    overlayEls.forEach(el => el.classList.add('no-reflection'))

    html2canvas(elBoard, {
        backgroundColor: null,
        useCORS: true,
        scale: 1, // Don't auto-scale — match DOM size
        logging: false,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a')
        link.download = 'my-meme.jpg'
        link.href = canvas.toDataURL('image/jpeg')
        link.click()

        // Restore canvas + overlay
        canvasEl.style.display = 'block'
        overlayEls.forEach(el => el.classList.remove('no-reflection'))
    }).catch(err => {
        console.error('Download failed:', err)
    })
}




function onShareMeme(ev) {
    ev.preventDefault()

    const elBoard = document.querySelector('.meme-board')
    const canvasEl = document.getElementById('meme-canvas')
    const overlayEls = document.querySelectorAll('.overlay-text')

    canvasEl.style.display = 'none'
    overlayEls.forEach(el => el.classList.add('no-reflection'))

    html2canvas(elBoard, { backgroundColor: null, useCORS: true, scale: 1 })
        .then(canvas => {
            const exportCanvas = document.createElement('canvas')
            exportCanvas.width = canvas.width
            exportCanvas.height = canvas.height
            const ctx = exportCanvas.getContext('2d')
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            ctx.drawImage(canvas, 0, 0)

            uploadImg(exportCanvas.toDataURL('image/jpeg', 0.95), (url) => {
                const encoded = encodeURIComponent(url)
                document.getElementById('share-result').innerHTML = `
                    <a href="${url}" target="_blank">View uploaded meme</a>
                    <p>URL: ${url}</p>
                    <button class="btn-facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encoded}', '_blank')">
                        Share on Facebook
                    </button>`
            })

            canvasEl.style.display = 'block'
            overlayEls.forEach(el => el.classList.remove('no-reflection'))
        })
        .catch(err => console.error('Share failed:', err))
}






function onRenderMemeToCanvas() {
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')
    const img = document.getElementById('meme-image')
    const meme = getMeme()

    const board = document.querySelector('.meme-board')
    if (!img || !img.src || !board) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const boardRect = board.getBoundingClientRect()

    meme.lines.forEach(line => {
        const scaledX = (line.x / boardRect.width) * canvas.width
        const scaledY = (line.y / boardRect.height) * canvas.height

        ctx.font = `${line.size}px ${line.font || 'Impact'}`
        ctx.fillStyle = line.color || 'white'
        ctx.textAlign = line.align || 'center'
        ctx.textBaseline = 'top'


        ctx.strokeStyle = 'black'
        ctx.lineWidth = Math.max(2, line.size / 15)
        ctx.strokeText(line.txt, scaledX, scaledY)
        ctx.fillText(line.txt, scaledX, scaledY)
    })
}









window.onInitMeme = onInitMeme

