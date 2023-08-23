const getIcon = (type, style={}) => {
    const icon = document.createElement('i');

    icon.classList.add('fa-solid');
    icon.classList.add(`fa-${type}`);

    if(typeof style == `object`) for(const [ prop, value ] of Object.entries(style)) {
        icon.style[prop] = value;
    };

    return icon;
}

const getLine = (style={}) => {
    const line = document.createElement('div');
    line.id = `line`
    line.style.height = `4px`;
    line.style.width = `100%`;
    line.style.borderRadius = `2px`;
    line.style.backgroundColor = `rgb(255, 255, 255)`;
    line.style.opacity = `1`;

    if(typeof style == `object`) for(const [ prop, value ] of Object.entries(style)) {
        line.style[prop] = value;
    };

    return line;
}

const getVerticalLine = (styleOpts={}, animeOpts={}) => {
    const line = getLine(Object.assign({ width: `4px`, height: `0px` }, styleOpts));

    anime(Object.assign({
        targets: line,
        height: `17px`,
        marginBottom: `-7px`,
        marginTop: `-10px`,
        easing: 'easeOutBack',
        duration: 500,
    }, animeOpts));

    return line;
}

const getPopoutText = (string, styleOpts={}) => {
    const txt = document.createElement(`h4`);

    txt.style.backgroundColor = `rgb(35, 35, 35)`;
    txt.style.color = `rgb(255, 255, 255)`;
    txt.style.padding = `5px 8px`;
    txt.style.borderRadius = `999px`;
    
    txt.style.position = `absolute`;

    txt.innerText = string;
    
    if(typeof styleOpts == `object`) for(const [ prop, value ] of Object.entries(styleOpts)) {
        txt.style[prop] = value;
    };

    return txt;
}