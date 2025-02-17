import { useState } from "react";
import { firestore, auth, storage } from "../firebase/firebase";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const useDeleteProfile = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const showToast = useShowToast();
    const navigate = useNavigate();

    const deleteProfile = async () => {
        if (!authUser) return;
        setIsDeleting(true);
    
        try {
            const userDocRef = doc(firestore, "users", authUser.uid);
    
            // **Step 1: Mark User as Deleted Instead of Removing**
            await updateDoc(userDocRef, {
                deleted: true,
                email: `deleted_${authUser.email}`, // Prevent email re-use
                username: "Deleted User",
                usernameLower: "deleted_user",
                profilePicURL: "", // Clear profile picture
            });
    
            // **Step 2: Delete Posts & Update Comments**
            const postsQuery = query(collection(firestore, "posts"), where("createdBy", "==", authUser.uid));
            const postDocs = await getDocs(postsQuery);
    
            for (const post of postDocs.docs) {
                const postId = post.id;
    
                // Delete post document
                await deleteDoc(doc(firestore, "posts", postId));
    
                // Delete associated media from storage
                const mediaRefs = [
                    ref(storage, `posts/${postId}/image`),
                    ref(storage, `posts/${postId}/video`),
                    ref(storage, `posts/${postId}/recordedVideo`),
                ];
                for (const mediaRef of mediaRefs) {
                    try {
                        await deleteObject(mediaRef);
                    } catch (error) {
                        console.warn(`Media not found for post ${postId}, skipping...`);
                    }
                }
            }
    
            // **Step 3: Update Comments to Show "Deleted User"**
            const commentsQuery = query(collection(firestore, "posts"));
            const postsSnapshot = await getDocs(commentsQuery);
    
            for (const post of postsSnapshot.docs) {
                const postData = post.data();
                const updatedComments = postData.comments.map((comment) =>
                    comment.createdBy === authUser.uid
                        ? { ...comment, createdBy: "deleted_user" }
                        : comment
                );
    
                await updateDoc(doc(firestore, "posts", post.id), {
                    comments: updatedComments,
                });
            }
    
            // **Step 4: Delete Profile Picture**
            const profilePicRef = ref(storage, `profilePics/${authUser.uid}`);
            try {
                await deleteObject(profilePicRef);
            } catch (error) {
                console.warn("No profile picture found, skipping deletion...");
            }
    
            // **Step 5: Logout User & Redirect to Auth Page**
            logout();
            navigate("/auth");
    
            showToast("Success", "Your account has been deleted.", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    };
    

    return { deleteProfile, isDeleting };
};

export default useDeleteProfile;
