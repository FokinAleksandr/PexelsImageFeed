const url = 'https://api.pexels.com/v1';

export function makeRequest<T = unknown>(endpoint: string, body?: object) {
  const headers = {
    'content-type': 'application/json',
    Authorization: '3mNALTZyTho9eBol2zabck0XCdpDTvRmjDio29Xshl6yuw56ffMrwDX4',
  };
  const config = {
    method: body ? 'POST' : 'GET',
    headers,
    ...(body && {body: JSON.stringify(body)}),
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
