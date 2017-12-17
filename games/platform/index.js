import { Engine } from '../../Jam/Engine';

/** @type {Engine} */
let game;

window.onload = function() {
    const DEBUG_STATUS = true;
    //game = new Engine(document.getElementById('theCanvas'), , DEBUG_STATUS);
    game.go();
};