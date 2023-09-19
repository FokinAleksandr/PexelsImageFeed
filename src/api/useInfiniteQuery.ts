import React from 'react';
import {unstable_batchedUpdates} from 'react-native';
import {StatusType} from './responseTypes';

type ParamsType<FetchResult, PageParam> = {
  queryFn: (param?: PageParam) => Promise<FetchResult>;
  getNextPageParam: (arg: FetchResult) => PageParam | undefined;
};

export function useInfiniteQuery<FetchResult, PageParam>({
  queryFn,
  getNextPageParam,
}: ParamsType<FetchResult, PageParam>) {
  const ref = React.useRef({queryFn, getNextPageParam});

  const [status, setStatus] = React.useState<StatusType>('loading');
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);
  const [isRefetching, setIsRefetching] = React.useState(false);
  const [data, setData] = React.useState<FetchResult[]>([]);

  const fetchNextPage = React.useCallback(() => {
    const lastFetchedItem = data.at(-1);
    if (
      ['loading', 'error'].includes(status) ||
      isRefetching ||
      isFetchingNextPage ||
      !lastFetchedItem
    ) {
      return;
    }

    const param = getNextPageParam(lastFetchedItem);

    if (param === undefined) {
      return;
    }

    setIsFetchingNextPage(true);

    return ref.current
      .queryFn(param)
      .then(fetchResult => {
        unstable_batchedUpdates(() => {
          setData(prev => prev.concat(fetchResult));
          setIsFetchingNextPage(false);
        });
      })
      .catch(err => {
        console.error(err);
        setIsFetchingNextPage(false);
      });
  }, [data, getNextPageParam, isFetchingNextPage, isRefetching, status]);

  const refetch = React.useCallback(() => {
    if (status === 'loading' || isRefetching || isFetchingNextPage) {
      return;
    }

    unstable_batchedUpdates(() => {
      if (status === 'error') {
        setStatus('loading');
      }

      setIsRefetching(true);
    });

    return ref.current
      .queryFn()
      .then(fetchResult => {
        unstable_batchedUpdates(() => {
          setData([fetchResult]);
          setStatus('success');
          setIsRefetching(false);
        });
      })
      .catch(err => {
        console.error(err);
        setIsRefetching(false);
      });
  }, [isFetchingNextPage, isRefetching, status]);

  React.useEffect(() => {
    ref.current = {queryFn, getNextPageParam};
  }, [queryFn, getNextPageParam]);

  React.useEffect(() => {
    ref.current
      .queryFn()
      .then(fetchResult => {
        unstable_batchedUpdates(() => {
          setData([fetchResult]);
          setStatus('success');
        });
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  return {
    status,
    isFetchingNextPage,
    isRefetching,
    data,
    fetchNextPage,
    refetch,
  };
}
