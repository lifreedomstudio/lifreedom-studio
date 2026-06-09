import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        // 💡 關鍵修正：將 createClient 移到 POST 內部，並加入防呆檢查
        // 這樣 Vercel 在 Build 階段就不會因為提早讀不到金鑰而崩潰
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase environment variables");
            return NextResponse.json({ error: '伺服器金鑰設定遺失' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

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