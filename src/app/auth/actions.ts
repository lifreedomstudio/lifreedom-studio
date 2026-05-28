"use server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/register?message=' + encodeURIComponent(error.message))
  }

  // 🎉 優化：註冊成功不丟去 profile，而是帶上提示訊息重導向回註冊頁
  const successMessage = '註冊成功！請至您的信箱收取中文驗證信件以啟用帳號。'
  return redirect('/register?message=' + encodeURIComponent(successMessage))
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
