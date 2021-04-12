function init(w, p) {

  
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 100, 175);
  
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    var createPlanet = function(name, radius, orbit, speed) {
      var geom = new THREE.SphereGeometry(radius, 320, 16);

      var mat = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('data:image/png;base64,' + p),
      });


      var planet = new THREE.Mesh(geom, mat);

      planet.userData.orbit = orbit;
      planet.userData.speed = speed;
  
      var canvas = document.createElement('canvas');
      canvas.width = 270;
      canvas.height = 256;
      var ctx = canvas.getContext("2d");
      ctx.font = "30pt Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(name, 240, 44);
      var tex = new THREE.Texture(canvas);
      tex.needsUpdate = true;
      var spriteMat = new THREE.SpriteMaterial({
        map: tex
      });
      var sprite = new THREE.Sprite(spriteMat);
  
      planet.add(sprite);
      planets.push(planet);
      scene.add(planet);
  
      //orbit
      var shape = new THREE.Shape();
      shape.moveTo(orbit, 0);
      shape.absarc(0, 0, orbit, 0, 2 * Math.PI, false);
      var spacedPoints = shape.getSpacedPoints(128);
      var orbitGeom = new THREE.BufferGeometry().setFromPoints(spacedPoints); 
      orbitGeom.rotateX(THREE.Math.degToRad(-90));
      var orbit = new THREE.Line(orbitGeom, new THREE.LineBasicMaterial({
        color: "yellow"
      }));
      scene.add(orbit);
    };


    //size, dist, speed
    createPlanet(w.min_temp, 30, 400, 0.3);

    const loader = new THREE.TextureLoader();
    var Sun = new THREE.Mesh(new THREE.SphereGeometry(50, 320, 16), new THREE.MeshBasicMaterial({

      map: loader.load('https://i.ibb.co/fHQ8Fg2/suncyl1.jpg'),
    }));
  
    scene.add(Sun);
  }
  



  function animate() {
    timestamp = Date.now() * 0.0001;
    requestAnimationFrame(animate);
    planets.forEach(function(planet) {
      
      var scaleFactor = 8;
      var sprite = planet.children[0];
      var scale = scaleVector.subVectors(planet.position, camera.position).length() / scaleFactor;
      sprite.scale.set(scale, scale, 1);
      var orbit = planet.userData.orbit;
      var speed = planet.userData.speed;
      planet.position.x = Math.cos(timestamp * speed) * orbit;
      planet.position.z = Math.sin(timestamp * speed) * orbit;
    });
    render();
  }
  
  function render() {
    renderer.render(scene, camera);
  }