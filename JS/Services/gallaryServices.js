'use strict'

function getGalleryFolders() {
    return {
        CartoonMan: 39,
        Dog: 5,
        Cat: 3,
        Clown: 13,
        Man: 7,
        Women: 8,
        Pepe: 24,
        Spongbob: 17,
    }
}

function getImagesForFolder(folderName, count) {
    const images = []
    for (let i = 1; i <= count; i++) {
        images.push({
            src: `img/${folderName}/${folderName} ${i}.jpg`,
            alt: `${folderName} ${i}`,
        })
    }
    return images
}
