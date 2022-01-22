import styles from "../../styles/Login.module.css";

export default function Login(props) {
  return (
    <div className={styles.login}>
      <form onSubmit={props.addCredentials}>
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
        <button type="submit">Authenticate</button>
      </form>
      <p>
        This information is only stored on your computer and passed through the
        proxy backend — your credentials are not permanently stored!
      </p>
    </div>
  );
}
