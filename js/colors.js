"use strict";

var colors = {};

colors.defaultDuration = -1;//1.5;
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
        this.hwb[0] = (rgb[(maxIdx+1)%3] - rgb[(maxIdx+2)%3]) / (max - min) + 2 * maxIdx;
        this.hwb[0] = (this.hwb[0] + 6) % 6; //ensure positive
        this.hwb[1] = min;
        this.hwb[2] = 255 - max;
    }
    //https://github.com/Qix-/color/blob/master/index.js
    this.Rotate = function(deg)
    {
        this.hwb[0] = (this.hwb[0] + deg/360 + 6) % 6;
    }
    //http://alvyray.com/Papers/CG/hwb2rgb.htm
    this.ToRgb = function()
    {
        var v = 255-this.hwb[2];
        var i = Math.floor(this.hwb[0]);
        var f = this.hwb[0] - i;
        var w = this.hwb[1];
        var n;
        if(i&1){
            //can maybe do something like f = 1 - f; to be more efficient
            n = (1-f)*v + f * w;
        } else
            n = (1-f)*w + f * v;
        switch(i){
            case 6: 
            case 0: return [v, n, w];
            case 1: return [n, v, w];
            case 2: return [w, v, n];
            case 3: return [w, n, v];
            case 4: return [n, w, v];
            case 5: return [v, w, n];
            default: return null;
        }
    }
    this.ToHex = function()
    {
        var rgb = this.ToRgb();
        var pre = (Math.round(rgb[2])+Math.round(rgb[1])*256+Math.round(rgb[0])*65536).toString(16);
        while(pre.length < 6)
        pre= '0'+pre;
        return '#'+pre;
    }
    this.FromHex(inputHex);
}

colors.Shuffle = function(duration, speed)
{
    //clear existing method
    if(colors.timeout)
        clearTimeout(colors.timeout)
    
    //choose a psuedo-random direction
    //if(!direction)
    //    direction = Math.random();
    
    var letter = 'A';
    for(var i in colors.colors)
    {
        var color = colors.colors[i];
        color.Rotate(speed);
        var hex = color.ToHex();
        if(letter=='A')
            console.log(color.hwb);
        root.style.setProperty('--color'+letter, hex);
        letter = increment(letter);
    }
    
    //apply the rotation
    if(duration< 0 || duration > colors.frameLength)
    colors.timeout = setTimeout(colors.Shuffle, colors.frameLength*1000, duration - colors.frameLength, speed);
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
                 
colors.timeout = colors.Shuffle(colors.defaultDuration, 3);