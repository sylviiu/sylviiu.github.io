const buttons = [];

document.body.querySelectorAll(`.btn`).forEach(btn => {
    if(btn.href) {
        const href = btn.href;
        btn.removeAttribute(`href`);

        btn.onclick = () => {
            btn.style.marginLeft = `0px`;

            const bounds = btn.getBoundingClientRect();

            const target = popout(btn, false);

            const originalRadius = bounds.width/2

            target.style.borderRadius = originalRadius + `px`

            console.log(target);

            const duration = 1000;

            anime({
                targets: target.childNodes,
                scale: 2,
                duration: duration/5,
                easing: `easeInCirc`,
                complete: () => anime({
                    targets: target.childNodes,
                    opacity: 0,
                    scale: 5,
                    duration: duration,
                    easing: `easeOutExpo`,
                })
            })

            anime({
                targets: target,
                left: `${bounds.x * (4.25/5)}px`,
                top: `${bounds.y * (4.25/5)}px`,
                width: `${100/5}vw`,
                height: `${100/5}vh`,
                maxWidth: `${100/5}vw`,
                maxHeight: `${100/5}vh`,
                filter: `invert(100%)`,
                borderRadius: originalRadius * (4.25/5),
                duration: duration/5,
                easing: `easeInCirc`,
                complete: () => {
                    setTimeout(() => window.location.href = href, duration/3)

                    anime({
                        targets: target,
                        left: `0px`,
                        top: `0px`,
                        width: `100vw`,
                        height: `100vh`,
                        maxWidth: `100vw`,
                        maxHeight: `100vh`,
                        marginLeft: 0,
                        borderRadius: 0,
                        duration: duration - (duration/5),
                        easing: `easeOutExpo`,
                    })
                }
            })
        }
    }
})