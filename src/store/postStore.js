import { create } from "zustand";

const usePostStore = create((set) => ({
	posts: [],

	createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

	deletePost: (id) =>
		set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),

	setPosts: (posts) => set({ posts }),

	setSavedPosts: (posts) => set({ posts }),

	setLikedPosts: (posts) => set({ posts }),

	// Add a new comment
	addComment: (postId, comment) =>
		set((state) => ({
			posts: state.posts.map((post) =>
				post.id === postId
					? { ...post, comments: [...post.comments, comment] }
					: post
			),
		})),

	// Update the existing comment
	updateComment: (postId, commentId, newText) =>
		set((state) => ({
			posts: state.posts.map((post) =>
				post.id === postId
					? {
							...post,
							comments: post.comments.map((comment) =>
								comment.id === commentId ? { ...comment, comment: newText } : comment
							),
						}
					: post
			),
		})),

	// Remove a comment
	removeComment: (postId, commentId) =>
		set((state) => ({
			posts: state.posts.map((post) =>
				post.id === postId
					? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
					: post
			),
		})),
}));

export default usePostStore;
