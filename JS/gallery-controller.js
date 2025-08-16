'use strict'

let gAllImages = []
let gActiveTag = null
let gSearchTerm = ''

function onRenderGallery() {
    gAllImages = galleryService.getAllImages()
    onRenderTags()
    onSetupSearchInput()
    onRenderGalleryImages()
}

function onRenderTags() {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.style.fontSize = `${Math.floor(Math.random() * 10) + 14}px`
        tag.addEventListener('click', () => onToggleTag(tag, tags))
    })
}

function onToggleTag(tag, tags) {
    const clicked = tag.textContent.toLowerCase()
    if (gActiveTag === clicked) {
        gActiveTag = null
        tag.classList.remove('active')
    } else {
        tags.forEach(t => t.classList.remove('active'))
        tag.classList.add('active')
        gActiveTag = clicked
    }
    onRenderGalleryImages()
}

function onSetupSearchInput() {
    const input = document.querySelector('.search-bar input')
    input.addEventListener('input', e => {
        gSearchTerm = e.target.value.toLowerCase()
        onRenderGalleryImages()
    })
}

function onRenderGalleryImages() {
    const elGallery = document.getElementById('gallery-container')
    elGallery.innerHTML = ''

    const filtered = gAllImages.filter(img => {
        const matchTag = !gActiveTag || img.folder === gActiveTag
        const matchSearch = !gSearchTerm || img.name.toLowerCase().includes(gSearchTerm)
        return matchTag && matchSearch
    })

    filtered.forEach(image => {
        const wrapper = document.createElement('div')
        wrapper.classList.add('gallery-item')

        const img = document.createElement('img')
        img.src = image.src
        img.alt = image.name
        img.addEventListener('click', () => onSelectImage(image.src))

        wrapper.appendChild(img)
        elGallery.appendChild(wrapper)
    })
}

function onSelectImage(src) {
    localStorage.setItem('selected-img', src)
    window.location.href = 'index.html'
}
