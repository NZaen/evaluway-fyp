import React from 'react';
import { useCollection } from '../hooks/useCollection';
import Avatar from './Avatar';
import './OnlineUsers.css';

export default function OnlineUsers() {
    const { isPending, error, documents } = useCollection('users');

    return (
        <div className="user-list scrollbar">
            <h2>Users</h2>
            {isPending && <div>Loading users...</div>}
            {error && <div>{error}</div>}
            {documents && documents.map((user) => (
                <div key={user.id} className="user-list-item">
                    {user.online && <span className="online-user"></span>}
                    <span>{user.displayName}</span>
                    <div className="avatar-wrapper-side" >
                        <img src={user.photoURL} alt="user avatar" />
                    </div>
                </div>
            ))}
        </div>
    );
}
