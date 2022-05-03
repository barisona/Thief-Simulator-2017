import { globals } from './globals';
import STARTMENU_HTML from './startmenu.html'
import PAUSEMENU_HTML from './pausemenu.html'

export function loadHTML(canvas, minimapCanvas){
    canvas.style.display = 'block'; // Removes padding below canvas
    //countdown setup
    var timer = document.createElement('div');
    //timer.style.cssText =
    //'position:absolute;width:100%;height:100%;opacity:1;z-index:100;';
    timer.style.cssText =
    'position:absolute;text-align:center;padding:20px;font-size:30px;color:white;font-family:Helvetica;width:100%;height:100%;opacity:1;z-index:100;';
    globals.TIMER = timer;


    document.body.appendChild(timer);
    var endofgame = document.createElement('div');
    //timer.style.cssText =
    //'position:absolute;width:100%;height:100%;opacity:1;z-index:100;';
    endofgame.style.cssText =
    'position:absolute;text-align:center;padding-top:300px;font-size:100px;color:white;font-family:Helvetica;width:100%;height:100%;opacity:1;z-index:100;';
    document.body.appendChild(endofgame);
    globals.END_OF_GAME = endofgame;
    //end countdown setup

    document.body.appendChild(canvas);
    minimapCanvas.style.position = 'absolute';
    minimapCanvas.style.top = '50px';
    minimapCanvas.style.right = '50px';

    document.body.appendChild(minimapCanvas);

    let startmenuContainer = document.createElement('div');
    startmenuContainer.id = 'startmenu-container';
    startmenuContainer.innerHTML = STARTMENU_HTML;
    // console.log(STARTMENU_HTML);
    document.body.appendChild(startmenuContainer);

    let pausemenuContainer = document.createElement('div');
    pausemenuContainer.id = 'pausemenu-container';
    pausemenuContainer.innerHTML = PAUSEMENU_HTML;
    document.body.appendChild(pausemenuContainer);
    pausemenuContainer.style.display = 'none'

    let itemsContainer = document.createElement('div');
    itemsContainer.id = 'items-container';
    itemsContainer.innerHTML = '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100;1,300&family=Poppins&display=swap" rel="stylesheet"><style>#items-container {position: fixed;background-color: rgba(0,0,0,0.5);bottom: 0;right: 0;left: 0;top: 0;opacity: 1;transition: 1s;}#items {padding-top: 5%;width: 50%;color: #ffffff;text-align: center;font-family: Poppins, sans-serif;font-size: 14px;line-height: 40px;cursor: pointer;text-align: center;margin-left: auto;margin-right: auto;}</style><div id="items"><br /><br /><br /><br /><span style="font-size:2em; font-weight: 300; font-family: Montserrat, sans-serif; font-style: italic;">Items to steal:</span><br /><br />Guitar<br/>Diamonds<br/><br/></div>';
    document.body.appendChild(itemsContainer);
    globals.ITEMSLISTHTML = itemsContainer;
    itemsContainer.style.display = 'none'


    // crosshair making
/*     const yongweiCrosshair = document.createElement('div');
    const img = document.createElement("img");
    img.src = 'https://steamuserimages-a.akamaihd.net/ugc/1009312513243995585/3420F7DA31E44C3DC1A4347BDFF66E4F04416095/'
    document.body.appendChild(img);

    img.style.position = 'absolute';
    img.width = img.width / 2.5;
    let xcenter = Math.floor(window.innerWidth / 2 - img.width / 2);
    let ycenter = Math.floor(window.innerHeight / 2 - img.height / 2);
    img.style.top = ycenter + 'px';
    img.style.left = xcenter + 'px'; */
}

export function loadingBar(){
    let loadingContainer = document.createElement('div');
    loadingContainer.style.backgroundColor = 'black'
    loadingContainer.style.width = '100vw';
    loadingContainer.id = "loading-container";
    loadingContainer.style.height = '100vh';

    let mainContainer = document.createElement('div');
    mainContainer.style.position = "absolute";
    mainContainer.style.top = "50%";
    mainContainer.style.left = "50%";
    mainContainer.style.marginRight = "-50%%";
    mainContainer.style.transform = "translate(-50%, -50%)";

    let GIFContainer = document.createElement('div');
    GIFContainer.style.width = "50%";
    GIFContainer.style.margin = "30px auto";

    let loadingGIF = document.createElement('img');
    loadingGIF.style.width = "150px";
    loadingGIF.src = './src/loading.gif';
    GIFContainer.appendChild(loadingGIF);


    let loadingText = document.createElement('div');
    loadingText.innerHTML = "Please wait, your game is loading..";
    loadingText.style.fontFamily = 'Poppins, sans-serif';
    loadingText.style.textAlign = 'center';
    loadingText.style.fontSize = '20px';
    loadingText.style.color = 'white';
    loadingText.style.lineHeight = '40px';

    mainContainer.appendChild(GIFContainer);
    mainContainer.appendChild(loadingText);

    loadingContainer.appendChild(mainContainer);

    document.body.appendChild(loadingContainer);
}

export function createCrosshair(){
    // Setting crosshair

    const outerCircle = document.createElement("img");
    const innerCircle = document.createElement("img");

    outerCircle.style.borderRadius = "50%";
    outerCircle.style.width = "30px";
    outerCircle.style.height = "30px";
    outerCircle.style.border = "2px solid white";

    outerCircle.style.position = 'absolute';
    let xcenter = Math.floor(window.innerWidth / 2 - 17);
    let ycenter = Math.floor(window.innerHeight / 2 - 17);
    outerCircle.style.top = ycenter + 'px';
    outerCircle.style.left = xcenter + 'px';
    outerCircle.classList.add("outerCircle");

    innerCircle.style.borderRadius = "50%";
    innerCircle.style.top = "50%";
    innerCircle.style.left = "50%";
    innerCircle.style.transform = "translate(-50%, -50%)";
    innerCircle.style.width = "6px";
    innerCircle.style.height = "6px";
    innerCircle.style.backgroundColor = "white";
    innerCircle.style.position = 'absolute';
    innerCircle.width = innerCircle.width / 2.5;
    xcenter = Math.floor(window.innerWidth / 2);
    ycenter = Math.floor(window.innerHeight / 2 );
    innerCircle.style.top = ycenter + 'px';
    innerCircle.style.left = xcenter + 'px';
    innerCircle.classList.add("innerCircle");

    // img.src = 'https://steamuserimages-a.akamaihd.net/ugc/1009312513243995585/3420F7DA31E44C3DC1A4347BDFF66E4F04416095/'
    document.body.appendChild(innerCircle);
    document.body.appendChild(outerCircle);
    globals.OUTER_CIRCLE = outerCircle;
    globals.INNER_CIRCLE = innerCircle;
}