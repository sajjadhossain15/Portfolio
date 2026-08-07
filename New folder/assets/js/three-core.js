const container = document.getElementById("hero-3d-target");

if (container && typeof THREE !== "undefined") {

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.outputEncoding = THREE.sRGBEncoding;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(1, 12);

    // Material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x6f5cff,
        metalness: 0.2,
        roughness: 0.08,
        transmission: 0.95,
        transparent: true,
        opacity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        ior: 1.5,
        emissive: 0x4b3dff,
        emissiveIntensity: 0.3
    });

    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const blueLight = new THREE.PointLight(0x00bfff, 5);
    blueLight.position.set(3, 2, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x8a2be2, 5);
    purpleLight.position.set(-3, -2, 3);
    scene.add(purpleLight);

    // Mouse
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {

        mouseX = (e.clientX / window.innerWidth - 0.5);
        mouseY = (e.clientY / window.innerHeight - 0.5);

    });

    // Clock
    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        // Rotation
        core.rotation.y += 0.003;
        core.rotation.x += 0.0015;

        // Floating
        core.position.y = Math.sin(t * 1.4) * 0.12;

        // Breathing
        const scale = 1 + Math.sin(t * 2) * 0.03;
        core.scale.set(scale, scale, scale);

        // Mouse Follow
        core.rotation.y += (mouseX - core.rotation.y) * 0.03;
        core.rotation.x += (mouseY - core.rotation.x) * 0.03;

        renderer.render(scene, camera);

    }

    animate();

    // Resize
    window.addEventListener("resize", () => {

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    });

}