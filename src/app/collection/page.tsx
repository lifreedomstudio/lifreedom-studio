const CARDS_DATA = [
    // 🟢 🥇 第一組：核心聽感（必做）
    {
        id: "mud_250hz", name: "Mud（混濁）", freq: "200–400Hz", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#10b981",
        unlockBy: "完成任務：讓混音變乾淨", learn: "這個頻段過多會讓聲音糊在一起，是新手混音最常翻車的地方。",
        detect: { tooMuch: "悶、糊、擠在一起", reduced: "乾淨、分離、清楚" },
        task: "找出哪一段比較乾淨", reward: "你現在能聽出混濁低頻", next: "挑戰：人聲 Mud 修正",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "air_12khz", name: "Air（空氣感）", freq: "10kHz+", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#38bdf8",
        unlockBy: "完成任務：尋找高頻呼吸感", learn: "高頻會影響聲音的開闊感，賦予聲音昂貴的仙氣。",
        detect: { tooMuch: "刺耳、單薄、假亮", reduced: "自然、通透、有呼吸感" },
        task: "分辨有沒有加 Air 的差別", reward: "你現在能感知極高頻的光澤", next: "挑戰：提升主唱呼吸感",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "punch_100hz", name: "Punch（衝擊感）", freq: "80–120Hz", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#ef4444",
        unlockBy: "完成任務：尋找大鼓的力量", learn: "低頻與瞬態決定打擊感，是節奏的心臟。",
        detect: { tooMuch: "轟鳴、混濁、蓋住貝斯", reduced: "有力、清楚、拳拳到肉" },
        task: "調整大鼓的 Punch 頻段", reward: "你現在能掌握低頻衝擊力", next: "挑戰：大鼓與貝斯融合",
        route: "/courses/mixing/eq-training"
    },

    // 🔵 🥈 第二組：混音核心能力
    {
        id: "vocal_position", name: "Vocal Forward（人聲前後）", freq: "1kHz-3kHz", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#8b5cf6",
        unlockBy: "完成任務：讓人聲跳出來", learn: "人聲的位置影響整體平衡，中頻決定了歌手離聽眾有多近。",
        detect: { tooMuch: "貼臉、壓迫、聽覺疲勞", reduced: "自然、融入、有深度" },
        task: "利用中頻讓人聲往前靠", reward: "你現在能控制人聲的遠近", next: "挑戰：背景和聲退後",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "masking", name: "Masking（頻率遮蔽）", freq: "全頻段", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#f59e0b",
        unlockBy: "完成任務：解除樂器打架", learn: "頻率重疊會讓元素互相吃掉，大聲的會掩蓋小聲的細節。",
        detect: { tooMuch: "聽不清、擠、樂器打架", reduced: "分離、清楚、各有空間" },
        task: "用減法 EQ 讓吉他讓出空間", reward: "你現在能聽出頻率衝突", next: "挑戰：Kick & Bass 避讓",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "stereo_width", name: "Stereo Width（寬度）", freq: "L/R 聲相", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#06b6d4",
        unlockBy: "完成任務：拉開聲場", learn: "左右分佈影響空間感，LCR 擺位能瞬間拓寬舞台。",
        detect: { tooMuch: "空洞、鬆散、失去力量", reduced: "集中、有重心、包覆感" },
        task: "將兩把吉他 Pan 開", reward: "你現在能判斷立體聲寬度", next: "挑戰：LCR 擺位實戰",
        route: "/incubator"
    },

    // 🟣 🥉 第三組：進階感知
    {
        id: "compression", name: "Compression Feel（壓縮感）", freq: "動態範圍", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#d946ef",
        unlockBy: "完成任務：控制失控的動態", learn: "壓縮會影響動態與穩定，甚至能改變樂器的物理打擊感。",
        detect: { tooMuch: "扁平、沒生命、呼吸困難", reduced: "自然、有起伏、具衝擊力" },
        task: "聽出過度壓縮的鼓組", reward: "你現在能感知壓縮器的運作", next: "挑戰：Glue 黏合混音",
        route: "/courses/mixing/compressor-training"
    },
    {
        id: "transient", name: "Transient（瞬態）", freq: "Attack 階段", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#ec4899",
        unlockBy: "完成任務：塑造打擊音頭", learn: "開頭的瞬間決定清晰度，是聲音輪廓的刀刃。",
        detect: { tooMuch: "刺耳、生硬、刮耳", reduced: "柔順、但清楚、有彈性" },
        task: "保留小鼓的 Transient", reward: "你現在能捕捉聲音的輪廓", next: "挑戰：平行壓縮應用",
        route: "/courses/mixing/compressor-training"
    },
    {
        id: "low_end_control", name: "Low End Control（低頻控制）", freq: "20-150Hz", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#14b8a6",
        unlockBy: "合成卡牌：需先收集 Mud, Punch, Masking", combine: ["mud_250hz", "punch_100hz", "masking"], learn: "低頻是混音的地基，決定歌曲的能量與夜店的震動感。",
        detect: { tooMuch: "轟鳴、吃掉 Headroom", reduced: "結實、乾淨、有律動" },
        task: "完美平衡 Kick 與 Bass", reward: "你現在能建構穩固的低頻", next: "挑戰：Sub Bass 混音",
        route: "/courses/mixing/eq-training"
    },

    // 🟡 🏆 第四組：成就卡
    {
        id: "clean_mix", name: "Clean Mix（乾淨混音）", freq: "全頻段平衡", category: "Achievement", tier: "Master", rarity: "Rare", theme: "#fbbf24",
        unlockBy: "完成 5 個基礎任務解鎖", learn: "所有的分離、動態與空間最終的完美融合。",
        detect: { tooMuch: "過度處理、失去自然感", reduced: "清晰、寬廣、如臨現場" },
        task: "完成一首歌曲的基礎混音", reward: "你已經能做出乾淨的混音判斷", next: "挑戰：Mastering 母帶處理",
        route: "/courses/mixing/eq-training"
    }
];