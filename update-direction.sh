cat << 'INNER_EOF' > /tmp/direction_part1.txt
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      if (currentY <= 50) {
        setGuidance({ label: 'SCROLL DOWN', iconType: 'down' });
      } else if (currentY >= maxScroll - 50) {
        setGuidance({ label: 'SCROLL UP', iconType: 'up' });
      } else if (Math.abs(delta) > 1) {
        if (delta > 0) {
          setGuidance({ label: 'SCROLL DOWN', iconType: 'down' });
        } else {
          setGuidance({ label: 'SCROLL UP', iconType: 'up' });
        }
      }
      
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial evaluation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
INNER_EOF
head -n 27 src/components/DirectionalGuidance.tsx > /tmp/direction_new.tsx
cat /tmp/direction_part1.txt >> /tmp/direction_new.tsx
tail -n +194 src/components/DirectionalGuidance.tsx >> /tmp/direction_new.tsx
cp /tmp/direction_new.tsx src/components/DirectionalGuidance.tsx
