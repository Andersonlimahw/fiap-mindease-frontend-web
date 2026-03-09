import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuthStore } from '../../stores/useAuthStore';

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

// Map Firebase User to local User following Mobile pattern
const mapUser = (user: FirebaseUser | null) => {
    if (!user || !user.email) return null;
    
    // Seguindo o padrão Mobile: id mapeia diretamente para o uid do FirebaseUser
    // Ex: rWXMMLXS8DXD7mQZRN7LcspCoUq2
    const id = user.uid;

    return {
        id: id,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoUrl: user.photoURL || undefined,
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
                isLoading: false
            });
        });
    },

    /**
     * Login with Google
     */
    loginWithGoogle: async (): Promise<void> => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = mapUser(userCredential.user);

            useAuthStore.setState({
                isAuthenticated: true,
                user,
            });
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
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
