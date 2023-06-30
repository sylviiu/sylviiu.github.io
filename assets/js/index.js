const img = document.body.querySelector(`#img`);
const imgOverlay = document.body.querySelector(`#img-overlay`);

anime({
    targets: imgOverlay,
    backdropFilter: [`brightness(0%)`, `brightness(100%)`],
    duration: 1500,
    delay: anime.stagger(35),
    easing: `easeOutExpo`,
})

imgOverlay.childNodes.forEach((node, i) => {
    if(node && node.style) {
        const bounds = node.getBoundingClientRect();

        anime({
            targets: node,
            opacity: [0, 1],
            width: [bounds.width*1.5, bounds.width*(node.id == `links` ? 1 : 1.1)],
            duration: 1500,
            letterSpacing: [`6px`, `0px`],
            right: [`50px`, `0px`],
            delay: 80 * (i+1),
            easing: `easeOutExpo`,
        })
    }
})

anime({
    targets: img,
    background: [img.style.background, img.style.background.replace(`-100px`, `0px`)],
    duration: 1500,
    easing: `easeOutExpo`,
})