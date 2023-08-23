const getIcon = (type, style={}) => {
    const icon = document.createElement('i');

    icon.classList.add('fa-solid');
    icon.classList.add(`fa-${type}`);

    if(typeof style == `object`) for(const [ prop, value ] of Object.entries(style)) {
        icon.style[prop] = value;
    };

    return icon;
}