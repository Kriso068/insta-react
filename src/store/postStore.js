import { create } from "zustand";

const usePostStore = create((set) => ({
	posts: [],
	createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
	deletePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
	setPosts: (posts) => set({ posts }),
	setSavedPosts: (posts) => set({ posts }),
	setLikedPosts: (posts) => set({ posts }),
	addComment: (postId, comment) =>
		set((state) => ({
			posts: state.posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: [...post.comments, comment],
					};
				}
				return post;
			}),
		})),
	updateComment: (postId, commentId, newText) =>
		set((state) => ({
			posts: state.posts.map((post) =>
				post.id === postId
					? {
							...post,
							comments: post.comments.map((comment) =>
								comment.id === commentId ? { ...comment, text: newText } : comment
							),
						}
					: post
			),
		})),

}));

export default usePostStore;
