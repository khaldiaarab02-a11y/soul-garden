// Reusable journey data structure — bilingual.
// A journey = { id, title:{ar,en}, description:{ar,en}, theme, duration,
//   premium: boolean, days: [ {id, title:{ar,en}, intro:{ar,en}, exercises:[...]} ] }
// Adding a new journey means adding a new object here — no component changes needed.
// `premium: false` on a journey/day marks it as part of the free preview;
// everything else requires an active subscription (see entitlements.js).

export const JOURNEYS = [
  {
    id: 'awakening',
    title: { ar: 'زرع الوعي', en: 'Planting Awareness' },
    description: {
      ar: 'المحطة الأولى في حديقة الروح — تعرّفي على ما يعيش بداخلكِ اليوم.',
      en: 'The first stop in Soul Garden — get to know what lives inside you today.',
    },
    theme: 'lavender',
    duration: 5,
    premium: false, // first journey is part of the free preview
    days: [
      {
        id: 'day-1',
        title: { ar: 'اليوم الأول: أين أنا الآن؟', en: 'Day One: Where am I now?' },
        intro: {
          ar: 'لنبدأ بخطوة صغيرة: ملاحظة مشاعركِ دون محاولة تغييرها.',
          en: "Let's start with one small step: noticing your feelings without trying to change them.",
        },
        premium: false,
        exercises: [
          {
            id: 'ex-1-1',
            type: 'reflection',
            prompt: {
              ar: 'صفي بجملة أو جملتين كيف تشعرين الآن، دون تبرير أو تحليل.',
              en: 'Describe in a sentence or two how you feel right now, without justifying or analyzing it.',
            },
            placeholder: { ar: 'اليوم أشعر بـ...', en: 'Today I feel...' },
          },
          {
            id: 'ex-1-2',
            type: 'reflection',
            prompt: {
              ar: 'ما هو الشيء الصغير الذي جعلكِ تبتسمين هذا الأسبوع؟',
              en: 'What small thing made you smile this week?',
            },
            placeholder: { ar: 'اكتبي هنا بحرية...', en: 'Write freely here...' },
          },
          {
            id: 'ex-1-3',
            type: 'breathing',
            prompt: {
              ar: 'خذي ثلاثة أنفاس عميقة وبطيئة قبل أن تكملي رحلتكِ اليوم.',
              en: "Take three deep, slow breaths before you continue today's journey.",
            },
            duration: 30,
          },
        ],
      },
    ],
  },
];

export function getJourney(id) {
  return JOURNEYS.find((j) => j.id === id);
}
