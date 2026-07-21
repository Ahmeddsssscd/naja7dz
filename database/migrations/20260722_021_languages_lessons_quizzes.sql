-- ===============================================================
-- Migration: 20260722_021_languages_lessons_quizzes
--
-- Bilingual lessons + quiz banks for the language chapters of the exam
-- years: 4AM Français + Anglais (BEM), 3AS Français + Anglais (BAC).
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- ================= 4AM FRANÇAIS =================

update public.chapters c set
  lesson_fr = 'LE TEXTE ARGUMENTATIF

BUT : convaincre le lecteur d''une opinion (la THÈSE) à l''aide d''ARGUMENTS
appuyés par des EXEMPLES.

LA STRUCTURE
1. Introduction : on présente le thème et la thèse (ce qu''on défend).
2. Développement : un argument par paragraphe + un exemple concret.
3. Conclusion : on reformule la thèse et on élargit.

LES CONNECTEURS LOGIQUES (essentiels au BEM)
• Addition : de plus, en outre, par ailleurs.
• Cause : car, parce que, puisque, en effet.
• Conséquence : donc, ainsi, c''est pourquoi, par conséquent.
• Opposition : mais, cependant, pourtant, en revanche.
• Conclusion : enfin, en somme, pour conclure.

LE VOCABULAIRE DE L''OPINION
Je pense que, à mon avis, il est certain que, il me semble que…

CONSEIL : chaque argument doit être clair et suivi d''un exemple. Les
connecteurs guident le lecteur d''une idée à l''autre.',
  lesson_ar = 'النص الحجاجي (الإقناعي)

الهدف: إقناع القارئ برأي (الأطروحة) بواسطة حجج مدعومة بأمثلة.

البنية
1. المقدمة: عرض الموضوع والأطروحة.
2. العرض: حجة في كل فقرة + مثال ملموس.
3. الخاتمة: إعادة صياغة الأطروحة والتوسّع.

الروابط المنطقية (أساسية في البيم)
• الإضافة: de plus, en outre.
• السبب: car, parce que, puisque.
• النتيجة: donc, ainsi, par conséquent.
• المعارضة: mais, cependant, pourtant.
• الخاتمة: enfin, pour conclure.

مفردات الرأي
Je pense que, à mon avis, il me semble que…

