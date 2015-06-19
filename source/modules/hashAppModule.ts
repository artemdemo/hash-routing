module hashApp {

    /**
     * Initialization
     */
    export function init () {
        imageMod.loadImages();
        bindEvents()
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