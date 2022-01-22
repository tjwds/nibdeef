import { useState, useEffect } from "react";

import styles from "../../styles/JudgeFeedEntries.module.css";

export default function JudgeFeedEntries(props) {
  const [toKeep, setToKeep] = useState([]);
  const [toSkip, setToSkip] = useState([]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    refreshFeed();
  }, []);

  const refreshFeed = (skip = []) => {
    const queryToSkipEntries = skip.reduce(
      (previous, next) => previous + "," + next,
      ""
    );
    const skipString = queryToSkipEntries ? "?skip=" + queryToSkipEntries : "";
    setLoading(true);
    fetch("api/getEntries/" + skipString, {
      headers: { Authorization: props.token },
    })
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  };

  if (isLoading) {
    return <div className={styles.container}>Loading…</div>;
  }

  const generateToggleKeepEntry = function (id) {
    return function (event) {
      if (event.target.checked) {
        setToKeep([...toKeep, id]);
      } else {
        let newToKeep = toKeep.slice().filter((item) => item !== id);
        setToKeep(newToKeep);
      }
    };
  };

  const entriesString = (entries, toKeepList) => {
    const len = entries.length;
    return `${len - toKeepList.length}/${len}`;
  };

  const setFeedbinRead = async (event) => {
    event.preventDefault();
    const toRemove = entries
      .map((entry) => entry.id)
      .filter((id) => !toKeep.includes(id));
    setToSkip([...toSkip, toKeep]);
    const res = await fetch(`api/setRead`, {
      method: "POST",
      body: JSON.stringify(toRemove),
      headers: { Authorization: props.token },
    });
    refreshFeed([...toSkip, toKeep]);
    setToKeep([]);
  };

  return (
    <div className={styles.container}>
      {entries.map((entry, index) => (
        <div className={styles.entry} key={index}>
          <input
            type="checkbox"
            className={styles.entryCheckbox}
            onClick={generateToggleKeepEntry(entry.id)}
          ></input>
          <p className={styles.entryText}>
            <a href={entry.url}>{entry.title}</a>
            <br />
            <small>{entry.summary}</small>
          </p>
        </div>
      ))}
      {/* TODO */}
      <div className={styles.applyContainer}>
        <button onClick={setFeedbinRead} className={styles.applyButton}>
          Mark {entriesString(entries, toKeep)} articles as read
        </button>
      </div>
    </div>
  );
}
