import { useState, useEffect } from "react";
import Image from "next/image";

import linkify from "../../utils/linkify.js";
import stripTags from "../../utils/stripTags.js";

import styles from "../../styles/JudgeFeedEntries.module.css";

const renderImage = (entry) => {
  let imageObj = entry.images && entry.images.size_1;
  if (imageObj) {
    return (
      <div className={styles.entryImage}>
        <Image
          src={imageObj.cdn_url}
          width={imageObj.width}
          height={imageObj.height}
          alt=""
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default function JudgeFeedEntries(props) {
  const [toKeep, setToKeep] = useState([]);
  const [toSkip, setToSkip] = useState([]);
  const [entries, setEntries] = useState([]);
  const [unreadCount, setUnreadCount] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [taggings, setTaggings] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("All");

  useEffect(() => {
    refreshFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFeed = (skip = [], sub = []) => {
    const searchParams = new URLSearchParams();
    const queryToSkipEntries = skip.reduce(
      (previous, next) => previous + (previous ? "," : "") + next,
      ""
    );
    if (queryToSkipEntries) {
      searchParams.set("skip", queryToSkipEntries);
    }
    const queryToSubEntries = (sub.length ? sub : selectedFeeds).reduce(
      (previous, next) => previous + (previous ? "," : "") + next,
      ""
    );
    if (queryToSubEntries) {
      searchParams.set("sub", queryToSubEntries);
    }
    setLoading(true);
    const promises = [
      fetch("api/getEntries/?" + searchParams.toString(), {
        headers: { Authorization: props.credentials },
      })
        .then((res) => res.json())
        .then((data) => {
          setUnreadCount(data.remaining);
          setEntries(data.unreads);
        }),
    ];
    if (!taggings.length) {
      promises.push(
        fetch("api/getTaggings", {
          headers: { Authorization: props.credentials },
        })
          .then((res) => res.json())
          .then((data) => {
            setTaggings(
              data.reduce((obj, tag) => {
                let target = obj[tag.name];
                if (!target) {
                  target = obj[tag.name] = [];
                }

                target.push(tag);
                return obj;
              }, {})
            );
          })
      );
    }
    if (!subscriptions.length) {
      promises.push(
        fetch("api/getSubscriptions", {
          headers: { Authorization: props.credentials },
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
            <strong className={styles.feedName}>{answer[0].title}</strong>
          </small>
        </>
      );
    }
    return <></>;
  };

  const selectOption = (e) => {
    const { value } = e.target;

    let newSelection = [];
    if (value !== "All") {
      const target = taggings[value];
      if (target && target.length) {
        newSelection = target.map((v) => v.feed_id);
      }
    }

    setSelectedFeeds(newSelection);
    setSelectedFilterValue(value);
    refreshFeed([], newSelection);
  };

  const TagFilterSelect = () => {
    return (
      <div className={styles.selectFeed}>
        <select onChange={selectOption} value={selectedFilterValue}>
          <option value="All">All</option>
          {Object.entries(taggings)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name], id) => {
              return (
                <option key={`select${id}`} value={name}>
                  {name}
                </option>
              );
            })}
        </select>
      </div>
    );
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
      headers: { Authorization: props.credentials },
    });
    refreshFeed([...toSkip, toKeep]);
    setToKeep([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.unreadCount}>
        {entries.length}/
        <span className={styles.unreadCountNumber}>{unreadCount}</span> unread
        entries
      </div>
      <TagFilterSelect />
      {entries.map((entry, index) => (
        <div className={styles.entry} key={index}>
          <div>
            <input
              type="checkbox"
              className={styles.entryCheckbox}
              onClick={generateToggleKeepEntry(entry.id)}
            ></input>
          </div>
          <div className={styles.entryContent}>
            <p className={styles.entryText}>
              <a href={entry.url} target="_blank" rel="noreferrer">
                {stripTags(entry.title || "(No title)")}
              </a>
              <br />
              {getNameForSubscriptionId(entry.feed_id)}
              <small
                className={styles.entryPreview}
                dangerouslySetInnerHTML={linkify(entry.summary)}
              />
            </p>
            {renderImage(entry)}
          </div>
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
