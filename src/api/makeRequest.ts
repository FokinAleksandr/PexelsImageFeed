import {CuratedPhotosResponseType} from './types';

const url = 'https://api.pexels.com/v1';

export function makeRequest<T = unknown>(endpoint: string) {
  const headers = {
    'content-type': 'application/json',
    Authorization: '3mNALTZyTho9eBol2zabck0XCdpDTvRmjDio29Xshl6yuw56ffMrwDX4',
  };
  const config = {
    method: 'GET',
    headers,
  };

  return fetch(url + endpoint, config).then(async response => {
    if (response.ok) {
      return (await response.json()) as Promise<T>;
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
}

export function getCuratedPhotos({page = 1}) {
  return makeRequest<CuratedPhotosResponseType>(
    `/curated?page=${page}&per_page=30`,
  );
}
