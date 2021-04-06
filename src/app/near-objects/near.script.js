function init(data) {
    console.log(data);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 100, 175);
  
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    const loaderAstro = new THREE.TextureLoader();
    var createPlanet = function(name, radius, orbit, speed) {
      var geom = new THREE.DodecahedronGeometry(radius, 1);



      
      var mat = new THREE.MeshBasicMaterial({
        map: loaderAstro.load('https://i.ibb.co/sb6wGTx/7885198-3x2-940x627.png'),
      });

      var planet = new THREE.Mesh(geom, mat);
      planet.userData.orbit = orbit;
      planet.userData.speed = speed;
  
      var canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      var ctx = canvas.getContext("2d");
      ctx.font = "20pt Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(name, 128, 44);
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
        color: "#013220"
      }));
      scene.add(orbit);
    };

    for (i = 0; i < data.length; i++) {

      var name = data[i].name
      var size = data[i].estimated_diameter.kilometers.estimated_diameter_max;
      var dist = data[i].close_approach_data[0].miss_distance.lunar;
      var speed = data[i].close_approach_data[0].relative_velocity.kilometers_per_second;
      console.log(size);
      createPlanet(name, parseInt(size)+0.75, parseInt(dist) + 4, speed/4);
      
    }


  //size, dist, speed
  
    //createPlanet("rock2", 1.5, 20, 3);
    //createPlanet("rock1", 60, 600, 4);
  //  createPlanet("rock3", 1.8, 40, 2);
   // createPlanet("rock4", 3, 60, 0.8);
   // createPlanet("rock5", 2.5, 70, 0.5);
    //createPlanet("rock6", 1.75, 80, 0.4);
    //createPlanet("rock7", 0.8, 90, 0.2);
  
    //console.log(planets[0].children[0]);
  
    const loader = new THREE.TextureLoader();
    var newEarth = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 16), new THREE.MeshBasicMaterial({
      
      map: loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Large_World_Topo_Map_2.png/1200px-Large_World_Topo_Map_2.png'),
    }));
  
  
  
    scene.add(newEarth);
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