import { getFeedbinData } from "../../src/api/getFeedbinData";

export default async function handler(req, res) {
  const { skip, sub } = req.query;
  const skipArr = skip ? skip.split(",").map(Number) : [];
  const subArr = sub ? sub.split(",").map(Number) : [];

  const entries = await getFeedbinData(
    "unread_entries",
    "",
    req.headers.authorization
  );
  let toFetch = entries
    .slice()
    .reverse()
    .filter((entry) => !skipArr.includes(entry));

  if (!toFetch.length) {
    return res.status(200).json({ unreads: [], remaining: entries.length });
  }

  let data = [];
  let next = 0;
  while (data.length < 20 && next < entries.length) {
    toFetch = toFetch.slice(next, next + 99);
    let resData = await getFeedbinData(
      "entries",
      `?ids=` +
        toFetch.reduce((previous, next) => previous + "," + next, "") +
        "&mode=extended",
      req.headers.authorization
    );
    resData = resData.map((item) => {
      const { content, ...rest } = item;
      return rest;
    });
    if (subArr.length) {
      resData = resData.filter((entry) => subArr.includes(entry.feed_id));
    }
    data.push(...resData.slice(0, 20 - data.length));
    next += 100;

    // TODO maybe add a delay so we don't get rate limited?
  }

  return res.status(200).json({ unreads: data, remaining: entries.length });
}
