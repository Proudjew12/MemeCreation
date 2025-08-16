'use strict'

let gAllImages = []
let gActiveTag = null
let gSearchTerm = ''

function onRenderGallery() {
    gAllImages = getAllGalleryImages()
    onRenderTags()
    onSetupSearchInput()
    onRenderGalleryImages()
}

function onRenderTags() {
    const tags = document.querySelectorAll('.tag')

    tags.forEach(tag => {
        const randomSize = Math.floor(Math.random() * 10) + 14
        tag.style.fontSize = `${randomSize}px`

        tag.addEventListener('click', () => {
            const clickedTag = tag.textContent.toLowerCase()

            if (gActiveTag === clickedTag) {
                gActiveTag = null
                tag.classList.remove('active')
            } else {
                tags.forEach(t => t.classList.remove('active'))
                tag.classList.add('active')
                gActiveTag = clickedTag
            }

            onRenderGalleryImages()
        })
    })
}


function onSetupSearchInput() {
    const input = document.querySelector('.search-bar input')
    input.addEventListener('input', (e) => {
        gSearchTerm = e.target.value.toLowerCase()
        onRenderGalleryImages()
    })
}

function onRenderGalleryImages() {
    const elGallery = document.getElementById('gallery-container')
    elGallery.innerHTML = ''

    const filtered = gAllImages.filter(img => {
        const matchTag = !gActiveTag || img.folder.toLowerCase() === gActiveTag
        const matchSearch = !gSearchTerm || img.name.toLowerCase().includes(gSearchTerm)
        return matchTag && matchSearch
    })

    filtered.forEach(image => {
        const img = document.createElement('img')
        img.src = image.src
        img.alt = image.name

        const wrapper = document.createElement('div')
        wrapper.classList.add('gallery-item')
        wrapper.appendChild(img)

        img.addEventListener('click', () => {
            localStorage.setItem('selected-img', image.src)
            window.location.href = 'index.html'
        })

        elGallery.appendChild(wrapper)
    })
}
