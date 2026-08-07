document.addEventListener("DOMContentLoaded", () => {

    if (typeof gsap === "undefined") {
        console.warn("GSAP not loaded");
        return;
    }

    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    tl.from(".site-header", {
        y: -80,
        opacity: 0,
        duration: 1
    })

        .from(".hero-badge", {
            opacity: 0,
            y: 20,
            duration: .6
        }, "-=0.5")

        .from(".hero-title span", {
            opacity: 0,
            y: 80,
            stagger: .15,
            duration: 1
        }, "-=0.2")

        .from(".hero-description", {
            opacity: 0,
            y: 30,
            duration: .8
        }, "-=0.5")

        .from(".hero-actions", {
            opacity: 0,
            y: 30,
            duration: .8
        }, "-=0.5")

        .from("#hero-3d-target", {
            opacity: 0,
            scale: .5,
            rotate: 90,
            duration: 1.4
        }, "-=1");

    // Scroll Indicator
    gsap.to(".scroll-indicator", {
        y: 15,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut"
    });

    // Floating Buttons
    gsap.to(".hero-btn", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: .2,
        ease: "sine.inOut"
    });

});