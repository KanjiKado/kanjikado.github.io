"use strict";

var colors = {};

colors.defaultDuration = 1.5;
colors.frameLength = 1/30;

var root = document.documentElement;

//helper functions
var increment = function(letter)
{
    return String.fromCharCode(letter.charCodeAt(0)+1);
}

//class functions
function HWBColor(inputHex)
{
    this.hwb = [0,0,0];
    //https://gist.github.com/lrvick/2080648
    this.FromHex = function(hex) {
        var bin = parseInt(hex, 16);
        var rgb = [bin >> 16, bin >> 8 & 0xff, bin & 0xff];
        var max = Math.max(...rgb);
        var min = Math.min(...rgb);
        
        var maxIdx = rgb.indexOf(max);
        //ie max r : h = (g - b) / range * 60 + 0
        this.hwb[0] = (rgb[(maxIdx+1)%3] - rgb[(maxIdx+2)%3]) / (max - min) * 60 + 120 * maxIdx;
        this.hwb[0] = (this.hwb[0] + 360) % 360; //ensure positive
        this.hwb[1] = min;
        this.hwb[2] = 255 - max;
    }
    //https://github.com/Qix-/color/blob/master/index.js
    this.Rotate = function(deg)
    {
        this.hwb[0] = (this.hwb[0] + deg + 360) % 360;
    }
    //http://alvyray.com/Papers/CG/hwb2rgb.htm
    this.ToRgb = function()
    {
        var v = Math.round(255-this.hwb[2]);
        var i = Math.floor(this.hwb[0]/60);
        var f = this.hwb[0]/60 - i;
        if(!(i % 1)) f = 1 - f;
        var w = this.hwb[1];
        var n = this.hwb[2] + Math.round(f * (v - w));
        switch(i){
            case 6: 
            case 0: return [v, n, w];
            case 1: return [n, v, w];
            case 2: return [w, v, n];
            case 3: return [w, n, v];
            case 4: return [n, w, v];
            case 5: return [v, w, n];
        }
    }
    this.ToHex = function()
    {
        var rgb = this.ToRgb();
        
        return '#'+(rgb[2]+rgb[1]*256+rgb[0]*65536).toString(16);
    }
    this.FromHex(inputHex);
}

colors.Shuffle = function(duration, direction)
{
    //clear existing method
    if(colors.timeout)
        clearTimeout(colors.timeout)
    
    //choose a psuedo-random direction
    if(!direction)
        direction = Math.random();
    
    var letter = 'A';
    for(var i in colors.colors)
    {
        var color = colors.colors[i];
        color.Rotate(3);
        var hex = color.ToHex();
        root.style.setProperty('--color'+letter, hex);
        letter = increment(letter);
    }
    
    //apply the rotation
    if(duration > colors.frameLength)
    colors.timeout = setTimeout(colors.Shuffle, colors.frameLength*1000, duration - colors.frameLength);
    //else
        //colors.timeout = 0 or something
}

colors.Cache = function()
{
    colors.colors = [];
    var letter = 'A';
    do{
        var value = getComputedStyle(root).getPropertyValue('--color'+letter);
        if(value)
            colors.colors.push(new HWBColor(value.substring(2)));
        letter = increment(letter);
    } while(value);
        
}
    
colors.Cache();
                 
colors.timeout = colors.Shuffle(colors.defaultDuration);