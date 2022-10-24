import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { createReducer } from './reducers'
import rootSagas from './sagas'
import { RootState } from 'types'
import { fatalErrorActions } from 'app/state/fatalerror'

export function configureAppStore(state?: Partial<RootState>) {
  const sagaMiddleware = createSagaMiddleware({
    onError: (error, info) => {
      store.dispatch(
        fatalErrorActions.setError({
          message: error.toString(),
          stack: error.stack,
          sagaStack: info.sagaStack,
        }),
      )
    },
  })

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware]

  const store = configureStore({
    reducer: createReducer(),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: ['payload.handleConfirm'],
          ignoredPaths: ['modal.current.handleConfirm', 'modal.stash'],
        },
      }).concat(middlewares),
    devTools:
      /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production',
    preloadedState: state,
  })

  sagaMiddleware.run(rootSagas)

  return store
}
