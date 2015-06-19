module hashApp {

    /**
     * Initialization
     */
    export function init () {
        imageMod.loadImages();
        bindEvents();

        nerve.on('image-loaded', function(){
            console.log('Image loaded');
        });
    }

    /**
     * Bind events to the buttons
     */
    function bindEvents () {
        document.getElementById('btn-prev')
            .addEventListener('click', function(){
                imageMod.showPrevImage();
            });

        document.getElementById('btn-next')
            .addEventListener('click', function(){
                imageMod.showNextImage();
            });
    }

}