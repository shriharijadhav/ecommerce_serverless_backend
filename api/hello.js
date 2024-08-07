export default function handler(request, response) {
  return response.json({
    message: "Hello world",
    url: process.env.DATABASE_URL,
  });
}
