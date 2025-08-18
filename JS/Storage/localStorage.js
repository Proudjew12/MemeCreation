'use strict'

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

function removeFromStorage(key) {
    localStorage.removeItem(key)
}

window.saveToStorage = saveToStorage
window.loadFromStorage = loadFromStorage
window.removeFromStorage = removeFromStorage
