// Reusable journey data structure.
// A journey = { id, title, description, theme, duration, days: [ {id, title, exercises:[...]} ] }
// Adding a new journey means adding a new object here — no component changes needed.

export const JOURNEYS = [
  {
    id: 'awakening',
    title: 'زرع الوعي',
    description: 'المحطة الأولى في حديقة الروح — تعرّف على ما يعيش بداخلك اليوم.',
    theme: 'lavender',
    duration: 5,
    days: [
      {
        id: 'day-1',
        title: 'اليوم الأول: أين أنا الآن؟',
        intro: 'لنبدأ بخطوة صغيرة: ملاحظة مشاعرك دون محاولة تغييرها.',
        exercises: [
          {
            id: 'ex-1-1',
            type: 'reflection',
            prompt: 'صف بجملة أو جملتين كيف تشعر الآن، دون تبرير أو تحليل.',
            placeholder: 'اليوم أشعر بـ...',
          },
          {
            id: 'ex-1-2',
            type: 'reflection',
            prompt: 'ما هو الشيء الصغير الذي جعلك تبتسم هذا الأسبوع؟',
            placeholder: 'اكتب هنا بحرية...',
          },
          {
            id: 'ex-1-3',
            type: 'breathing',
            prompt: 'خذ ثلاثة أنفاس عميقة وبطيئة قبل أن تكمل رحلتك اليوم.',
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
