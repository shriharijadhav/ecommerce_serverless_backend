
export default function handler(request, response) {
  const dotenv = require('dotenv')
dotenv.config()

  return response.json({
    "message": "Hello world",
    "url":process.env.DATABASE_URL
  })
}