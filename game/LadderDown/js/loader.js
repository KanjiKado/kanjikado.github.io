"use strict";

var app = app || {};
(function(){
    //race conditions yayy!
    var pageLoaded = false;
    var preLoaded = false;
    
    //using our preload js code
    
    function prePageLoad()
    {
        window.onload = function() {
            if(preLoaded)
                init();
            pageLoaded = true;
        };
        var preload = new createjs.LoadQueue();
        preload.addEventListener("fileload", handleFileComplete);
        preload.addEventListener("complete", handleQueueComplete);
        preload.addEventListener("progress", handleProgress);
        //scripts
        preload.loadFile("js/libs/matter.min.js", false);
        preload.loadFile("js/libs/bounce.min.js", false);
        preload.loadFile("js/container.js", false);
        preload.loadFile("js/keys.js", false);
        preload.loadFile("js/ui.js", false);
        preload.loadFile("js/main.js", false);
        preload.load();
    }
    function handleFileComplete(event)
    {
        document.body.appendChild(event.result);
    }
    function handleQueueComplete(event)
    {
        preLoaded = true;
        if(pageLoaded)
        {
            init();
        }
    }
    function handleProgress(event)
    {
        console.log(event.loaded);
    }
    function init(){
        app.container.init();
        app.ui.init();
        app.main.init();
        //we've initialized all of the properties, seal.
        Object.seal(app);
    }
    prePageLoad();
})();