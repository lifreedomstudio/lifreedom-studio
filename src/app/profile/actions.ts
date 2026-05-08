'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const daw = formData.get('daw') as string
  const instruments = JSON.parse(formData.get('instruments') as string)

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      daw,
      instruments,
      updated_at: new Date().toISOString()
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}
