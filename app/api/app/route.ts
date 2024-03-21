import { validate } from "@/src/validators/app";
import { firebase } from "../firebase";
import { ValidatorException } from "@/src/exceptions/validator";

const db = firebase.firestore()

export async function POST(request: Request) {
  try {
    const app = await request.json() as App; validate(app)
    app.created = new Date().toISOString()
    const ref = await db.collection('apps').add(app)
    return Response.json(await ref.get())
  } catch (e) {
    console.error(e)
    if (e instanceof ValidatorException) {
      return new Response(e.message, { status: 400 })
    }
    return new Response(null, { status: 500 })
  }
}