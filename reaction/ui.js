const controllersDiv = document.getElementById('controllersDiv');

const reactionTime = document.getElementById('reactionTime');
const waiting = reactionTime.querySelector('#waiting');

let anim = null;

let waitingAnim = () => anim = anime({
    targets: waiting,
    opacity: [0.7, 0.3],
    easing: 'easeOutCirc',
    duration: 1500,
    complete: () => waitingAnim()
});

const reset = () => {
    anime.remove(waiting);
    waiting.removeAttribute('style');
    waitingAnim();
};

reset();

gamepadsHook.push((gamepads) => {
    for(const gamepad of Object.values(gamepads)) {
        const id = `${gamepad.id}-${gamepad.index}`;

        console.log(`checking for controller "${id}"`)

        if(!controllersDiv.querySelector(`#${id}`)) {
            console.log(`adding controller "${id}"`)

            const icon = getIcon('gamepad', { color: `#bababa` });

            gamepad.state.onbutton = (i, button) => {
                anime.remove(icon);

                console.log(`button ${i}: ${button.value}`)

                const brightness = (button.value * 70) + 185;

                anime({
                    targets: icon,
                    scale: 1 + (button.value * 0.5),
                    color: `rgb(${brightness}, ${brightness}, ${brightness})`,
                    easing: 'easeOutCirc',
                    duration: 250
                })
            };

            controllersDiv.appendChild(icon);

            console.log(`added controller "${id}"`)
        }
    }
})