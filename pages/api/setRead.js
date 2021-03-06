const setFeedbinRead = async (toMarkRead, authHeader) => {
  const req = await fetch(
    `https://api.feedbin.com/v2/unread_entries/delete.json`,
    {
      method: "POST",
      body: JSON.stringify({ unread_entries: toMarkRead }),
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await req.json();
  return data;
};

export default function handler(req, res) {
  setFeedbinRead(JSON.parse(req.body), req.headers.authorization).then((data) =>
    res.status(200).json(data)
  );
}
