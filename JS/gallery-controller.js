'use strict'

function onRenderGallery() {
    onRenderTags()
    onRenderGalleryImages()
}

function onRenderTags() {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        const randomSize = Math.floor(Math.random() * 10) + 14
        tag.style.fontSize = `${randomSize}px`

        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'))
            tag.classList.add('active')
        })
    })
}

function onRenderGalleryImages() {
    const elGallery = document.getElementById('gallery-container')
    elGallery.innerHTML = ''

    const folders = getGalleryFolders()

    for (const folder in folders) {
        const images = getImagesForFolder(folder, folders[folder])

        images.forEach(image => {
            const img = document.createElement('img')
            img.src = image.src
            img.alt = image.alt

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
}
