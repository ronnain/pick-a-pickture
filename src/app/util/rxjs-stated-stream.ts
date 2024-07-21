import { Observable, catchError, of, startWith, switchMap, map } from 'rxjs';

type SatedStreamResult<T> = {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error: unknown;
  result: T | undefined;
};

export type StatedData<T> =
  | {
      readonly isLoading: false;
      readonly isLoaded: true;
      readonly hasError: false;
      readonly error: undefined;
      readonly result: T;
    }
  | {
      readonly isLoading: true;
      readonly isLoaded: false;
      readonly hasError: false;
      readonly error: undefined;
      readonly result: T | undefined;
    }
  | {
      readonly isLoading: false;
      readonly isLoaded: false;
      readonly hasError: true;
      readonly error: any;
      readonly result: undefined;
    };

export function statedStream<T>(
  toCall: Observable<T>,
  initialValue?: T
): Observable<StatedData<T>> {
  return toCall.pipe(
    switchMap(() =>
      toCall.pipe(
        map(
          (result) =>
            ({
              isLoading: false,
              isLoaded: true,
              hasError: false,
              error: undefined,
              result,
            } as const satisfies SatedStreamResult<T>)
        ),
        startWith({
          isLoading: true,
          isLoaded: false,
          hasError: false,
          error: undefined,
          result: initialValue,
        } as const)
      )
    ),
    catchError((error) =>
      of({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error,
        result: undefined,
      } as const)
    )
  );
}

/**
 * Use it when a stated stream will emit value only when triggered from an event.
 * Like if a user create an account, and the statedStream return the state when creating an account, it will emit nothing at the beginning.
 * So use fromAsyncStatedStream, to emit an initial value, that could be use in vew model...
 */
export function fromAsyncStatedStream<T>(
  statedStreamCall: ReturnType<typeof statedStream<T>>,
  initialValue?: T
) {
  return statedStreamCall.pipe(
    startWith({
      isLoading: false,
      isLoaded: false,
      hasError: false,
      error: undefined,
      result: initialValue,
    } satisfies SatedStreamResult<T>)
  );
}
