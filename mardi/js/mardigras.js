

var CGIP = { REVISION: '1' };

class Ball {
	
	constructor(color) {
		var geometry = new THREE.SphereGeometry(0.2, 8, 8);
		var material = new THREE.MeshLambertMaterial( { color: color });
		this.tdo = new THREE.Mesh( geometry, material ) ;
	}
	
	move() {
        var a = CGIP.angle / this.track;			
		this.tdo.position.setX(Math.cos(a) * this.track);
		this.tdo.position.setY(Math.sin(a) * this.track);
	}
	
}

class LightBulb {
	
	constructor(color) {
        var light = new THREE.DirectionalLight( color );
        light.position.set( 0, 1, 1 ).normalize();
        this.tdo = light;
	}
	
	move() {
		
	}
	
}

class GlobeTrotter {
	
	constructor(color) {
		var geometry = new THREE.SphereGeometry(0.2, 10, 10);
		var material = new THREE.MeshLambertMaterial( { color: color });  // MeshLambertMaterial MeshStandardMaterial
		this.tdo = new THREE.Mesh( geometry, material ) ;
		this.angle1 = 0.0;
		this.angle2 = 0.0;
		this.radius = 0.01;
		
		this.inc1 = 0.0023;
		this.inc2 = 0.0067;
	}
	
	push(mult) {
		this.angle1 = this.angle1 + this.inc1 * mult;
		this.angle2 = this.angle2 + this.inc2 * mult;
	}
	
	move() {

		this.radius = this.radius + 0.01;
		if (this.radius > 9.0) {
			this.radius = 9.0;
		}
		
		this.angle1 = this.angle1 + this.inc1;
		this.angle2 = this.angle2 + this.inc2;
		
		var z = this.radius * Math.cos(this.angle1);
		var w = this.radius * Math.sin(this.angle1);
		
		var x = w * Math.cos(this.angle2);
		var y = w * Math.sin(this.angle2);

		this.tdo.position.set(x,y,z);

	}
	
	setSpeed(max) {
		
		var vel = this.direction.length();
		var x = this.direction.x;
		var y = this.direction.y;
		var z = this.direction.z;
		
		var ratio = Math.sqrt(max / vel);
		x = x / ratio;
		y = y / ratio;
		z = z / ratio;
		
		this.direction.setX(x);
		this.direction.setY(y);
		this.direction.setZ(z);

		var vel = this.direction.length();

	}
	
	alter(p, d, r) {
		if (Math.abs(p) <= r) {
			// if inside radius then don't change course
			return d;
		}
		if (Math.sign(p) != Math.sign(d)) {
			// if heading back to center then don't change course
			return d;
		}
		
		var dif = (Math.abs(p) - r) * 0.6;
		if (dif > 0.1) {
			dif = 0.1;
		}
		
		return d - (dif * Math.sign(d));
	}
	
}

class Chaser {
	
	constructor(color, target) {
		var geometry = new THREE.SphereGeometry(0.2, 10, 10);
		var material = new THREE.MeshStandardMaterial( { color: color });
		this.tdo = new THREE.Mesh( geometry, material ) ;
		this.direction = new THREE.Vector3(0,0,0);
		this.tdo.position.set(this.random(-30,0),this.random(-30,0),this.random(-85,-80));
		this.target = target;
	}
	
	random(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	move() {

		var x = this.target.tdo.position.x - this.tdo.position.x;
		var y = this.target.tdo.position.y - this.tdo.position.y;
		var z = this.target.tdo.position.z - this.tdo.position.z;
		
		var dif = new THREE.Vector3(x,y,z);
		var len = dif.length();  // how far away the target is
		if (len > 1) {
			len = 1;
		}
		len = len * 0.05;
		dif.normalize();
		dif.multiplyScalar(len);
		this.tdo.position.add(dif);
		
	}
	
	setSpeed(max) {
		
		var vel = this.direction.length();
		var x = this.direction.x;
		var y = this.direction.y;
		var z = this.direction.z;
		
		var ratio = Math.sqrt(max / vel);
		x = x / ratio;
		y = y / ratio;
		z = z / ratio;
		
		this.direction.setX(x);
		this.direction.setY(y);
		this.direction.setZ(z);

		var vel = this.direction.length();

	}
	
	alter(p, d, r) {
		if (Math.abs(p) <= r) {
			// if inside radius then don't change course
			return d;
		}
		if (Math.sign(p) != Math.sign(d)) {
			// if heading back to center then don't change course
			return d;
		}
		
		var dif = (Math.abs(p) - r) * 0.6;
		if (dif > 0.1) {
			dif = 0.1;
		}
		
		return d - (dif * Math.sign(d));
	}
	
}

class Scenario {

	constructor() {
		CGIP.scene = new THREE.Scene();
		CGIP.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

		CGIP.renderer = new THREE.WebGLRenderer();
		CGIP.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( CGIP.renderer.domElement );
		
		CGIP.camera.position.x = 9;
		CGIP.camera.position.y = 9;
		CGIP.camera.position.z = 8;
		
		CGIP.camera.lookAt( CGIP.scene.position );
		
		CGIP.actors = [];

		var light = new LightBulb( 0xffffff );
		this.add(light);

	}
  
  add(participant) {
	  CGIP.scene.add( participant.tdo );
	  CGIP.actors.push( participant );
  }
  
  start() {
	  
	  CGIP.angle = 0.0;
	  var index;
	  
	  var render = function () {
			requestAnimationFrame( render );

			CGIP.angle = CGIP.angle + 0.05;
			for (index = 0; index < CGIP.actors.length; index++) {
	
		        var actor = CGIP.actors[index];
		        actor.move();
				
			}
			
			CGIP.renderer.render(CGIP.scene, CGIP.camera);
		};

		render();
  }
  
}

