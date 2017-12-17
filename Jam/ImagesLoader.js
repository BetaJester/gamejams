// Set automagically based on setupLoadImages.
// Based on code learned in https://www.udemy.com/how-to-program-games/ - seriously.

export class ImagesLoaderItem {
    /** @param {string} fileName */
    constructor(fileName) {
        this.fileName = fileName;
        this.image = new Image();
    }
}

export class ImagesLoader {

    /**
     * 
     * @param {Array<ImagesLoaderItem>} imageList 
     * @param {string} path 
     */
    constructor(imageList, path) {
        this.imageList = imageList;
        this.path = path;
        this._picsToLoad = 0;
        this.onDone = null;
    }

    _imageOnLoad() {
        this._picsToLoad--;
        if (this._picsToLoad == 0) {
            this.onDone();
        }
    }

    /** @param {ImagesLoaderItem} listItem */
    _beginLoadingImage(listItem) {
        listItem.image.onload = this._imageOnLoad.bind(this);
        listItem.image.src = this.path + listItem.fileName;
    }

    beginLoading() {
        this._picsToLoad = this.imageList.length;
        for (let listItem of this.imageList) {
            this._beginLoadingImage(listItem);
        }
        return this.imageList.length;
    }
}