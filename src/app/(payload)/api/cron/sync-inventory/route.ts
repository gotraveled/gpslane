import { getPayloadClient } from '../../../../../lib/storefront'
import { syncInventory } from '../../../../../lib/inventory-sync'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response('unauthorized', { status: 401 })
  }
  try {
    const payload = await getPayloadClient()
    const result = await syncInventory({ payload })
    return Response.json(result)
  } catch (e: any) {
    return new Response(e?.message ?? 'error', { status: 500 })
  }
}
