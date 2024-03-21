import { firebase } from "../../firebase"

const db = firebase.firestore()

export async function GET() {
  try {
    return Response.json((await db
      .collection('apps')
      .count()
      .get())
      .data()
      .count, {headers: {'Cache-Control': 's-maxage=60'}})
  } catch (e) {
    return Response.json(0)
  }
}