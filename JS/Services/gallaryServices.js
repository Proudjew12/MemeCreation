'use strict'

function getGalleryFolders() {
    return {
        CartoonMan: 39,
        Dog: 5,
        Cat: 3,
        Clown: 13,
        Man: 23,
        Women: 8,
        Pepe: 24,
        SpongeBob: 17,
    }
}

function getImagesForFolder(folderName, count) {
    const images = []
    for (let i = 1; i <= count; i++) {
        images.push({
            folder: folderName,
            name: `${folderName} ${i}.jpg`,
            src: `img/${folderName}/${folderName} ${i}.jpg`,
        })
    }
    return images
}

function getAllGalleryImages() {
    const folders = getGalleryFolders()
    const allImages = []

    for (const folder in folders) {
        const images = getImagesForFolder(folder, folders[folder])
        allImages.push(...images)
    }

    return allImages
}
