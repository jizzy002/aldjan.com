import { useEffect, useRef } from 'react';

export default function AnimatedBackground({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createBlobs = () => {
      const blobs = [];
      const blobCount = 5;
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          x: (Math.random() * canvas.width),
          y: (Math.random() * canvas.height),
          radius: Math.random() * 150 + 100,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          hue: i * (360 / blobCount) + (isDark ? 200 : 0),
          saturation: 70 + Math.random() * 30,
          lightness: isDark ? 25 + Math.random() * 15 : 50 + Math.random() * 20
        });
      }
      return blobs;
    };

    const blobs = createBlobs();

    const drawBlob = (blob, time) => {
      ctx.save();
      ctx.globalAlpha = 0.6;
      
      // Update position with slow movement
      blob.x += blob.speedX;
      blob.y += blob.speedY;

      // Wrap around screen
      if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
      if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
      if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
      if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;

      // Draw blob with wave distortion
      ctx.beginPath();
      const points = 6;
      const angle = (Math.PI * 2) / points;

      for (let i = 0; i < points; i++) {
        const x = Math.cos(angle * i) * blob.radius;
        const y = Math.sin(angle * i) * blob.radius;
        
        // Add wave distortion using time
        const distortion = Math.sin(time * 0.003 + i) * blob.radius * 0.3;
        const px = blob.x + x + distortion;
        const py = blob.y + y + Math.sin(time * 0.002 + i) * blob.radius * 0.2;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.closePath();
      ctx.fillStyle = `hsl(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%)`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = isDark ? 'rgba(18, 18, 18, 0.02)' : 'rgba(255, 255, 255, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob) => drawBlob(blob, time));
      time++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
