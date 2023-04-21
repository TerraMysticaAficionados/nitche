import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(!process.env.NITCHE_SERVER_URL) {
    return res.status(404).end() 
  }
  try {
    const response = await fetch(process.env.NITCHE_SERVER_URL + "/api/broadcasts", {
      method:"GET"
    })
    const broadcasts = await response.json()
    return res.status(200).json(broadcasts)
  } catch(error) {
    console.log(error)
    return res.status(404).end()
  }
}