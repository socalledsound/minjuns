var sound, fft, amplitude, r = 130, dr = 70;
var system;
function preload(){ 
	sound = loadSound('crickets.mp3');
} 

function setup(){
  createCanvas(400,400);
  //angleMode(DEGREES);
  system = new ParticleSystem(createVector(10,10 ));
  fft = new p5.FFT();
	fft.setInput(sound);
	sound.play();
  amplitude = new p5.Amplitude();
	amplitude.setInput(sound);
 
}
 
function draw(){
  background(85);
   translate(width/2,height/2);  
	let waveform = fft.waveform();
	fill(255,10);
  
  let amp = waveform[600];
  
  
  
  let numberParticlesToAdd = map(amp, -0.5, 0.5, -30,30);
  
  for(let i = 2; i < numberParticlesToAdd; i++){
    system.addParticle();
  }
  console.log(amp);
  let sizeVal = map(amp, -0.1, 0.1, 0, 50); 
  
  //system.changeSizes(sizeVal);
  system.run(sizeVal);
  
  
  
 //push();
  //rotate(frameCount*100);
  
	ellipse(3,3,150*amplitude.getLevel(),150*amplitude.getLevel());
  noFill();
  beginShape();
  stroke(255,100); // waveform is red
  strokeWeight(1);
  for (let i = 0; i< waveform.length; i+=5){
		let ang = i*360/waveform.length;
		let x = (r)*cos(radians(ang));
    let y = (r)*sin(radians(ang));
    let a = map( waveform[i], -3, 9, r-dr, r+dr)*cos(radians(ang));// ;
    let b = map( waveform[i], -9, 1, r-dr, r+dr)*sin(radians(ang));// ;
    vertex(a,b);
		push();
		strokeWeight(1);
        rotate(frameCount/400);
		stroke(255,100);
		line(x, y, a, b);
		pop();
		push();
		stroke(255);
    strokeWeight(1);
    point(a, b);
		pop();
  }
  endShape();  
  
 // pop();
}
// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.03);
  this.velocity = createVector(random(-1,1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 400.0;
};

Particle.prototype.run = function(v) {
  this.update(v);
  this.display();
};

// Method to update position
Particle.prototype.update = function(mod){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 5;
  this.size = 1 * mod;
  this.blue = random(255);
  this.alpha = 100;
    //console.log(mod);
};

// Method to display
Particle.prototype.display = function() {
  stroke(255, this.lifespan);
  strokeWeight(0);
  fill(0, 0, this.blue, this.lifespan);
 // console.log(this.size);
  ellipse(this.position.x, this.position.y, this.size, this.size);
};



// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.changeSizes = function(value){

   for(let i = 0; i < this.particles.length; i++){
    // console.log(this.particles[i]);
     //this.particles[i].size = this.particles[i].size * value;
   }


};


ParticleSystem.prototype.run = function(modVal) {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run(modVal);
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};