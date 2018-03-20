perlin = (() => {
  console.log("running")
  "use strict"

  let scene = new THREE.Scene()
  let renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : THREE.CanvasRenderer()
  let light = new THREE.AmbientLight(0xffffff)
  let camera
  let manualGeometry
  let t = 0

  function initScene() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.querySelector("#webgl-container").appendChild(renderer.domElement)
    scene.add(light)


    let width = window.innerWidth
    let height = window.innerHeight
    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 1
    camera.position.y = 100
    camera.position.x = 100

    scene.add(camera)





    let noiseGeometry = new THREE.Geometry()


    let w = window.innerWidth,
      h = window.innerHeight

    let M = 4294967296,
      // a - 1 should be divisible by m's prime factors
      A = 1664525,
      // c and m should be co-prime
      C = 1;

    let Z = Math.floor(Math.random() * M);

    function rand() {
      Z = (A * Z + C) % M;
      return Z / M - 0.5;
    };

    function interpolate(pa, pb, px) {
      var ft = px * Math.PI,
        f = (1 - Math.cos(ft)) * 0.5;
      return pa * (1 - f) + pb * f;
    }

    var x = 0,
      dx = 1,
      y = h / 2,
      amp = 10, //amplitude
      wl = 40, //wavelength
      fq = 1 / wl, //frequency
      a = rand(),
      b = rand();


    while (x < w) {
      if (x % wl === 0) {
        a = b;
        b = rand();
        y = h / 2 + a * amp;
      } else {
        y = h / 2 + interpolate(a, b, (x % wl) / wl) * amp;
      }
      noiseGeometry.vertices.push(new THREE.Vector3(x-w/2+dx, 0.0, 0.0))
      noiseGeometry.vertices.push(new THREE.Vector3(x-w/2+dx, y, 0.0))
      // ctx.fillRect(x, y, 1, 1);
      x += dx;
    }
    console.log(Object.values(noiseGeometry.vertices))
    for (let i=0; i< noiseGeometry.vertices.length-2; i+=2){
      noiseGeometry.faces.push(new THREE.Face3(i, i+2, i+1))
      noiseGeometry.faces.push(new THREE.Face3(i+1, i+2, i+3))
    }

    let material = new THREE.MeshNormalMaterial
    let noiseMesh = new THREE.Mesh(noiseGeometry,material)
    scene.add(noiseMesh)








    // Create custom Geometry

    let triangleGeometry = new THREE.Geometry()

    triangleGeometry.vertices.push(new THREE.Vector3(0.0, 10.0, 0.0))
    triangleGeometry.vertices.push(new THREE.Vector3(-10.0, -10.0, 0.0))
    triangleGeometry.vertices.push(new THREE.Vector3(10.0, -10.0, 0.0))

    triangleGeometry.faces.push(new THREE.Face3(0, 1, 2))

    triangleGeometry.faces[0].vertexColors[0] = new THREE.Color(0xFF0000)
    triangleGeometry.faces[0].vertexColors[1] = new THREE.Color(0x00FF00)
    triangleGeometry.faces[0].vertexColors[2] = new THREE.Color(0x0000FF)

    let triangleMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      wireframe: false
    })

    manualGeometry = new THREE.Mesh(triangleGeometry, triangleMaterial)
    // scene.add(manualGeometry)




    stats = new Stats()
    stats.setMode(0)
    stats.domElement.style = 'position: absolute; left: 20px; top: 20px;'
    document.body.appendChild(stats.domElement)

    render()
  }

  function render() {

    t += 0.00

    manualGeometry.geometry.vertices[0].y = 10 * (1 + Math.pow(Math.sin(t), 2))
    manualGeometry.geometry.vertices[1].x = 10 * (1 + Math.pow(Math.sin(t), 2))
    manualGeometry.geometry.vertices[2].x = -10 * (1 + Math.pow(Math.sin(t), 2))
    manualGeometry.geometry.verticesNeedUpdate = true

    renderer.render(scene, camera)
    requestAnimationFrame(render)
    stats.update()
  }

  // initScene()
  window.onload = initScene
  return scene
})()
