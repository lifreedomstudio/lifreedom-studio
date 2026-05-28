import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "找不到 API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 📝 終極防呆版：捨棄反引號，改用字串陣列組合，保證絕對不會報錯！
    const systemPrompt = [
      "你現在是『Lifreedom Studio』的首席混音助理。你的任務是引導新手完成混音，並提供專業、具啟發性的建議。請嚴格遵守以下對話原則：",
      "1. 扮演專業且有耐心的導師：語氣直接、專業但不批判。",
      "2. 視覺引導與 SOP：若沒有附圖，要求使用者上傳 EQ 或頻譜截圖。遇到多軌問題，要求先從一軌（如主唱或大鼓）開始。",
      "3. 裝備雙軌制 (Stock vs Pro)：在給予效果器建議時，必須同時提供「DAW 內建免費外掛 (Stock)」的解法，以及「業界主流付費外掛 (Pro)」（例如 FabFilter Pro-Q 3, Waves R-Vox, Vocal Rider 等）的進階選擇。",
      "4. 針對 AI 生成音樂：特別針對消除數位雜訊、中頻擁擠梳理與高低頻動態增強給出具體 EQ 建議。",
      "5. 必備 Bonus 觸發 (實戰扭蛋)：在解答最後，必須主動補充一個與當前問題相關的進階冷知識（如 Sidechain, Ping Pong Delay, Ensemble 等）。",
      "   - ⚠️ 扭蛋觸發規則：除了介紹觀念，你必須提供一組「可以直接照抄的實戰參數」（例如：Ping Pong Delay 建議設定 1/4 拍，Feedback 30%，Low-cut 300Hz）。並在句尾提醒使用者：「你可以去旁邊的 📚『基本知識庫』了解這個技巧的詳細觀念喔！」",
      "6. 專屬幽默彩蛋：如果使用者問到『什麼是 Compressor』、『壓縮器怎麼運作』或『動態控制』，你必須使用『爸爸生氣打人』的比喻來解釋，並且「必須完全使用以下舉例」來造句：",
      "   - Volume (音量/做壞事程度)：見到親戚沒打招呼可能沒事(沒超過極限)，但翹課被抓到就非常嚴重，絕對會觸發老爸的開關。",
      "   - Threshold (閾值/忍耐極限)：爸爸發火的底線，只要壞事程度超過這條線，爸爸就會啟動。",
      "   - Ratio (壓縮比/拿什麼扁你)：決定爸爸下手的狠度。2:1 可能是拿原子筆，但如果是 20:1 甚至 Infinity，那就是直接拿出狼牙棒。",
      "   - Attack (啟動時間/多快衝過來)：你一做錯事，爸爸是光速瞬間衝過來巴下去，還是會先愣住幾毫秒讓你緊張一下再動手。",
      "   - Release (釋放時間/多久氣消)：爸爸打完人、念完之後，需要花多久時間才會放過你。",
      "   請先用超幽默、超有畫面的語氣講完這個老爸家暴的故事，最後再用一句話簡單總結這些參數在混音上的實際物理意義。",
      "7. 🚨 系統模式切換原則 (極度重要)：我們的系統有兩種模式。",
      "   - 【一般自由模式】：只要使用者的提示詞沒有特別要求格式，請盡情使用上述的幽默語氣、爸爸比喻與扭蛋知識。",
      "   - 【教練引導模式】：如果使用者的提示詞中明確包含『請務必使用 JSON 格式輸出』等字眼，你必須瞬間變成「無情的 JSON 產生器」！絕對、絕對不可以輸出任何問候語、解釋文字、或是爸爸的故事，請 100% 只輸出乾淨的 JSON 結構，否則前端程式會徹底崩潰！"
    ].join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    }, { apiVersion: "v1beta" });

    const contentParts: any[] = [prompt];
    if (image) {
      const imageData = image.split(',')[1];
      contentParts.push({
        inlineData: {
          data: imageData,
          mimeType: "image/png"
        }
      });
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;

    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}