import { validate } from "@/src/validators/app";
import { firebase } from "../firebase";
import { ValidatorException } from "@/src/exceptions/validator";

const db = firebase.firestore()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ?? 1
    const pageSize = 10
    var query = db.collection('apps').limit(+pageSize)

    const orderBy = searchParams.get('orderBy')
    const sort = searchParams.get('sort') ?? 'desc'
    if (orderBy == 'created') {
      query = query.orderBy('created', sort == 'asc' ? 'asc' : 'desc')
    }

    const type = searchParams.get('type') as AppType | null
    if (type == 'app' || type == 'game') {
      query = query.where('type', '==', type)
    }

    const category = searchParams.get('category')
    if (category) {
      query = query.where('category', '==', category)
    }
    
    return Response.json((await query
      .offset(+pageSize * (+page - 1))
      .get())
      .docs
      .map(doc => ({id: doc.id, ...doc.data()} as App)))
  } catch (e) {
    return Response.json([])
  }
}

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