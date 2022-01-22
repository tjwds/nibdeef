import { getFeedbinData } from "../../src/getFeedbinData";

export default function handler(req, res) {
  const skipReq = req.query.skip;
  const skipArr = skipReq ? skipReq.split(",").map(Number) : [];
  getFeedbinData("unread_entries").then((entries) => {
    const toFetch = entries
      .slice()
      .reverse()
      .filter((entry) => !skipArr.includes(entry))
      .slice(0, 10);
    getFeedbinData(
      "entries",
      `?ids=` + toFetch.reduce((previous, next) => previous + "," + next),
      ""
    ).then((data) => res.status(200).json(data));
  });
}
