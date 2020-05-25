"use strict"

var app = app || {};

app.ui = Object.seal({
    pre : {
        obj : undefined,
        title : undefined,
        best : undefined,
        button : undefined,
        credit : undefined,
        show : function (){
            this.obj.style.display = "inline";
            var bounce = new Bounce();
            bounce.scale({
                from:{x:1, y:1},
                to:{x:1.3, y:1},
                duration:1000,
                stiffness:1,
                easing: "bounce",
                delay: 100,
                bounces: 4
            }).scale({
                from:{x:1, y:1},
                to:{x:1, y:1.3},
                duration:1000,
                stiffness:1,
                delay: 100,
                bounces: 6
            }).translate({
                from:{x:1000, y:0},
                to:{x:0, y:0},
                duration:1000,
                stiffness:2,
                delay: 0,
            }).scale({
                from:{x:1, y:1},
                to:{x:.8, y:.8},
                duration:1200,
                stiffness:2,
                delay: 100,
                bounces: 8
            }).scale({
                from:{x:0, y:3},
                to:{x:1, y:1},
                duration:2000,
                stiffness:3,
                delay: 0,
                bounces: 4
            }).applyTo(this.title);
            
            var bounce2 = new Bounce();
            bounce2.
            rotate({
                from: -90,
                to: 0,
                duration:3000,
                bounces: 4,
                delay: 0,
                stiffness:3,
            }).translate({from:{x:-1000, y:0},
                to:{x:0, y:0},
                duration:3000,
                stiffness:4,
                delay: 0,
                bounces: 4}).
            translate({from:{x:0, y:-200},
                to:{x:0, y:0},
                duration:3000,
                stiffness:3,
                delay: 0,
                easing: "sway",
                bounces: 4}).
            translate({from:{x:0, y:0},
                to:{x:0, y:150},
                duration:3000,
                stiffness:3,
                delay: 0,
                bounces: 4})
            .scale({
                from:{x:1, y:1},
                to:{x:1.2, y:1.1},
                duration:2000,
                stiffness:2,
                easing: "sway",
                delay: 300,
                bounces: 3
            }).
            applyTo(this.button);
            
            var bounce3 = new Bounce();
             bounce3.scale({
                from:{x:1, y:1.5},
                to:{x:1, y:1},
                duration:500,
                stiffness:5,
                delay: 0,
                bounces: 2,
                stiffness:1
            }).translate({
                 from:{x:0, y:-40},
                 to:{x:0, y:0},
                 duration:600,
                 delay: 0
                      })
             .translate({
                 from:{x:0, y:-60},
                 to:{x:0, y:0},
                 duration:500,
                easing: "hardbounce",
                 bounce: 0,
                 delay: 100
                      })
            .applyTo(this.credit)
        },
        hide: function()
        {
            if(this.obj.style.display!="inline")
                return;
            var bounce = new Bounce();
             bounce.scale({
                from:{x:1, y:1},
                to:{x:1, y:1.5},
                duration:500,
                stiffness:5,
                delay: 0,
                bounces: 2,
                stiffness:1
            }).translate({
                 from:{x:0, y:0},
                 to:{x:0, y:-40},
                 duration:600,
                 delay: 0
                      })
             .translate({
                 from:{x:0, y:0},
                 to:{x:0, y:-60},
                 duration:500,
                easing: "hardbounce",
                 bounce: 0,
                 delay: 100
                      })
            .applyTo(this.title,{onComplete:function(){
                app.ui.pre.obj.style.display = "none";
            }})
                 
            var bounce2 = new Bounce();
            bounce2.
            rotate({
                from: -12,
                to: 0,
                duration:3000,
                bounces: 2,
                delay: 0,
                easing: "bounce",
                stiffness:1,
            })
            .translate({from:{x:0, y:0},
                to:{x:1000, y:0},
                duration:1000,
                stiffness:3,
                delay: 0,
                bounces: 0})
            .applyTo(this.button);
            
            var bounce3 = new Bounce();
             bounce3.scale({
                from:{x:1, y:1},
                to:{y:1, x:1.5},
                duration:500,
                stiffness:5,
                delay: 0,
                bounces: 2,
                stiffness:1
            }).translate({
                 from:{x:0, y:0},
                 to:{y:0, x:80},
                 duration:600,
                 delay: 0
                      })
             .translate({
                 from:{x:0, y:0},
                 to:{y:0, x:120},
                 duration:500,
                easing: "hardbounce",
                 bounce: 0,
                 delay: 100
                      })
            .applyTo(this.credit,{onComplete:function(){
                app.ui.pre.obj.style.display = "none";
            }})
            /*
            .
            then(function(){
                console.log("animation complete");
            });*/
        }
    },
    play : {
        obj : undefined,
        group : undefined,
        big : undefined,
        small : undefined,
        show: function()
        {
            if(this.obj.style.display == "inline")
                return;
            this.obj.style.display = "inline";
            
            var bounce = new Bounce();
            
            bounce.translate({
                from:{x:1000, y:0},
                to:{x:0, y:0},
                duration:1200,
                stiffness:2,
                delay: 0,
                bounces: 1
            })
            .applyTo(this.group);
        },
        hide: function()
        {
             if(this.obj.style.display != "inline")
                 return;
            this.obj.style.display = "none";
        }
    },
    post : {
        obj: undefined,
        button: undefined,
        show: function()
        {
            this.obj.style.display = "inline";
            
            var bounce = new Bounce();
            
            bounce.translate(
                {from:{x:0, y:1000},
                to:{x:0, y:-100},
                duration:3000,
                stiffness:3,
                delay: 0,
                easing: "hardbounce",
                bounces: 10}
            )
            .applyTo(this.button);
        },
        hide: function()
        {
             if(this.obj.style.display != "inline")
                 return;
            this.obj.style.display = "none";
        }
            },
    active : undefined,
    init : function()
    {
        //screen: pre
        this.pre.obj = document.querySelector("#pre");
        this.pre.title = document.querySelector("#pre .title");
        this.pre.button = document.querySelector("#pre #start");
        this.pre.credit = document.querySelector("#pre #right");
        this.pre.button.addEventListener('click', function(){
            app.ui.onStateSwitch("play");
            app.main.start();
        }, false);
        
        this.play.obj = document.querySelector("#play");
        //console.dir(document.querySelector("#play"));
        this.play.group = document.querySelector("#play .score");
        //console.dir(this.play.group);
        this.play.big = document.querySelector("#play #big");
        this.play.small = document.querySelector("#play #small");
        
        this.post.obj = document.querySelector("#post");
        this.post.button = document.querySelector("#post #replay");
        
        
        this.post.button.addEventListener('click', function(){
            app.main.reset();
        }, false);
        
        this.onStateSwitch("pre");
    },
    setScore : function (score){
        this.play.big.innerHTML = Math.floor(score/10);
        this.play.small.innerHTML = "."+score%10;
    },
    onStateSwitch : function(state)
    {
        if(state=="pre"){
            this.pre.show();
            this.play.hide();
            this.post.hide();
            app.main.state=app.main.GAME_STATE.PRE;
        }
        else if(state=="play"){
            this.pre.hide();
            this.play.show();
            this.post.hide();
            app.main.state = app.main.GAME_STATE.PLAY;
        } else if(state=="post")
        {
            app.main.state = app.main.GAME_STATE.POST;
            this.post.show();
        }
    }
});