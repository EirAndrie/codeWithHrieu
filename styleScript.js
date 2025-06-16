// check if device dimension is on mobile view
const isMobile = window.innerWidth <= 600;

//render hamburger menu once in mobile device dimensions
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('primary-navigation');
    const navLinks = document.querySelectorAll('#primary-navigation li');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');

        // Update ARIA state for accessibility
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Scroll to section and hide nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
    });
});



//custom cursor background that follows along
const customCursor = document.getElementById('customCursor');
// Move the cursor
if(!isMobile && customCursor) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(customCursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.18,
            ease: "power3.out"
        });
    }); 
} else if (customCursor) {
    customCursor.style.display = 'none';
}
//end

gsap.registerPlugin(ScrollTrigger); //call library or plugin

//script to direct user to parts of the webpage when navigation buttons clicked
document.querySelectorAll('.navButtons li[data-target]').forEach(li => {
    li.addEventListener('click', function() {
        const section = document.getElementById(this.dataset.target);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
//end



ScrollTrigger.matchMedia({
    // Desktop view animations
    "(min-width: 601px)": function () {
        // script to reveal text as a whole in 1 animation
        gsap.utils.toArray('.revealOnScroll').forEach(el => {
            const delay = parseFloat(el.dataset.delay) || 0;
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: delay,
                ease: "power3.out"
            });
        });
        // end

        //script to reveal each text in 1 animation on scroll
        document.querySelectorAll('.revealOnScrollEachLetter').forEach(el => {
            el.innerHTML = el.textContent.split('').map(letter =>
                letter === ' ' ? '<span> </span>' : `<span>${letter}</span>`
            ).join('');
            gsap.from(el.querySelectorAll('span'), {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                y: 100,
                opacity: 0,
                stagger: 0.03,
                duration: 0.5,
                ease: 'power3.out',
            });
        });
        //end
        
        //script for text color animation on scroll
        document.querySelectorAll('.colorScrollText').forEach(el => {
            el.innerHTML = el.innerHTML
                .split(/(<br\s*\/?>)/gi)
                .map(part => {
                    if (part.match(/<br\s*\/?>/i)) return part;
                    return part.replace(/([^\s<>])/g, '<span>$1</span>');
                }).join('');
            const spans = el.querySelectorAll('span');
            gsap.to(spans, {
                color: "#fff",
                stagger: {
                    each: 0.03,
                    from: "start"
                },
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: true,
                    toggleActions: "play reverse play reverse"
                }
            });
        });
        //end

        // video demo reveal on mouse hover
        const hoverVideo = document.getElementById('hoverVideo');
        const hoverVideoSource = document.getElementById('hoverVideoSource');

        let moveHandler = null;
        let currentCardIndex = null;
        let clickHandler = null;

        document.querySelectorAll('.projectCard').forEach((card, idx) => {
            card.addEventListener('mouseenter', (e) => {
                if (currentCardIndex !== idx) {
                    gsap.to(hoverVideo, { opacity: 0, duration: 0.3, onComplete: () => {
                    hoverVideoSource.src = videoSources[idx];
                    hoverVideo.load();
                    hoverVideo.play();
                    gsap.to(hoverVideo, { opacity: 1, duration: 0.5 });
                }});
                } else {
                    hoverVideo.play();
                    gsap.to(hoverVideo, { opacity: 1, duration: 0.3 });
                }
                currentCardIndex = idx;

                moveHandler = function(e) {
                    gsap.set(hoverVideo, {
                        x: e.clientX,
                        y: e.clientY
                    });
                };
                document.addEventListener('mousemove', moveHandler);

                clickHandler = function() {
                    if(projectUrls[idx]) {
                    window.open(projectUrls[idx], '_blank');
                }
            };
            hoverVideo.addEventListener('click', clickHandler);
        });

        card.addEventListener('mouseleave', () => {
            hoverVideo.pause();
                gsap.to(hoverVideo, { opacity: 0, duration: 0.3 });
                    if (moveHandler) {
                        document.removeEventListener('mousemove', moveHandler);
                        moveHandler = null;
                    }
                    if (clickHandler) {
                        hoverVideo.removeEventListener('click', clickHandler);
                        clickHandler = null;
                    }
                    currentCardIndex = null;
                });
            });
    }
});

document.querySelectorAll('.siteLinks').forEach(wrapper => {
    const overlay = wrapper.querySelector('.visitOverlay');

    wrapper.addEventListener('mousemove', e => {
        const rect = wrapper.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        overlay.style.left = `${x}px`;
        overlay.style.top = `${y}px`;
        overlay.style.opacity = '1';
    });

    wrapper.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
    });
});

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});