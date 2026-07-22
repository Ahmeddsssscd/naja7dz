-- ===============================================================
-- Migration: 20260722_022_college_1am_2am_maths
--
-- Bilingual lessons + 5-question quiz banks for every 1AM and 2AM maths
-- chapter (chapters seeded in migration 017). Fills the non-exam college
-- years so younger students get the full lesson→quiz experience.
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- ================= 1AM MATHÉMATIQUES =================

update public.chapters c set
  lesson_fr = 'NOMBRES ENTIERS ET DÉCIMAUX

LES ENTIERS NATURELS
0, 1, 2, 3… servent à compter. On les lit par classes de 3 chiffres
(unités, mille, million).

LES NOMBRES DÉCIMAUX
Un nombre décimal a une partie entière et une partie décimale séparées par
une virgule : 12,45. Le premier chiffre après la virgule = les dixièmes,
le deuxième = les centièmes, le troisième = les millièmes.

COMPARER
On compare d''abord la partie entière, puis chiffre par chiffre après la
virgule. Attention : 3,5 = 3,50 (les zéros à droite ne changent rien).
3,45 < 3,5 car 4 dixièmes < 5 dixièmes.

REPÉRAGE SUR UNE DEMI-DROITE GRADUÉE
Chaque nombre a une position (abscisse) sur la droite graduée.

À RETENIR : la virgule sépare les unités des dixièmes. Bien lire le rang
de chaque chiffre.',
  lesson_ar = 'الأعداد الطبيعية والعشرية

الأعداد الطبيعية
0، 1، 2، 3… تُستعمل للعدّ، وتُقرأ بأقسام من ثلاثة أرقام (وحدات، آلاف، ملايين).

الأعداد العشرية
للعدد العشري جزء صحيح وجزء عشري تفصل بينهما فاصلة: 12.45. أول رقم بعد الفاصلة
هو الأعشار، والثاني أجزاء من مئة، والثالث أجزاء من ألف.

المقارنة
نقارن الجزء الصحيح أولاً ثم رقمًا رقمًا بعد الفاصلة. ملاحظة: 3.5 = 3.50.
3.45 < 3.5 لأن 4 أعشار < 5 أعشار.

التوقيع على مستقيم مدرّج
لكل عدد موضع (فاصلة) على المستقيم المدرّج.

