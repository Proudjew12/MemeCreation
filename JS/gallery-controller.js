'use strict'

'use strict'

function onRenderGallery() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        const randomSize = Math.floor(Math.random() * 10) + 14; // 14px to 24px
        tag.style.fontSize = `${randomSize}px`;
    });

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'))
            tag.classList.add('active')
        });
    });
}


