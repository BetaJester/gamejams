function setFormat(){return(new Audio).canPlayType("audio/mp3")?".mp3":".ogg"}function calculateMousePosition(t,i,e){e.x=t.clientX-i.left+document.documentElement.scrollLeft,e.y=t.clientY-i.top+document.documentElement.scrollTop}class ImagesLoaderItem{constructor(t){this.fileName=t,this.image=new Image}}class ImagesLoader{constructor(t,i){this.imageList=t,this.path=i,this._picsToLoad=0,this.onDone=null}_imageOnLoad(){this._picsToLoad--,0==this._picsToLoad&&this.onDone()}_beginLoadingImage(t){t.image.onload=this._imageOnLoad.bind(this),t.image.src=this.path+t.fileName}beginLoading(){this._picsToLoad=this.imageList.length;for(let t of this.imageList)this._beginLoadingImage(t);return this.imageList.length}}class Thingy{constructor(){this.children=[]}addChild(t){this.children.push(t)}removeChild(t){let i=this.children.indexOf(t);return-1!=i&&(this.children.splice(i,1),!0)}clearChildren(){this.children.splice(0)}update(t){this.updateChildren(t)}updateChildren(t){for(let i=0;i<this.children.length;++i)this.children[i].update(t)}draw(t){this.drawChildren(t)}drawChildren(t){for(let i=0;i<this.children.length;++i)this.children[i].draw(t)}}class Point{constructor(t,i){this.x=t,this.y=i}copy(){return new Point(this.x,this.y)}rotateAroundBy(t,i){const e=Math.sin(i),s=Math.cos(i);this.x-=t.x,this.y-=t.y;const n=this.x*s-this.y*e,o=this.x*e+this.y*s;this.x=n+t.x,this.y=o+t.y}plus(t){return new Point(this.x+t.x,this.y+t.y)}plusAmount(t){return new Point(this.x+t,this.y+t)}times(t){return new Point(this.x*t.x,this.y*t.y)}timesAmount(t){return new Point(this.x*t,this.y*t)}minus(t){return new Point(this.x-t.x,this.y-t.y)}minusAmount(t){return new Point(this.x-t,this.y-t)}}class Rotation{constructor(t,i){this.amount=t,this.speed=i}}class Sprite extends Thingy{constructor(t,i){super(),this.speed=new Point(0,0),this.rotation=new Rotation(0,0),this.center=new Point(0,0),this.scale=new Point(1,1),this.enabled=!0,this.position=new Point(t,i)}update(t){this.position.x+=this.speed.x/t.fps,this.position.y+=this.speed.y/t.fps,this.rotation.amount+=this.rotation.speed/t.fps,this.updateNow(t),this.updateChildren(t)}draw(t){if(this.enabled){let i=t.context;i.save(),i.translate(this.position.x,this.position.y),i.rotate(this.rotation.amount),i.scale(this.scale.x,this.scale.y),this.drawNow(t),this.drawChildren(t),i.restore()}}drawNow(t){}updateNow(t){}}class ImageSprite extends Sprite{constructor(t,i,e){super(t,i),this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.size=new Point(e.width,e.height),this.canvas.width=e.width,this.canvas.height=e.height,this.context.drawImage(e,0,0)}drawNow(t){t.context.drawImage(this.canvas,this.center.x,this.center.y)}calculateCenter(){this.center.x=-.5*this.size.x,this.center.y=-.5*this.size.y}}const SoundExtension=setFormat();class SoundMultiChannel{constructor(t,i=2){this._filename=t,this._channelCount=i,this._channels=[],this._currentChannel=0;for(let e=0;e<i;++e)this._channels.push(new Audio(t+SoundExtension))}play(){this._channels[this._currentChannel].currentTime=0,this._channels[this._currentChannel].play(),++this._currentChannel>=this._channelCount&&(this._currentChannel=0)}}class SoundLooping{constructor(t){this._channel=new Audio(t+SoundExtension),this._channel.loop=!0}setIsPlaying(t){t?this._channel.play():this._channel.pause()}setVolume(t){this._channel.volume=t}}class State{static get INIT(){return 0}static get CYCLE(){return 1}static get FINISH(){return 2}constructor(){this.state=State.INIT}doInit(t){this.init(t)}doCycle(t){this.state==State.CYCLE&&this.cycle(t)}doFinish(t){this.state==State.CYCLE&&(this.state=State.FINISH,this.finish(t))}initDone(){this.state=State.CYCLE}init(t){this.initDone()}cycle(t){}finish(t){t.clearChildren()}}class Background extends Thingy{constructor(){super()}}class ColorBackground extends Background{constructor(t){super(),this.style=t}draw(t){t.context.fillStyle=this.style,t.context.fillRect(0,0,t.canvas.width,t.canvas.height)}}class Rectangle{constructor(t,i,e,s){this.position=new Point(t,i),this.size=new Point(e,s)}intersectsLine(t,i){let e=t.x,s=i.x;if(t.x>i.x&&(e=i.x,s=t.x),s>this.position.x+this.size.x&&(s=this.position.x+this.size.x),e<this.position.x&&(e=this.position.x),e>s)return!1;var n=t.y,o=i.y,h=i.x-t.x;if(Math.abs(h)>1e-7){var a=(i.y-t.y)/h,r=t.y-a*t.x;n=a*e+r,o=a*s+r}if(n>o){var l=o;o=n,n=l}return o>this.position.y+this.size.y&&(o=this.position.y+this.size.y),n<this.position.y&&(n=this.position.y),!(n>o)}}class SplashScreen extends Thingy{constructor(t){super(),this.image=t}draw(t){t.context.drawImage(this.image,0,0),this.drawChildren(t)}}const Button_Left=0,Button_Right=2,Button_Middle=1,Key_Up=38,Key_Down=40,Key_Left=37,Key_Right=39,Key_W=87,Key_A=65,Key_S=83,Key_D=68,Key_Space=32;class InputStatus{constructor(){this.Key_Up=!1,this.Key_Down=!1,this.Key_Left=!1,this.Key_Right=!1,this.Key_W=!1,this.Key_A=!1,this.Key_S=!1,this.Key_D=!1,this.Key_Space=!1,this.Button_Left=!1,this.Button_Right=!1,this.Button_Middle=!1,this.Button_Back=!1,this.Button_Forward=!1,this.MouseLocation=new Point(0,0)}}class Engine extends Thingy{addDebugItem(t){this.debugList.push(t)}removeDebugItem(t){let i=this.debugList.indexOf(t);return-1!=i&&(this.debugList.splice(i,1),!0)}constructor(t,i,e=!1){super(),this.fps=0,this.timeToDo=0,this.lastUpdate=0,this.input=new InputStatus,this.canvas=t,this.state=i,this.debug=e,this.debugList=[],this.context=t.getContext("2d"),this.canvas.addEventListener("mousedown",this.mouseDown.bind(this)),this.canvas.addEventListener("mouseup",this.mouseUp.bind(this)),this.canvas.addEventListener("mousemove",this.mouseMove.bind(this)),document.addEventListener("keydown",this.keyDown.bind(this)),document.addEventListener("keyup",this.keyUp.bind(this))}updateFps(t){this.fps=1/((t-this.lastUpdate)/1e3),this.lastUpdate=t}setState(t){this.state&&this.state.doFinish(this),this.state=t,this.state.doInit(this)}mouseDown(t){switch(window.focus(),t.preventDefault(),t.stopPropagation(),t.preventDefault(),t.button){case Button_Left:this.input.Button_Left=!0;break;case Button_Right:this.input.Button_Right=!0;break;case Button_Middle:this.input.Button_Middle=!0}}mouseUp(t){switch(window.focus(),t.preventDefault(),t.stopPropagation(),t.button){case Button_Left:this.input.Button_Left=!1;break;case Button_Right:this.input.Button_Right=!1;break;case Button_Middle:this.input.Button_Middle=!1}}mouseMove(t){calculateMousePosition(t,this.canvas.getBoundingClientRect(),this.input.MouseLocation)}keyDown(t){switch(window.focus(),t.preventDefault(),t.stopPropagation(),t.keyCode){case Key_Up:this.input.Key_Up=!0;break;case Key_Down:this.input.Key_Down=!0;break;case Key_Left:this.input.Key_Left=!0;break;case Key_Right:this.input.Key_Right=!0;break;case Key_W:this.input.Key_W=!0;break;case Key_A:this.input.Key_A=!0;break;case Key_S:this.input.Key_S=!0;break;case Key_D:this.input.Key_D=!0;break;case Key_Space:this.input.Key_Space=!0}}keyUp(t){switch(window.focus(),t.preventDefault(),t.stopPropagation(),t.keyCode){case Key_Up:this.input.Key_Up=!1;break;case Key_Down:this.input.Key_Down=!1;break;case Key_Left:this.input.Key_Left=!1;break;case Key_Right:this.input.Key_Right=!1;break;case Key_W:this.input.Key_W=!1;break;case Key_A:this.input.Key_A=!1;break;case Key_S:this.input.Key_S=!1;break;case Key_D:this.input.Key_D=!1;break;case Key_Space:this.input.Key_Space=!1}}go(){this.setState(this.state),requestAnimationFrame(this.cycleRunner.bind(this))}cycleRunner(t){this.updateFps(t);let i=new Date;this.update(this),this.draw(this),this.state.doCycle(this),this.debug&&this.drawDebug(),requestAnimationFrame(this.cycleRunner.bind(this)),this.timeToDo=(new Date).valueOf()-i.valueOf()}drawDebug(){let t=0;let i=this.context;i.fillStyle="cyan",i.fillText("FPS: "+this.fps.toPrecision(4).toString(),10,t+=20);for(let e of this.debugList)i.fillText(e(),10,t+=20)}}const IMAGE_LIST=[new ImagesLoaderItem("startupSplash.png"),new ImagesLoaderItem("shipBody.png"),new ImagesLoaderItem("shipGun.png"),new ImagesLoaderItem("shipJet.png"),new ImagesLoaderItem("enemy0.png")],TUNING={STARTUP_SPLASH:{IMAGE_NUMBER:0},SHIP:{X:300,Y:300,IMAGE_NUMBER:1,MOVE_SPEED:1.5,GRAVITY_MAX:.3,GRAVITY_MIN:.01,PIXEL_GRAV_MAX:5},SHIP_GUN:{X:0,Y:0,IMAGE_NUMBER:2},SHIP_JET:{X:0,Y:0,IMAGE_NUMBER:3},ASTEROID:{IMAGE_NUMBER:4}},LEVEL_DATA=[{ASTEROID_COUNT:10}],Turning={Left:-1,None:0,Right:1};class BoundedImageSprite extends ImageSprite{updateNow(t){super.updateNow(t),(this.position.x<=0&&this.speed.x<0||this.position.x>=t.canvas.width&&this.speed.x>0)&&(this.speed.x*=-1,this.speed.x*=.9),(this.position.y<=0&&this.speed.y<0||this.position.y>=t.canvas.height&&this.speed.y>0)&&(this.speed.y*=-1,this.speed.y*=.9)}}class Ship extends BoundedImageSprite{constructor(){super(TUNING.SHIP.X,TUNING.SHIP.Y,IMAGE_LIST[TUNING.SHIP.IMAGE_NUMBER].image),this.isAccelerating=!1,this.isFiring=!1,this.turning=Turning.None,this.isUsingGravity=!1,this.gravityAmount=TUNING.SHIP.GRAVITY_MAX,this.gun=new ImageSprite(TUNING.SHIP_GUN.X,TUNING.SHIP_GUN.Y,IMAGE_LIST[TUNING.SHIP_GUN.IMAGE_NUMBER].image),this.jet=new ImageSprite(TUNING.SHIP_JET.X,TUNING.SHIP_JET.Y,IMAGE_LIST[TUNING.SHIP_JET.IMAGE_NUMBER].image),this.calculateCenter(),this.gun.calculateCenter(),this.jet.calculateCenter(),this.jet.enabled=!1,this.addChild(this.gun),this.addChild(this.jet)}updateNow(t){super.updateNow(t),this.gun.rotation.amount=Math.atan2(t.input.MouseLocation.y-this.position.y,t.input.MouseLocation.x-this.position.x)-this.rotation.amount,this.jet.enabled=this.isAccelerating,this.isAccelerating&&(this.speed.x+=Math.cos(this.rotation.amount)*TUNING.SHIP.MOVE_SPEED,this.speed.y+=Math.sin(this.rotation.amount)*TUNING.SHIP.MOVE_SPEED),this.rotation.amount+=this.turning*TUNING.SHIP.MOVE_SPEED/t.fps}gunPosition(){let t=this.position.x+12.7*Math.cos(this.gun.rotation.amount+this.rotation.amount),i=this.position.y+12.7*Math.sin(this.gun.rotation.amount+this.rotation.amount);return new Point(t,i)}drawNow(t){super.drawNow(t),this.isUsingGravity&&(t.context.fillStyle="rgba(0,200,100,0.3)",t.context.beginPath(),t.context.arc(0,0,100*(TUNING.SHIP.GRAVITY_MAX-(TUNING.SHIP.GRAVITY_MAX-this.gravityAmount)),0,2*Math.PI),t.context.fill())}}class Pixel{constructor(t,i,e,s,n,o){this.speed=new Point(2*Math.random()-1,2*Math.random()-1),this.position=i,this.life=100,t.addPixel(this,`rgba(${e},${s},${n},${o}`)}}class PixelPile extends Thingy{constructor(t){super(),this.ship=t,this.pixels=new Map,this.totalPixels=0,this.absorbedPixels=0,this.soundClaim=new SoundMultiChannel("audio/claim",6)}addPixel(t,i){if(this.pixels.has(i)){let e=this.pixels.get(i);e&&e.push(t)}else this.pixels.set(i,[]);this.totalPixels++}clearPixels(){this.pixels.clear()}update(t){for(let i of this.pixels.values()){let e=this.ship.isUsingGravity,s=this.ship.gravityAmount,n=TUNING.SHIP.PIXEL_GRAV_MAX,o=this.ship.position.x,h=this.ship.position.y,a=[],r=0;for(let l of i){if((l.position.x<=0&&l.speed.x<0||l.position.x>=t.canvas.width&&l.speed.x>0)&&(l.speed.x*=-1,l.speed.x*=.9),(l.position.y<=0&&l.speed.y<0||l.position.y>=t.canvas.height&&l.speed.y>0)&&(l.speed.y*=-1,l.speed.y*=.9),e){let t=o-l.position.x,i=h-l.position.y;Math.abs(t)<15&&Math.abs(i)<15&&--l.life<=0&&(a.push(r),this.absorbedPixels++,this.soundClaim.play());let e=Math.atan2(i,t);l.speed.x+=Math.cos(e)*s,l.speed.y+=Math.sin(e)*s,l.speed.x>n&&(l.speed.x=n),l.speed.y>n&&(l.speed.y=n),l.speed.x<-n&&(l.speed.x=-n),l.speed.y<-n&&(l.speed.y=-n)}l.position.x+=5*l.speed.x/t.fps,l.position.y+=5*l.speed.y/t.fps,++r}a.sort((t,i)=>t<i);for(let t of a)i.splice(t,1),this.totalPixels--}}draw(t){for(let[i,e]of this.pixels){t.context.fillStyle=i;for(let i of e)t.context.fillRect(i.position.x,i.position.y,1,1)}}}class LineCollision extends Point{constructor(t,i,e){super(t,i),this.isWall=e}}class Asteroid extends BoundedImageSprite{constructor(t,i){super(t,i,IMAGE_LIST[TUNING.ASTEROID.IMAGE_NUMBER].image),this.rotation.speed=.5*(Math.random()-.5),this.speed.x=25*(Math.random()-.5),this.speed.y=25*(Math.random()-.5),this.calculateCenter()}hit(t,i){const e=this.size.x,s=this.size.y;let n=this.context.getImageData(0,0,e,s),o=n.data,h=4*(i.y*this.canvas.width+i.x);i.rotateAroundBy(new Point(.5*e,.5*s),this.rotation.amount),new Pixel(t,new Point(this.position.x+i.x-.5*e,this.position.y+i.y-.5*s),o[h+0],o[h+1],o[h+2],o[h+3]),o[h+3]=0,this.context.putImageData(n,0,0)}findLineEnd(t,i){t=t.copy(),i=i.copy(),t.x=Math.floor(t.x),t.y=Math.floor(t.y),i.x=Math.floor(i.x),i.y=Math.floor(i.y);let e=Math.abs(i.x-t.x),s=Math.abs(i.y-t.y),n=t.x<i.x?1:-1,o=t.y<i.y?1:-1,h=e-s,a={x:!1,y:!1},r=this.context.getImageData(0,0,this.size.x,this.size.y).data,l=!1,p=this.size.x*this.size.y*2;for(;;){if(--p<0){l=!0;break}if(t.x<this.size.x&&t.x>=0&&(a.x=!0),t.y<this.size.y&&t.y>0&&(a.y=!0),a.x&&(t.x>=this.size.x||t.x<0)){l=!0;break}if(a.y&&(t.y>=this.size.y||t.y<0)){l=!0;break}if(a.x&&a.y){if(0!=r[4*(t.y*this.size.x+t.x)+3]){l=!1;break}}let i=h<<1;i>-s&&(h-=s,t.x+=n),i<e&&(h+=e,t.y+=o)}return new LineCollision(t.x,t.y,l)}}class AsteroidHit{constructor(t,i){this.asteroid=t,this.lineEnd=i}}class LevelState extends State{constructor(){super(),this.asteroids=[],this.background=null,this.ship=null,this.pixelPile=null,this.soundLaser=new SoundLooping("audio/laser"),this.levelNumber=0}init(t){t.addChild(new ColorBackground("rgb(0,0,32)")),this.ship=new Ship,this.pixelPile=new PixelPile(this.ship),t.addChild(this.ship);for(let i=0;i<LEVEL_DATA[this.levelNumber].ASTEROID_COUNT;++i){let i=0,e=0;do{i=Math.random()*t.canvas.width,e=Math.random()*t.canvas.height}while(Math.sqrt((this.ship.position.x-i)*(this.ship.position.x-i)+(this.ship.position.y-e)*(this.ship.position.y-e))<200);let s=new Asteroid(i,e);this.asteroids.push(s),t.addChild(s)}t.addChild(this.pixelPile),t.canvas.addEventListener("wheel",this.mouseWheel.bind(this)),t.debugList.push(()=>"Free Pixels: "+this.pixelPile.totalPixels),t.debugList.push(()=>"Absorbed Pixels: "+this.pixelPile.absorbedPixels),this.initDone()}mouseWheel(t){t.preventDefault(),this.ship.gravityAmount-=.01*Math.sign(t.deltaY),this.ship.gravityAmount<TUNING.SHIP.GRAVITY_MIN&&(this.ship.gravityAmount=TUNING.SHIP.GRAVITY_MIN),this.ship.gravityAmount>TUNING.SHIP.GRAVITY_MAX&&(this.ship.gravityAmount=TUNING.SHIP.GRAVITY_MAX)}cycle(t){let i=t.input.Key_W||t.input.Key_Up;if(this.ship.isAccelerating=i,this.ship.isUsingGravity=t.input.Key_Space,t.input.Key_A||t.input.Key_Left?this.ship.turning=Turning.Left:t.input.Key_D||t.input.Key_Right?this.ship.turning=Turning.Right:this.ship.turning=Turning.None,this.ship.isFiring=t.input.Button_Left,this.soundLaser.setIsPlaying(t.input.Button_Left),this.ship.isFiring){let i=null,s=this.asteroids.slice();var e=function(t,i){return Math.sqrt((t.x-i.x)*(t.x-i.x)+(t.y-i.y)*(t.y-i.y))};s.sort((t,i)=>e(this.ship.position,t.position)<e(this.ship.position,i.position));let n=t.input.MouseLocation.copy();const o=e(this.ship.position,t.input.MouseLocation),h=Math.max(t.canvas.width,t.canvas.height);n.x=n.x+(n.x-this.ship.position.x)/o*h,n.y=n.y+(n.y-this.ship.position.y)/o*h;for(let t=s.length-1;t>=0;--t){let i=s[t];const e=Math.max(i.size.x,i.size.y),o=1.4*e,h=1.4*e,a=i.position.y-h/2,r=i.position.x-o/2;new Rectangle(r,a,o,h).intersectsLine(this.ship.position,n)||s.splice(t,1)}let a=[];for(let e=0;e<s.length;++e){let n=s[e],o=this.ship.gunPosition(),h=t.input.MouseLocation.copy(),r=n.position.copy();r.x-=n.size.x/2,r.y-=n.size.y/2,o.rotateAroundBy(n.position,-1*n.rotation.amount),h.rotateAroundBy(n.position,-1*n.rotation.amount),o.x-=r.x,o.y-=r.y,h.x-=r.x,h.y-=r.y,null==(i=n.findLineEnd(o,h))||i.isWall||a.push(new AsteroidHit(n,i))}if(0!=a.length){a.sort((t,i)=>e(this.ship.position,t.asteroid.position.plus(t.lineEnd.minus(t.asteroid.size.timesAmount(.5))))>e(this.ship.position,i.asteroid.position.plus(i.lineEnd.minus(i.asteroid.size.timesAmount(.5))))),a[0].asteroid.hit(this.pixelPile,a[0].lineEnd),this.soundLaser.setVolume(1);let i=a[0].lineEnd.plus(a[0].asteroid.position).minus(a[0].asteroid.size.timesAmount(.5)),s=t.context;s.strokeStyle="rgb(255,0,0)",s.lineWidth=1,s.beginPath(),s.moveTo(this.ship.gunPosition().x,this.ship.gunPosition().y),s.lineTo(i.x,i.y),s.stroke()}else{this.soundLaser.setVolume(.3);let i=t.context;i.strokeStyle="rgb(255,0,0)",i.lineWidth=1,i.beginPath(),i.moveTo(this.ship.gunPosition().x,this.ship.gunPosition().y),i.lineTo(n.x,n.y),i.stroke()}}}finish(t){let i=!1;try{var e=Object.defineProperty({},"passive",{get:function(){i=!0}});window.addEventListener("test",null,e)}catch(t){}t.canvas.removeEventListener("wheel",this.mouseWheel.bind(this),!!i&&{passive:!0})}}class SplashState extends State{constructor(){super(),this.splash=null,this.imageLoader=null,this.done=!1,this.loadingDots=""}init(t){this.imageLoader=new ImagesLoader(IMAGE_LIST,"images/"),this.imageLoader.onDone=this.init2.bind(this,t),this.imageLoader.beginLoading()}init2(t){this.splash=new SplashScreen(IMAGE_LIST[TUNING.STARTUP_SPLASH.IMAGE_NUMBER].image),t.addChild(this.splash),this.done=!0,super.initDone()}cycle(t){if(!this.done){this.loadingDots.length<100?this.loadingDots+=".":this.loadingDots="",t.context.fillStyle="black",t.context.font="Consolas 20px";let i="Loading Images"+this.loadingDots;t.context.fillText(i,320,450)}t.input.Button_Left&&this.done&&t.setState(new LevelState)}finish(t){super.finish(t)}}var game;window.onload=function(){let t=new SplashState;(game=new Engine(document.getElementById("theCanvas"),t,!0)).go()};//# sourceMappingURL=index.js.map