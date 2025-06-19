import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ideasReducer from './slices/ideasSlice';
import trendsReducer from './slices/trendsSlice';
import calendarReducer from './slices/calendarSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    trends: trendsReducer,
    calendar: calendarReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date objects
        ignoredActionPaths: ['payload.calendarDate'],
        ignoredPaths: [
          'ideas.items.calendarDate',
          'calendar.events.calendarDate'
        ],
      },
    }),
});

export default store;