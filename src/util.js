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
        }, 100)
    }
}

export function showItemList() {
    let itemContainer = document.getElementById('items-container')
    let innerstart = '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100;1,300&family=Poppins&display=swap" rel="stylesheet"><style>#items-container {position: fixed;background-color: rgba(0,0,0,0.5);bottom: 0;right: 0;left: 0;top: 0;opacity: 1;transition: 1s;}#items {padding-top: 5%;width: 50%;color: #ffffff;text-align: center;font-family: Poppins, sans-serif;font-size: 14px;line-height: 40px;cursor: pointer;text-align: center;margin-left: auto;margin-right: auto;}</style><div id="items"><br /><br /><br /><br /><span style="font-size:2em; font-weight: 300; font-family: Montserrat, sans-serif; font-style: italic;">Items to steal:</span><br /><br />';
    let innerend = '<br/></div>';
    let innermid = '';
    for (let item of globals.ITEMS) {
        innermid += item + '<br/>';
    }

    if (globals.ITEMS.length == 0) {
        innermid = 'You\'re Done! Escape from the front entrance!'
    }
    globals.ITEMSLISTHTML.innerHTML = innerstart + innermid + innerend;
    if (itemContainer.style.display === 'none') {
        itemContainer.style.opacity = '1'
        setTimeout(() => {
            globals.OUTER_CIRCLE.style.display = 'none';
            globals.INNER_CIRCLE.style.display = 'none';
            itemContainer.style.display = 'block';
        }, 100)
    }
}

export function hideItemList() {
    let itemContainer = document.getElementById('items-container')
    if (itemContainer.style.display !== 'none') {
        itemContainer.style.opacity = '1'
        setTimeout(() => {
            itemContainer.style.display = 'none';
            globals.OUTER_CIRCLE.style.display = 'block';
            globals.INNER_CIRCLE.style.display = 'block';
        }, 100)
    }
}
 