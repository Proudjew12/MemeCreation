'use strict'

function onRenderGallery() {

    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        const randomSize = Math.floor(Math.random() * 10) + 14; // 14px to 24px
        tag.style.fontSize = `${randomSize}px`;

        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'))
            tag.classList.add('active')
        });
    });

    const elGallery = document.getElementById('gallery-container')

    const folders = {
        CartoonMan: 39,
        Dog: 5,
        Cat: 3,
        Clown: 13,
        Man: 7,
        Women: 8,
        Pepe: 24,
        Spongbob: 17,
    }

    for (const folder in folders) {
        const count = folders[folder]
        for (let i = 1; i <= count; i++) {
            const img = document.createElement('img')
            img.src = `img/${folder}/${folder} ${i}.jpg`
            img.alt = `${folder} ${i}`

            const wrapper = document.createElement('div')
            wrapper.classList.add('gallery-item')
            wrapper.appendChild(img)

            elGallery.appendChild(wrapper)
        }
    }
}
