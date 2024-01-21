import { useReducer, useEffect, Reducer } from "react";

enum Status {
  LOADING,
  FAILURE,
  SUCCESS,
}

type State<Data> =
  | {
      isIdle: true;
      isLoading: false;
      isError: false;
      error: undefined;
      data: undefined;
    }
  | {
      isIdle: false;
      isLoading: true;
      isError: false;
      error: undefined;
      data: undefined;
    }
  | {
      isIdle: true;
      isLoading: false;
      isError: true;
      error: string;
      data: undefined;
    }
  | {
      isIdle: true;
      isLoading: false;
      isError: false;
      error: undefined;
      data: Data;
    };

type Action<Data> =
  | { status: Status.LOADING }
  | { status: Status.FAILURE; error: string }
  | { status: Status.SUCCESS; payload: Data };

export const useAPI = <Data>(callAPI: () => Promise<Data>): [State<Data>, React.Dispatch<Action<Data>>] => {
  const dataFetchReducer: Reducer<State<Data>, Action<Data>> = (state, action) => {
    switch (action.status) {
      case Status.LOADING:
        return {
          ...state,
          isIdle: false,
          isLoading: true,
          isError: false,
          error: undefined,
          data: undefined,
        };
      case Status.SUCCESS:
        return {
          ...state,
          isIdle: true,
          isLoading: false,
          isError: false,
          error: undefined,
          data: action.payload,
        };
      case Status.FAILURE:
        return {
          ...state,
          isIdle: true,
          isLoading: false,
          isError: true,
          error: action.error,
          data: undefined,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isIdle: true,
    isLoading: false,
    isError: false,
    error: undefined,
    data: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ status: Status.LOADING });
        const result = await callAPI();
        dispatch({ status: Status.SUCCESS, payload: result });
      } catch (err) {
        dispatch({ status: Status.FAILURE, error: err.message });
      }
    };

    if (state.isIdle && state.error === undefined && state.data === undefined) {
      fetchData();
    }
  }, [state, callAPI]);

  return [state, dispatch];
};
