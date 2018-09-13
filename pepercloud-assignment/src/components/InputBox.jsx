import React from 'react';

function InputBox(props) {
    return (
        <div className="inputBox">
            <input {...props} />
        </div>
    );
}

export default InputBox;
