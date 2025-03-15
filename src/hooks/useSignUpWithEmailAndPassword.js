import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import defaultProfilePicURL from "../assets/avatar-default.png";

const useSignUpWithEmailAndPassword = () => {
	const [createUserWithEmailAndPassword, , loading, error] = useCreateUserWithEmailAndPassword(auth);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	// Only allows letters, numbers, dots, and underscores
	const usernamePattern = /^[a-zA-Z0-9._]+$/; 
	
	const signup = async (inputs) => {
		// Check if all fields are filled
		if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
			showToast("Error", "Please fill all the fields", "error");
			return;
		}

		// Validate username format
		if (!usernamePattern.test(inputs.username)) {
			showToast("Error", "Username can only contain letters, numbers, dots (.), and underscores (_)", "error");
			return;
		}

		const forbiddenUsernames = ["deleted_user", "deleted user", "deleted.user"]; // Prevent restricted usernames

        if (forbiddenUsernames.includes(inputs.username.toLowerCase())) {
            showToast("Error", "This username is reserved. Please choose another.", "error");
            return;
        }
		const usersRef = collection(firestore, "users");
		const q = query(usersRef, where("username", "==", inputs.username));
		const querySnapshot = await getDocs(q);

		// Check if username already exists
		if (!querySnapshot.empty) {
			showToast("Error", "Username already exists", "error");
			return;
		}

		try {
			const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
			if (!newUser && error) {
				showToast("Error", error.message, "error");
				return;
			}

			if (newUser) {
				const userDoc = {
					uid: newUser.user.uid,
					email: inputs.email,
					username: inputs.username,
					usernameLower: inputs.username.toLowerCase(),
					fullName: inputs.fullName,
					bio: "",
					profilePicURL: defaultProfilePicURL,
					followers: [],
					following: [],
					messages: [],
					blockedUsers: [],
					posts: [],
					saved: [],
					createdAt: Date.now(),
					deleted: false,
				};
				await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
				localStorage.setItem("user-info", JSON.stringify(userDoc));
				loginUser(userDoc);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;
