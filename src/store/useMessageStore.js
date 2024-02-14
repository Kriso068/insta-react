import { create } from "zustand";

const useMessageStore = create((set) => ({
	messages: [],
	createMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
	deleteMessage: (id) => set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),
	setMessages: (messages) => set({ messages }),

}));

export default useMessageStore;
