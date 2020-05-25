"use strict";

var app = app || {};

//eventually:
//https://github.com/liabru/matter-js/wiki/Rendering
//https://color.adobe.com/create/color-wheel/?base=2&rule=Shades&selected=0&name=My%20Color%20Theme&mode=rgb&rgbvalues=0.584382305227928,0.6189786323992145,0.75,0.38958820348528533,0.4126524215994763,0.5,0.7791764069705707,0.8253048431989526,1,0.19479410174264267,0.20632621079973815,0.25,0.7012587662735136,0.7427743588790573,0.9&swatchOrder=0,1,2,3,4
//^+FFFEDE

//https://color.adobe.com/create/color-wheel/?base=2&rule=Triad&selected=4&name=My%20Color%20Theme&mode=rgb&rgbvalues=1,0.9963144002929198,0.8692965572242429,0.09999999999999998,0.687303522439015,1,0.99,0.9620837980046986,0,0.79,0.07899999999999999,0.13104258718074605,0.25,0.012500000000000011,0.029884127222823076&swatchOrder=0,1,2,3,4
app.main = Object.seal({
    
    //have ladder class, with consts, variables, and functions
    bgAudio: undefined,
    effectAudio: undefined,
    paused: false,
    init : function()
    {
                this.state = this.GAME_STATE.PRE;
        //window.addEventListener('resize', onWindowResize);
        this.matter = new this.Matter();
        app.container.registerResizable(this.updateResolution.bind(this));
        this.matter.initMatter();
        document.querySelector("body").addEventListener('click', function() {if(app.main.state==app.main.GAME_STATE.PLAY&&!this.paused)app.main.matter.ladder.drop();}, false);
        //this.updateResolution(500,500);
        //console.dir(this.matter);
        bgAudio =  document.getElementById("bgAudio");
        effectAudio =  document.getElementById("effectAudio");
        bgAudio.volume = 0.2;
        bgAudio.play();
    },
    
    GAME_STATE:Object.freeze({
        PRE:0,
        PLAY:1,
        PAUSE:2,
        POST:3,
    }),
    state:undefined,
    updateResolution : function(newWidth, newHeight)
    {
        this.matter.resizeTo(newWidth, newHeight);//use -5,-5 as compatability fix
    },
    die: function()
    {
        if(this.state == this.GAME_STATE.PLAY)
        {
            app.ui.onStateSwitch("post");
            this.matter.onDeath();
        }
                
    },
    
	playEffect : function (){
	var effectSounds = ["1.mp3","2.mp3","3.mp3","4.mp3"];
		effectAudio.src = "media/pop_"+effectSounds[Math.floor(Math.random()*4)];
		effectAudio.play();
	},
    start: function()
    {
        app.main.matter.start();
    },
    reset: function()
    {
        app.ui.onStateSwitch("pre");
        app.main.matter.reset();
    },
    pause : function()
    {
        if(app.main.state==app.main.GAME_STATE.PLAY){
            this.paused = true;
            this.matter.setTimeScale(.00000000001);
        }
        
        bgAudio.pause();
    },
    resume : function()
    {
        if(app.main.state==app.main.GAME_STATE.PLAY){
            this.paused = false;
            this.matter.setTimeScale(1);
        }
        
        bgAudio.play();
    },
    matter : undefined,
    Matter : function()
    {
        // module aliases
        var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Events = Matter.Events,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        Bounds = Matter.Bounds,
        Vector = Matter.Vector,
        Mouse = Matter.Mouse,
        group = Body.nextGroup(true);
        this.ladder = undefined;
        
        this.reset = function()
        {
            World.clear(engine.world,false);
            this.ladder = new Ladder(undefined, 80, {x:50,y:20}, {x:70,y:10}, undefined, undefined, group, undefined);
            World.add(engine.world, Matter.MouseConstraint.create(engine));
            Bounds.shift(render.bounds, {x:0, y:0});
                    
            
                    //Mouse.setOffset(mouseConstraint.mouse,
                    //                render.bounds.min); //*/
            //reset position
        }
        this.setTimeScale = function(amt)
        {
            engine.timing.timeScale = amt;
        }
        
        this.start = function()
        {
            var time = 0;
            var increment = 90;
            var ladder = this.ladder.composite;
            var speed = 1.1;
            this.sceneEvents.push(
                Events.on(engine, 'tick', function() {
                    
                    if(app.main.paused)
                        return;
                    
                    time++;
                    if(time>=increment)
                        {
                            time = 0;
                            increment+=speed
                            speed += 1/speed;
                            increment-=speed
                        }
                    Bounds.translate(render.bounds, {x:0, y:speed});
                    
                    //Mouse.setOffset(mouseConstraint.mouse,
                    //                render.bounds.min); //*/
                    var offscreen = 0;
                    ladder.composites.forEach( (comp, idx)=>{
                        /*
                        Body.applyForce(comp.bodies[comp.bodies.length-1],comp.bodies[comp.bodies.length-1].position,{x:.001, y:0}, false);*/
                        if(!Bounds.overlaps(comp.bodies[comp.bodies.length-1].bounds, render.bounds)){
                                offscreen++;
                        }
                        if(offscreen==3)
                        {
                            app.main.die();
                        }
                        //Composite.translate(comp, );
                    });
                    // we must update the mouse too
            })
            );
            this.confetti();
        }
        
        this.confetti = function ()
        {
            for(var i = 0; i<4;  i++){
                var stack = Composites.stack(app.container.width/2-80, app.container.height/2-155+render.bounds.min.y, 2,2, 0,0, function(x, y) {
                    return Bodies.circle(x, y, 30, 30);
                });
                World.add(engine.world, stack);
            }
            app.main.playEffect();
        }
        
        this.onDeath = function()
        {
            //Composite.remove(engine.world, mouseConstraint);
            this.sceneEvents = [];
            Events.off(engine, 'tick');
            this.confetti();
        }
        //int, vec2,
        var Ladder = function(origin, width, verticalsPrefab, rungPrefab, ropePrefab, joinsPrefab, layer, options){// options : undefined
            var left = undefined,
                right = undefined,
                rung = undefined,
                depth = 0;
            
            this.composite = undefined;
            
            //r/theydidthemath
            var constants = Object.seal({
                stiffness:0.4,
                jointDisp: -25,
                width : 80,
                verticals : {
                    jointPos : {x:-verticalsPrefab.x/2, y:0}
                },
                rung : {
                    jointPos : {x:0, y:0}
                },
                defaultSize: 4,
                tightDist : 9 //depth away constraints to be tightened are
            }),
            origin = Object.seal({
                x: app.container.width/2,
                y: 0
            });
            
            this.drop = function()
            {
                //generate
                appendPrefab(left, verticalsPrefab, left.bodies[depth-1].position, constants.verticals.jointPos, [left.bodies[depth-1]])
                appendPrefab(right, verticalsPrefab, right.bodies[depth-1].position, constants.verticals.jointPos, [right.bodies[depth-1]])
                appendPrefab(rung, rungPrefab, rung.bodies[depth-1].position, constants.rung.jointPos, [right.bodies[depth],left.bodies[depth]])
                depth++;
                //TODO: refactor
                app.ui.setScore((depth-constants.defaultSize-1)*7);
                
            }
            var rectFrom = function(pos, prefab, draw)
            {
                return Bodies.rectangle(pos.x, pos.y, prefab.x, prefab.y, { collisionFilter: { group: layer },
                render: {
                    fillStyle: '#63697F',
                    strokeStyle: '#63697F'
                }
                                                                          
                                                                          });
            }
            this.init = function()
            {
                if(depth!=0)
                {
                    //console.log("wtf bro... don't init me like this");
                    return;    
                }
                origin.x-=constants.width/2;
                
                //make our first compsite
                left = Composite.create();
                right = Composite.create();
                rung = Composite.create();
                this.composite = Composite.create();
                Composite.add(this.composite,[left,right,rung]);
                
                
                origin.x-=constants.width/2;
                appendPrefab(left, verticalsPrefab, origin,origin,[null])
                origin.x+=constants.width;
                appendPrefab(right, verticalsPrefab, origin,origin,[null])
                
                origin.x-=constants.width/2;
                //origin.y-=verticalsPrefab.y;
                appendPrefab(rung, rungPrefab, origin, constants.rung.jointPos, [right.bodies[depth],left.bodies[depth]])
                
                depth++;
                
                //build the first bunch of rungs
                for(var i = 0; i< constants.defaultSize; i++){
                    //console.log(i);
                    this.drop();
                }
                
                //add it to the world
                World.add(engine.world, this.composite);
                
                
                window.onblur = function(){
                    //console.log("blur at " + Date());
                    app.main.pause();
                };
                
                window.onfocus=function(){
                    //console.log("focus at "+Date());
                    app.main.resume();
                };
            }
            var appendPrefab = function(comp, prefab, spawnAt, joint, constraintParents)
            {
                Composite.add(comp, rectFrom(spawnAt, prefab),undefined);
                //ensure we're looking the right way
                var angle = 0;
                if(depth!=0)// && prefab == verticalsPrefab)
                {
                //    console.dir(comp.bodies[depth-1]);
                    Body.rotate(comp.bodies[depth], comp.bodies[depth-1].angle);//-Math.PI);//comp.bodies[depth-1].rotation)
                    
                    Body.setVelocity(comp.bodies[depth], comp.bodies[depth-1].velocity);// a fix to the forever upward ladder
                    if(depth>=constants.tightDist)
                    {
                        comp.constraints[depth-constants.tightDist].stiffness = 1;
                        comp.bodies[depth-constants.tightDist].mass = 1000;
                        //Matter.Body.setStatic(comp.bodies[depth-constants.tightDist],true);//off screen, not tight dist
                        if(depth>=constants.tightDist*2)
                        {
                            Matter.Body.setStatic(comp.bodies[depth-constants.tightDist*2],true);//off screen, not tight dist
                        }
                    }
                }
                var angle = comp.bodies[depth].angle;
                var dir = 1;
                for(var i = 0; i<constraintParents.length; i++){
                    Composite.add(comp, Constraint.create({ 
                        bodyA : constraintParents[i],
                        bodyB: comp.bodies[depth],
                        pointB: { x: prefab.x/2*dir*Math.cos(angle),
                                  y: prefab.x/2*dir*Math.sin(angle)
                                },
                        pointA: { x: joint.x*Math.cos(angle) + joint.y*Math.sin(angle),
                                  y: joint.x*Math.sin(angle) + joint.y*Math.cos(angle)
                                },
                        length: 5,
                        stiffness: constants.stiffness,
                    render:{
                        strokeStyle: '#FFFEDE',
                    }
                    }));
                    dir*=-1;
                }
            };
            //init by default drops
            //for .... drop
            
            this.init();
        }
        // create an engine
        var engine = Engine.create();
        
        // create a renderer
        var render = Render.create({
            element: app.container.box,
            engine: engine,
            options: {
                width: app.container.width,//grab the screen size
                height: app.container.height,
                pixelRatio: 1,
                background: '#323540',
                wireframeBackground: '#323540',
                hasBounds: true,//eventually: true
                enabled: true,
                showSeparations: false,
                wireframes: false,
                showMousePosition: false/*,
                wireframes: true,
                showSleeping: true,
                showDebug: true,
                showBroadphase: false,
                showBounds: true,
                showVelocity: true,
                showCollisions: false,
                showAxes: true,
                showPositions: false,
                showAngleIndicator: false,
                showIds: true,
                showShadows: true,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false*///,
            }
        });
        
        //var mouseConstraint = Matter.MouseConstraint.create(engine);
        
        this.sceneEvents = [];
        
        //if here incase ever tilt
        /*
        if(mouseConstraint){
            //hook me up bruh
            Mouse.setScale(mouseConstraint.mouse, { x: 1, y: 1 });
            World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
            Mouse.setElement(mouseConstraint.mouse, render.canvas);
        }*/
        
        
        // create two boxes and a ground
        this.resizeTo = function(width, height)
        {
            render.options.width = width;
            render.options.height = height;
            render.canvas.width = width;
            render.canvas.height = height;
            //render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
            //render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;
            //Bounds.translate(render.bounds, translate);
            // we must update the mouse too
            //Mouse.setOffset(mouse, render.bounds.min);
            //Mouse.setScale(mouse, boundsScale);
            //Mouse.setOffset(mouse, render.bounds.min);
        }
        
        this.initMatter = function()
        {
            //create the ladder
            this.ladder = new Ladder(undefined, 80, {x:50,y:20}, {x:70,y:10}, undefined, undefined, group, undefined);
            
            // run the engine
            Engine.run(engine);
            
            // run the renderer
            Render.run(render);
            
            
            
            //create the game loop
            /*
            this.sceneEvents.push(
                Events.on(engine, 'tick', function() {
                    ladder.composites.forEach( (comp, idx)=>{
                        Composite.translate(comp, {x:10, y:0});
                    });
                }));
                */
        };
    }
});