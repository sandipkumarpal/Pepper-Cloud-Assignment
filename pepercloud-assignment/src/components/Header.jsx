import React from 'react';

function Header(props) {
    return (
        <header className="header">
            <div className="container">
                {props.children || "Header"}
            </div>
        </header>
    );
}

export default Header;