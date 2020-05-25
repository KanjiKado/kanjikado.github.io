/*
Lots of code borrowed from our PubSub ICE!
*/
"use strict";

var app = app || {};

//we use pubsub for everyone who cares about canvas resizes
app.container = Object.seal({
    height : 0,
    width : 0,
    box : undefined,//document.querySelector("#container"),
    subscribers : [],
    registerResizable : function(element)
    {
        this.subscribers.push(element);
    },
    unregisterResizable : function(element)
    {
        var index = this.subscribers.indexOf(element);
        this.subscribers.splice(index, 1);
    },
    resizeSubscribers : function()
    {
        this.subscribers.forEach((element,index,array)=>{
        element(this.width, this.height);});
    },
    onResize : function(width, height)
    {
        this.height = this.box.offsetHeight;
        this.width = this.box.offsetWidth;
        this.resizeSubscribers();
    },
    init : function()
    {
        this.box = document.querySelector("#container");
        this.onResize();
        window.onresize = this.onResize.bind(this);
    }
});