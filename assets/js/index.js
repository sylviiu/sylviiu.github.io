const img = document.body.querySelector(`#img`);
const imgOverlay = document.body.querySelector(`#img-overlay`);

const backgrounds = [`creature.webp`, `bright2.webp`, `jinx.webp`, `jinx2.webp`, `jinxsneefa.webp`];

img.style.background = img.style.background.replace(`bright2.webp`, backgrounds[Math.floor(Math.random() * backgrounds.length)]);

anime({
    targets: imgOverlay,
    backdropFilter: [`brightness(0%)`, `brightness(100%)`],
    duration: 1500,
    delay: anime.stagger(35),
    easing: `easeOutExpo`,
});

const strings = [ `software developer`, `creature`, `vr enthusiast`, `eeper`, `i'm probably asleep right now actually` ];

imgOverlay.childNodes.forEach((node, i) => {
    if(node && node.id && node.id.startsWith(`string`)) {
        node.innerText = strings.splice(Math.floor(Math.random() * strings.length), 1)[0];
    }

    if(node && node.style) anime({
        targets: node,
        opacity: [0, 1],
        duration: 1500,
        letterSpacing: [`6px`, `0px`],
        right: [`50px`, `0px`],
        delay: 80 * (i+1),
        easing: `easeOutExpo`,
    })
})

anime({
    targets: img,
    left: [-100, 0],
    duration: 1500,
    easing: `easeOutExpo`,
})
