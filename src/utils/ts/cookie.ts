export function setCookie(name: string, value: unknown, day?: number) {
  const date = new Date();
  const serializedValue = String(value);
  const encodedValue = encodeURIComponent(serializedValue);

  if (day) {
    date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodedValue}; expires=${date.toUTCString()}; path=/;`;
  } else {
    document.cookie = `${name}=${encodedValue}; path=/;`;
  }
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();

    return cookieValue ? decodeURIComponent(cookieValue) : cookieValue;
  }
  return undefined;
}

export function deleteCookie(name: string) {
  const date = new Date();
  date.setTime(date.getTime() - 1 * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=; expires=${date.toUTCString()}; path=/;`;
}
