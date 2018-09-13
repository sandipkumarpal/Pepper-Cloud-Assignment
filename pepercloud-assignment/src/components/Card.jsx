import React from 'react';

function Card({data}) {
    return (
        <div className="card">
            <img src={data.user.profile_image_url} alt={data.user.name} />
            <div className="card-body">
                <div className="card-text">{data.text}</div>
                <div className="card-time">
                    {new Date(data.created_at).toLocaleTimeString()}
                </div>
                <div className="card-user">
                    <a href={`https://twitter.com/${data.user.screen_name}`} target="_blank">{`@${data.user.screen_name}`}</a>
                </div>
            </div>
        </div>
    );
}

export default Card;