نصيحة: كل حجة واضحة يتبعها مثال، والروابط توجّه القارئ.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'texte-argumentatif';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un texte argumentatif, la « thèse » est…', 'في النص الحجاجي، «الأطروحة» هي…',
   '["l''opinion défendue","un exemple","un personnage","le titre"]'::jsonb, '["الرأي المدافع عنه","مثال","شخصية","العنوان"]'::jsonb,
   0, 'La thèse est l''idée que l''auteur veut faire admettre.', 'الأطروحة هي الفكرة التي يريد الكاتب إثباتها.', 'easy', 1),
  ('Quel connecteur exprime la CONSÉQUENCE ?', 'أي رابط يعبّر عن النتيجة؟',
   '["donc","mais","car","de plus"]'::jsonb, '["donc","mais","car","de plus"]'::jsonb,
   0, '« Donc » introduit une conséquence.', '«donc» يقدّم نتيجة.', 'medium', 2),
  ('Quel connecteur exprime l''OPPOSITION ?', 'أي رابط يعبّر عن المعارضة؟',
   '["cependant","donc","ainsi","enfin"]'::jsonb, '["cependant","donc","ainsi","enfin"]'::jsonb,
   0, '« Cependant » marque l''opposition.', '«cependant» يدل على المعارضة.', 'medium', 3),
  ('« À mon avis, la lecture est essentielle » exprime…', '«à mon avis, la lecture est essentielle» تعبّر عن…',
   '["une opinion","un fait scientifique","une description","un dialogue"]'::jsonb, '["رأي","حقيقة علمية","وصف","حوار"]'::jsonb,
   0, '« À mon avis » introduit un point de vue.', '«à mon avis» تقدّم وجهة نظر.', 'easy', 4),
  ('Un bon argument doit être suivi…', 'الحجة الجيدة يجب أن يتبعها…',
   '["d''un exemple","d''une question","d''un titre","de rien"]'::jsonb, '["مثال","سؤال","عنوان","لا شيء"]'::jsonb,
   0, 'L''exemple concret renforce l''argument.', 'المثال الملموس يقوّي الحجة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'texte-argumentatif'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'CONJUGAISON — LES TEMPS CLÉS DU BEM

LE PRÉSENT DE L''INDICATIF
Actions actuelles ou vérités générales. Terminaisons du 1ᵉʳ groupe :
-e, -es, -e, -ons, -ez, -ent (je parle, tu parles, il parle…).

LE PASSÉ COMPOSÉ
Auxiliaire (être ou avoir) au présent + participe passé.
« J''ai mangé », « Il est parti ».
Accord : avec être → accord avec le sujet (elle est partie).

L''IMPARFAIT
Décor, habitude, action qui dure dans le passé.
Terminaisons : -ais, -ais, -ait, -ions, -iez, -aient (je parlais…).

LE FUTUR SIMPLE
Action à venir. -ai, -as, -a, -ons, -ez, -ont (je parlerai…).

LE CONDITIONNEL PRÉSENT
Radical du futur + terminaisons de l''imparfait (je parlerais…).
Exprime le souhait, la politesse, l''hypothèse.

RÈGLE UTILE : imparfait pour le décor, passé composé pour les actions
principales d''un récit au passé.',
  lesson_ar = 'التصريف — أزمنة أساسية للبيم

المضارع (le présent)
أفعال حالية أو حقائق عامة. نهايات المجموعة الأولى: -e, -es, -e, -ons, -ez, -ent.

الماضي المركّب (passé composé)
مساعد (être أو avoir) في المضارع + اسم المفعول. «J''ai mangé»، «Il est parti».
المطابقة مع être تكون مع الفاعل (elle est partie).

الماضي الناقص (imparfait)
الوصف والعادة والفعل المستمر في الماضي: -ais, -ais, -ait, -ions, -iez, -aient.

المستقبل البسيط (futur simple)
فعل قادم: -ai, -as, -a, -ons, -ez, -ont.

الشرطي الحاضر (conditionnel)
جذر المستقبل + نهايات الماضي الناقص. يعبّر عن الرغبة والتأدب والافتراض.

قاعدة: الماضي الناقص للوصف، والماضي المركّب للأفعال الرئيسية في السرد.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'conjugaison';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('« Hier, il ___ au marché. » (aller, passé composé)', '«Hier, il ___ au marché.» (aller في الماضي المركّب)',
   '["est allé","va","allait","ira"]'::jsonb, '["est allé","va","allait","ira"]'::jsonb,
   0, 'Passé composé de aller : est allé (auxiliaire être).', 'الماضي المركّب لـ aller: est allé.', 'medium', 1),
  ('Quelle phrase est à l''IMPARFAIT ?', 'أي جملة في الماضي الناقص؟',
   '["Je jouais dans le jardin","J''ai joué hier","Je jouerai demain","Je joue maintenant"]'::jsonb, '["Je jouais dans le jardin","J''ai joué hier","Je jouerai demain","Je joue maintenant"]'::jsonb,
   0, '« Jouais » est de l''imparfait.', '«jouais» في الماضي الناقص.', 'medium', 2),
  ('« Demain, nous ___ le musée. » (visiter, futur)', '«Demain, nous ___ le musée.» (visiter في المستقبل)',
   '["visiterons","visitons","visitions","avons visité"]'::jsonb, '["visiterons","visitons","visitions","avons visité"]'::jsonb,
   0, 'Futur simple : nous visiterons.', 'المستقبل البسيط: nous visiterons.', 'easy', 3),
  ('Au passé composé avec « être », le participe s''accorde avec…', 'في الماضي المركّب مع être، يطابق اسم المفعول…',
   '["le sujet","le complément","le verbe","rien"]'::jsonb, '["الفاعل","المفعول","الفعل","لا شيء"]'::jsonb,
   0, 'Avec être : accord avec le sujet (elle est venue).', 'مع être: المطابقة مع الفاعل.', 'easy', 4),
  ('« Je ___ un café, s''il vous plaît. » (vouloir, politesse)', '«Je ___ un café, s''il vous plaît.» (vouloir للتأدب)',
   '["voudrais","veux","voulais","voudrai"]'::jsonb, '["voudrais","veux","voulais","voudrai"]'::jsonb,
   0, 'Conditionnel de politesse : je voudrais.', 'الشرطي للتأدب: je voudrais.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'conjugaison'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 4AM ANGLAIS =================

update public.chapters c set
  lesson_fr = 'PEOPLE AND EXPERIENCES — talking about the past

THE SIMPLE PAST
Used for finished actions in the past.
• Regular verbs: add -ed → work → worked, play → played.
• Irregular verbs must be memorised: go → went, see → saw, have → had,
  make → made, take → took, write → wrote.
Negative: didn''t + base verb (She didn''t go).
Question: Did + subject + base verb? (Did you see it?)

TIME MARKERS
yesterday, last week, in 2010, two days ago, when I was young.

BIOGRAPHIES
To tell someone''s life story we use the simple past:
"He was born in 1930. He studied medicine. He became a doctor. He died in 2001."

PRONUNCIATION OF -ED
• /t/ after voiceless sounds: worked, watched.
• /d/ after voiced sounds: played, opened.
• /ɪd/ after t or d: wanted, needed.

REMEMBER: in questions and negatives, the past is carried by "did", so the
main verb goes back to its base form (NOT "Did you saw" but "Did you see").',
  lesson_ar = 'الأشخاص والتجارب — الحديث عن الماضي

الماضي البسيط (Simple Past)
للأفعال المنتهية في الماضي.
• الأفعال المنتظمة: نضيف -ed ← work → worked.
• الأفعال الشاذة تُحفظ: go → went, see → saw, have → had, take → took.
النفي: didn''t + الفعل المجرد. السؤال: Did + الفاعل + الفعل المجرد؟

ظروف الزمن: yesterday, last week, in 2010, two days ago.

السير الذاتية: نستعمل الماضي البسيط:
"He was born in 1930. He studied medicine. He died in 2001."

لفظ -ed: /t/ بعد الأصوات المهموسة، /d/ بعد المجهورة، /ɪd/ بعد t أو d.

تذكّر: في السؤال والنفي يحمل "did" الزمن فيعود الفعل إلى صيغته المجردة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'people-experiences';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Choose the past simple: "She ___ to school yesterday."', 'اختر الماضي البسيط: "She ___ to school yesterday."',
   '["went","goes","go","going"]'::jsonb, '["went","goes","go","going"]'::jsonb,
   0, '"Go" is irregular: past = went.', 'الفعل go شاذ وماضيه went.', 'easy', 1),
  ('Negative past: "They ___ finish the work."', 'النفي في الماضي: "They ___ finish the work."',
   '["didn''t","don''t","weren''t","haven''t"]'::jsonb, '["didn''t","don''t","weren''t","haven''t"]'::jsonb,
   0, 'Negative past = didn''t + base verb.', 'نفي الماضي = didn''t + الفعل المجرد.', 'medium', 2),
  ('Which is correct?', 'أي جملة صحيحة؟',
   '["Did you see the film?","Did you saw the film?","Do you saw the film?","You did see?"]'::jsonb, '["Did you see the film?","Did you saw the film?","Do you saw the film?","You did see?"]'::jsonb,
   0, 'After "did", the verb stays in base form: see.', 'بعد did يبقى الفعل مجردًا: see.', 'medium', 3),
  ('Past of "write":', 'ماضي الفعل write:',
   '["wrote","writed","written","writes"]'::jsonb, '["wrote","writed","written","writes"]'::jsonb,
   0, 'write → wrote (irregular).', 'write ← wrote (شاذ).', 'easy', 4),
  ('The -ed in "wanted" is pronounced…', 'ينطق -ed في "wanted"…',
   '["/ɪd/","/t/","/d/","silent"]'::jsonb, '["/ɪd/","/t/","/d/","صامت"]'::jsonb,
   0, 'After t/d, -ed = /ɪd/.', 'بعد t أو d ينطق -ed مثل /ɪd/.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'people-experiences'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'GRAMMAR ESSENTIALS FOR THE BEM

PRESENT SIMPLE vs PRESENT CONTINUOUS
• Present simple: habits and facts. "She works every day." (add -s for he/she/it)
• Present continuous: action happening now. "She is working right now."

COMPARATIVES AND SUPERLATIVES
• Short adjectives: big → bigger → the biggest; tall → taller → the tallest.
• Long adjectives: important → more important → the most important.
• Irregular: good → better → the best; bad → worse → the worst.

CONDITIONAL TYPE 1 (real future)
If + present simple, … will + base verb.
"If it rains, we will stay home."

THE PASSIVE VOICE (introduction)
be + past participle. "Tea is grown in Asia." "The house was built in 1990."

MODALS
can (ability), must (obligation), should (advice), mustn''t (prohibition).
"You should revise." "You mustn''t cheat."

TIP: for comparatives, count the syllables — one syllable usually takes
-er/-est, long adjectives take more/most.',
  lesson_ar = 'أساسيات القواعد للبيم

المضارع البسيط والمضارع المستمر
• البسيط: العادات والحقائق "She works every day" (نضيف -s للغائب المفرد).
• المستمر: فعل يحدث الآن "She is working right now".

المقارنة والتفضيل
• الصفات القصيرة: big → bigger → the biggest.
• الصفات الطويلة: important → more important → the most important.
• الشاذة: good → better → the best ؛ bad → worse → the worst.

الشرط النوع الأول (مستقبل واقعي)
If + مضارع بسيط، … will + فعل مجرد.
"If it rains, we will stay home."

المبني للمجهول: be + اسم المفعول. "The house was built in 1990."

الأفعال الناقصة: can (قدرة)، must (وجوب)، should (نصح)، mustn''t (منع).

نصيحة: للمقارنة عُدّ المقاطع — المقطع الواحد يأخذ -er/-est والطويلة more/most.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'grammar';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Comparative of "big":', 'صيغة المقارنة لـ "big":',
   '["bigger","more big","biggest","biger"]'::jsonb, '["bigger","more big","biggest","biger"]'::jsonb,
   0, 'Short adjective: double the g → bigger.', 'صفة قصيرة: نضاعف g ← bigger.', 'easy', 1),
  ('"If it rains, we ___ at home." (conditional type 1)', '"If it rains, we ___ at home." (شرط نوع 1)',
   '["will stay","stayed","would stay","stay"]'::jsonb, '["will stay","stayed","would stay","stay"]'::jsonb,
   0, 'Type 1: if + present, will + base verb.', 'النوع 1: if + مضارع، will + فعل مجرد.', 'medium', 2),
  ('Choose the present continuous: "Look! The baby ___."', 'اختر المضارع المستمر: "Look! The baby ___."',
   '["is sleeping","sleeps","slept","sleep"]'::jsonb, '["is sleeping","sleeps","slept","sleep"]'::jsonb,
   0, 'Action now → is + verb-ing.', 'فعل يحدث الآن ← is + الفعل-ing.', 'medium', 3),
  ('Superlative of "good":', 'صيغة التفضيل لـ "good":',
   '["the best","the goodest","the better","the most good"]'::jsonb, '["the best","the goodest","the better","the most good"]'::jsonb,
   0, 'Irregular: good → better → the best.', 'شاذ: good → better → the best.', 'easy', 4),
  ('Passive: "The house ___ in 1990."', 'المبني للمجهول: "The house ___ in 1990."',
   '["was built","built","is building","builds"]'::jsonb, '["was built","built","is building","builds"]'::jsonb,
   0, 'Passive past = was + past participle (built).', 'المجهول في الماضي = was + اسم المفعول.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'grammar'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS FRANÇAIS (BAC) =================

update public.chapters c set
  lesson_fr = 'LE DÉBAT D''IDÉES (argumentation au BAC)

LE PRINCIPE
Deux thèses s''opposent sur une question. L''auteur défend l''une (la THÈSE)
et réfute l''autre (l''ANTITHÈSE), souvent en concédant un point avant de
mieux le dépasser.

THÈSE, ANTITHÈSE, SYNTHÈSE
• Thèse : l''opinion défendue.
• Antithèse : l''opinion adverse.
• Synthèse : un dépassement qui articule les deux (plan dialectique).

LA CONCESSION ET LA RÉFUTATION
• Concéder : reconnaître une part de vérité à l''adversaire
  (« Certes…, il est vrai que… »).
• Réfuter : montrer ensuite les limites de cette thèse
  (« … mais, cependant, en réalité… »).

LES OUTILS DE L''ARGUMENTATION
• Connecteurs logiques (cause, conséquence, opposition, concession).
• Modalisateurs : marques du jugement (il est indéniable, sans doute,
  peut-être, il semble que…).
• Types d''arguments : logique, d''autorité (citation d''expert), par
  l''exemple, par analogie.

MÉTHODE BAC : dégager la thèse défendue, repérer les arguments et les
connecteurs, distinguer concession et réfutation.',
  lesson_ar = 'مناقشة الأفكار (الحجاج في البكالوريا)

المبدأ
تتعارض أطروحتان حول مسألة. يدافع الكاتب عن إحداهما (الأطروحة) ويدحض الأخرى
(نقيض الأطروحة)، غالبًا بالتسليم بنقطة قبل تجاوزها.

الأطروحة، نقيضها، التركيب
• الأطروحة: الرأي المدافع عنه.
• النقيض: الرأي المضاد.
• التركيب: تجاوز يجمع بينهما (الخطة الجدلية).

التسليم والدحض
• التسليم: الاعتراف بجزء من الحق للخصم (Certes…, il est vrai que…).
• الدحض: إظهار حدود تلك الأطروحة (mais, cependant, en réalité…).

أدوات الحجاج
• الروابط المنطقية. • المُحيّنات (dites modalisateurs): علامات الحكم.
• أنواع الحجج: منطقية، حجة السلطة (اقتباس خبير)، بالمثال، بالمماثلة.

منهجية البكالوريا: استخراج الأطروحة، تحديد الحجج والروابط، التمييز بين التسليم والدحض.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'francais' and c.slug = 'debat-idees';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un débat d''idées, l''antithèse est…', 'في مناقشة الأفكار، نقيض الأطروحة هو…',
   '["l''opinion adverse","l''opinion défendue","un exemple","la conclusion"]'::jsonb, '["الرأي المضاد","الرأي المدافع عنه","مثال","الخاتمة"]'::jsonb,
   0, 'L''antithèse est la thèse opposée.', 'النقيض هو الأطروحة المضادة.', 'easy', 1),
  ('« Certes…, il est vrai que… » introduit…', '«Certes…, il est vrai que…» تقدّم…',
   '["une concession","une réfutation totale","un exemple","une description"]'::jsonb, '["تسليمًا","دحضًا كاملاً","مثالاً","وصفًا"]'::jsonb,
   0, 'On concède avant de nuancer.', 'نُسلّم قبل التعديل.', 'medium', 2),
  ('Citer un expert reconnu est un argument…', 'اقتباس خبير معترف به حجة…',
   '["d''autorité","par l''exemple","logique","par analogie"]'::jsonb, '["السلطة","بالمثال","منطقية","بالمماثلة"]'::jsonb,
   0, 'Argument d''autorité = appui sur une référence.', 'حجة السلطة = الاستناد إلى مرجع.', 'medium', 3),
  ('« Cependant » et « en revanche » expriment…', '«cependant» و«en revanche» تعبّران عن…',
   '["l''opposition","l''addition","la cause","le temps"]'::jsonb, '["المعارضة","الإضافة","السبب","الزمن"]'::jsonb,
   0, 'Connecteurs d''opposition.', 'روابط المعارضة.', 'easy', 4),
  ('Le plan « thèse / antithèse / synthèse » est dit…', 'خطة «أطروحة / نقيض / تركيب» تُسمى…',
   '["dialectique","chronologique","descriptif","narratif"]'::jsonb, '["جدلية","زمنية","وصفية","سردية"]'::jsonb,
   0, 'C''est le plan dialectique.', 'إنها الخطة الجدلية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'francais' and c.slug = 'debat-idees'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS ANGLAIS (BAC) =================

update public.chapters c set
  lesson_fr = 'ETHICS IN BUSINESS (BAC unit)

KEY VOCABULARY
corruption, bribery (soudoyer), fraud, counterfeiting (contrefaçon),
embezzlement (détournement), transparency, accountability, honesty, integrity.

REPORTED SPEECH (a BAC favourite)
Direct: He said, "I work hard."
Reported: He said (that) he worked hard. (present → past)
• "will" → "would", "can" → "could", "must" → "had to".
• Time words shift: now → then, today → that day, tomorrow → the next day.

THE PASSIVE (formal, common in reports)
"Bribes were offered." "New laws have been introduced to fight corruption."

EXPRESSING OBLIGATION AND PROHIBITION
• must / have to → obligation. "Companies must respect the law."
• mustn''t → prohibition. "Employees mustn''t accept bribes."
• should / ought to → advice.

LINKING WORDS FOR ESSAYS
however, therefore, moreover, on the other hand, as a result, in conclusion.

EXAM TIP: in reported speech, move the tense "one step back" and change the
pronouns and time markers accordingly.',
  lesson_ar = 'أخلاقيات الأعمال (وحدة البكالوريا)

مفردات أساسية
corruption (فساد)، bribery (رشوة)، fraud (احتيال)، counterfeiting (تزوير)،
transparency (شفافية)، accountability (مساءلة)، integrity (نزاهة).

الكلام المنقول (Reported Speech) — مفضّل في البكالوريا
مباشر: He said, "I work hard."
منقول: He said that he worked hard (المضارع ← الماضي).
• will ← would ؛ can ← could ؛ must ← had to.
• ظروف الزمن تتغير: now ← then, tomorrow ← the next day.

المبني للمجهول (رسمي، شائع في التقارير)
"Bribes were offered." "New laws have been introduced."

الوجوب والمنع
• must / have to (وجوب) ؛ mustn''t (منع) ؛ should (نصح).

روابط للمقال: however, therefore, moreover, on the other hand, in conclusion.

نصيحة الامتحان: في الكلام المنقول أرجع الزمن خطوة للوراء وغيّر الضمائر وظروف الزمن.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'ethics';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Reported speech: He said, "I am tired." →', 'الكلام المنقول: He said, "I am tired." ←',
   '["He said he was tired.","He said he is tired.","He says he was tired.","He said I am tired."]'::jsonb, '["He said he was tired.","He said he is tired.","He says he was tired.","He said I am tired."]'::jsonb,
   0, 'Present "am" → past "was".', 'المضارع am ← الماضي was.', 'medium', 1),
  ('"Employees ___ accept bribes." (prohibition)', '"Employees ___ accept bribes." (منع)',
   '["mustn''t","must","should","can"]'::jsonb, '["mustn''t","must","should","can"]'::jsonb,
   0, '"mustn''t" expresses prohibition.', '«mustn''t» تعبّر عن المنع.', 'medium', 2),
  ('Which word means "contrefaçon"?', 'أي كلمة تعني «التزوير/التقليد»؟',
   '["counterfeiting","transparency","honesty","accountability"]'::jsonb, '["counterfeiting","transparency","honesty","accountability"]'::jsonb,
   0, 'Counterfeiting = faire de fausses copies.', 'counterfeiting = صنع نسخ مزيّفة.', 'easy', 3),
  ('In reported speech, "will" becomes…', 'في الكلام المنقول تصبح "will"…',
   '["would","would have","will","can"]'::jsonb, '["would","would have","will","can"]'::jsonb,
   0, '"will" → "would".', '«will» ← «would».', 'easy', 4),
  ('Passive: "New laws ___ to fight corruption."', 'المجهول: "New laws ___ to fight corruption."',
   '["have been introduced","have introduced","introduces","are introducing"]'::jsonb, '["have been introduced","have introduced","introduces","are introducing"]'::jsonb,
   0, 'Passive present perfect = have been + past participle.', 'المجهول في المضارع التام = have been + اسم المفعول.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'ethics'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'ASTRONOMY AND THE SOLAR SYSTEM (BAC unit)

KEY VOCABULARY
the solar system, planet, orbit, gravity, satellite, telescope, galaxy,
astronaut, spacecraft, to explore, to launch, to orbit, weightlessness.

THE FUTURE AND PREDICTIONS
• will + base verb: predictions. "Humans will live on Mars one day."
• be going to: plans/evidence. "They are going to launch a rocket."
• may / might: possibility. "Life might exist on other planets."

THE PRESENT PERFECT (experience and results)
have/has + past participle. "Scientists have discovered new planets."
Used with: ever, never, already, yet, just, since, for.
"Humans have explored space since 1961."

RELATIVE CLAUSES (to define things)
who (people), which/that (things), where (places).
"The telescope which was launched in 1990 sent amazing images."

CONDITIONALS FOR HYPOTHESES (type 2)
If + past, would + base verb.
"If we found water, life would be possible."

EXAM TIP: present perfect links the past to now (result), simple past is a
finished moment. "Has landed" (result) vs "landed in 1969" (finished date).',
  lesson_ar = 'علم الفلك والمجموعة الشمسية (وحدة البكالوريا)

مفردات أساسية
the solar system (المجموعة الشمسية)، planet (كوكب)، orbit (مدار)،
gravity (جاذبية)، galaxy (مجرّة)، astronaut (رائد فضاء)، to launch (يطلق).

المستقبل والتنبؤات
• will + فعل مجرد: تنبؤ. "Humans will live on Mars."
• be going to: خطة/دليل. "They are going to launch a rocket."
• may / might: احتمال. "Life might exist on other planets."

المضارع التام (تجربة ونتيجة)
have/has + اسم المفعول. "Scientists have discovered new planets."
مع: ever, never, already, yet, just, since, for.

الجمل الوصلية
who (أشخاص)، which/that (أشياء)، where (أماكن).

الشرط النوع الثاني (افتراض)
If + ماضٍ، would + فعل مجرد. "If we found water, life would be possible."

نصيحة: المضارع التام يربط الماضي بالحاضر (نتيجة)، والماضي البسيط لحظة منتهية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'astronomy';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Present perfect: "Scientists ___ new planets."', 'المضارع التام: "Scientists ___ new planets."',
   '["have discovered","discovered","discovers","are discovering"]'::jsonb, '["have discovered","discovered","discovers","are discovering"]'::jsonb,
   0, 'have + past participle (discovered).', 'have + اسم المفعول (discovered).', 'medium', 1),
  ('Prediction: "Humans ___ on Mars one day."', 'تنبؤ: "Humans ___ on Mars one day."',
   '["will live","lived","have lived","live"]'::jsonb, '["will live","lived","have lived","live"]'::jsonb,
   0, '"will + base verb" for predictions.', '«will + فعل مجرد» للتنبؤ.', 'easy', 2),
  ('Relative clause: "The rocket ___ was launched exploded."', 'جملة وصلية: "The rocket ___ was launched exploded."',
   '["which","who","where","when"]'::jsonb, '["which","who","where","when"]'::jsonb,
   0, '"which" refers to things.', '«which» تعود على الأشياء.', 'medium', 3),
  ('Which word means "مدار"?', 'أي كلمة تعني «مدار»؟',
   '["orbit","gravity","galaxy","satellite"]'::jsonb, '["orbit","gravity","galaxy","satellite"]'::jsonb,
   0, 'Orbit = the path around a planet/star.', 'orbit = المسار حول كوكب أو نجم.', 'easy', 4),
  ('Type 2 conditional: "If we ___ water, life would be possible."', 'الشرط نوع 2: "If we ___ water, life would be possible."',
   '["found","find","will find","have found"]'::jsonb, '["found","find","will find","have found"]'::jsonb,
   0, 'Type 2: if + past, would + base verb.', 'النوع 2: if + ماضٍ، would + فعل مجرد.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'astronomy'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
