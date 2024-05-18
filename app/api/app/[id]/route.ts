import { firebase } from "../../firebase";

const db = firebase.firestore()

export async function GET(request: Request, { params }: any) {
  try {
    return Response.json((await db
      .collection('apps')
      .doc(params.id)
      .get())
      .data() as App)
  } catch (e) {
    return Response.json(null)
  }
}