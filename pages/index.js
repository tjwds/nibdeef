import useCredentials from "../src/hooks/useCredentials";

import JudgeFeedEntries from "../src/components/JudgeFeedEntries";
import Login from "../src/components/Login";

export default function Application() {
  const [credentials, setCredentials] = useCredentials();

  return credentials ? (
    <JudgeFeedEntries credentials={credentials} />
  ) : (
    <Login setCredentials={setCredentials} />
  );
}
