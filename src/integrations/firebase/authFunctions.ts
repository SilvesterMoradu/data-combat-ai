import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { showSuccess, showError } from '@/utils/toast';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    showSuccess(`Welcome, ${user.displayName || user.email}!`);
    return user;
  } catch (error: any) {
    console.error('Error during Google sign-in:', error);
    showError(`Failed to sign in with Google: ${error.message}`);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    showSuccess('You have been logged out successfully!');
  } catch (error: any) {
    console.error('Error during sign-out:', error);
    showError(`Failed to log out: ${error.message}`);
  }
};