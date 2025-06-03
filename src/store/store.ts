import { configureStore } from "@reduxjs/toolkit";

const initialState = { public: "", typeofblock: "" };

const rootReducer = (state = initialState, action: any) => {
	// You should handle actions here, for now just return state
	if (action.type === "UPDATE") {
		return {
			...state,
			public: action.payload.public,
			typeofblock: action.payload.typeofblock,
		};
	}
	return state;
};

export const store = configureStore({
	reducer: rootReducer,
});
