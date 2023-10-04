export const createJsonResponse = <T>(data: T, status = 200) => {
  return new Response(JSON.stringify(data), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "content-type": "application/json",
    },
    status: status,
  });
};
