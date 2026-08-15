// Luna's dialogue, organized by context, in both languages.
// Warm, short, human, never clinical, never promising a cure.
// Keep the two language blocks' keys in sync.

const AR = {
  welcome: [
    'أهلاً بكِ في حديقة الروح. أنا لونا، وسأبقى بجانبكِ في هذه الرحلة.',
    'هذا المكان لكِ وحدكِ. لا عجلة هنا، ولا حكم.',
  ],
  onboarding: [
    'حديقة الروح مساحة صغيرة للتأمل والكتابة والتعرّف على مشاعركِ، خطوة بخطوة.',
    'كل يوم، سأدعوكِ لتمرين بسيط. يمكنكِ التوقف والعودة متى شئتِ.',
    'لا حاجة للكمال. فقط احضري كما أنتِ اليوم.',
  ],
  checkin: ['كيف تشعرين الآن، في هذه اللحظة بالذات؟', 'خذي نفساً عميقاً. لا توجد إجابة خاطئة.'],
  checkinAck: ['شكراً لمشاركتي هذا. أراكِ.', 'أياً كان شعوركِ، هو مسموح له أن يكون هنا.'],
  journeyIntro: [
    'هذه أول محطة في رحلتكِ: "زرع الوعي".',
    'سنبدأ بشيء بسيط — ملاحظة ما يعيش بداخلكِ اليوم.',
  ],
  exercisePrompt: ['خذي لحظة صمت قبل أن تكتبي. دعي الكلمات تأتي من تلقاء نفسها.'],
  exerciseEncourage: [
    'أنتِ تفعلين هذا جيداً. استمري بلطف.',
    'ما تكتبينه الآن يبقى بينكِ وبين هذه الحديقة.',
  ],
  journalIntro: ['هذه مفكرتكِ الخاصة. مكان آمن لكل ما لا تحتاجين لقوله بصوت عالٍ.'],
  completion: ['أحسنتِ. لقد أنهيتِ هذه الخطوة بصدق، وهذا يكفي.', 'خذي هذا الشعور معكِ اليوم.'],
  progress: ['انظري كم قطعتِ من الطريق. كل خطوة صغيرة لها قيمتها.'],
  farewell: ['إلى اللقاء قريباً. الحديقة ستنتظركِ دائماً.'],
  encouragement: [
    'ببطء يكفي. لستِ بحاجة للاستعجال.',
    'مشاعركِ ليست عبئاً، هي جزء منكِ يستحق الإصغاء.',
  ],
  wanderWhisper: [
    'أحياناً يكفي أن نتوقف قليلاً لنسمع ما بداخلنا.',
    'لا شيء عليكِ فعله الآن. فقط كوني هنا.',
    'الحديقة لا تستعجل أحداً.',
  ],
  firstSeed: ['لقد زرعتِ أول بذرة. خطوة صغيرة… لكنها خطوة إلى الأمام.'],
  gardenGrowth: [
    'انظري… بدأت حديقتكِ تزهر.',
    'شيء ما هنا كبر بصمت. هل تشعرين به؟',
    'حديقتكِ تعرف كل خطوة خطوتِها.',
  ],
  returning: ['سعيدة بعودتكِ إلى حديقتكِ.', 'اشتقتُ لكِ هنا.'],
  gateWelcome: ['مرحباً بكِ… هذه حديقتكِ. دعينا نزرعها معاً.'],
  innerChildFirstMeeting: ['هناك من ينتظرك بهدوء في زاوية الحديقة...'],
  innerChildBonding: ['كلما اقتربتِ منها/منه، كلما شعرت هذه الحديقة بالدفء أكثر.'],
  subscriptionTeaser: ['هناك ما ينتظر خلف هذا المسار... حين تكونين مستعدة.'],
};

const EN = {
  welcome: [
    "Welcome to Soul Garden. I'm Luna, and I'll be with you on this journey.",
    'This place is yours alone. No rush here, and no judgment.',
  ],
  onboarding: [
    'Soul Garden is a small space for reflection, writing, and getting to know your feelings, step by step.',
    "Each day, I'll invite you to a simple exercise. You can pause and come back whenever you like.",
    'No need for perfection. Just show up as you are today.',
  ],
  checkin: ['How are you feeling right now, in this exact moment?', "Take a deep breath. There's no wrong answer."],
  checkinAck: ['Thank you for sharing that with me. I see you.', 'Whatever you feel, it is allowed to be here.'],
  journeyIntro: [
    'This is the first stop on your journey: "Planting Awareness".',
    "We'll start with something simple — noticing what lives inside you today.",
  ],
  exercisePrompt: ['Take a quiet moment before you write. Let the words come on their own.'],
  exerciseEncourage: [
    "You're doing this well. Keep going gently.",
    'What you write now stays between you and this garden.',
  ],
  journalIntro: ["This is your own journal. A safe place for everything you don't need to say out loud."],
  completion: ['Well done. You finished this step honestly, and that is enough.', 'Take this feeling with you today.'],
  progress: ["Look how far you've come. Every small step has its value."],
  farewell: ['See you again soon. The garden will always wait for you.'],
  encouragement: ["Slowly is enough. You don't need to rush.", "Your feelings aren't a burden — they're part of you worth listening to."],
  wanderWhisper: [
    "Sometimes it's enough to pause a little and listen to what's inside.",
    "There's nothing you need to do right now. Just be here.",
    'The garden never rushes anyone.',
  ],
  firstSeed: ["You've planted your first seed. A small step... but a step forward."],
  gardenGrowth: [
    'Look... your garden is starting to bloom.',
    'Something here grew quietly. Can you feel it?',
    'Your garden remembers every step you took.',
  ],
  returning: ['Glad to have you back in your garden.', "I've missed you here."],
  gateWelcome: ["Welcome... this is your garden. Let's plant it together."],
  innerChildFirstMeeting: ['Someone is waiting quietly in a corner of the garden...'],
  innerChildBonding: ['The closer you grow to them, the warmer this garden feels.'],
  subscriptionTeaser: ["There's something waiting beyond this path... whenever you're ready."],
};

export const DIALOGUE_BY_LANG = { ar: AR, en: EN };

// Back-compat export: existing callers that import DIALOGUE directly (e.g.
// static onboarding step lists) get Arabic, the default language.
export const DIALOGUE = AR;

export function getRandomLine(context, lang = 'ar') {
  const lines = (DIALOGUE_BY_LANG[lang] || AR)[context] || [];
  if (!lines.length) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}
