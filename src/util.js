import {globals} from './globals'

export function hideStartmenu() {
    let startmenuContainer = document.getElementById('startmenu-container')
    if (startmenuContainer.style.display !== 'none') {
        startmenuContainer.style.opacity = '0'
        setTimeout(() => {
            startmenuContainer.style.display = 'none'
        }, 2000)
    }
}

export function showPauseMenu() {
    let pausemenuContainer = document.getElementById('pausemenu-container')
    if (pausemenuContainer.style.display === 'none') {
        pausemenuContainer.style.opacity = '1'
        setTimeout(() => {
            pausemenuContainer.style.display = 'block';
            globals.OUTER_CIRCLE = 'none';
        }, 100)
    }
}

export function hidePauseMenu() {
    let pausemenuContainer = document.getElementById('pausemenu-container')
    if (pausemenuContainer.style.display !== 'none') {
        pausemenuContainer.style.opacity = '1'
        setTimeout(() => {
            pausemenuContainer.style.display = 'none';
            globals.OUTER_CIRCLE = 'block';
        }, 100)
    }
}

export function showItemList() {
    let itemContainer = document.getElementById('items-container')
    if (itemContainer.style.display === 'none') {
        itemContainer.style.opacity = '1'
        setTimeout(() => {
            itemContainer.style.display = 'block';
            globals.OUTER_CIRCLE = 'none';
        }, 100)
    }
}

export function hideItemList() {
    let itemContainer = document.getElementById('items-container')
    if (itemContainer.style.display !== 'none') {
        itemContainer.style.opacity = '1'
        setTimeout(() => {
            itemContainer.style.display = 'none'
            globals.OUTER_CIRCLE = 'block';
        }, 100)
    }
}
 