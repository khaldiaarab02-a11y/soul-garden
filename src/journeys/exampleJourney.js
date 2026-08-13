/*
  exampleJourney
  ==============
  A minimal, deliberately placeholder journey used only to prove the
  data architecture works end-to-end (loading, rendering shape). This
  is NOT "Day 01" of the real "Garden of Awareness" journey — the
  brief is explicit that real journey content comes in a later task.
*/

export const exampleJourney = {
  id: 'example-journey',
  title: { ar: 'رحلة تجريبية' },
  subtitle: { ar: 'لإثبات أن البنية التقنية تعمل' },
  visualTheme: 'placeholder',
  audioTheme: 'placeholder',
  unlockCondition: { type: 'always' },
  days: [
    {
      id: 'day01',
      title: { ar: 'يوم تجريبي' },
      introduction: { ar: 'هذا نص تجريبي فقط لاختبار البنية.' },
      questions: [
        {
          id: 'q1',
          prompt: { ar: 'كيف تشعرين الآن؟' },
          type: 'emotionalSelection',
          choices: [
            { id: 'calm', label: { ar: 'هادئة' } },
            { id: 'curious', label: { ar: 'فضولية' } },
          ],
        },
      ],
      journalingPrompt: { ar: 'اكتبي بضع كلمات عن شعورك.' },
      completionMessage: { ar: 'شكراً لمشاركتك هذه اللحظة.' },
    },
  ],
};
