export const SoundExtension = setFormat();

/** @returns {string} */
function setFormat() {
    return new Audio().canPlayType('audio/mp3') ? '.mp3' : '.ogg';
}
