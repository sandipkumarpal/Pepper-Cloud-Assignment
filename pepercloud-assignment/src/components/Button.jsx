import React from 'react';

function Button(props) {
    const classSet = props.className ? `${props.className} button` : 'button';
    return (
        <button 
            className={classSet} 
            onClick={props.onClick} 
            {...props}
        >
            {props.children || "button"}
        </button>
    );
}

export default Button;
