
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import { signOut } from "firebase/auth";

const useLogin = () => {
	const showToast = useShowToast();
	const [signInWithEmailAndPassword, , loading, error] = useSignInWithEmailAndPassword(auth);
	const loginUser = useAuthStore((state) => state.login);

	const login = async (inputs) => {
		if (!inputs.email || !inputs.password) {
			return showToast("Error", "Please fill all the fields", "error");
		}

		try {
			// **Step 1: Sign in with Firebase Auth**
			const userCred = await signInWithEmailAndPassword(inputs.email, inputs.password);
			const user = userCred.user;

			if (!user) {
				showToast("Error", "Invalid login credentials", "error");
				return;
			}

			// **Step 2: Get user data from Firestore**
			const docRef = doc(firestore, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				showToast("Error", "No account found. Please sign up.", "error");
				await signOut(auth); 
				return;
			}

			const userData = docSnap.data();

			// **Step 3: If user is deleted, log them out immediately**
			if (userData.deleted) {
				showToast("Error", "Account deleted. Contact support.", "error");
				await signOut(auth);
				localStorage.removeItem("user-info");
				return;
			}

			// **Step 4: Proceed with login**
			localStorage.setItem("user-info", JSON.stringify(userData));
			loginUser(userData);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { loading, error, login };
};

export default useLogin;

