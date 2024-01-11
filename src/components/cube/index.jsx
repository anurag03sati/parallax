
'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

const YourComponent = () => {
  const canvas = useRef(null);
  const renderer = new THREE.WebGLRenderer();

  useEffect(() => {

    canvas.current.appendChild(renderer.domElement);
    renderer.domElement.classList.add('webgl');

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1e1a20');
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('./gradients/3.jpg');
    gradientTexture.magFilter = THREE.NearestFilter;

    
    const material = new THREE.MeshToonMaterial({
      color: '#ffeded',
      gradientMap: gradientTexture,
    });

    // Objects
    const objectsDistance = 4;
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      material
    );
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;

    scene.add(mesh1, mesh2, mesh3);

    const sectionMeshes = [mesh1, mesh2, mesh3];

    // Lights
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    // Particles
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] =
        objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: '#ffeded',
      sizeAttenuation: true,
      size: 0.03,
    });

    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

   
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

   
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    
    window.addEventListener('resize', handleResize);

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 6;
    cameraGroup.add(camera);
    handleResize();
   
    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener('scroll', () => {
      console.log("im scrolling")
      scrollY = window.scrollY;
      const newSection = Math.round(scrollY / sizes.height);

      if (newSection !== currentSection) {
        currentSection = newSection;

        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5',
        });
      }
    });

    const cursor = { x: 0, y: 0 };

    window.addEventListener('mousemove', (event) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = event.clientY / sizes.height - 0.5;
      console.log(cursor.x,cursor.y)
    });


    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;


      camera.position.y = -scrollY / sizes.height * objectsDistance;

      const parallaxX = cursor.x * 0.5;
      const parallaxY = -cursor.y * 0.5;
      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

     
      for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
      }

     
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

  
    tick();

    return () => {
   
      window.removeEventListener('resize', handleResize);
    
    };
  }, []); 

  return (
    <div>
      {/* Section 1 */}
      <section style={{ position: 'relative', height: '100vh', background: 'rgba(0, 0, 0, 0)' }}>
        <h1 style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', color: '#ffeded', zIndex: 2 }}>
          Torus
        </h1>
      </section>
  
      {/* Section 2 */}
      <section style={{ position: 'relative', height: '100vh', background: 'rgba(0, 0, 0, 0)' }}>
        <h1 style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%, -50%)', color: '#ffeded', zIndex: 2 }}>
          Cone
        </h1>
      </section>
  
      {/* Section 3 */}
      <section style={{ position: 'relative', height: '100vh', background: 'rgba(0, 0, 0, 0)' }}>
        <h1 style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', color: '#ffeded', zIndex: 2 }}>
          TorusKnot
        </h1>
      </section>
  
      <div ref={canvas} />
    </div>
  );
  
};

export default YourComponent;