تذكر: الفاصلة تفصل الوحدات عن الأعشار.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'entiers-decimaux';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 34,72 le chiffre 7 représente…', 'في 34.72 يمثل الرقم 7…',
   '["7 dixièmes","7 unités","7 centièmes","7 dizaines"]'::jsonb, '["7 أعشار","7 وحدات","7 أجزاء من مئة","7 عشرات"]'::jsonb,
   0, '1er chiffre après la virgule = dixièmes.', 'أول رقم بعد الفاصلة = الأعشار.', 'easy', 1),
  ('Compare : 3,45 … 3,5', 'قارن: 3.45 … 3.5',
   '["3,45 < 3,5","3,45 > 3,5","3,45 = 3,5","impossible"]'::jsonb, '["3.45 < 3.5","3.45 > 3.5","3.45 = 3.5","مستحيل"]'::jsonb,
   0, '4 dixièmes < 5 dixièmes.', '4 أعشار < 5 أعشار.', 'medium', 2),
  ('Quelle écriture égale 7,3 ?', 'أي كتابة تساوي 7.3؟',
   '["7,30","7,03","0,73","73"]'::jsonb, '["7.30","7.03","0.73","73"]'::jsonb,
   0, 'Ajouter un zéro à droite ne change rien.', 'إضافة صفر على اليمين لا تغيّر القيمة.', 'easy', 3),
  ('Le plus grand nombre est…', 'العدد الأكبر هو…',
   '["12,8","12,79","12,081","9,99"]'::jsonb, '["12.8","12.79","12.081","9.99"]'::jsonb,
   0, '12,8 = 12,800 > 12,79.', '12.8 = 12.800 > 12.79.', 'medium', 4),
  ('2,05 se lit…', 'يُقرأ 2.05…',
   '["deux et cinq centièmes","deux et cinq dixièmes","deux et cinquante","vingt-cinq"]'::jsonb, '["اثنان وخمسة أجزاء من مئة","اثنان وخمسة أعشار","اثنان وخمسون","خمسة وعشرون"]'::jsonb,
   0, '05 après la virgule = 5 centièmes.', '05 بعد الفاصلة = 5 أجزاء من مئة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'entiers-decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES OPÉRATIONS

L''ADDITION et LA SOUSTRACTION
On pose les nombres en alignant les virgules et les rangs. On complète avec
des zéros si besoin.

LA MULTIPLICATION
Multiplier par 10, 100, 1000 : on décale la virgule vers la droite d''autant
de rangs. 3,45 × 100 = 345.
Multiplier deux décimaux : on multiplie sans virgule puis on place autant de
chiffres après la virgule que dans les deux facteurs réunis.

LA DIVISION
Diviser par 10, 100 : on décale la virgule vers la gauche. 345 ÷ 100 = 3,45.
Quotient et reste : dans la division euclidienne, dividende = diviseur ×
quotient + reste (avec reste < diviseur).

PRIORITÉS DE CALCUL
1. Les parenthèses. 2. La multiplication et la division. 3. L''addition et la
soustraction. On calcule de gauche à droite à priorité égale.
Exemple : 5 + 3 × 2 = 5 + 6 = 11 (pas 16).',
  lesson_ar = 'العمليات

الجمع والطرح
نضع الأعداد بمحاذاة الفواصل والمراتب، ونكمل بالأصفار عند الحاجة.

الضرب
الضرب في 10 و100 و1000: ننقل الفاصلة نحو اليمين بعدد المراتب. 3.45 × 100 = 345.
ضرب عددين عشريين: نضرب دون فاصلة ثم نضع عدد الأرقام العشرية = مجموع أرقام العاملين.

القسمة
القسمة على 10 و100: ننقل الفاصلة نحو اليسار. 345 ÷ 100 = 3.45.
القسمة الإقليدية: المقسوم = القاسم × الحاصل + الباقي (الباقي < القاسم).

أولويات الحساب
1. الأقواس. 2. الضرب والقسمة. 3. الجمع والطرح.
مثال: 5 + 3 × 2 = 11 (وليس 16).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3,45 × 100 = ?', '3.45 × 100 = ؟',
   '["345","34,5","3450","3,45"]'::jsonb, '["345","34.5","3450","3.45"]'::jsonb,
   0, 'On décale la virgule de 2 rangs à droite.', 'ننقل الفاصلة رتبتين نحو اليمين.', 'easy', 1),
  ('Calcule : 5 + 3 × 2', 'احسب: 5 + 3 × 2',
   '["11","16","13","10"]'::jsonb, '["11","16","13","10"]'::jsonb,
   0, 'Multiplication d''abord : 3×2=6, puis 5+6=11.', 'الضرب أولاً: 6، ثم 5+6=11.', 'medium', 2),
  ('345 ÷ 100 = ?', '345 ÷ 100 = ؟',
   '["3,45","34,5","3450","0,345"]'::jsonb, '["3.45","34.5","3450","0.345"]'::jsonb,
   0, 'On décale la virgule de 2 rangs à gauche.', 'ننقل الفاصلة رتبتين نحو اليسار.', 'easy', 3),
  ('Dans 47 = 6 × 7 + reste, le reste est…', 'في 47 = 6 × 7 + الباقي، الباقي هو…',
   '["5","1","42","7"]'::jsonb, '["5","1","42","7"]'::jsonb,
   0, '6×7 = 42, reste = 47−42 = 5.', '6×7 = 42، الباقي = 5.', 'medium', 4),
  ('Calcule : (5 + 3) × 2', 'احسب: (5 + 3) × 2',
   '["16","11","13","10"]'::jsonb, '["16","11","13","10"]'::jsonb,
   0, 'Parenthèses d''abord : 8×2 = 16.', 'الأقواس أولاً: 8×2 = 16.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES FRACTIONS

SENS D''UNE FRACTION
a/b : b (dénominateur) = nombre de parts égales du tout ; a (numérateur) =
nombre de parts prises. 3/4 = 3 parts sur 4.

FRACTIONS ÉGALES
On multiplie (ou divise) numérateur ET dénominateur par le même nombre :
1/2 = 2/4 = 3/6. Simplifier = diviser les deux par le même nombre.

COMPARER
• Même dénominateur : la plus grande a le plus grand numérateur (3/5 > 2/5).
• Même numérateur : la plus grande a le plus petit dénominateur (1/3 > 1/5).

FRACTION D''UNE QUANTITÉ
Prendre 3/4 de 20 : 20 ÷ 4 = 5, puis 5 × 3 = 15.

ADDITION (même dénominateur)
On additionne les numérateurs : 2/7 + 3/7 = 5/7.

À RETENIR : une fraction est un partage ; le dénominateur ne doit jamais
être nul.',
  lesson_ar = 'الكسور

معنى الكسر
a/b: المقام b عدد الأجزاء المتساوية للكل، والبسط a عدد الأجزاء المأخوذة.
3/4 = 3 أجزاء من 4.

الكسور المتساوية
نضرب (أو نقسم) البسط والمقام في نفس العدد: 1/2 = 2/4 = 3/6. الاختزال = القسمة على نفس العدد.

المقارنة
• نفس المقام: الأكبر بسطًا هو الأكبر (3/5 > 2/5).
• نفس البسط: الأصغر مقامًا هو الأكبر (1/3 > 1/5).

كسر من مقدار
3/4 من 20: 20 ÷ 4 = 5 ثم 5 × 3 = 15.

الجمع (نفس المقام)
2/7 + 3/7 = 5/7.

تذكر: الكسر تجزئة، والمقام لا يكون معدومًا أبدًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'fractions';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Quelle fraction est égale à 1/2 ?', 'أي كسر يساوي 1/2؟',
   '["3/6","2/3","1/4","3/4"]'::jsonb, '["3/6","2/3","1/4","3/4"]'::jsonb,
   0, '1/2 = 3/6 (×3 en haut et en bas).', '1/2 = 3/6.', 'easy', 1),
  ('Compare : 3/5 … 2/5', 'قارن: 3/5 … 2/5',
   '["3/5 > 2/5","3/5 < 2/5","3/5 = 2/5","impossible"]'::jsonb, '["3/5 > 2/5","3/5 < 2/5","3/5 = 2/5","مستحيل"]'::jsonb,
   0, 'Même dénominateur : 3 > 2.', 'نفس المقام: 3 > 2.', 'easy', 2),
  ('Calcule : 3/4 de 20', 'احسب: 3/4 من 20',
   '["15","12","5","60"]'::jsonb, '["15","12","5","60"]'::jsonb,
   0, '20÷4=5, puis 5×3=15.', '20÷4=5 ثم 5×3=15.', 'medium', 3),
  ('Simplifie : 6/8', 'اختزل: 6/8',
   '["3/4","2/4","6/8","1/2"]'::jsonb, '["3/4","2/4","6/8","1/2"]'::jsonb,
   0, 'On divise par 2 : 6/8 = 3/4.', 'نقسم على 2: 6/8 = 3/4.', 'medium', 4),
  ('Compare : 1/3 … 1/5', 'قارن: 1/3 … 1/5',
   '["1/3 > 1/5","1/3 < 1/5","1/3 = 1/5","impossible"]'::jsonb, '["1/3 > 1/5","1/3 < 1/5","1/3 = 1/5","مستحيل"]'::jsonb,
   0, 'Même numérateur : plus petit dénominateur = plus grand.', 'نفس البسط: الأصغر مقامًا أكبر.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'fractions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES NOMBRES RELATIFS

DÉCOUVERTE
Un nombre relatif a un signe : positif (+) ou négatif (−).
Exemples de la vie : température −5 °C, une dette −200 DA, un étage −2.

REPÉRAGE SUR UNE DROITE
0 est l''origine. Les positifs à droite, les négatifs à gauche.
Plus on va à droite, plus le nombre est grand : −5 < −2 < 0 < 3.

COMPARER DES RELATIFS
• Un négatif est toujours plus petit qu''un positif.
• Entre deux négatifs, le plus grand est celui le plus proche de 0 :
  −2 > −7.

DISTANCE À ZÉRO (valeur absolue)
La distance à zéro de +5 et de −5 est 5. Deux nombres opposés (+3 et −3)
ont la même distance à zéro.

À RETENIR : sur la droite graduée, « plus grand » veut dire « plus à
droite », pas « plus loin de zéro ».',
  lesson_ar = 'الأعداد النسبية

اكتشاف
للعدد النسبي إشارة: موجب (+) أو سالب (−).
أمثلة من الحياة: حرارة −5 °م، دَين −200 دج، طابق −2.

التوقيع على مستقيم
0 هو المبدأ. الموجبة يمينًا والسالبة يسارًا. كلما اتجهنا يمينًا كبر العدد:
−5 < −2 < 0 < 3.

مقارنة الأعداد النسبية
• العدد السالب دائمًا أصغر من الموجب.
• بين سالبين: الأكبر هو الأقرب إلى الصفر: −2 > −7.

البعد عن الصفر (القيمة المطلقة)
بُعد +5 و−5 عن الصفر هو 5. العددان المتقابلان (+3 و−3) لهما نفس البعد.

تذكر: على المستقيم «الأكبر» يعني «الأكثر يمينًا» لا «الأبعد عن الصفر».'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'relatifs';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Compare : −5 … −2', 'قارن: −5 … −2',
   '["−5 < −2","−5 > −2","−5 = −2","impossible"]'::jsonb, '["−5 < −2","−5 > −2","−5 = −2","مستحيل"]'::jsonb,
   0, '−2 est plus proche de 0, donc plus grand.', '−2 أقرب إلى الصفر إذن أكبر.', 'easy', 1),
  ('Quel est l''opposé de +7 ?', 'ما مقابل +7؟',
   '["−7","+7","0","1/7"]'::jsonb, '["−7","+7","0","1/7"]'::jsonb,
   0, 'L''opposé change le signe : −7.', 'المقابل يغيّر الإشارة: −7.', 'easy', 2),
  ('Range du plus petit au plus grand : 3 ; −1 ; −4 ; 0', 'رتّب من الأصغر إلى الأكبر: 3 ؛ −1 ؛ −4 ؛ 0',
   '["−4 < −1 < 0 < 3","3 < 0 < −1 < −4","−1 < −4 < 0 < 3","0 < −1 < 3 < −4"]'::jsonb,
   '["−4 < −1 < 0 < 3","3 < 0 < −1 < −4","−1 < −4 < 0 < 3","0 < −1 < 3 < −4"]'::jsonb,
   0, 'Sur la droite : les négatifs à gauche.', 'على المستقيم السالبة يسارًا.', 'medium', 3),
  ('La distance à zéro de −8 est…', 'بُعد −8 عن الصفر هو…',
   '["8","−8","0","16"]'::jsonb, '["8","−8","0","16"]'::jsonb,
   0, 'La distance à zéro est toujours positive.', 'البعد عن الصفر موجب دائمًا.', 'medium', 4),
  ('Un négatif est-il plus grand ou plus petit qu''un positif ?', 'هل السالب أكبر أم أصغر من الموجب؟',
   '["toujours plus petit","toujours plus grand","parfois égal","cela dépend"]'::jsonb, '["دائمًا أصغر","دائمًا أكبر","أحيانًا متساويان","حسب الحالة"]'::jsonb,
   0, 'Tout négatif < tout positif.', 'كل سالب أصغر من أي موجب.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'relatifs'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA PROPORTIONNALITÉ

DÉFINITION
Deux grandeurs sont proportionnelles si on passe de l''une à l''autre en
multipliant toujours par le même nombre (le coefficient).

LE TABLEAU DE PROPORTIONNALITÉ
Les quotients d''une colonne à l''autre sont égaux.
2 → 6, 5 → 15, 8 → 24 : coefficient ×3.

LA RÈGLE DE TROIS (passage à l''unité)
4 stylos coûtent 60 DA. Combien coûtent 7 stylos ?
1 stylo : 60 ÷ 4 = 15 DA. 7 stylos : 15 × 7 = 105 DA.

LES POURCENTAGES
Un pourcentage est une proportion sur 100. 20 % de 50 = (20 × 50) ÷ 100 = 10.

LA VITESSE
v = distance ÷ temps. C''est une situation de proportionnalité entre la
distance et le temps.

À RETENIR : proportionnel = même multiplicateur pour toutes les colonnes.',
  lesson_ar = 'التناسبية

تعريف
مقداران متناسبان إذا انتقلنا من الأول إلى الثاني بالضرب دائمًا في نفس العدد (المعامل).

جدول التناسبية
خارج القسمة متساوٍ من عمود لآخر.
2 ← 6، 5 ← 15، 8 ← 24: المعامل ×3.

قاعدة الثلاثة (المرور بالوحدة)
4 أقلام بـ 60 دج. كم ثمن 7 أقلام؟
قلم واحد: 60 ÷ 4 = 15 دج. سبعة: 15 × 7 = 105 دج.

النسب المئوية
النسبة المئوية تناسب من 100. 20% من 50 = (20 × 50) ÷ 100 = 10.

السرعة
v = المسافة ÷ الزمن، وهي وضعية تناسبية بين المسافة والزمن.

تذكر: التناسب = نفس المعامل لكل الأعمدة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('4 stylos coûtent 60 DA. 7 stylos coûtent…', '4 أقلام بـ 60 دج. 7 أقلام بـ…',
   '["105 DA","120 DA","90 DA","420 DA"]'::jsonb, '["105 دج","120 دج","90 دج","420 دج"]'::jsonb,
   0, '1 stylo = 15 DA, 7 stylos = 105 DA.', 'قلم = 15 دج، 7 = 105 دج.', 'medium', 1),
  ('20 % de 50 = ?', '20% من 50 = ؟',
   '["10","20","30","5"]'::jsonb, '["10","20","30","5"]'::jsonb,
   0, '(20×50)/100 = 10.', '(20×50)/100 = 10.', 'easy', 2),
  ('Le tableau 2→6, 5→15 a pour coefficient…', 'الجدول 2←6، 5←15 معامله…',
   '["3","2","4","6"]'::jsonb, '["3","2","4","6"]'::jsonb,
   0, '6÷2 = 15÷5 = 3.', '6÷2 = 15÷5 = 3.', 'medium', 3),
  ('Une voiture à 80 km/h parcourt en 3 h…', 'سيارة سرعتها 80 كم/سا تقطع في 3 سا…',
   '["240 km","83 km","160 km","27 km"]'::jsonb, '["240 كم","83 كم","160 كم","27 كم"]'::jsonb,
   0, '80 × 3 = 240 km.', '80 × 3 = 240 كم.', 'easy', 4),
  ('Ce tableau est-il proportionnel ? 3→9 ; 4→12 ; 5→14', 'هل الجدول تناسبي؟ 3←9 ؛ 4←12 ؛ 5←14',
   '["Non","Oui, coef 3","Oui, coef 2","On ne peut pas savoir"]'::jsonb, '["لا","نعم، المعامل 3","نعم، المعامل 2","لا نعلم"]'::jsonb,
   0, '9÷3=3, 12÷4=3, mais 14÷5=2,8 : non proportionnel.', '14÷5 = 2.8 ≠ 3 إذن غير تناسبي.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'DROITES ET ANGLES

VOCABULAIRE DES DROITES
• Droites PARALLÈLES : ne se croisent jamais (même écart partout). Notation //.
• Droites PERPENDICULAIRES : se croisent en formant un angle droit (90°).
  Notation ⊥.
• Droites SÉCANTES : se croisent en un point.

LES ANGLES
Un angle se mesure en degrés avec un rapporteur.
• Angle DROIT = 90°. • Angle PLAT = 180°. • Angle AIGU < 90°.
• Angle OBTUS entre 90° et 180°.

ANGLES PARTICULIERS
• Deux angles COMPLÉMENTAIRES : leur somme fait 90°.
• Deux angles SUPPLÉMENTAIRES : leur somme fait 180°.
• Angles OPPOSÉS PAR LE SOMMET : ils sont égaux.

LA MÉDIATRICE
La médiatrice d''un segment est la droite perpendiculaire qui passe par son
milieu. Tout point de la médiatrice est à égale distance des deux extrémités.',
  lesson_ar = 'المستقيمات والزوايا

مصطلحات المستقيمات
• متوازيان: لا يتقاطعان أبدًا (نفس المسافة). الرمز //.
• متعامدان: يتقاطعان مكوّنين زاوية قائمة (90°). الرمز ⊥.
• متقاطعان: يلتقيان في نقطة.

الزوايا
تُقاس الزاوية بالدرجات بالمنقلة.
• قائمة = 90°. • مستقيمة = 180°. • حادة < 90°. • منفرجة بين 90° و180°.

زوايا خاصة
• متتامّتان: مجموعهما 90°.
• متكاملتان: مجموعهما 180°.
• متقابلتان بالرأس: متساويتان.

محور القطعة
محور القطعة هو المستقيم العمودي المار بمنتصفها. كل نقطة منه تبعد بالتساوي عن طرفيها.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'droites-angles';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un angle droit mesure…', 'الزاوية القائمة تقيس…',
   '["90°","180°","45°","360°"]'::jsonb, '["90°","180°","45°","360°"]'::jsonb,
   0, 'L''angle droit = 90°.', 'الزاوية القائمة = 90°.', 'easy', 1),
  ('Deux droites qui ne se croisent jamais sont…', 'مستقيمان لا يتقاطعان أبدًا هما…',
   '["parallèles","perpendiculaires","sécantes","confondues"]'::jsonb, '["متوازيان","متعامدان","متقاطعان","منطبقان"]'::jsonb,
   0, 'Elles sont parallèles.', 'هما متوازيان.', 'easy', 2),
  ('Deux angles complémentaires ont une somme de…', 'زاويتان متتامّتان مجموعهما…',
   '["90°","180°","45°","360°"]'::jsonb, '["90°","180°","45°","360°"]'::jsonb,
   0, 'Complémentaires → 90°.', 'المتتامّتان ← 90°.', 'medium', 3),
  ('Un angle de 130° est…', 'زاوية 130° هي…',
   '["obtus","aigu","droit","plat"]'::jsonb, '["منفرجة","حادة","قائمة","مستقيمة"]'::jsonb,
   0, 'Entre 90° et 180° = obtus.', 'بين 90° و180° = منفرجة.', 'medium', 4),
  ('La médiatrice d''un segment passe par son milieu et lui est…', 'محور القطعة يمر بمنتصفها ويكون لها…',
   '["perpendiculaire","parallèle","sécante oblique","confondu"]'::jsonb, '["عموديًا","موازيًا","مائلاً","منطبقًا"]'::jsonb,
   0, 'Perpendiculaire passant par le milieu.', 'عمودي مار بالمنتصف.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'droites-angles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'TRIANGLES ET QUADRILATÈRES

LES TRIANGLES
• Quelconque : 3 côtés différents.
• Isocèle : 2 côtés égaux (et 2 angles égaux).
• Équilatéral : 3 côtés égaux (et 3 angles de 60°).
• Rectangle : un angle droit.
PROPRIÉTÉ : la somme des angles d''un triangle est toujours 180°.

INÉGALITÉ TRIANGULAIRE
Un triangle est constructible si le plus grand côté est plus petit que la
somme des deux autres.

LES QUADRILATÈRES
• Rectangle : 4 angles droits, côtés opposés égaux.
• Carré : 4 côtés égaux + 4 angles droits.
• Losange : 4 côtés égaux.
• Parallélogramme : côtés opposés parallèles deux à deux.

CONSTRUCTION
On utilise règle, équerre, compas et rapporteur en respectant les mesures
données.

À RETENIR : dans tout triangle, angle1 + angle2 + angle3 = 180°.',
  lesson_ar = 'المثلثات والرباعيات

المثلثات
• أي مثلث: 3 أضلاع مختلفة.
• متقايس الساقين: ضلعان متساويان (وزاويتان متساويتان).
• متقايس الأضلاع: 3 أضلاع متساوية (و3 زوايا 60°).
• قائم: زاوية قائمة.
خاصية: مجموع زوايا المثلث يساوي دائمًا 180°.

المتباينة المثلثية
يمكن إنشاء المثلث إذا كان أكبر ضلع أصغر من مجموع الضلعين الآخرين.

الرباعيات
• المستطيل: 4 زوايا قائمة، أضلاع متقابلة متساوية.
• المربع: 4 أضلاع متساوية + 4 زوايا قائمة.
• المعيّن: 4 أضلاع متساوية.
• متوازي الأضلاع: أضلاع متقابلة متوازية.

تذكر: في كل مثلث مجموع الزوايا = 180°.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'triangles-quadri';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La somme des angles d''un triangle est…', 'مجموع زوايا المثلث هو…',
   '["180°","360°","90°","270°"]'::jsonb, '["180°","360°","90°","270°"]'::jsonb,
   0, 'Toujours 180°.', 'دائمًا 180°.', 'easy', 1),
  ('Un triangle équilatéral a des angles de…', 'المثلث المتقايس الأضلاع زواياه…',
   '["60°","90°","45°","30°"]'::jsonb, '["60°","90°","45°","30°"]'::jsonb,
   0, '180 ÷ 3 = 60°.', '180 ÷ 3 = 60°.', 'medium', 2),
  ('Un carré est un quadrilatère avec…', 'المربع رباعي له…',
   '["4 côtés égaux et 4 angles droits","4 côtés égaux seulement","4 angles droits seulement","2 côtés égaux"]'::jsonb,
   '["4 أضلاع متساوية و4 زوايا قائمة","4 أضلاع متساوية فقط","4 زوايا قائمة فقط","ضلعان متساويان"]'::jsonb,
   0, 'Définition du carré.', 'تعريف المربع.', 'easy', 3),
  ('Dans un triangle, deux angles font 50° et 60°. Le troisième…', 'في مثلث زاويتان 50° و60°. الثالثة…',
   '["70°","80°","90°","110°"]'::jsonb, '["70°","80°","90°","110°"]'::jsonb,
   0, '180 − 50 − 60 = 70°.', '180 − 50 − 60 = 70°.', 'medium', 4),
  ('Peut-on construire un triangle de côtés 2, 3 et 8 cm ?', 'هل يمكن إنشاء مثلث أضلاعه 2 و3 و8 سم؟',
   '["Non (2+3 < 8)","Oui","Oui, isocèle","Oui, rectangle"]'::jsonb, '["لا (2+3 < 8)","نعم","نعم، متقايس الساقين","نعم، قائم"]'::jsonb,
   0, 'Inégalité triangulaire : 2+3=5 < 8, impossible.', 'المتباينة المثلثية: 5 < 8، مستحيل.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'triangles-quadri'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'AIRES ET PÉRIMÈTRES

LE PÉRIMÈTRE (le tour, en cm)
• Carré : P = 4 × côté.
• Rectangle : P = 2 × (Longueur + largeur).
• Cercle (circonférence) : P = 2 × π × rayon ≈ 6,28 × rayon.

L''AIRE (la surface, en cm²)
• Carré : A = côté × côté.
• Rectangle : A = Longueur × largeur.
• Triangle : A = (base × hauteur) ÷ 2.
• Disque : A = π × rayon².

CONVERSIONS D''AIRES
1 m² = 100 dm² = 10 000 cm². Attention, les aires se convertissent par
bonds de 100, pas de 10.

NE PAS CONFONDRE
Périmètre en cm, aire en cm². Deux figures de même périmètre peuvent avoir
des aires différentes.

À RETENIR : hauteur d''un triangle = segment perpendiculaire à la base
passant par le sommet opposé.',
  lesson_ar = 'المساحات والمحيطات

المحيط (الدوران، بالسم)
• المربع: 4 × الضلع.
• المستطيل: 2 × (الطول + العرض).
• الدائرة: 2 × π × نصف القطر ≈ 6.28 × نصف القطر.

المساحة (السطح، بالسم²)
• المربع: الضلع × الضلع.
• المستطيل: الطول × العرض.
• المثلث: (القاعدة × الارتفاع) ÷ 2.
• القرص: π × نصف القطر².

تحويل المساحات
1 م² = 100 دسم² = 10000 سم². تُحوّل المساحات بقفزات 100 لا 10.

لا تخلط: المحيط بالسم والمساحة بالسم².

تذكر: ارتفاع المثلث قطعة عمودية على القاعدة تمر بالرأس المقابل.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'aires-perimetres';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Aire d''un rectangle 7 cm × 4 cm ?', 'مساحة مستطيل 7 سم × 4 سم؟',
   '["28 cm²","22 cm²","11 cm²","28 cm"]'::jsonb, '["28 سم²","22 سم²","11 سم²","28 سم"]'::jsonb,
   0, 'A = L × l = 7 × 4 = 28 cm².', 'المساحة = 7 × 4 = 28 سم².', 'easy', 1),
  ('Périmètre d''un carré de côté 5 cm ?', 'محيط مربع ضلعه 5 سم؟',
   '["20 cm","25 cm","10 cm","15 cm"]'::jsonb, '["20 سم","25 سم","10 سم","15 سم"]'::jsonb,
   0, 'P = 4 × 5 = 20 cm.', 'المحيط = 4 × 5 = 20 سم.', 'easy', 2),
  ('Aire d''un triangle : base 8, hauteur 5 ?', 'مساحة مثلث قاعدته 8 وارتفاعه 5؟',
   '["20 cm²","40 cm²","13 cm²","26 cm²"]'::jsonb, '["20 سم²","40 سم²","13 سم²","26 سم²"]'::jsonb,
   0, 'A = (8×5)/2 = 20 cm².', 'المساحة = (8×5)/2 = 20 سم².', 'medium', 3),
  ('1 m² = ? cm²', '1 م² = ؟ سم²',
   '["10 000","100","1000","10"]'::jsonb, '["10000","100","1000","10"]'::jsonb,
   0, '1 m² = 10 000 cm².', '1 م² = 10000 سم².', 'medium', 4),
  ('Le périmètre se mesure en cm, l''aire en…', 'المحيط بالسم والمساحة بـ…',
   '["cm²","cm","cm³","litres"]'::jsonb, '["سم²","سم","سم³","لترات"]'::jsonb,
   0, 'L''aire est une surface : cm².', 'المساحة سطح: سم².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'aires-perimetres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 2AM MATHÉMATIQUES =================

update public.chapters c set
  lesson_fr = 'OPÉRATIONS SUR LES NOMBRES RELATIFS

ADDITION DE DEUX RELATIFS
• Mêmes signes : on additionne les distances à zéro, on garde le signe.
  (+5) + (+3) = +8 ;  (−5) + (−3) = −8.
• Signes différents : on soustrait les distances, on garde le signe du plus
  grand en distance. (+7) + (−4) = +3 ;  (−7) + (+4) = −3.

SOUSTRACTION
Soustraire = ajouter l''opposé.
(+5) − (+8) = (+5) + (−8) = −3.
(−4) − (−9) = (−4) + (+9) = +5.

MULTIPLICATION ET DIVISION — RÈGLE DES SIGNES
• (+) × (+) = (+) et (−) × (−) = (+).
• (+) × (−) = (−) et (−) × (+) = (−).
Même règle pour la division.
(−6) × (−2) = +12 ;  (−12) ÷ (+3) = −4.

À RETENIR : « moins par moins donne plus ». Pour soustraire, on transforme
en addition de l''opposé.',
  lesson_ar = 'العمليات على الأعداد النسبية

جمع عددين نسبيين
• نفس الإشارة: نجمع البعدين عن الصفر ونحتفظ بالإشارة.
  (+5) + (+3) = +8 ؛ (−5) + (−3) = −8.
• إشارتان مختلفتان: نطرح البعدين ونحتفظ بإشارة الأكبر بعدًا.
  (+7) + (−4) = +3 ؛ (−7) + (+4) = −3.

الطرح
الطرح = إضافة المقابل.
(+5) − (+8) = (+5) + (−8) = −3.

الضرب والقسمة — قاعدة الإشارات
• (+) × (+) = (+) و (−) × (−) = (+).
• (+) × (−) = (−) و (−) × (+) = (−).
نفس القاعدة للقسمة.
(−6) × (−2) = +12 ؛ (−12) ÷ (+3) = −4.

تذكر: «سالب في سالب يعطي موجبًا». وللطرح نحوّل إلى جمع المقابل.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'relatifs-operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : (−5) + (−3)', 'احسب: (−5) + (−3)',
   '["−8","−2","+8","+2"]'::jsonb, '["−8","−2","+8","+2"]'::jsonb,
   0, 'Mêmes signes : on ajoute, on garde le signe.', 'نفس الإشارة: نجمع ونحتفظ بالإشارة.', 'easy', 1),
  ('Calcule : (+7) + (−4)', 'احسب: (+7) + (−4)',
   '["+3","−3","+11","−11"]'::jsonb, '["+3","−3","+11","−11"]'::jsonb,
   0, 'On soustrait, signe du plus grand : +3.', 'نطرح، إشارة الأكبر: +3.', 'medium', 2),
  ('Calcule : (−6) × (−2)', 'احسب: (−6) × (−2)',
   '["+12","−12","−8","+8"]'::jsonb, '["+12","−12","−8","+8"]'::jsonb,
   0, 'Moins par moins = plus.', 'سالب في سالب = موجب.', 'easy', 3),
  ('Calcule : (+5) − (+8)', 'احسب: (+5) − (+8)',
   '["−3","+3","+13","−13"]'::jsonb, '["−3","+3","+13","−13"]'::jsonb,
   0, '(+5) + (−8) = −3.', '(+5) + (−8) = −3.', 'medium', 4),
  ('Calcule : (−12) ÷ (+3)', 'احسب: (−12) ÷ (+3)',
   '["−4","+4","−9","−36"]'::jsonb, '["−4","+4","−9","−36"]'::jsonb,
   0, 'Signes différents = négatif : −4.', 'إشارتان مختلفتان = سالب: −4.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'relatifs-operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'OPÉRATIONS SUR LES FRACTIONS

METTRE AU MÊME DÉNOMINATEUR
Pour additionner ou soustraire, il faut le même dénominateur.
1/3 + 1/4 : dénominateur commun 12 → 4/12 + 3/12 = 7/12.

MULTIPLICATION
On multiplie les numérateurs entre eux, les dénominateurs entre eux.
2/3 × 5/7 = 10/21. On peut simplifier avant de calculer.

DIVISION
Diviser par une fraction = multiplier par son inverse.
2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.

FRACTION D''UNE FRACTION
Les 2/3 de 3/4 : 2/3 × 3/4 = 6/12 = 1/2.

SIMPLIFIER
On divise numérateur et dénominateur par le même nombre jusqu''à la forme
irréductible : 18/24 = 3/4 (÷6).

À RETENIR : on additionne SEULEMENT au même dénominateur ; on multiplie
directement ; on divise en multipliant par l''inverse.',
  lesson_ar = 'العمليات على الكسور

توحيد المقامات
للجمع أو الطرح يجب توحيد المقام.
1/3 + 1/4: المقام المشترك 12 ← 4/12 + 3/12 = 7/12.

الضرب
نضرب البسط في البسط والمقام في المقام.
2/3 × 5/7 = 10/21. يمكن الاختزال قبل الحساب.

القسمة
القسمة على كسر = الضرب في مقلوبه.
2/3 ÷ 4/5 = 2/3 × 5/4 = 5/6.

كسر من كسر
2/3 من 3/4: 2/3 × 3/4 = 1/2.

الاختزال
نقسم البسط والمقام على نفس العدد حتى الصورة غير القابلة للاختزال: 18/24 = 3/4.

تذكر: نجمع فقط بنفس المقام، ونضرب مباشرة، ونقسم بالضرب في المقلوب.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'fractions-operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 1/3 + 1/4', 'احسب: 1/3 + 1/4',
   '["7/12","2/7","2/12","1/7"]'::jsonb, '["7/12","2/7","2/12","1/7"]'::jsonb,
   0, 'Dénominateur 12 : 4/12 + 3/12 = 7/12.', 'المقام 12: 4/12 + 3/12 = 7/12.', 'medium', 1),
  ('Calcule : 2/3 × 5/7', 'احسب: 2/3 × 5/7',
   '["10/21","7/10","10/10","2/7"]'::jsonb, '["10/21","7/10","10/10","2/7"]'::jsonb,
   0, 'Numérateurs et dénominateurs : 10/21.', 'البسط في البسط والمقام في المقام: 10/21.', 'easy', 2),
  ('Calcule : 2/3 ÷ 4/5', 'احسب: 2/3 ÷ 4/5',
   '["5/6","8/15","6/5","10/7"]'::jsonb, '["5/6","8/15","6/5","10/7"]'::jsonb,
   0, '2/3 × 5/4 = 10/12 = 5/6.', '2/3 × 5/4 = 5/6.', 'medium', 3),
  ('Simplifie : 18/24', 'اختزل: 18/24',
   '["3/4","9/12","2/3","6/8"]'::jsonb, '["3/4","9/12","2/3","6/8"]'::jsonb,
   0, 'On divise par 6 : 18/24 = 3/4.', 'نقسم على 6: 3/4.', 'easy', 4),
  ('Les 2/3 de 3/4 = ?', '2/3 من 3/4 = ؟',
   '["1/2","5/7","6/7","2/4"]'::jsonb, '["1/2","5/7","6/7","2/4"]'::jsonb,
   0, '2/3 × 3/4 = 6/12 = 1/2.', '2/3 × 3/4 = 1/2.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'fractions-operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'CALCUL LITTÉRAL (initiation)

UNE EXPRESSION LITTÉRALE
C''est un calcul contenant des lettres (variables). Ex. 3x + 5.
On peut CALCULER SA VALEUR en remplaçant la lettre par un nombre :
pour x = 2, 3x + 5 = 3×2 + 5 = 11.

CONVENTIONS D''ÉCRITURE
On n''écrit pas le signe × devant une lettre : 3 × x = 3x.
x × x = x². 1 × x = x.

RÉDUIRE UNE EXPRESSION
On regroupe les termes SEMBLABLES (mêmes lettres) :
3x + 5x = 8x ;  2x + 3 + 4x + 1 = 6x + 4.
On ne peut PAS additionner 3x et 5 (termes différents).

LA DISTRIBUTIVITÉ (développer)
k(a + b) = ka + kb.
3(x + 2) = 3x + 6 ;  5(2x − 1) = 10x − 5.

À RETENIR : on ne réduit qu''entre termes semblables. « Développer », c''est
supprimer les parenthèses avec la distributivité.',
  lesson_ar = 'الحساب الحرفي (تمهيد)

العبارة الحرفية
حساب يحتوي على حروف (متغيرات). مثال: 3x + 5.
نحسب قيمتها بتعويض الحرف بعدد: من أجل x = 2، 3x + 5 = 11.

اصطلاحات الكتابة
لا نكتب × أمام حرف: 3 × x = 3x. و x × x = x². و 1 × x = x.

اختزال عبارة
نجمع الحدود المتشابهة (نفس الحروف):
3x + 5x = 8x ؛ 2x + 3 + 4x + 1 = 6x + 4.
لا نجمع 3x و5 (حدّان مختلفان).

التوزيعية (النشر)
k(a + b) = ka + kb.
3(x + 2) = 3x + 6 ؛ 5(2x − 1) = 10x − 5.

تذكر: نختزل فقط بين الحدود المتشابهة. النشر = إزالة الأقواس بالتوزيعية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Pour x = 2, que vaut 3x + 5 ?', 'من أجل x = 2، كم يساوي 3x + 5؟',
   '["11","10","16","8"]'::jsonb, '["11","10","16","8"]'::jsonb,
   0, '3×2 + 5 = 11.', '3×2 + 5 = 11.', 'easy', 1),
  ('Réduis : 3x + 5x', 'اختزل: 3x + 5x',
   '["8x","8x²","15x","8"]'::jsonb, '["8x","8x²","15x","8"]'::jsonb,
   0, 'Termes semblables : 3x+5x = 8x.', 'حدود متشابهة: 8x.', 'easy', 2),
  ('Développe : 3(x + 2)', 'انشر: 3(x + 2)',
   '["3x + 6","3x + 2","x + 6","3x + 5"]'::jsonb, '["3x + 6","3x + 2","x + 6","3x + 5"]'::jsonb,
   0, 'k(a+b) = ka+kb.', 'k(a+b) = ka+kb.', 'medium', 3),
  ('Réduis : 2x + 3 + 4x + 1', 'اختزل: 2x + 3 + 4x + 1',
   '["6x + 4","6x + 3","8x","10x"]'::jsonb, '["6x + 4","6x + 3","8x","10x"]'::jsonb,
   0, '(2x+4x) + (3+1) = 6x + 4.', '(2x+4x) + (3+1) = 6x + 4.', 'medium', 4),
  ('Développe : 5(2x − 1)', 'انشر: 5(2x − 1)',
   '["10x − 5","10x − 1","7x − 5","10x + 5"]'::jsonb, '["10x − 5","10x − 1","7x − 5","10x + 5"]'::jsonb,
   0, '5×2x − 5×1 = 10x − 5.', '10x − 5.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PROPORTIONNALITÉ ET POURCENTAGES

RAPPEL
Deux grandeurs proportionnelles ont un coefficient constant.

LES POURCENTAGES
• Calculer t % d''une valeur : (t × valeur) ÷ 100.
  15 % de 200 = (15 × 200) ÷ 100 = 30.
• Augmentation de 10 % : on multiplie par 1,10.
• Réduction de 20 % : on multiplie par 0,80.

L''ÉCHELLE
Sur une carte, l''échelle 1/100 000 signifie : 1 cm sur la carte = 100 000 cm
= 1 km dans la réalité.
distance réelle = distance carte × dénominateur de l''échelle.

LA VITESSE MOYENNE
v = distance ÷ temps. Unités cohérentes (km et h, ou m et s).
150 km en 2 h → v = 75 km/h.

À RETENIR : un pourcentage est une proportion sur 100. Augmenter de t %,
c''est multiplier par (1 + t/100).',
  lesson_ar = 'التناسبية والنسب المئوية

تذكير
المقداران المتناسبان لهما معامل ثابت.

النسب المئوية
• حساب t% من قيمة: (t × القيمة) ÷ 100.
  15% من 200 = 30.
• زيادة بـ 10%: نضرب في 1.10.
• تخفيض بـ 20%: نضرب في 0.80.

السلّم
على خريطة، السلّم 1/100000 يعني: 1 سم على الخريطة = 100000 سم = 1 كم في الواقع.
المسافة الحقيقية = مسافة الخريطة × مقام السلّم.

السرعة المتوسطة
v = المسافة ÷ الزمن (وحدات متجانسة). 150 كم في ساعتين ← 75 كم/سا.

تذكر: النسبة المئوية تناسب من 100. الزيادة بـ t% = الضرب في (1 + t/100).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('15 % de 200 = ?', '15% من 200 = ؟',
   '["30","15","20","45"]'::jsonb, '["30","15","20","45"]'::jsonb,
   0, '(15×200)/100 = 30.', '(15×200)/100 = 30.', 'easy', 1),
  ('Augmenter 50 de 10 % donne…', 'زيادة 50 بـ 10% تعطي…',
   '["55","60","51","10"]'::jsonb, '["55","60","51","10"]'::jsonb,
   0, '50 × 1,10 = 55.', '50 × 1.10 = 55.', 'medium', 2),
  ('Échelle 1/100 000 : 3 cm sur la carte = ? réel', 'السلّم 1/100000: 3 سم على الخريطة = ؟ في الواقع',
   '["3 km","300 m","30 km","3 m"]'::jsonb, '["3 كم","300 م","30 كم","3 م"]'::jsonb,
   0, '3 × 100 000 = 300 000 cm = 3 km.', '3 × 100000 = 3 كم.', 'medium', 3),
  ('150 km en 2 h : vitesse moyenne ?', '150 كم في ساعتين: السرعة المتوسطة؟',
   '["75 km/h","300 km/h","152 km/h","50 km/h"]'::jsonb, '["75 كم/سا","300 كم/سا","152 كم/سا","50 كم/سا"]'::jsonb,
   0, 'v = 150/2 = 75 km/h.', 'v = 150/2 = 75 كم/سا.', 'easy', 4),
  ('Réduire un prix de 20 %, c''est multiplier par…', 'تخفيض ثمن بـ 20% = الضرب في…',
   '["0,80","1,20","0,20","0,08"]'::jsonb, '["0.80","1.20","0.20","0.08"]'::jsonb,
   0, '100 % − 20 % = 80 % → ×0,80.', '100% − 20% = 80% ← ×0.80.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA SYMÉTRIE CENTRALE

DÉFINITION
Le symétrique d''un point M par rapport à un point O est le point M'' tel que
O est le MILIEU du segment [MM'']. On dit qu''on a fait un demi-tour (180°)
autour de O.

CONSTRUCTION
Pour construire M'' : on trace la demi-droite [MO), et on reporte la distance
OM de l''autre côté : OM'' = OM.

PROPRIÉTÉS
La symétrie centrale CONSERVE :
• les longueurs (un segment et son image ont même longueur),
• les angles (mêmes mesures),
• le parallélisme et l''alignement,
• les aires.
L''image d''une droite est une droite qui lui est PARALLÈLE.

CENTRE DE SYMÉTRIE D''UNE FIGURE
Une figure a un centre de symétrie O si elle se superpose à elle-même après
un demi-tour autour de O (ex. le cercle, le rectangle, le parallélogramme).

DIFFÉRENCE avec la symétrie axiale : la symétrie axiale est un pliage
(par rapport à une droite) ; la symétrie centrale est un demi-tour
(par rapport à un point).',
  lesson_ar = 'التناظر المركزي

تعريف
نظير النقطة M بالنسبة للنقطة O هو النقطة M'' بحيث O منتصف القطعة [MM''].
أي أننا قمنا بنصف دورة (180°) حول O.

الإنشاء
لإنشاء M'': نرسم نصف المستقيم [MO) وننقل المسافة OM إلى الجهة الأخرى: OM'' = OM.

الخصائص
يحافظ التناظر المركزي على:
• الأطوال، • الزوايا، • التوازي والاستقامية، • المساحات.
صورة مستقيم هي مستقيم يوازيه.

مركز تناظر شكل
للشكل مركز تناظر O إذا انطبق على نفسه بعد نصف دورة حول O (الدائرة، المستطيل، متوازي الأضلاع).

الفرق مع التناظر المحوري: المحوري طيّ (بالنسبة لمستقيم)، والمركزي نصف دورة (بالنسبة لنقطة).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'symetrie-centrale';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La symétrie centrale correspond à un…', 'التناظر المركزي يوافق…',
   '["demi-tour (180°)","pliage","quart de tour","agrandissement"]'::jsonb, '["نصف دورة (180°)","طيّ","ربع دورة","تكبير"]'::jsonb,
   0, 'Demi-tour autour du centre.', 'نصف دورة حول المركز.', 'easy', 1),
  ('Si M'' est le symétrique de M par rapport à O, alors O est…', 'إذا كانت M'' نظيرة M بالنسبة لـ O فإن O هي…',
   '["le milieu de [MM'']","une extrémité","en dehors","confondu avec M"]'::jsonb, '["منتصف [MM'']","طرف","خارج القطعة","منطبقة على M"]'::jsonb,
   0, 'O est le milieu de [MM''].', 'O منتصف [MM''].', 'medium', 2),
  ('La symétrie centrale conserve…', 'يحافظ التناظر المركزي على…',
   '["les longueurs et les angles","seulement les couleurs","rien","seulement le sens"]'::jsonb, '["الأطوال والزوايا","الألوان فقط","لا شيء","المنحى فقط"]'::jsonb,
   0, 'Longueurs, angles, aires sont conservés.', 'يحافظ على الأطوال والزوايا والمساحات.', 'medium', 3),
  ('L''image d''une droite par symétrie centrale est…', 'صورة مستقيم بالتناظر المركزي هي…',
   '["une droite parallèle","un cercle","un point","une courbe"]'::jsonb, '["مستقيم موازٍ","دائرة","نقطة","منحنى"]'::jsonb,
   0, 'Une droite parallèle à la première.', 'مستقيم يوازي الأول.', 'easy', 4),
  ('Laquelle a un centre de symétrie ?', 'أي شكل له مركز تناظر؟',
   '["le rectangle","le triangle quelconque","le triangle isocèle seul","la lettre A"]'::jsonb, '["المستطيل","المثلث الكيفي","المتقايس الساقين فقط","الحرف A"]'::jsonb,
   0, 'Le rectangle a un centre de symétrie (son centre).', 'المستطيل له مركز تناظر.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'symetrie-centrale'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'ANGLES ET PARALLÉLISME

DEUX DROITES COUPÉES PAR UNE SÉCANTE
Quand une droite (sécante) coupe deux autres droites, elle forme des paires
d''angles remarquables :
• Angles ALTERNES-INTERNES : de part et d''autre de la sécante, entre les
  deux droites.
• Angles CORRESPONDANTS : même position par rapport à la sécante et à chaque
  droite.

PROPRIÉTÉ FONDAMENTALE
Si les deux droites sont PARALLÈLES, alors :
• les angles alternes-internes sont ÉGAUX,
• les angles correspondants sont ÉGAUX.

RÉCIPROQUE (pour prouver le parallélisme)
Si deux angles alternes-internes sont égaux (ou deux correspondants égaux),
alors les deux droites sont PARALLÈLES.

ANGLES OPPOSÉS PAR LE SOMMET
Toujours égaux, que les droites soient parallèles ou non.

À RETENIR : « alternes-internes égaux » ⟺ « droites parallèles ». C''est
l''outil pour démontrer que deux droites sont parallèles.',
  lesson_ar = 'الزوايا والتوازي

مستقيمان يقطعهما قاطع
عندما يقطع مستقيم (قاطع) مستقيمين آخرين يكوّن أزواج زوايا مميزة:
• زوايا متبادلة داخليًا: على جانبي القاطع بين المستقيمين.
• زوايا متناظرة: نفس الموضع بالنسبة للقاطع ولكل مستقيم.

الخاصية الأساسية
إذا كان المستقيمان متوازيين فإن:
• الزوايا المتبادلة داخليًا متساوية،
• الزوايا المتناظرة متساوية.

العكس (لإثبات التوازي)
إذا تساوت زاويتان متبادلتان داخليًا (أو متناظرتان) فالمستقيمان متوازيان.

الزوايا المتقابلة بالرأس
متساوية دائمًا، سواء كان المستقيمان متوازيين أم لا.

تذكر: «متبادلتان داخليًا متساويتان» ⟺ «مستقيمان متوازيان».'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'angles-parallelisme';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les angles opposés par le sommet sont…', 'الزوايا المتقابلة بالرأس…',
   '["toujours égaux","toujours supplémentaires","toujours droits","jamais égaux"]'::jsonb, '["متساوية دائمًا","متكاملة دائمًا","قائمة دائمًا","غير متساوية أبدًا"]'::jsonb,
   0, 'Toujours égaux.', 'متساوية دائمًا.', 'easy', 1),
  ('Si deux droites sont parallèles, les angles alternes-internes sont…', 'إذا كان المستقيمان متوازيين فالزوايا المتبادلة داخليًا…',
   '["égaux","supplémentaires","complémentaires","nuls"]'::jsonb, '["متساوية","متكاملة","متتامّة","معدومة"]'::jsonb,
   0, 'Parallèles → alternes-internes égaux.', 'التوازي ← المتبادلة داخليًا متساوية.', 'medium', 2),
  ('Deux angles correspondants égaux prouvent que les droites sont…', 'زاويتان متناظرتان متساويتان تثبتان أن المستقيمين…',
   '["parallèles","perpendiculaires","sécants","confondus"]'::jsonb, '["متوازيان","متعامدان","متقاطعان","منطبقان"]'::jsonb,
   0, 'Réciproque : correspondants égaux → parallèles.', 'العكس: متناظرتان متساويتان ← متوازيان.', 'medium', 3),
  ('Deux droites parallèles coupées par une sécante : un angle vaut 65°, son alterne-interne vaut…', 'مستقيمان متوازيان يقطعهما قاطع: زاوية 65°، متبادلتها داخليًا…',
   '["65°","115°","25°","180°"]'::jsonb, '["65°","115°","25°","180°"]'::jsonb,
   0, 'Alternes-internes égaux : 65°.', 'المتبادلتان متساويتان: 65°.', 'easy', 4),
  ('L''outil pour DÉMONTRER que deux droites sont parallèles est…', 'أداة إثبات أن مستقيمين متوازيان هي…',
   '["l''égalité d''angles alternes-internes","le calcul d''aire","le théorème de Pythagore","la médiane"]'::jsonb, '["تساوي زاويتين متبادلتين داخليًا","حساب المساحة","خاصية فيثاغورث","المتوسط"]'::jsonb,
   0, 'La réciproque sur les angles prouve le parallélisme.', 'العكس على الزوايا يثبت التوازي.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'angles-parallelisme'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES TRIANGLES — DROITES REMARQUABLES

LES MÉDIATRICES
La médiatrice d''un côté est perpendiculaire à ce côté en son milieu.
Les 3 médiatrices se coupent en un point unique : le CENTRE DU CERCLE
CIRCONSCRIT (le cercle qui passe par les 3 sommets).

LES HAUTEURS
Une hauteur part d''un sommet et est perpendiculaire au côté opposé.
Les 3 hauteurs se coupent en un point : l''ORTHOCENTRE.

LES MÉDIANES
Une médiane joint un sommet au milieu du côté opposé.
Les 3 médianes se coupent en un point : le CENTRE DE GRAVITÉ (G). Il est
situé aux 2/3 de chaque médiane depuis le sommet.

LES BISSECTRICES
Une bissectrice partage un angle en deux angles égaux.
Les 3 bissectrices se coupent au CENTRE DU CERCLE INSCRIT (tangent aux
3 côtés).

À RETENIR : médiatrices → cercle circonscrit ; bissectrices → cercle
inscrit ; médianes → centre de gravité ; hauteurs → orthocentre.',
  lesson_ar = 'المثلثات — المستقيمات الخاصة

المحاور (المتوسطات العمودية)
محور ضلع عمودي عليه في منتصفه. تتقاطع المحاور الثلاثة في نقطة واحدة:
مركز الدائرة المحيطة (المارة بالرؤوس الثلاثة).

الارتفاعات
الارتفاع ينطلق من رأس ويكون عموديًا على الضلع المقابل. تتقاطع الارتفاعات في نقطة:
مركز الارتفاعات (الأرثومركز).

المتوسطات
المتوسط يصل رأسًا بمنتصف الضلع المقابل. تتقاطع المتوسطات في نقطة:
مركز الثقل (G) على بُعد 2/3 من كل متوسط انطلاقًا من الرأس.

المنصّفات
المنصّف يقسم زاوية إلى زاويتين متساويتين. تتقاطع المنصّفات في مركز الدائرة المحاطة
(المماسة للأضلاع الثلاثة).

تذكر: المحاور ← الدائرة المحيطة، المنصّفات ← المحاطة، المتوسطات ← مركز الثقل، الارتفاعات ← الأرثومركز.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'triangles';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les 3 médiatrices d''un triangle se coupent au centre du cercle…', 'تتقاطع محاور المثلث في مركز الدائرة…',
   '["circonscrit","inscrit","de gravité","tangent"]'::jsonb, '["المحيطة","المحاطة","الثقل","المماسة"]'::jsonb,
   0, 'Médiatrices → cercle circonscrit.', 'المحاور ← الدائرة المحيطة.', 'medium', 1),
  ('Une médiane joint un sommet…', 'المتوسط يصل رأسًا…',
   '["au milieu du côté opposé","au pied de la hauteur","au centre du cercle","à un autre sommet"]'::jsonb,
   '["بمنتصف الضلع المقابل","بأسفل الارتفاع","بمركز الدائرة","برأس آخر"]'::jsonb,
   0, 'Médiane : sommet → milieu du côté opposé.', 'المتوسط: رأس ← منتصف الضلع المقابل.', 'easy', 2),
  ('Le point de concours des médianes est…', 'نقطة تقاطع المتوسطات هي…',
   '["le centre de gravité","l''orthocentre","le centre inscrit","le milieu"]'::jsonb, '["مركز الثقل","الأرثومركز","المركز المحاط","المنتصف"]'::jsonb,
   0, 'Médianes → centre de gravité G.', 'المتوسطات ← مركز الثقل.', 'medium', 3),
  ('Une hauteur est perpendiculaire…', 'الارتفاع عمودي على…',
   '["au côté opposé","à la médiane","à la bissectrice","à rien"]'::jsonb, '["الضلع المقابل","المتوسط","المنصّف","لا شيء"]'::jsonb,
   0, 'Hauteur ⊥ côté opposé.', 'الارتفاع عمودي على الضلع المقابل.', 'easy', 4),
  ('Le cercle inscrit dans un triangle a pour centre le point de concours des…', 'مركز الدائرة المحاطة في مثلث هو تقاطع…',
   '["bissectrices","médiatrices","hauteurs","médianes"]'::jsonb, '["المنصّفات","المحاور","الارتفاعات","المتوسطات"]'::jsonb,
   0, 'Bissectrices → cercle inscrit.', 'المنصّفات ← الدائرة المحاطة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'triangles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'STATISTIQUES (initiation)

VOCABULAIRE DE BASE
• Population : l''ensemble étudié. • Caractère : ce qu''on observe (taille,
  note…). • Effectif : nombre d''individus pour une valeur.
• Effectif total (N) : somme de tous les effectifs.

LA FRÉQUENCE
fréquence = effectif ÷ effectif total. On l''exprime en fraction, en décimal
ou en pourcentage. Sur 25 élèves, si 5 ont eu 16 : fréquence = 5/25 = 0,2 = 20 %.

LES REPRÉSENTATIONS GRAPHIQUES
• Diagramme en bâtons : la hauteur du bâton = l''effectif.
• Diagramme circulaire : chaque part = un angle proportionnel à l''effectif
  (angle = fréquence × 360°).
• Histogramme : pour des données regroupées en classes.

LA MOYENNE
moyenne = (somme de toutes les valeurs) ÷ (nombre de valeurs).
Moyenne pondérée : (Σ valeur × effectif) ÷ effectif total.

À RETENIR : la somme des fréquences vaut toujours 1 (ou 100 %).',
  lesson_ar = 'الإحصاء (تمهيد)

مصطلحات أساسية
• المجتمع الإحصائي: المجموعة المدروسة. • الميزة: ما نلاحظه (الطول، العلامة…).
• التكرار: عدد الأفراد لقيمة معينة. • التكرار الكلي (N): مجموع التكرارات.

التواتر
التواتر = التكرار ÷ التكرار الكلي، ويُعبّر عنه بكسر أو نسبة مئوية.
من 25 تلميذًا نال 5 علامة 16: التواتر = 5/25 = 0.2 = 20%.

التمثيلات البيانية
• المخطط بالأعمدة: ارتفاع العمود = التكرار.
• المخطط الدائري: كل جزء زاوية تناسب التكرار (الزاوية = التواتر × 360°).
• المدرّج التكراري: لمعطيات مجمّعة في فئات.

المتوسط الحسابي
المتوسط = (مجموع القيم) ÷ (عددها).
المتوسط المتوازن: (Σ القيمة × التكرار) ÷ التكرار الكلي.

تذكر: مجموع التواترات يساوي دائمًا 1 (أو 100%).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'statistiques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Sur 25 élèves, 5 ont eu 16. La fréquence est…', 'من 25 تلميذًا نال 5 علامة 16. التواتر…',
   '["20 %","5 %","16 %","25 %"]'::jsonb, '["20 %","5 %","16 %","25 %"]'::jsonb,
   0, '5/25 = 0,2 = 20 %.', '5/25 = 20%.', 'medium', 1),
  ('L''effectif total est…', 'التكرار الكلي هو…',
   '["la somme de tous les effectifs","le plus grand effectif","la moyenne","le nombre de valeurs différentes"]'::jsonb,
   '["مجموع كل التكرارات","أكبر تكرار","المتوسط","عدد القيم المختلفة"]'::jsonb,
   0, 'N = somme des effectifs.', 'N = مجموع التكرارات.', 'easy', 2),
  ('Moyenne de 10, 12, 14 ?', 'متوسط 10 و12 و14؟',
   '["12","36","14","11"]'::jsonb, '["12","36","14","11"]'::jsonb,
   0, '(10+12+14)/3 = 12.', '(10+12+14)/3 = 12.', 'easy', 3),
  ('Dans un diagramme circulaire, l''angle d''une part = fréquence × …', 'في مخطط دائري، زاوية الجزء = التواتر × …',
   '["360°","180°","100°","90°"]'::jsonb, '["360°","180°","100°","90°"]'::jsonb,
   0, 'Le disque entier = 360°.', 'القرص كامل = 360°.', 'medium', 4),
  ('La somme de toutes les fréquences vaut…', 'مجموع كل التواترات يساوي…',
   '["1 (ou 100 %)","0","N","360°"]'::jsonb, '["1 (أو 100%)","0","N","360°"]'::jsonb,
   0, 'Les fréquences totalisent toujours 1.', 'مجموع التواترات دائمًا 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'statistiques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
