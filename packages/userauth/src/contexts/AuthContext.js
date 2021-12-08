import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);
	const history = useHistory();

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return auth.signOut();
	}

	function resetPassword(email) {
		return auth.sendPasswordResetEmail(email);
	}

	function updateEmail(email) {
		return currentUser.updateEmail(email);
	}

	function updatePassword(password) {
		return currentUser.updatePassword(password);
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
			history.push('/')
			
		});

		return unsubscribe;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value = {
		currentUser,
		login,
		signup,
		logout,
		resetPassword,
		updateEmail,
		updatePassword,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
