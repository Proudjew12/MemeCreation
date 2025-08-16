'use strict'

function createMemeService() {
    let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]

    let gMeme = {
        selectedImgId: 5,
        selectedLineIdx: 0,
        lines: []
    }

    let gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

    function getMeme() { return gMeme }

    function addLine(txt, color = 'red', font = 'impact') {
        const line = { txt, size: 20, color, font, align: 'center', x: 40, y: 40 }
        gMeme.lines.push(line)
        gMeme.selectedLineIdx = gMeme.lines.length - 1
        return line
    }

    function removeLine(idx = gMeme.selectedLineIdx) {
        if (!gMeme.lines.length) return
        gMeme.lines.splice(idx, 1)
        gMeme.selectedLineIdx = Math.max(0, gMeme.lines.length - 1)
    }

    function setSelectedLineIdx(idx) {
        if (idx >= 0 && idx < gMeme.lines.length) gMeme.selectedLineIdx = idx
    }

    function updateLineTxt(txt, idx = gMeme.selectedLineIdx) {
        if (gMeme.lines[idx]) gMeme.lines[idx].txt = txt
    }

    function updateLinePos(idx, x, y) {
        if (gMeme.lines[idx]) { gMeme.lines[idx].x = x; gMeme.lines[idx].y = y }
    }

    function updateLineColor(color, idx = gMeme.selectedLineIdx) {
        if (gMeme.lines[idx]) gMeme.lines[idx].color = color
    }

    function updateLineSize(delta, idx = gMeme.selectedLineIdx) {
        if (gMeme.lines[idx]) gMeme.lines[idx].size = Math.max(8, gMeme.lines[idx].size + delta)
    }

    function updateLineAlign(align, idx = gMeme.selectedLineIdx) {
        if (gMeme.lines[idx]) gMeme.lines[idx].align = align
    }

    function updateLineFont(font, idx = gMeme.selectedLineIdx) {
        if (gMeme.lines[idx]) gMeme.lines[idx].font = font
    }

    function drawImageOnCanvas(img) {
        const canvas = document.getElementById('meme-canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const imgRatio = img.naturalWidth / img.naturalHeight
        const canvasRatio = canvas.width / canvas.height
        let w, h, x, y
        if (imgRatio > canvasRatio) { w = canvas.width; h = w / imgRatio; x = 0; y = (canvas.height - h) / 2 }
        else { h = canvas.height; w = h * imgRatio; x = (canvas.width - w) / 2; y = 0 }
        ctx.drawImage(img, x, y, w, h)
    }

    function exportMeme(cb) {
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
                cb(exportCanvas)
                canvasEl.style.display = 'block'
                overlayEls.forEach(el => el.classList.remove('no-reflection'))
            })
    }

    function uploadImg(imgDataUrl, onSuccess) {
        const CLOUD_NAME = 'webify'
        const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        const UPLOAD_PRESET = 'webify'
        const formData = new FormData()
        formData.append('file', imgDataUrl)
        formData.append('upload_preset', UPLOAD_PRESET)
        fetch(UPLOAD_URL, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => onSuccess(data.secure_url))
            .catch(() => alert('Upload failed. Try downloading instead.'))
    }

    return {
        getMeme,
        addLine,
        removeLine,
        setSelectedLineIdx,
        updateLineTxt,
        updateLinePos,
        updateLineColor,
        updateLineSize,
        updateLineAlign,
        updateLineFont,
        drawImageOnCanvas,
        exportMeme,
        uploadImg
    }
}

window.memeService = createMemeService()
