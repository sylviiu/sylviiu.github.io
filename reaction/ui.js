const controllersDiv = document.getElementById('controllersDiv');

const reactionTime = document.getElementById('reactionTime');
const waiting = reactionTime.querySelector('#waiting');

const settingsDiv = document.getElementById('settings');

let anim = null;

let waitingAnim = () => anim = anime({
    targets: waiting,
    opacity: [0.7, 0.3],
    easing: 'easeOutCirc',
    duration: 1500,
    complete: () => waitingAnim()
});

let started = null;

const reset = async (removeNodes) => {
    if(removeNodes) await new Promise(res => {
        anime.remove(removeNodes);
        anime({
            targets: removeNodes,
            height: 0,
            opacity: 0,
            easing: 'easeOutExpo',
            duration: 500,
            complete: () => {
                for(const node of removeNodes) {
                    if(node.parentNode) node.parentNode.removeChild(node);
                };

                res();
            }
        })
    });

    settingsDiv.removeAttribute('style');

    started = null;

    anime.remove(waiting);
    waiting.setAttribute('style', 'width: 100%');

    anime({
        targets: waiting,
        opacity: [0, 0.7],
        scale: [0, 1],
        easing: 'easeOutBack',
        duration: 500,
        begin: () => waiting.setAttribute(`style`, `width: 100%`),
        complete: () => waitingAnim()
    })
};

const start = (gamepad) => {
    settingsDiv.setAttribute('style', 'display: none;');

    const opts = getOptions();

    anime.remove(waiting);

    anime({
        targets: waiting,
        opacity: 0,
        scale: 0,
        easing: 'easeInCirc',
        duration: 500,
        complete: () => {
            waiting.setAttribute(`style`, `display: none;`);
        
            const line = getLine({ width: `4px` });
            reactionTime.appendChild(line);
        
            started = true;
            
            anime({
                targets: line,
                width: `100%`,
                opacity: 0.2,
                easing: 'easeOutCirc',
                duration: 1200,
                complete: () => {
                    const line2 = getLine({ width: `0%`, marginTop: `-4px` });
                    reactionTime.appendChild(line2);

                    const randomTime = Math.random() * 13000;

                    console.log(`randomTime`, randomTime, `name`, name);

                    setTimeout(() => {
                        const beginLine = getVerticalLine({}, {
                            begin: () => {
                                reactionTime.appendChild(beginLine);

                                let sound = null;

                                if(opts.vibration) gamepad.vibrate();
                                if(opts.sound) sound = playRandomSound(opts.volume) 

                                started = performance.now();
                                console.log(`started`, started);

                                const name = `onbuttonGame${started}`

                                gamepad[name] = (i, button, timestamp) => {
                                    if(button.value == 1) {
                                        delete gamepad[name];

                                        if(sound && !sound.paused) sound.pause();

                                        const time = timestamp - started;

                                        console.log(`time`, time);

                                        anime.remove(line2);

                                        const endLine = getVerticalLine({ left: (parseInt(window.getComputedStyle(line2).width) - 2) + `px` }, {
                                            complete: () => {
                                                const txt = getPopoutText(`${Math.round(time)}ms`, {
                                                    top: `calc(50vh + 20px)`,
                                                    left: `calc(50vw - ${parseInt(window.getComputedStyle(line).width)/2}px + ${parseInt(window.getComputedStyle(line2).width)}px - 20px)`,
                                                });

                                                anime({
                                                    targets: txt,
                                                    opacity: [0, 1],
                                                    easing: 'easeOutExpo',
                                                    duration: 500,
                                                    begin: () => document.body.appendChild(txt),
                                                    complete: () => {
                                                        gamepad.onbuttonReset = (i, button) => {
                                                            if(button.value == 1) {
                                                                delete gamepad.onbuttonReset;
        
                                                                reset([line, line2, beginLine, endLine, txt]);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });

                                        reactionTime.appendChild(endLine);
                                    }
                                }

                                anime({
                                    targets: line2,
                                    width: `100%`,
                                    easing: `linear`,
                                    duration: 5000,
                                    complete: () => {
                                        delete gamepad[name];
                                        reset([line, line2, beginLine]);
                                    }
                                });
                            }
                        })
                    }, randomTime);
                }
            })
        }
    })
}

reset();

gamepadsHook.push((gamepads) => {
    const connectedIDS = [];

    for(const gamepad of Object.values(gamepads)) {
        const id = gamepad.useID

        connectedIDS.push(id);

        console.log(`checking for controller "${id}"`)

        if(!controllersDiv.querySelector(`#${id}`)) {
            console.log(`adding controller "${id}"`);

            gamepad.vibrate();

            const icon = getIcon('gamepad', { color: `#bababa` });
            icon.id = id;

            gamepad.onbutton = (i, button) => {
                anime.remove(icon);

                console.log(`button ${i}: ${button.value}`);

                if(i == 0 && button.value == 1 && !started) start(gamepad)

                const brightness = (button.value * 70) + 185;

                anime({
                    targets: icon,
                    scale: 1 + (button.value * 0.5),
                    color: `rgb(${brightness}, ${brightness}, ${brightness})`,
                    easing: 'easeOutCirc',
                    duration: 250
                })
            };

            anime({
                targets: icon,
                scale: [0, 1],
                easing: 'easeOutBack',
                duration: 500,
                begin: () => controllersDiv.appendChild(icon)
            })

            console.log(`added controller "${id}"`)
        } else console.log(`controller "${id}" already exists`)
    };

    for(const controller of controllersDiv.childNodes) {
        if(controller.id && !connectedIDS.includes(controller.id)) {
            console.log(`removing controller "${controller.id}"`)

            controllersDiv.removeChild(controller);

            console.log(`removed controller "${controller.id}"`)
        }
    }
})