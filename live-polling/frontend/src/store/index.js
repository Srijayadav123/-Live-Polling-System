import { configureStore, createSlice } from "@reduxjs/toolkit";

// Slice to manage poll state
const pollSlice = createSlice({
  name: "poll",
  initialState: {
    currentQuestion: null,
    options: [],
    results: [],
    students: [],
  },
  reducers: {
    setQuestion: (state, action) => {
      state.currentQuestion = action.payload.question;
      state.options = action.payload.options.map((opt) => ({ text: opt, votes: 0 }));
      state.results = [];
    },
    submitVote: (state, action) => {
      const index = action.payload;
      if (state.options[index]) {
        state.options[index].votes += 1;
      }
    },
    resetPoll: (state) => {
      state.currentQuestion = null;
      state.options = [];
      state.results = [];
    },
    addStudent: (state, action) => {
      if (!state.students.includes(action.payload)) {
        state.students.push(action.payload);
      }
    },
  },
});

export const { setQuestion, submitVote, resetPoll, addStudent } = pollSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    poll: pollSlice.reducer,
  },
});

export default store;

