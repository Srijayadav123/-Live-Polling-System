// pollSlice.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'poll',
  initialState: {
    pollId: null,
    title: '',
    questions: [],
    currentQuestion: null,
    students: [],
    partial: null,
    history: []
  },
  reducers: {
    setPoll(state, action) { Object.assign(state, action.payload); },
    setCurrentQuestion(state, action) { state.currentQuestion = action.payload; },
    setStudents(state, action) { state.students = action.payload; },
    setPartial(state, action) { state.partial = action.payload; },
    addHistory(state, action) { state.history = action.payload; }
  }
});
export const { setPoll, setCurrentQuestion, setStudents, setPartial, addHistory } = slice.actions;
export default slice.reducer;
