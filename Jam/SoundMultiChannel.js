import { SoundExtension } from './SoundExtension.js';

// Concept from Hands-On Intro to Game Programming-v5 p378.

export class SoundMultiChannel {

    /**
     * Creates an instance of SoundMultiChannel.
     * @param {string} filename 
     * @param {number} [channelCount=2] 
     */
    constructor(filename, channelCount = 2) {
        this._filename = filename;
        this._channelCount = channelCount;
        this._channels = [];
        this._currentChannel = 0;
        for (let i = 0; i < channelCount; ++i) {
            this._channels.push(new Audio(filename+SoundExtension));
        }
    }

    play() {
        this._channels[this._currentChannel].currentTime = 0;
        this._channels[this._currentChannel].play();
        if (++this._currentChannel >= this._channelCount) {
            this._currentChannel = 0;
        }
    }
}