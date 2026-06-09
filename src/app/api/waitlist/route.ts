import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 使用具備寫入權限的 Service Role Key，確保可以繞過 RLS 安全原則寫入名單
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, plan } = await req.json();

        if (!email || !plan) {
            return NextResponse.json({ error: '缺少信箱或方案名稱' }, { status: 400 });
        }

        // 將早鳥名單寫入 Supabase 的 waitlist 資料表
        const { error } = await supabase
            .from('waitlist')
            .insert([{ email, plan }]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || '伺服器內部錯誤' }, { status: 500 });
    }
}