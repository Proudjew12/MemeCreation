'use strict'

const galleryService = {
    getFolders,
    getImagesForFolder,
    getAllImages
}

function getFolders() {
    return {
        CartoonMan: 38,
        Dog: 5,
        Cat: 3,
        Clown: 13,
        Man: 23,
        Women: 8,
        Pepe: 24,
        SpongeBob: 17
    }
}

function getImagesForFolder(folderName, count) {
    const images = []
    for (let i = 1; i <= count; i++) {
        images.push({
            folder: folderName.toLowerCase(),
            name: `${folderName} ${i}.jpg`,
            src: `img/${folderName}/${folderName} ${i}.jpg`
        })
    }
    return images
}

function getAllImages() {
    const folders = getFolders()
    const all = []
    for (const folder in folders) {
        all.push(...getImagesForFolder(folder, folders[folder]))
    }
    return all
}

window.galleryService = galleryService
