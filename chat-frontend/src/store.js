import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/userSlice'
import appApi from './services/appApi'

/*persist our store so you dont have to login everytime you refresh/close the page */
import storage from 'redux-persist/lib/storage'
import {combineReducers} from 'redux'
import { persistReducer } from 'redux-persist'

/* import thunk to allow async */
import thunk from 'redux-thunk'

// combine reducers,because we can only have 1 reducer / store
const reducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]:appApi.reducer
})

const persistConfig = {
  key: 'root',
  storage,
  blackList:[appApi.reducerPath]
}

//persist our store

const persistedReducer = persistReducer(persistConfig, reducer)

// creating the store
const store = configureStore({
  reducer: persistedReducer,
  middleware:[thunk,appApi.middleware]
})

export default store