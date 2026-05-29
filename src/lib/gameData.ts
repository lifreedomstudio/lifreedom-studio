// lib/gameData.ts

// 🥇 1. SKILLS (保持不變)
export const SKILLS = [
    {
        id: "mud_250hz", name: "Mud（混濁）", freq: "200–400Hz", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#10b981",
        learn: "這個頻段過多會讓聲音糊在一起，是新手混音最常翻車的地方。",
        detect: { tooMuch: "悶、糊、擠在一起", reduced: "乾淨、分離、清楚" }
    },
    {
        id: "air_12khz", name: "Air（空氣感）", freq: "10kHz+", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#38bdf8",
        learn: "高頻會影響聲音的開闊感，賦予聲音昂貴的仙氣。",
        detect: { tooMuch: "刺耳、單薄、假亮", reduced: "自然、通透、有呼吸感" }
    }
    // ... 其他卡牌
];

// 🎮 2. LEVELS (加上 order，讓 Skill Page 好排序)
export const LEVELS = [
    {
        id: "mud_lv1",
        skillId: "mud_250hz",
        order: 1, // 👈 新增：排序依據
        type: "AB",
        difficulty: "easy",
        question: "哪一段比較混濁？",
        audio: { A: "/audio/mud_clean.mp3", B: "/audio/mud_muddy_6db.mp3" },
        correct: "B",
        unlocks: ["mud_lv2"], // 👈 新增：通關後解鎖下一關的 ID
        feedback: {
            correct: ["🔥 很準！你已經抓到低中頻堆積", "✅ 不錯，你開始聽出混濁了"],
            wrong: ["👂 再聽一次，注意聲音是否變悶", "💡 提示：mud 通常在 200–400Hz"]
        }
    },
    {
        id: "mud_lv2",
        skillId: "mud_250hz",
        order: 2, // 👈 新增
        type: "AB",
        difficulty: "medium",
        question: "哪一段比較乾淨？",
        audio: { A: "/audio/mud_clean.mp3", B: "/audio/mud_muddy_3db.mp3" },
        correct: "A",
        unlocks: ["mud_lv3"],
        feedback: {
            correct: ["🎯 完美！3dB 的差異你也聽出來了"],
            wrong: ["👂 這次比較難，注意聽尾音轟轟的感覺"]
        }
    }
    // ... 其他關卡
];
// 在這裡補上這一段！這是我剛剛漏給你的！
export type UserProgressType = {
    unlockedLevels: string[];
    completedLevels: string[];
    skillXP: Record<string, number>;
};
// 👤 3. USER_PROGRESS (修正解鎖邏輯)
export const initialProgress = {
    // 預設解鎖 Mud 的第一關 (讓新手有門可以進)
    unlockedLevels: ["mud_lv1"],
    completedLevels: [], // 記錄已通關的關卡 ID (例如: "mud_lv1")
    skillXP: {
        mud_250hz: 0,
        air_12khz: 0
    }
};

// 工具函式：檢查特定 Skill 是否對玩家開放
// (只要該技能底下有任何一關在 unlockedLevels 裡，就代表整張卡開放)
export const isSkillUnlocked = (skillId: string, unlockedLevels: string[]) => {
    const levelsForSkill = LEVELS.filter(l => l.skillId === skillId);
    return levelsForSkill.some(level => unlockedLevels.includes(level.id));
};