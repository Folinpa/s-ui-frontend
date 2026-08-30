import Data from '@/store/modules/data'
import { HttpClient } from '@/types/rules'

// sing-box rejects a detour to a direct outbound that carries no options of
// its own: it would dial exactly what it dials without a detour. Downloading
// over such an outbound is already what leaving the detour out means, so it is
// treated as no detour at all.
export function isNoopDetour(tag: string): boolean {
  if (!tag) return true
  const outbound = Data().outbounds?.find((o: any) => o.tag == tag)
  if (!outbound || outbound.type != 'direct') return false
  return Object.keys(outbound).every(key => ['id', 'type', 'tag'].includes(key))
}

// The http_client a remote rule-set should carry to download over `tag`, or
// nothing when that would be a no-op.
export function downloadHttpClient(tag: string): HttpClient | undefined {
  return isNoopDetour(tag) ? undefined : { detour: tag }
}
