import { useState } from 'react';
import { projectFirestore, projectAuth } from '../firebase/config';

export const useRemoveUser = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const removeUser = async (userId) => {
        setError(null);
        setIsPending(true);

        try {
            // Remove the user document from the "users" collection
            await projectFirestore.collection('users').doc(userId).delete();

            // Remove the user from the authentication system
            const user = projectAuth.currentUser;
            if (user) {
                await user.delete();
            }

            if (!isPending) {
                setIsPending(false);
                setError(null);
            }
        } catch (error) {
            if (!isPending) {
                setError(error.message);
                setIsPending(false);
            }
        }
    };

    return { removeUser, error, isPending };
};
