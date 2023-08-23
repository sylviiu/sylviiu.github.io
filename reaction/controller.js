let pollingGamepads = false;

const gamepads = {};

const gamepadsHook = [];

const refreshGamepadHook = () => {
    for(const hook of gamepadsHook) hook(gamepads);
}

const connect = (navigatorGamepad) => {
    let timestamp = navigatorGamepad.timestamp;

    const useID = `gamepad-${navigatorGamepad.mapping}-${navigatorGamepad.index}`;

    if(!gamepads[useID]) {
        const gamepad = {
            useID,
            axes: navigatorGamepad.axes ? navigatorGamepad.axes.map(a => 0) : navigatorGamepad.axes,
            buttons: navigatorGamepad.buttons ? navigatorGamepad.buttons.map(a => 0) : navigatorGamepad.buttons,
            vibrate: (duration=150) => {
                if(!navigatorGamepad.connected) return console.log(`[vibrate] gamepad disconnected`)
    
                if(navigatorGamepad.vibrationActuator && typeof navigatorGamepad.vibrationActuator.playEffect == `function`) {
                    navigatorGamepad.vibrationActuator.playEffect("dual-rumble", {
                        duration: duration,
                        strongMagnitude: 1.0,
                        weakMagnitude: 1.0
                    });
                } else if(navigatorGamepad.hapticActuators && navigatorGamepad.hapticActuators.length > 0 && navigatorGamepad.hapticActuators.filter(o => typeof o.pulse == `function`)) {
                    for(const hapticActuator of navigatorGamepad.hapticActuators.filter(o => typeof o.pulse == `function`)) {
                        hapticActuator.pulse(duration, 1.0);
                    }
                }
            }
        }
    
        gamepads[useID] = gamepad;
    
        refreshGamepadHook();
    
        if(!gamepad.updateInterval) gamepad.updateInterval = setInterval(() => {
            if(!navigatorGamepad.connected) return console.log(`gamepad disconnected`)
    
            if(pollingGamepads) navigatorGamepad = navigator.getGamepads()[navigatorGamepad.index];
    
            if(navigatorGamepad.timestamp == timestamp) return;
    
            console.log(`update`, navigatorGamepad)
    
            timestamp = navigatorGamepad.timestamp;

            const axesHooks = Object.keys(gamepad).filter(k => k.startsWith(`onaxis`) && typeof gamepad[k] == `function`).map(k => gamepad[k]);
    
            if(axesHooks.length > 0 && navigatorGamepad.axes && navigatorGamepad.axes.length > 0) {
                for(const i in navigatorGamepad.axes) {
                    if(navigatorGamepad.axes[i] != gamepad.axes[i]) axesHooks.forEach(h => h(i, navigatorGamepad.axes[i], timestamp));
                }
    
                gamepad.axes = navigatorGamepad.axes.slice();
            }
    
            const buttonHooks = Object.keys(gamepad).filter(k => k.startsWith(`onbutton`) && typeof gamepad[k] == `function`).map(k => gamepad[k]);

            if(buttonHooks.length > 0 && navigatorGamepad.buttons && navigatorGamepad.buttons.length > 0) {
                for(const i in navigatorGamepad.buttons) {
                    if(navigatorGamepad.buttons[i].value != gamepad.buttons[i]) buttonHooks.forEach(h => h(i, navigatorGamepad.buttons[i], timestamp));
                };
    
                gamepad.buttons = navigatorGamepad.buttons.map((button) => button.value);
            }
        }, 25)
    }
}

if(!(`ongamepadconnected` in window)) {
    console.log(`gamepadconnected not supported, polling gamepads`);

    pollingGamepads = true;

    setInterval(() => {
        const gamepads = navigator.getGamepads();

        for(const gamepad of gamepads) {
            if(gamepad) connect(gamepad);
        }
    }, 500);

    window.addEventListener('gamepadconnected', (e) => {
        if(e.gamepad) connect(e.gamepad);
    });
} else {
    console.log(`gamepadconnected supported, using event listener`);
    
    window.addEventListener('gamepadconnected', (e) => connect(e.gamepad));
}

window.addEventListener('gamepaddisconnected', (e) => {
    const gamepad = e.gamepad;
    console.log(`disconnect`, gamepad)

    if(gamepads[gamepad.index].updateInterval) clearInterval(gamepads[gamepad.index].updateInterval)

    delete gamepads[gamepad.index];

    refreshGamepadHook();
});