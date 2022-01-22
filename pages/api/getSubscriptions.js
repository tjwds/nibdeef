import { getFeedbinData } from "../../src/api/getFeedbinData";

export default function handler(req, res) {
  getFeedbinData("subscriptions", "", req.headers.authorization).then(
    (subscriptions) => {
      res.status(200).json(subscriptions);
    }
  );
}
