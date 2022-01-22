import { useState, useEffect } from "react";

import styles from "../../styles/JudgeFeedEntries.module.css";

export default function JudgeFeedEntries(props) {
  const [toKeep, setToKeep] = useState([]);
  const [toSkip, setToSkip] = useState([]);
  const [entries, setEntries] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setLoading] = useState(true);

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
    const promises = [
      fetch("api/getEntries/" + skipString, {
        headers: { Authorization: props.token },
      })
        .then((res) => res.json())
        .then((data) => {
          setEntries(data);
        }),
    ];
    if (!subscriptions.length) {
      promises.push(
        fetch("api/getSubscriptions", {
          headers: { Authorization: props.token },
        })
          .then((res) => res.json())
          .then((data) => {
            setSubscriptions(data);
          })
      );
    }
    Promise.all(promises).then(() => setLoading(false));
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

  const getNameForSubscriptionId = (id) => {
    const answer = subscriptions.filter(
      (subscription) => subscription.feed_id === id
    );
    if (answer[0]) {
      return (
        <>
          <small>
            <strong>{answer[0].title}</strong>
          </small>
          <br />
        </>
      );
    }
    return <></>;
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
            {getNameForSubscriptionId(entry.feed_id)}
            <small>{entry.summary}</small>
          </p>
        </div>
      ))}
      <div className={styles.applyContainer}>
        <button onClick={setFeedbinRead} className={styles.applyButton}>
          Mark {entriesString(entries, toKeep)} articles as read
        </button>
      </div>
    </div>
  );
}
