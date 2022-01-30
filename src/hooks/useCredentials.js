import { useEffect, useState } from "react";

export default function useCredentials() {
  // initialize state with credentials from storage and a setter that
  // will be proxied
  const [credentials, _setCredentials] = useState("");

  // process credentials and set them
  const setCredentials = function (username, password, storePermanently) {
    const credentials = btoa(username + ":" + password);
    if (storePermanently) {
      try {
        localStorage.setItem("feedbin-credentials", credentials);
      } catch (err) {}
    }
    _setCredentials(credentials);
  };

  useEffect(() => {
    // try to get credentials from localStorage
    let storageCredentials = "";
    try {
      const fetchedStorageCredentials = localStorage.getItem(
        "feedbin-credentials"
      );
      if (fetchedStorageCredentials) {
        _setCredentials(fetchedStorageCredentials);
      }
    } catch (e) {}
  }, []);

  // return expected pair, where setCredentials has side-effects
  return [credentials, setCredentials];
}
