const gamepads = {};

const gamepadsHook = [];

const refreshGamepadHook = () => {
    for(const hook of gamepadsHook) hook(gamepads);
}

window.addEventListener('gamepadconnected', (e) => {
    const gamepad = e.gamepad;
    console.log(`connect`, gamepad)

    let timestamp = gamepad.timestamp

    gamepad.state = {
        axes: gamepad.axes ? gamepad.axes.slice() : gamepad.axes,
        buttons: gamepad.buttons ? gamepad.buttons.map((button) => button.value) : gamepad.buttons,
    };

    gamepads[gamepad.index] = gamepad;

    refreshGamepadHook();

    gamepad.updateInterval = setInterval(() => {
        if(!gamepad.connected) return console.log(`gamepad disconnected`)

        if(gamepad.timestamp == timestamp) return;

        timestamp = gamepad.timestamp;

        if(gamepad.axes && gamepad.axes.length > 0) {
            for(const i in gamepad.axes) {
                if(gamepad.axes[i] != gamepad.state.axes[i] && gamepad.state.onaxis) gamepad.state.onaxis(i, gamepad.axes[i]);
            }

            gamepad.state.axes = gamepad.axes.slice();
        }

        if(gamepad.buttons && gamepad.buttons.length > 0) {
            for(const i in gamepad.buttons) {
                if(gamepad.buttons[i].value != gamepad.state.buttons[i] && gamepad.state.onbutton) gamepad.state.onbutton(i, gamepad.buttons[i]);
            };

            gamepad.state.buttons = gamepad.buttons.map((button) => button.value);
        }
    }, 25)
});

window.addEventListener('gamepaddisconnected', (e) => {
    const gamepad = e.gamepad;
    console.log(`disconnect`, gamepad)

    if(gamepads[gamepad.index].updateInterval) clearInterval(gamepads[gamepad.index].updateInterval)

    delete gamepads[gamepad.index];

    refreshGamepadHook();
});