import styles from "../../styles/Login.module.css";

export default function Login(props) {
  const addCredentials = (event) => {
    event.preventDefault();
    props.setCredentials(
      event.target.username.value,
      event.target.password.value,
      event.target.storeLocally.checked
    );
  };

  return (
    <div className={styles.login}>
      <form onSubmit={addCredentials}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="password"
          required
        />
        <input
          id="storeLocally"
          name="storeLocally"
          type="checkbox"
          className={styles.storeLocally}
        />
        <label htmlFor="storeLocally">Store credentials on this device</label>
        <button type="submit">Authenticate</button>
      </form>
      <p>
        <small>(This information is only stored on your computer.)</small>
      </p>
    </div>
  );
}
