interface imgDataObjInterface {
    id: string;
    url: string;
}

module hashApp.imageMod {
    var imagesUrlList: Array<imgDataObjInterface> = [
        {
            id: '2nzG3RAM',
            url: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11378519_476930275817046_1425363243_n.jpg'
        },
        {
            id: 'WOlnB0T2',
            url: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11254004_563635640442480_1205304710_n.jpg'
        },
        {
            id: 'gAO4KZHi',
            url: 'https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11336014_683794865082531_238137827_n.jpg'
        },
        {
            id: 'NBQPepWU',
            url: 'https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11357853_1575807749352460_1661368683_n.jpg'
        },
        {
            id: 'QPn9BVPs',
            url: 'https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11427300_1630033297214805_104885768_n.jpg'
        }
    ];

    /**
     * Images objects array
     * @type {Array}
     */
    var imagesArr = [];

    /**
     * Images  list - HTML object
     */
    var $imagesList: HTMLUListElement;

    /**
     * Current image - index
     */
    var currentImgID: number;

    /**
     * Load all images
     */
    export function loadImages () {

        $imagesList = document.createElement('ul');
        $imagesList.className += 'images-list';

        document.getElementById('images-list').appendChild( $imagesList );

        imagesUrlList.forEach(function( imageData:imgDataObjInterface ){
            imagesArr.push( new imgClass( imageData ) );
        });
        showImage();
    }

    /**
     *
     * @param id
     * @param animation
     */
    export function showImage ( id:number = 0, animation: boolean = false ) {
        imagesArr[ id ].$imgLi.className += ' show';
    }

    /**
     * Return image object by the given ID
     * @param imageObjID - inner id of the image
     * @returns {any}
     */
    export function getImageByObjID ( imageObjID: string ) {
        for ( var i=0, len=imagesArr.length; i<len; i++ ) {
            var img = imagesArr[i];
            if ( imageObjID == imagesArr[i].imgData.id ) return img;
        }
        return null
    }

    /**
     * Image Class
     */
    class imgClass {

        /**
         * LI element that contain IMG element
         */
        $imgLi: HTMLLIElement;

        imgData: imgDataObjInterface;

        constructor( imageData:imgDataObjInterface ) {
            var $img = new Image;
            $img.onload = this.onload.bind( this );
            $img.src = imageData.url;

            this.$imgLi = document.createElement('li');
            this.$imgLi.appendChild( $img );

            this.imgData = imageData;
        }

        /**
         * Callback on image loaded
         */
        onload() {
            $imagesList.appendChild( this.$imgLi );
        }
    }
}