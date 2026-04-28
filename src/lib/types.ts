export type Tier = 'common' | 'rare' | 'ultra'

export interface Sticker {
  id: string
  name: string
  location: string
  tier: Tier
  color: string
  icon: string
  points: number
  image_url: string | null
}

export interface UserScan {
  id: string
  user_id: string
  sticker_id: string
  scanned_at: string
  sticker?: Sticker
}
