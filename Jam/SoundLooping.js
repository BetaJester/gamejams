import { SoundExtension } from './SoundExtension.js';

// Concept from Hands-On Intro to Game Programming-v5 p386.
export class SoundLooping {
    
    /** @param {string} filename */
    constructor(filename) {
        this._channel = new Audio(filename+SoundExtension);
        this._channel.loop = true;
    }

    /** @param {boolean} isPlaying */
    setIsPlaying(isPlaying) {
        if (isPlaying) {
            this._channel.play();
        } else {
            this._channel.pause();
        }
    }

    /** @param {number} volume */
    setVolume(volume) {
        this._channel.volume = volume;
    }
}