import React, {Dispatch} from 'react';

type QueriesStateType<Data> = Record<
  string,
  | {status: 'loading'; data: undefined; timeStamp: undefined; error: undefined}
  | {status: 'success'; data: Data; timeStamp: number}
  | {status: 'error'; data: Data; timeStamp?: number; error: unknown}
>;

type ActionType<Data> =
  | {
      type: 'startLoading';
      payload: string;
    }
  | {
      type: 'fetchSuccessful';
      payload: {data: Data; timeStamp: number; key: string};
    }
  | {
      type: 'fetchError';
      payload: {key: string; error: unknown};
    };

type QueriesContextType<Data> = {
  queries: QueriesStateType<Data>;
  dispatch: Dispatch<ActionType<Data>>;
} | null;

const QueriesContext = React.createContext<QueriesContextType<any>>(null);

export function useQuery<FetchResponse>(
  key: string,
  fn: () => Promise<FetchResponse>,
) {
  const ref = React.useRef(fn);
  const queriesContext =
    React.useContext<QueriesContextType<FetchResponse>>(QueriesContext);

  if (!queriesContext) {
    throw new Error('useQuery has to be used within <QueriesContext.Provider>');
  }

  const {queries, dispatch} = queriesContext;
  const request = queries[key];

  const fetchFn = React.useCallback(() => {
    dispatch({type: 'startLoading', payload: key});

    return ref
      .current()
      .then(data =>
        dispatch({
          type: 'fetchSuccessful',
          payload: {
            key,
            data,
            timeStamp: new Date().getTime(),
          },
        }),
      )
      .catch(error =>
        dispatch({
          type: 'fetchError',
          payload: {
            key,
            error,
          },
        }),
      );
  }, [dispatch, ref, key]);

  React.useEffect(() => {
    ref.current = fn;
  }, [fn]);

  React.useEffect(() => {
    const currentTimeStampMinusHalfMinute = new Date();
    currentTimeStampMinusHalfMinute.setSeconds(
      currentTimeStampMinusHalfMinute.getSeconds() - 30,
    );

    if (
      !request ||
      (request.status !== 'loading' &&
        request.timeStamp &&
        request.timeStamp < currentTimeStampMinusHalfMinute.getTime())
    ) {
      fetchFn();
    }
  }, [request, fetchFn]);

  return {
    status: request?.status || 'loading',
    data: request?.data,
    refetch: fetchFn,
  };
}

function reducer(
  state: QueriesStateType<unknown>,
  action: ActionType<unknown>,
): QueriesStateType<unknown> {
  switch (action.type) {
    case 'startLoading':
      return {
        ...state,
        [action.payload]: {
          data: undefined,
          status: 'loading',
          timeStamp: undefined,
          error: undefined,
        },
      };
    case 'fetchSuccessful':
      return {
        ...state,
        [action.payload.key]: {
          data: action.payload.data,
          status: 'success',
          error: undefined,
          timeStamp: action.payload.timeStamp,
        },
      };
    case 'fetchError':
      return {
        ...state,
        [action.payload.key]: {
          data: state[action.payload.key]?.data,
          timeStamp: state[action.payload.key]?.timeStamp,
          status: 'error',
          error: action.payload.error,
        },
      };
    default:
      throw new Error();
  }
}

export function QueriesProvider(props: React.PropsWithChildren) {
  const [queries, dispatch] = React.useReducer(reducer, {});

  return (
    <QueriesContext.Provider value={{queries, dispatch}}>
      {props.children}
    </QueriesContext.Provider>
  );
}
