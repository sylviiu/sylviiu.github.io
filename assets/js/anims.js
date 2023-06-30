const customEaseInOut = (val) => {
    const logAndReturn = (value) => {
        value = Math.min(value, 1)
        console.log(`${val} -> ${value}`);
        return value;
    }

    if(val < 0.3) {
        logAndReturn(anime.easing(`easeInCirc`)(val/0.3)*0.3);
    } else {
        logAndReturn((0.3) + (anime.easing(`easeOutExpo`)(((val-0.3)/0.7))*0.7));
    }
}