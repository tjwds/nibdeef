
const getFeedbinData = async (location, queryParams, authHeader) => {
  const req = await fetch(`https://api.feedbin.com/v2/${location}.json${queryParams}`, {
    headers: { Authorization: authHeader },
  });
  const data = await req.json();
  return data;
};

export { getFeedbinData };
