import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import './Profile.css';
import Avatar from '../../components/Avatar';
import { projectAuth } from '../../firebase/config';

export default function Profile() {
    const { user } = useAuthContext();
    const { documents } = useCollection('users');
    const { uid } = projectAuth.currentUser;

    return (
        <div>
            <h2 className="page-title">Profile</h2>
            <div className="profile">
                <div className="avatar-container">
                    <Avatar src={user.photoURL} />
                </div>

                {documents &&
                    documents.map((user) => {
                        if (user.id === uid) {
                            return (
                                <div key={uid} className="user-details">
                                    <div>
                                        <span>User ID:</span> {user.id}
                                    </div>
                                    <div>
                                        <span>Display Name:</span> {user.displayName}
                                    </div>
                                    <div>
                                        <span>Location:</span> {user.location}
                                    </div>
                                    <div>
                                        <span>Age:</span> {user.age}
                                    </div>
                                    <div>
                                        <span>Occupation:</span> {user.occupation}
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                <h3>{user.fullName}</h3>
            </div>
        </div>
    );
}
