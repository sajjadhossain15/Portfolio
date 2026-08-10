import React, { useCallback, useEffect, useRef, useState } from 'react';

export function FrostedGlassCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  // Position references
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only initialize custom cursor on devices with a fine pointer (like mice)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // Hide native cursor globally when this mounts
    document.body.style.cursor = 'none';
    
    // Add global class to override pointer styles
    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let rafId: number;

    const render = () => {
      // Dot follows instantly
      dotPos.current.x = mouse.current.x;
      dotPos.current.y = mouse.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = '';
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Global Luminous Tail Effect */}
      <GlobalCursorTail mousePos={mouse} />

      {/* Instant Follow Center Dot (Star Core Head) */}
      <div
        ref={dotRef}
        className="star-core-wrapper fixed top-0 left-0 pointer-events-none z-[9999] block will-change-transform mix-blend-screen"
      >
        <div className="star-core-dot w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_5px_rgba(147,197,253,0.9)] animate-cursor-pulse" />
      </div>
    </>
  );
}

function GlobalCursorTail({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);

  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const speedRef = useRef(0);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollVelRef = useRef(0);

  const NUM_PTS = 18;

  // Fluid, organic left/right floating offset matching compact circle constraints
  const getRestingOffset = useCallback((t: number, now: number) => {
    // Smooth continuous left-right swaying ribbon wave
    const waveMain = Math.sin(now * 1.3 - t * 2.5) * (7.5 * Math.pow(t, 0.85));
    const waveSecondary = Math.cos(now * 0.95 - t * 1.8) * (2.8 * t);

    const rx = waveMain + waveSecondary;
    const ry = (21.0 * Math.pow(t, 0.9)) + Math.sin(now * 0.75 + t * 1.2) * 1.2;

    return { x: rx, y: ry };
  }, []);

  useEffect(() => {
    const pts = [];
    const now = performance.now() * 0.001;
    for (let i = 0; i < NUM_PTS; i++) {
      const t = i / (NUM_PTS - 1);
      const offset = getRestingOffset(t, now);
      pts.push({
        x: mousePos.current.x + offset.x,
        y: mousePos.current.y + offset.y,
      });
    }
    pointsRef.current = pts;
  }, [mousePos, getRestingOffset]);

  useEffect(() => {
    let animId: number;

    const renderTail = () => {
      if (!svgRef.current || !pathRef.current) {
        animId = requestAnimationFrame(renderTail);
        return;
      }

      const target = mousePos.current;
      const pts = pointsRef.current;
      if (pts.length === 0) {
        animId = requestAnimationFrame(renderTail);
        return;
      }

      const now = performance.now() * 0.001;

      // Track scroll delta & smooth scroll velocity
      const currentScrollY = window.scrollY;
      const scrollDeltaY = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      scrollVelRef.current += (scrollDeltaY - scrollVelRef.current) * 0.28;
      if (Math.abs(scrollVelRef.current) < 0.05) {
        scrollVelRef.current = 0;
      }

      // Calculate combined mouse & scroll speed
      const dx = target.x - prevMouseRef.current.x;
      const dy = target.y - prevMouseRef.current.y;
      const instantSpeed = Math.hypot(dx, dy + scrollVelRef.current * 0.8);
      speedRef.current += (instantSpeed - speedRef.current) * 0.15;
      prevMouseRef.current = { x: target.x, y: target.y };

      // Motion weight: 0 when resting/idle, 1 when moving
      const motionWeight = Math.min(speedRef.current / 3.5, 1.0);
      const restBlend = Math.pow(1 - motionWeight, 2.0);

      // Lead point is anchored EXACTLY at cursor target (no lag or gap)
      pts[0].x = target.x;
      pts[0].y = target.y;

      const N = pts.length;

      // Trailing points: fluid movement & scroll physics when active, smooth resting shape when idle
      for (let i = 1; i < N; i++) {
        const t = i / (N - 1);
        const restOffset = getRestingOffset(t, now);
        const targetRestPos = {
          x: pts[0].x + restOffset.x,
          y: pts[0].y + restOffset.y,
        };

        const lerpFactor = 0.38 - (i / N) * 0.08;
        let physX = pts[i].x + (pts[i - 1].x - pts[i].x) * lerpFactor;
        let physY = pts[i].y + (pts[i - 1].y - pts[i].y) * lerpFactor;

        // Scroll travel force (reduced by 50% from previous stage):
        // Down scroll (scrollVel > 0): head points down, tail stretches smoothly UP (-Y)
        // Up scroll (scrollVel < 0): head points up, tail stretches smoothly DOWN (+Y)
        const scrollForceY = -scrollVelRef.current * (1.1 + t * 2.1);
        physY += scrollForceY * 0.11;

        // When moving (restBlend = 0), blendFactor = 0 -> purely physics-driven tail following pointer & scroll.
        // When stopped (restBlend = 1), blendFactor = 0.28 -> smoothly returns to compact resting flow.
        const blendFactor = restBlend * 0.28;
        pts[i].x = physX * (1 - blendFactor) + targetRestPos.x * blendFactor;
        pts[i].y = physY * (1 - blendFactor) + targetRestPos.y * blendFactor;
      }

      // Ribbon geometry calculation
      const leftPts: { x: number; y: number }[] = [];
      const rightPts: { x: number; y: number }[] = [];

      // Base width: default is 0.85 (compact), mouse interaction expansion reduced by 50% (+0.33 max)
      const baseWidth = 0.85 + motionWeight * 0.33;

      for (let i = 0; i < N; i++) {
        let angle = 0;
        if (i < N - 1) {
          angle = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
        } else if (i > 0) {
          angle = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
        }

        const normal = angle + Math.PI / 2;
        const t = i / (N - 1);
        const w = baseWidth * Math.pow(1 - t, 1.5);

        const cosN = Math.cos(normal);
        const sinN = Math.sin(normal);

        leftPts.push({ x: pts[i].x + cosN * w, y: pts[i].y + sinN * w });
        rightPts.push({ x: pts[i].x - cosN * w, y: pts[i].y - sinN * w });
      }

      let pathStr = `M ${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        pathStr += ` L ${leftPts[i].x.toFixed(1)} ${leftPts[i].y.toFixed(1)}`;
      }
      for (let i = N - 1; i >= 0; i--) {
        pathStr += ` L ${rightPts[i].x.toFixed(1)} ${rightPts[i].y.toFixed(1)}`;
      }
      pathStr += ' Z';

      pathRef.current.setAttribute('d', pathStr);

      if (gradRef.current) {
        gradRef.current.setAttribute('x1', pts[0].x.toFixed(1));
        gradRef.current.setAttribute('y1', pts[0].y.toFixed(1));
        gradRef.current.setAttribute('x2', pts[N - 1].x.toFixed(1));
        gradRef.current.setAttribute('y2', pts[N - 1].y.toFixed(1));
      }

      // Baseline opacity is always visible (~0.65 to 0.78)
      const currentOpacity = 0.65 + Math.min(speedRef.current * 0.012, 0.13);
      svgRef.current.style.opacity = currentOpacity.toFixed(2);

      animId = requestAnimationFrame(renderTail);
    };

    animId = requestAnimationFrame(renderTail);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, getRestingOffset]);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-[9996] w-screen h-screen overflow-hidden"
      style={{ opacity: 0.7 }}
    >
      <defs>
        <linearGradient ref={gradRef} id="global-cursor-tail-grad" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#A855F7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
        </linearGradient>
        <filter id="global-cursor-tail-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        fill="url(#global-cursor-tail-grad)"
        filter="url(#global-cursor-tail-glow)"
      />
    </svg>
  );
}

