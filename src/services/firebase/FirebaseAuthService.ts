import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuthStore } from '../../stores/useAuthStore';

// Map Firebase User to local User
const mapUser = (user: FirebaseUser | null) => {
    if (!user || !user.email) return null;
    return {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
    };
};

export const FirebaseAuthService = {
    /**
     * Initialize listener for auth state changes
     */
    init: () => {
        return onAuthStateChanged(auth, (firebaseUser) => {
            const user = mapUser(firebaseUser);
            useAuthStore.setState({
                isAuthenticated: !!user,
                user,
                isLoading: false // Assuming we might add this to the store later to prevent flash
            });
        });
    },

    /**
     * Login with Email and Password
     */
    login: async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = mapUser(userCredential.user);

            useAuthStore.setState({
                isAuthenticated: true,
                user,
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Log out current user
     */
    logout: async (): Promise<void> => {
        try {
            await signOut(auth);
            useAuthStore.setState({
                isAuthenticated: false,
                user: null,
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};
