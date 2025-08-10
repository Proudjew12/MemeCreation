'use strict'

function makeId(length = 6) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function getFormattedDate(time) {
    const date = new Date(time)
    return date.toDateString()
}
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}
function makeLorem(wordCount = 100) {
    const words = [
        'The', 'sky', 'above', 'the', 'port', 'was', 'the', 'color', 'of', 'television',
        'tuned', 'to', 'a', 'dead', 'channel', '.', 'All', 'this', 'happened', 'more',
        'or', 'less', '.', 'I', 'had', 'the', 'story', 'bit', 'by', 'bit', 'from',
        'various', 'people', 'and', 'as', 'generally', 'happens', 'in', 'such', 'cases',
        'each', 'time', 'it', 'was', 'a', 'different', 'story', '.', 'It', 'was',
        'a', 'pleasure', 'to', 'burn'
    ]
    let txt = ''
    while (wordCount-- > 0) {
        txt += words[getRandomInt(0, words.length)] + ' '
    }
    return txt.trim()
}
function padNum(num) {
    return num < 10 ? '0' + num : num
}
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}
