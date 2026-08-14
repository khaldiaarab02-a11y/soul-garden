# حديقة الروح — Soul Garden V1

مساحة تأمل عاطفي تفاعلية برفقة لونا، مرشدة الحديقة.

## التشغيل محلياً

```bash
npm install
npm run dev
```

## البناء

```bash
npm run build
```

الناتج يُحفظ في `dist/` مهيأً للنشر على:
`https://khaldiaarab02-a11y.github.io/soul-garden/`

## النشر على GitHub Pages

تم تضمين ملف `.github/workflows/deploy.yml` — أي دفع (push) إلى فرع
`main` يبني وينشر الموقع تلقائياً عبر GitHub Actions.

بديل يدوي:

```bash
npm run deploy
```//uses gh-pages package already listed in devDependencies

## بنية المشروع

- `src/components/Luna` — نظام الشخصية القابل لإعادة الاستخدام (لونا)
- `src/components/Garden` — الخلفية الجوية للحديقة
- `src/components/Navigation` — نظام التنقل الموحّد
- `src/components/UI` — نظام الأزرار والعناصر المشتركة
- `src/scenes/*` — المشاهد: الرئيسية، التعريف، التأمل، الرحلة، المفكرة، التقدّم
- `src/data/*` — كل المحتوى (الحوار، المشاعر، الرحلات) — بيانات وليس كوداً مضمّناً
- `src/state/SoulGardenContext.jsx` — الحالة المشتركة الوحيدة، محفوظة في localStorage
- `src/audio/audioManager.js` — نظام صوت مركزي، آمن عند غياب الملفات
- `public/images/characters/luna/luna-hero.png` — رسم لونا الرسمي

## ملاحظة حول الصوت

لا توجد ملفات صوتية فعلية مضمّنة في هذا التسليم (لم تُرفق أي أصول صوتية).
نظام الصوت (`audioManager.js`) مبني ليتجاهل بأمان أي ملف مفقود، حتى لا
يظهر الموقع معطلاً. لإضافة الصوت لاحقاً، ضع الملفات في `public/audio/`:

- `garden-ambience.mp3`
- `soft-chime.mp3`
- `page-turn.mp3`

## حدود هذا الإصدار (V1)

- رحلة واحدة كاملة (اليوم الأول) بثلاثة تمارين حقيقية — البنية جاهزة
  لإضافة أيام ورحلات إضافية عبر `src/data/journeys.js` فقط.
- لا يوجد صوت فعلي مضمّن (انظر أعلاه).
- التنقّل يعتمد على حالة داخلية بسيطة بدل مكتبة توجيه، لتفادي أي
  تبعية غير ضرورية.
