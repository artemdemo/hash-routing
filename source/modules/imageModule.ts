interface imgDataObjInterface {
    id: string;
    url: string;
}

module hashApp.imageMod {
    var imagesUrlList: Array<imgDataObjInterface> = [
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
     * Previous image ID - index
     */
    var prevImgID: number;

    /**
     * Animation duration
     * @type {number}
     */
    var animDuration: number = 600;

    /**
     * Determine whether slides are currently animating or not
     * @type {boolean}
     */
    var isAnimating: boolean = false;

    /**
     * Animation timeouts - I need to be able to cancel them
     * @type {Array}
     */
    var animTimeouts: Array<number> = [];

    enum Direction {prev, next}

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

        history.init();

        nerve.on('history', 'next', function( state ){
            showImage( state.id, Direction.next );
        });

        nerve.on('history', 'prev', function( state ){
            showImage( state.id, Direction.prev );
        });
    }

    /**
     * Show next image
     */
    export function showNextImage () {
        if ( ! showImage( currentImgID + 1, Direction.next ) )
            showImage( 0, Direction.next );

        history.saveState( String( currentImgID ) );
    }

    /**
     * Show previous image
     */
    export function showPrevImage () {
        if ( ! showImage( currentImgID - 1, Direction.prev ) )
            showImage( imagesArr.length - 1, Direction.prev );

        history.saveState( String( currentImgID ) );
    }


    /**
     * Show image - general function
     * @param id
     * @param direction
     * @param animation
     * @return {boolean}
     */
    function showImage ( id:number = 0, direction: Direction = Direction.next, animation: boolean = true ) {

        var showOutClass: string,
            showInClass: string;

        if ( typeof imagesArr[id] == 'undefined' ) return false;

        switch ( true ) {

            // animation NEXT
            case direction == Direction.next:

                showOutClass = 'showOutLeft';
                showInClass = 'showInRight';

                break;

            // animation PREV
            case direction == Direction.prev:
                showOutClass = 'showOutRight';
                showInClass = 'showInLeft';

                break;
        }


        // If currentImgID is undefined - that's mean that it is first slide and I need to show it without animation
        // Same for 'animation' @param
        if ( typeof currentImgID == 'undefined' ) {
            helper.addClass( 'show', imagesArr[ 0 ].$imgLi );
            currentImgID = 0;
            return true;
        }

        /**
         * If there is animation in process and user still clicked to change slide
         * I need to cancel animation and change fast to the next slide
         */
        if ( isAnimating === true ) {
            imagesArr[ currentImgID ].$imgLi.className = 'show';
            imagesArr[ prevImgID ].$imgLi.className = '';

            clearAllTimeouts();
            isAnimating = false;
            return true;
        }

        isAnimating = true;

        helper.addClass( showOutClass, imagesArr[ currentImgID ].$imgLi );

        // I'm using IIFE, otherwise currentImgID will be changed by the time setTimeout will fire
        (function(currentImgID, id){
            var timerID:number;
            timerID = setTimeout(function(){
                helper.removeClass( 'show', imagesArr[ currentImgID ].$imgLi );
                helper.removeClass( showOutClass, imagesArr[ currentImgID ].$imgLi );
            }, animDuration);

            animTimeouts.push(timerID);

            // I'm adding showInRight class faster, case it will feel better for user
            timerID = setTimeout(function(){
                var timerID:number;

                helper.addClass( 'show', imagesArr[ id ].$imgLi );
                helper.addClass( showInClass, imagesArr[ id ].$imgLi );

                // After image has been added I need to remove animation class
                timerID = setTimeout(function(){
                    helper.removeClass( showInClass, imagesArr[ id ].$imgLi );
                    isAnimating = false;
                }, animDuration);

                animTimeouts.push(timerID);

            }, animDuration / 3 );

            animTimeouts.push(timerID);

        })(currentImgID, id);

        prevImgID = currentImgID;
        currentImgID = id;
        return true;
    }

    /**
     * Clear all animation timers
     */
    function clearAllTimeouts() {
        animTimeouts.forEach(function( timerID ){
            clearTimeout(timerID);
        });

        animTimeouts = [];
    }

    /**
     * Return image object by the given ID
     * @param imageObjID - inner id of the image
     * @returns {*}
     */
    function getImageByObjID ( imageObjID: string ) {
        for ( var i=0, len=imagesArr.length; i<len; i++ ) {
            var img = imagesArr[i];
            if ( imageObjID == imagesArr[i].imgData.id ) return img;
        }
        return null
    }


    /****************************************
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
            nerve.send('image-loaded');
        }
    }
}