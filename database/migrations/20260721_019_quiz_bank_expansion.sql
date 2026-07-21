-- ===============================================================
-- Migration: 20260721_019_quiz_bank_expansion
--
-- 5 bilingual quiz questions per chapter for every maths chapter of
-- the exam years (5AP / 4AM / 3AS) not already covered by migration 017.
-- Guarded by NOT EXISTS per chapter — safe to re-run.
-- ===============================================================

-- Helper pattern used throughout:
--   insert ... select c.id, v.* from chapters c join subjects s ...
--   cross join (values ...) where <grade/slug> and not exists (...)

-- ======================= 5AP =======================

-- grands-nombres
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Comment se lit 4 256 807 ?', 'كيف يُقرأ العدد 4 256 807؟',
   '["Quatre millions deux cent cinquante-six mille huit cent sept","Quarante-deux millions","Quatre cent mille","Quatre milliards"]'::jsonb,
   '["أربعة ملايين ومئتان وستة وخمسون ألفًا وثمانمئة وسبعة","اثنان وأربعون مليونًا","أربعمئة ألف","أربعة مليارات"]'::jsonb,
   0, 'On lit classe par classe : 4 millions, 256 mille, 807.', 'نقرأ قسمًا قسمًا: 4 ملايين ثم 256 ألفًا ثم 807.', 'easy', 1),
  ('Dans 573 208, que vaut le chiffre 7 ?', 'في العدد 573 208، ما قيمة الرقم 7؟',
   '["70 000","7 000","700","7"]'::jsonb, '["70 000","7 000","700","7"]'::jsonb,
   0, 'Le 7 est au rang des dizaines de mille : 70 000.', 'الرقم 7 في مرتبة عشرات الآلاف: 70 000.', 'easy', 2),
  ('Quel est le plus grand nombre ?', 'ما هو العدد الأكبر؟',
   '["530 200","529 999","98 765","499 999"]'::jsonb, '["530 200","529 999","98 765","499 999"]'::jsonb,
   0, '530 200 > 529 999 : au rang des dizaines de mille, 3 > 2.', '530 200 > 529 999 لأن 3 > 2 في عشرات الآلاف.', 'medium', 3),
  ('1 million = ?', 'مليون واحد = ؟',
   '["1 000 000","100 000","10 000","1 000"]'::jsonb, '["1 000 000","100 000","10 000","1 000"]'::jsonb,
   0, 'Un million s''écrit avec 6 zéros.', 'المليون يُكتب بستة أصفار.', 'easy', 4),
  ('Range du plus petit au plus grand : 45 060 ; 45 600 ; 44 999', 'رتب من الأصغر إلى الأكبر: 45 060 ؛ 45 600 ؛ 44 999',
   '["44 999 < 45 060 < 45 600","45 600 < 45 060 < 44 999","45 060 < 44 999 < 45 600","44 999 < 45 600 < 45 060"]'::jsonb,
   '["44 999 < 45 060 < 45 600","45 600 < 45 060 < 44 999","45 060 < 44 999 < 45 600","44 999 < 45 600 < 45 060"]'::jsonb,
   0, 'On compare chiffre par chiffre depuis la gauche.', 'نقارن رقمًا رقمًا من اليسار.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- nombres-decimaux
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 12,45 — que représente le 4 ?', 'في 12.45 — ماذا يمثل الرقم 4؟',
   '["4 dixièmes","4 unités","4 centièmes","4 dizaines"]'::jsonb, '["4 أعشار","4 وحدات","4 أجزاء من مئة","4 عشرات"]'::jsonb,
   0, 'Le premier chiffre après la virgule est le rang des dixièmes.', 'أول رقم بعد الفاصلة هو مرتبة الأعشار.', 'easy', 1),
  ('Compare : 3,25 … 3,4', 'قارن: 3.25 … 3.4',
   '["3,25 < 3,4","3,25 > 3,4","3,25 = 3,4","Impossible"]'::jsonb, '["3.25 < 3.4","3.25 > 3.4","3.25 = 3.4","مستحيل"]'::jsonb,
   0, '2 dixièmes < 4 dixièmes, donc 3,25 < 3,40.', 'عُشران < 4 أعشار، إذن 3.25 < 3.40.', 'medium', 2),
  ('Calcule : 12,45 + 3,8', 'احسب: 12.45 + 3.8',
   '["16,25","15,53","16,53","15,25"]'::jsonb, '["16.25","15.53","16.53","15.25"]'::jsonb,
   0, 'On aligne les virgules : 12,45 + 3,80 = 16,25.', 'نحاذي الفاصلتين: 12.45 + 3.80 = 16.25.', 'medium', 3),
  ('Quelle écriture est égale à 5,7 ?', 'أي كتابة تساوي 5.7؟',
   '["5,70","5,07","0,57","57"]'::jsonb, '["5.70","5.07","0.57","57"]'::jsonb,
   0, 'Ajouter un zéro à droite de la partie décimale ne change rien.', 'إضافة صفر على يمين الجزء العشري لا تغير القيمة.', 'easy', 4),
  ('7/10 en écriture décimale = ?', '7/10 بالكتابة العشرية = ؟',
   '["0,7","7,0","0,07","0,71"]'::jsonb, '["0.7","7.0","0.07","0.71"]'::jsonb,
   0, '7 dixièmes = 0,7.', '7 أعشار = 0.7.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'nombres-decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- proportionnalite
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3 cahiers coûtent 120 DA. Combien coûtent 7 cahiers ?', '3 كراريس بـ 120 دج. كم ثمن 7 كراريس؟',
   '["280 DA","360 DA","840 DA","240 DA"]'::jsonb, '["280 دج","360 دج","840 دج","240 دج"]'::jsonb,
   0, 'Un cahier : 120÷3 = 40 DA. Sept cahiers : 40×7 = 280 DA.', 'الكراس: 40 دج. سبعة: 280 دج.', 'medium', 1),
  ('1 baguette coûte 15 DA. 6 baguettes coûtent…', 'خبزة بـ 15 دج. ثمن 6 خبزات…',
   '["90 DA","75 DA","65 DA","105 DA"]'::jsonb, '["90 دج","75 دج","65 دج","105 دج"]'::jsonb,
   0, '15 × 6 = 90 DA.', '15 × 6 = 90 دج.', 'easy', 2),
  ('Ce tableau est-il proportionnel ? 2→10 ; 3→15 ; 5→25', 'هل هذا الجدول تناسبي؟ 2←10 ؛ 3←15 ؛ 5←25',
   '["Oui, coefficient 5","Non","Oui, coefficient 8","On ne sait pas"]'::jsonb, '["نعم، المعامل 5","لا","نعم، المعامل 8","لا نعلم"]'::jsonb,
   0, '10÷2 = 15÷3 = 25÷5 = 5 : même coefficient partout.', 'خارج القسمة 5 في كل الأعمدة.', 'medium', 3),
  ('Une voiture roule à 90 km/h. Quelle distance en 2 heures ?', 'سيارة سرعتها 90 كم/سا. ما المسافة في ساعتين؟',
   '["180 km","92 km","45 km","270 km"]'::jsonb, '["180 كم","92 كم","45 كم","270 كم"]'::jsonb,
   0, '90 × 2 = 180 km.', '90 × 2 = 180 كم.', 'easy', 4),
  ('5 kg de pommes coûtent 800 DA. Combien coûtent 2 kg ?', '5 كغ تفاح بـ 800 دج. كم ثمن 2 كغ؟',
   '["320 DA","400 DA","160 DA","300 DA"]'::jsonb, '["320 دج","400 دج","160 دج","300 دج"]'::jsonb,
   0, '1 kg : 800÷5 = 160 DA. 2 kg : 320 DA.', 'الكيلو: 160 دج. كيلوغرامان: 320 دج.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- mesures
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3,5 km = ? m', '3.5 كم = ؟ م',
   '["3 500 m","350 m","35 000 m","35 m"]'::jsonb, '["3500 م","350 م","35000 م","35 م"]'::jsonb,
   0, '1 km = 1 000 m, donc 3,5 km = 3 500 m.', '1 كم = 1000 م، إذن 3.5 كم = 3500 م.', 'easy', 1),
  ('2 kg = ? g', '2 كغ = ؟ غ',
   '["2 000 g","200 g","20 g","20 000 g"]'::jsonb, '["2000 غ","200 غ","20 غ","20000 غ"]'::jsonb,
   0, '1 kg = 1 000 g.', '1 كغ = 1000 غ.', 'easy', 2),
  ('1,5 L = ? cL', '1.5 ل = ؟ سل',
   '["150 cL","15 cL","1 500 cL","105 cL"]'::jsonb, '["150 سل","15 سل","1500 سل","105 سل"]'::jsonb,
   0, '1 L = 100 cL, donc 1,5 L = 150 cL.', '1 ل = 100 سل، إذن 150 سل.', 'medium', 3),
  ('Quelle unité pour la masse d''une pièce de monnaie ?', 'ما وحدة قياس كتلة قطعة نقدية؟',
   '["Le gramme","Le kilogramme","Le litre","Le mètre"]'::jsonb, '["الغرام","الكيلوغرام","اللتر","المتر"]'::jsonb,
   0, 'Une pièce pèse quelques grammes.', 'القطعة النقدية تزن بضعة غرامات.', 'easy', 4),
  ('250 cm = ? m', '250 سم = ؟ م',
   '["2,5 m","25 m","0,25 m","2,05 m"]'::jsonb, '["2.5 م","25 م","0.25 م","2.05 م"]'::jsonb,
   0, '100 cm = 1 m, donc 250 cm = 2,5 m.', '100 سم = 1 م، إذن 250 سم = 2.5 م.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'mesures'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- perimetres-aires
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Périmètre d''un carré de côté 6 cm ?', 'محيط مربع ضلعه 6 سم؟',
   '["24 cm","36 cm","12 cm","18 cm"]'::jsonb, '["24 سم","36 سم","12 سم","18 سم"]'::jsonb,
   0, 'P = 4 × 6 = 24 cm.', 'المحيط = 4 × 6 = 24 سم.', 'easy', 1),
  ('Aire d''un rectangle de 8 cm sur 5 cm ?', 'مساحة مستطيل طوله 8 سم وعرضه 5 سم؟',
   '["40 cm²","26 cm²","13 cm²","80 cm²"]'::jsonb, '["40 سم²","26 سم²","13 سم²","80 سم²"]'::jsonb,
   0, 'A = 8 × 5 = 40 cm².', 'المساحة = 8 × 5 = 40 سم².', 'easy', 2),
  ('Périmètre d''un rectangle de 8 cm sur 5 cm ?', 'محيط مستطيل 8 سم × 5 سم؟',
   '["26 cm","40 cm","13 cm","21 cm"]'::jsonb, '["26 سم","40 سم","13 سم","21 سم"]'::jsonb,
   0, 'P = 2 × (8 + 5) = 26 cm.', 'المحيط = 2 × (8 + 5) = 26 سم.', 'medium', 3),
  ('Aire d''un triangle : base 10 cm, hauteur 6 cm ?', 'مساحة مثلث قاعدته 10 سم وارتفاعه 6 سم؟',
   '["30 cm²","60 cm²","16 cm²","36 cm²"]'::jsonb, '["30 سم²","60 سم²","16 سم²","36 سم²"]'::jsonb,
   0, 'A = (10 × 6) ÷ 2 = 30 cm².', 'المساحة = (10 × 6) ÷ 2 = 30 سم².', 'medium', 4),
  ('L''aire se mesure en…', 'تُقاس المساحة بـ…',
   '["cm²","cm","cm³","kg"]'::jsonb, '["سم²","سم","سم³","كغ"]'::jsonb,
   0, 'L''aire est une surface : unités au carré.', 'المساحة سطح: وحدات مربعة.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'perimetres-aires'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de faces a un cube ?', 'كم وجهًا للمكعب؟',
   '["6","4","8","12"]'::jsonb, '["6","4","8","12"]'::jsonb,
   0, 'Un cube a 6 faces carrées.', 'للمكعب 6 أوجه مربعة.', 'easy', 1),
  ('Le diamètre d''un cercle de rayon 4 cm vaut…', 'قطر دائرة نصف قطرها 4 سم يساوي…',
   '["8 cm","4 cm","2 cm","16 cm"]'::jsonb, '["8 سم","4 سم","2 سم","16 سم"]'::jsonb,
   0, 'd = 2 × r = 8 cm.', 'القطر = 2 × نصف القطر = 8 سم.', 'easy', 2),
  ('Un triangle avec 2 côtés égaux est…', 'مثلث له ضلعان متقايسان هو…',
   '["isocèle","équilatéral","rectangle","quelconque"]'::jsonb, '["متقايس الساقين","متقايس الأضلاع","قائم","كيفي"]'::jsonb,
   0, 'Deux côtés égaux = triangle isocèle.', 'ضلعان متقايسان = متقايس الساقين.', 'medium', 3),
  ('Combien d''arêtes a un cube ?', 'كم حرفًا للمكعب؟',
   '["12","6","8","10"]'::jsonb, '["12","6","8","10"]'::jsonb,
   0, 'Un cube a 12 arêtes.', 'للمكعب 12 حرفًا.', 'medium', 4),
  ('Un quadrilatère avec 4 côtés égaux et 4 angles droits est…', 'رباعي له 4 أضلاع متقايسة و4 زوايا قائمة هو…',
   '["un carré","un losange seulement","un rectangle seulement","un triangle"]'::jsonb, '["مربع","معيّن فقط","مستطيل فقط","مثلث"]'::jsonb,
   0, 'C''est la définition du carré.', 'هذا هو تعريف المربع.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'geometrie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- problemes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un car transporte 4 groupes de 27 élèves. Combien d''élèves en tout ?', 'حافلة تنقل 4 أفواج من 27 تلميذًا. كم تلميذًا في المجموع؟',
   '["108","31","104","112"]'::jsonb, '["108","31","104","112"]'::jsonb,
   0, '4 × 27 = 108 élèves.', '4 × 27 = 108 تلاميذ.', 'easy', 1),
  ('Yasmine a 500 DA. Elle achète un livre à 320 DA. Combien lui reste-t-il ?', 'لدى ياسمين 500 دج. اشترت كتابًا بـ 320 دج. كم بقي لها؟',
   '["180 DA","220 DA","280 DA","820 DA"]'::jsonb, '["180 دج","220 دج","280 دج","820 دج"]'::jsonb,
   0, '500 − 320 = 180 DA.', '500 − 320 = 180 دج.', 'easy', 2),
  ('On partage 96 bonbons entre 8 enfants. Combien chacun ?', 'نقسم 96 حلوى على 8 أطفال. كم لكل واحد؟',
   '["12","8","88","16"]'::jsonb, '["12","8","88","16"]'::jsonb,
   0, '96 ÷ 8 = 12 bonbons chacun.', '96 ÷ 8 = 12 حلوى لكل طفل.', 'medium', 3),
  ('« Combien en TOUT ? » indique généralement…', '«كم في المجموع؟» تدل عادة على…',
   '["une addition","une soustraction","une division","rien"]'::jsonb, '["الجمع","الطرح","القسمة","لا شيء"]'::jsonb,
   0, '« En tout » = on regroupe = addition (ou multiplication).', '«في المجموع» = نجمع.', 'easy', 4),
  ('Un fermier a 3 rangées de 15 oliviers et en plante 10 de plus. Total ?', 'فلاح لديه 3 صفوف من 15 زيتونة وغرس 10 أخرى. المجموع؟',
   '["55","45","28","150"]'::jsonb, '["55","45","28","150"]'::jsonb,
   0, '3 × 15 = 45, puis 45 + 10 = 55.', '3 × 15 = 45 ثم 45 + 10 = 55.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'problemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ======================= 4AM =======================

-- calcul-litteral
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Développe : 3(x + 5)', 'انشر: 3(x + 5)',
   '["3x + 15","3x + 5","x + 15","15x"]'::jsonb, '["3x + 15","3x + 5","x + 15","15x"]'::jsonb,
   0, 'k(a+b) = ka + kb → 3x + 15.', 'k(a+b) = ka + kb.', 'easy', 1),
  ('Développe : (x + 3)²', 'انشر: (x + 3)²',
   '["x² + 6x + 9","x² + 9","x² + 3x + 9","x² + 6x + 6"]'::jsonb, '["x² + 6x + 9","x² + 9","x² + 3x + 9","x² + 6x + 6"]'::jsonb,
   0, '(a+b)² = a² + 2ab + b² = x² + 6x + 9.', '(a+b)² = a² + 2ab + b².', 'medium', 2),
  ('Factorise : x² − 25', 'حلّل: x² − 25',
   '["(x+5)(x−5)","(x−5)²","(x+5)²","x(x−25)"]'::jsonb, '["(x+5)(x−5)","(x−5)²","(x+5)²","x(x−25)"]'::jsonb,
   0, 'a² − b² = (a+b)(a−b).', 'a² − b² = (a+b)(a−b).', 'medium', 3),
  ('Factorise : 3x² + 6x', 'حلّل: 3x² + 6x',
   '["3x(x + 2)","3(x + 2)","x(3x + 2)","3x(x + 6)"]'::jsonb, '["3x(x + 2)","3(x + 2)","x(3x + 2)","3x(x + 6)"]'::jsonb,
   0, 'Facteur commun 3x : 3x(x + 2).', 'العامل المشترك 3x.', 'medium', 4),
  ('Développe : (2x − 5)²', 'انشر: (2x − 5)²',
   '["4x² − 20x + 25","4x² + 25","4x² − 10x + 25","2x² − 20x + 25"]'::jsonb, '["4x² − 20x + 25","4x² + 25","4x² − 10x + 25","2x² − 20x + 25"]'::jsonb,
   0, '(a−b)² = a² − 2ab + b² avec a = 2x, b = 5.', '(a−b)² = a² − 2ab + b².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- equations (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Résous : 7x − 4 = 3x + 12', 'حل: 7x − 4 = 3x + 12',
   '["x = 4","x = 2","x = 8","x = −4"]'::jsonb, '["x = 4","x = 2","x = 8","x = −4"]'::jsonb,
   0, '4x = 16 → x = 4.', '4x = 16 ← x = 4.', 'medium', 1),
  ('(x − 2)(x + 5) = 0. Les solutions sont…', '(x − 2)(x + 5) = 0. الحلول هي…',
   '["x = 2 ou x = −5","x = −2 ou x = 5","x = 2 ou x = 5","x = 10"]'::jsonb, '["x = 2 أو x = −5","x = −2 أو x = 5","x = 2 أو x = 5","x = 10"]'::jsonb,
   0, 'Produit nul : chaque facteur peut être nul.', 'جداء معدوم: كل عامل يمكن أن ينعدم.', 'medium', 2),
  ('Résous : −2x < 10', 'حل: −2x < 10',
   '["x > −5","x < −5","x > 5","x < 5"]'::jsonb, '["x > −5","x < −5","x > 5","x < 5"]'::jsonb,
   0, 'Division par −2 : on CHANGE le sens → x > −5.', 'القسمة على −2 تقلب اتجاه المتراجحة.', 'hard', 3),
  ('Résous : x/3 = 7', 'حل: x/3 = 7',
   '["x = 21","x = 7/3","x = 10","x = 4"]'::jsonb, '["x = 21","x = 7/3","x = 10","x = 4"]'::jsonb,
   0, 'x = 7 × 3 = 21.', 'x = 7 × 3 = 21.', 'easy', 4),
  ('Le double d''un nombre augmenté de 3 vaut 19. Ce nombre est…', 'ضعف عدد مضافًا إليه 3 يساوي 19. هذا العدد هو…',
   '["8","11","16","7"]'::jsonb, '["8","11","16","7"]'::jsonb,
   0, '2x + 3 = 19 → 2x = 16 → x = 8.', '2x + 3 = 19 ← x = 8.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'equations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- systemes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('{ x + y = 10 ; 2x − y = 2 }. Alors x = ?', '{ x + y = 10 ؛ 2x − y = 2 }. إذن x = ؟',
   '["4","6","5","3"]'::jsonb, '["4","6","5","3"]'::jsonb,
   0, 'En additionnant : 3x = 12 → x = 4.', 'بالجمع: 3x = 12 ← x = 4.', 'medium', 1),
  ('{ x + y = 10 ; 2x − y = 2 }. Alors y = ?', '{ x + y = 10 ؛ 2x − y = 2 }. إذن y = ؟',
   '["6","4","8","2"]'::jsonb, '["6","4","8","2"]'::jsonb,
   0, 'x = 4, donc y = 10 − 4 = 6.', 'x = 4 إذن y = 6.', 'medium', 2),
  ('Le couple (2 ; 3) est-il solution de { x + y = 5 ; x − y = −1 } ?', 'هل الثنائية (2 ؛ 3) حل للجملة { x + y = 5 ؛ x − y = −1 }؟',
   '["Oui","Non","Seulement la 1ère équation","Seulement la 2ème"]'::jsonb, '["نعم","لا","المعادلة الأولى فقط","الثانية فقط"]'::jsonb,
   0, '2+3 = 5 ✓ et 2−3 = −1 ✓ : les deux équations sont vérifiées.', '2+3 = 5 ✓ و 2−3 = −1 ✓.', 'easy', 3),
  ('Dans la méthode par substitution, on commence par…', 'في طريقة التعويض نبدأ بـ…',
   '["isoler une inconnue","additionner les équations","tout multiplier par 2","tracer un graphique"]'::jsonb,
   '["عزل مجهول","جمع المعادلتين","الضرب في 2","رسم بيان"]'::jsonb,
   0, 'On exprime une inconnue en fonction de l''autre puis on remplace.', 'نعبر عن مجهول بدلالة الآخر ثم نعوض.', 'easy', 4),
  ('2 stylos + 1 cahier = 130 DA ; 1 stylo + 1 cahier = 90 DA. Prix du stylo ?', 'قلمان + كراس = 130 دج ؛ قلم + كراس = 90 دج. ثمن القلم؟',
   '["40 DA","50 DA","30 DA","90 DA"]'::jsonb, '["40 دج","50 دج","30 دج","90 دج"]'::jsonb,
   0, 'En soustrayant : 1 stylo = 130 − 90 = 40 DA.', 'بالطرح: القلم = 40 دج.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'systemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- fonctions
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('f(x) = 3x. Que vaut f(5) ?', 'f(x) = 3x. كم تساوي f(5)؟',
   '["15","8","35","5/3"]'::jsonb, '["15","8","35","5/3"]'::jsonb,
   0, 'f(5) = 3 × 5 = 15.', 'f(5) = 3 × 5 = 15.', 'easy', 1),
  ('La représentation d''une fonction LINÉAIRE est…', 'التمثيل البياني لدالة خطية هو…',
   '["une droite passant par l''origine","une droite quelconque","une parabole","un cercle"]'::jsonb,
   '["مستقيم يمر بالمبدأ","مستقيم كيفي","قطع مكافئ","دائرة"]'::jsonb,
   0, 'Linéaire = proportionnalité = droite par l''origine.', 'الخطية = تناسبية = مستقيم يمر بالمبدأ.', 'easy', 2),
  ('g(x) = 2x + 3. L''ordonnée à l''origine est…', 'g(x) = 2x + 3. الترتيب إلى المبدأ هو…',
   '["3","2","5","0"]'::jsonb, '["3","2","5","0"]'::jsonb,
   0, 'b = 3 : la droite coupe l''axe des ordonnées en 3.', 'b = 3: يقطع المستقيم محور التراتيب في 3.', 'easy', 3),
  ('g(x) = 2x + 3. L''antécédent de 11 est…', 'g(x) = 2x + 3. سابقة العدد 11 هي…',
   '["4","25","7","11"]'::jsonb, '["4","25","7","11"]'::jsonb,
   0, '2x + 3 = 11 → x = 4.', '2x + 3 = 11 ← x = 4.', 'medium', 4),
  ('Une droite passe par (1 ; 2) et (3 ; 8). Son coefficient directeur est…', 'مستقيم يمر بـ (1 ؛ 2) و(3 ؛ 8). معامله الموجه هو…',
   '["3","2","6","4"]'::jsonb, '["3","2","6","4"]'::jsonb,
   0, 'a = (8−2)/(3−1) = 6/2 = 3.', 'a = (8−2)/(3−1) = 3.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'fonctions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- statistiques (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Notes : 12 (coef 2) et 15 (coef 3). Moyenne pondérée ?', 'علامتان: 12 (معامل 2) و15 (معامل 3). المعدل المتوازن؟',
   '["13,8","13,5","14","12,6"]'::jsonb, '["13.8","13.5","14","12.6"]'::jsonb,
   0, '(24 + 45) ÷ 5 = 13,8.', '(24 + 45) ÷ 5 = 13.8.', 'medium', 1),
  ('Série : 8, 10, 12, 15, 19. La médiane est…', 'السلسلة: 8، 10، 12، 15، 19. الوسيط هو…',
   '["12","10","15","12,8"]'::jsonb, '["12","10","15","12.8"]'::jsonb,
   0, 'La valeur du milieu de la série ordonnée : 12.', 'القيمة الوسطى للسلسلة المرتبة: 12.', 'easy', 2),
  ('Série : 8, 10, 12, 15, 19. L''étendue est…', 'السلسلة: 8، 10، 12، 15، 19. المدى هو…',
   '["11","19","8","13"]'::jsonb, '["11","19","8","13"]'::jsonb,
   0, '19 − 8 = 11.', '19 − 8 = 11.', 'easy', 3),
  ('Sur 25 élèves, 5 ont eu 18. La fréquence de la note 18 est…', 'من بين 25 تلميذًا، 5 نالوا 18. تواتر العلامة 18 هو…',
   '["20 %","5 %","25 %","18 %"]'::jsonb, '["20 %","5 %","25 %","18 %"]'::jsonb,
   0, '5/25 = 0,20 = 20 %.', '5/25 = 20 %.', 'medium', 4),
  ('Série paire : 6, 8, 12, 14. La médiane est…', 'سلسلة زوجية: 6، 8، 12، 14. الوسيط هو…',
   '["10","8","12","9"]'::jsonb, '["10","8","12","9"]'::jsonb,
   0, 'Moyenne des deux valeurs centrales : (8+12)/2 = 10.', 'متوسط القيمتين الوسطيين: 10.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'statistiques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- thales
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Thalès s''applique quand les deux droites coupées sont…', 'تُطبق مبرهنة طالس عندما يكون المستقيمان المقطوعان…',
   '["parallèles","perpendiculaires","sécantes","égales"]'::jsonb, '["متوازيين","متعامدين","متقاطعين","متقايسين"]'::jsonb,
   0, 'La configuration exige (MN) // (BC).', 'الوضعية تتطلب (MN) // (BC).', 'easy', 1),
  ('AM = 3, AB = 5, BC = 10 avec (MN)//(BC). MN = ?', 'AM = 3، AB = 5، BC = 10 و(MN)//(BC). كم MN؟',
   '["6","5","7,5","4"]'::jsonb, '["6","5","7.5","4"]'::jsonb,
   0, 'MN = BC × AM/AB = 10 × 3/5 = 6.', 'MN = 10 × 3/5 = 6.', 'medium', 2),
  ('Les rapports de Thalès sont : AM/AB = AN/AC = …', 'نسب طالس: AM/AB = AN/AC = …',
   '["MN/BC","BC/MN","AB/AC","AM/AN"]'::jsonb, '["MN/BC","BC/MN","AB/AC","AM/AN"]'::jsonb,
   0, 'Le troisième rapport porte sur les côtés parallèles.', 'النسبة الثالثة تخص الضلعين المتوازيين.', 'easy', 3),
  ('Si AM/AB = AN/AC (même ordre), alors…', 'إذا كان AM/AB = AN/AC (بنفس الترتيب) فإن…',
   '["(MN) // (BC)","(MN) ⊥ (BC)","M = N","rien"]'::jsonb, '["(MN) // (BC)","(MN) ⊥ (BC)","M = N","لا شيء"]'::jsonb,
   0, 'C''est la réciproque du théorème de Thalès.', 'هذا هو عكس مبرهنة طالس.', 'medium', 4),
  ('Réduction de rapport k = 1/2 : les aires sont multipliées par…', 'تصغير بنسبة k = 1/2: تُضرب المساحات في…',
   '["1/4","1/2","2","1/8"]'::jsonb, '["1/4","1/2","2","1/8"]'::jsonb,
   0, 'Les aires sont multipliées par k² = 1/4.', 'المساحات تُضرب في k² = 1/4.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'thales'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- trigonometrie (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('cos α = ?', 'جتا α = ؟',
   '["adjacent / hypoténuse","opposé / hypoténuse","opposé / adjacent","hypoténuse / adjacent"]'::jsonb,
   '["المجاور ÷ الوتر","المقابل ÷ الوتر","المقابل ÷ المجاور","الوتر ÷ المجاور"]'::jsonb,
   0, 'CAH : Cosinus = Adjacent / Hypoténuse.', 'جتا = المجاور على الوتر.', 'easy', 1),
  ('Hypoténuse 10 cm, angle 30°. Le côté opposé vaut… (sin 30° = 0,5)', 'الوتر 10 سم والزاوية 30°. الضلع المقابل يساوي… (جا 30° = 0.5)',
   '["5 cm","10 cm","8,7 cm","2,5 cm"]'::jsonb, '["5 سم","10 سم","8.7 سم","2.5 سم"]'::jsonb,
   0, 'opposé = 10 × sin 30° = 5 cm.', 'المقابل = 10 × 0.5 = 5 سم.', 'medium', 2),
  ('cos²α + sin²α = ?', 'جتا²α + جا²α = ؟',
   '["1","0","2","cos 2α"]'::jsonb, '["1","0","2","جتا 2α"]'::jsonb,
   0, 'Relation fondamentale de la trigonométrie.', 'العلاقة الأساسية في حساب المثلثات.', 'easy', 3),
  ('tan α = ?', 'ظا α = ؟',
   '["sin α / cos α","cos α / sin α","1 / sin α","sin α × cos α"]'::jsonb,
   '["جا α ÷ جتا α","جتا α ÷ جا α","1 ÷ جا α","جا α × جتا α"]'::jsonb,
   0, 'tan = sin / cos = opposé / adjacent.', 'ظا = جا ÷ جتا.', 'medium', 4),
  ('Le cosinus d''un angle aigu est toujours…', 'جتا زاوية حادة دائمًا…',
   '["entre 0 et 1","supérieur à 1","négatif","égal à 1"]'::jsonb, '["بين 0 و1","أكبر من 1","سالب","يساوي 1"]'::jsonb,
   0, 'L''hypoténuse est le plus grand côté, donc le rapport < 1.', 'الوتر أكبر ضلع فالنسبة أصغر من 1.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'trigonometrie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie-espace (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Volume d''une pyramide = ?', 'حجم الهرم = ؟',
   '["(base × hauteur) ÷ 3","base × hauteur","(base × hauteur) ÷ 2","base + hauteur"]'::jsonb,
   '["(القاعدة × الارتفاع) ÷ 3","القاعدة × الارتفاع","(القاعدة × الارتفاع) ÷ 2","القاعدة + الارتفاع"]'::jsonb,
   0, 'Pyramide et cône : le tiers du prisme/cylindre.', 'الهرم والمخروط: ثلث الموشور/الأسطوانة.', 'easy', 1),
  ('Volume d''une boule de rayon r = ?', 'حجم كرة نصف قطرها r = ؟',
   '["(4/3) π r³","4 π r²","π r² h","(1/3) π r³"]'::jsonb, '["(4/3) π r³","4 π r²","π r² h","(1/3) π r³"]'::jsonb,
   0, 'V = (4/3)πr³ ; 4πr² est l''aire de la sphère.', 'V = (4/3)πr³ أما 4πr² فهي مساحة السطح.', 'medium', 2),
  ('Cône : r = 3 cm, h = 7 cm. Volume ?', 'مخروط: r = 3 سم و h = 7 سم. الحجم؟',
   '["21π cm³","63π cm³","9π cm³","42π cm³"]'::jsonb, '["21π سم³","63π سم³","9π سم³","42π سم³"]'::jsonb,
   0, 'V = π×9×7÷3 = 21π cm³.', 'V = π×9×7÷3 = 21π سم³.', 'medium', 3),
  ('1 litre = ?', '1 لتر = ؟',
   '["1 dm³","1 m³","1 cm³","10 dm³"]'::jsonb, '["1 دسم³","1 م³","1 سم³","10 دسم³"]'::jsonb,
   0, '1 L = 1 dm³.', '1 ل = 1 دسم³.', 'easy', 4),
  ('Réduction de rapport k : les volumes sont multipliés par…', 'تصغير بنسبة k: تُضرب الحجوم في…',
   '["k³","k²","k","3k"]'::jsonb, '["k³","k²","k","3k"]'::jsonb,
   0, 'Longueurs ×k, aires ×k², volumes ×k³.', 'الأطوال ×k والمساحات ×k² والحجوم ×k³.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ======================= 3AS =======================

-- limites-continuite
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('lim (1/x) quand x → +∞ = ?', 'نهاية 1/x لما x → +∞ = ؟',
   '["0","+∞","1","−∞"]'::jsonb, '["0","+∞","1","−∞"]'::jsonb,
   0, '1/x devient aussi petit que l''on veut.', '1/x يصغر كما نشاء.', 'easy', 1),
  ('Si lim f(x) = 3 quand x → +∞, la courbe admet…', 'إذا كانت نهاية f عند +∞ تساوي 3 فإن المنحنى يقبل…',
   '["une asymptote horizontale y = 3","une asymptote verticale x = 3","un extremum en 3","rien"]'::jsonb,
   '["مقاربًا أفقيًا y = 3","مقاربًا شاقوليًا x = 3","قيمة حدية عند 3","لا شيء"]'::jsonb,
   0, 'Limite finie en ∞ → asymptote horizontale.', 'نهاية منتهية عند ∞ ← مقارب أفقي.', 'medium', 2),
  ('lim (2x³ − 5x + 1) quand x → +∞ = ?', 'نهاية (2x³ − 5x + 1) لما x → +∞ = ؟',
   '["+∞","−∞","2","0"]'::jsonb, '["+∞","−∞","2","0"]'::jsonb,
   0, 'C''est la limite du terme dominant 2x³.', 'نهاية الحد الأعلى درجة 2x³.', 'medium', 3),
  ('« ∞/∞ » est…', '«∞/∞» هي…',
   '["une forme indéterminée","toujours égale à 1","toujours +∞","toujours 0"]'::jsonb,
   '["حالة عدم تعيين","تساوي 1 دائمًا","+∞ دائمًا","0 دائمًا"]'::jsonb,
   0, 'Il faut lever l''indétermination (factoriser).', 'يجب إزالة عدم التعيين (بالتحليل).', 'easy', 4),
  ('f continue et strictement croissante sur [0;2], f(0) = −1, f(2) = 5. L''équation f(x) = 0 admet…', 'f مستمرة ومتزايدة تمامًا على [0;2]، f(0) = −1 وf(2) = 5. المعادلة f(x) = 0 تقبل…',
   '["une unique solution dans [0;2]","aucune solution","deux solutions","une infinité"]'::jsonb,
   '["حلاً وحيدًا في [0;2]","لا حل","حلين","عددًا غير منتهٍ"]'::jsonb,
   0, 'TVI + stricte monotonie : existence ET unicité.', 'مبرهنة القيم المتوسطة مع الرتابة التامة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'limites-continuite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- derivation
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La dérivée de x³ est…', 'مشتقة x³ هي…',
   '["3x²","x²","3x","x³/3"]'::jsonb, '["3x²","x²","3x","x³/3"]'::jsonb,
   0, '(xⁿ)'' = n·xⁿ⁻¹.', '(xⁿ)'' = n·xⁿ⁻¹.', 'easy', 1),
  ('Si f''(x) > 0 sur I, alors f est… sur I', 'إذا كانت f''(x) > 0 على مجال فإن f عليه…',
   '["croissante","décroissante","constante","nulle"]'::jsonb, '["متزايدة","متناقصة","ثابتة","معدومة"]'::jsonb,
   0, 'Dérivée positive = fonction croissante.', 'مشتقة موجبة = دالة متزايدة.', 'easy', 2),
  ('La tangente en a a pour équation…', 'معادلة المماس عند a هي…',
   '["y = f''(a)(x−a) + f(a)","y = f(a)(x−a) + f''(a)","y = f''(a)·x","y = f(a)"]'::jsonb,
   '["y = f''(a)(x−a) + f(a)","y = f(a)(x−a) + f''(a)","y = f''(a)·x","y = f(a)"]'::jsonb,
   0, 'Formule de la tangente au point d''abscisse a.', 'صيغة المماس عند النقطة ذات الفاصلة a.', 'medium', 3),
  ('Dérivée de f(x) = x² − 4x + 1 ?', 'مشتقة f(x) = x² − 4x + 1؟',
   '["2x − 4","2x + 4","x − 4","2x − 3"]'::jsonb, '["2x − 4","2x + 4","x − 4","2x − 3"]'::jsonb,
   0, '(x²)'' = 2x, (−4x)'' = −4, (1)'' = 0.', 'مشتقة كل حد على حدة.', 'medium', 4),
  ('f''(x) = 2x − 4 s''annule en x = 2 en changeant de signe (− puis +). En 2, f admet…', 'f''(x) = 2x − 4 تنعدم عند 2 مغيّرة إشارتها (− ثم +). عند 2 تقبل f…',
   '["un minimum","un maximum","une asymptote","rien"]'::jsonb, '["قيمة حدية صغرى","قيمة حدية كبرى","مقاربًا","لا شيء"]'::jsonb,
   0, 'f décroît puis croît : minimum local en x = 2.', 'f تتناقص ثم تتزايد: قيمة صغرى عند 2.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'derivation'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- exponentielle
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('e⁰ = ?', 'e⁰ = ؟',
   '["1","0","e","−1"]'::jsonb, '["1","0","e","−1"]'::jsonb,
   0, 'Tout nombre non nul à la puissance 0 vaut 1.', 'أي عدد غير معدوم أسه 0 يساوي 1.', 'easy', 1),
  ('e^a × e^b = ?', 'e^a × e^b = ؟',
   '["e^(a+b)","e^(ab)","e^(a−b)","e^a + e^b"]'::jsonb, '["e^(a+b)","e^(ab)","e^(a−b)","e^a + e^b"]'::jsonb,
   0, 'Produit d''exponentielles : on additionne les exposants.', 'جداء الأسيات: نجمع الأسس.', 'easy', 2),
  ('La dérivée de e^(2x) est…', 'مشتقة e^(2x) هي…',
   '["2e^(2x)","e^(2x)","2x·e^(2x)","e^(2x)/2"]'::jsonb, '["2e^(2x)","e^(2x)","2x·e^(2x)","e^(2x)/2"]'::jsonb,
   0, '(e^u)'' = u''·e^u avec u'' = 2.', '(e^u)'' = u''·e^u حيث u'' = 2.', 'medium', 3),
  ('Pour tout x réel, eˣ est…', 'من أجل كل x حقيقي، eˣ…',
   '["strictement positif","parfois négatif","nul en 0","supérieur à 1"]'::jsonb,
   '["موجب تمامًا","سالب أحيانًا","معدوم عند 0","أكبر من 1"]'::jsonb,
   0, 'eˣ > 0 pour tout x — jamais nul, jamais négatif.', 'eˣ > 0 دائمًا.', 'easy', 4),
  ('Résous : eˣ = 5', 'حل: eˣ = 5',
   '["x = ln 5","x = 5e","x = e⁵","x = 5"]'::jsonb, '["x = ln 5","x = 5e","x = e⁵","x = 5"]'::jsonb,
   0, 'eˣ = k ⟺ x = ln k (k > 0).', 'eˣ = k ⟺ x = ln k.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'exponentielle'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- logarithme
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('ln 1 = ?', 'ln 1 = ؟',
   '["0","1","e","−1"]'::jsonb, '["0","1","e","−1"]'::jsonb,
   0, 'ln 1 = 0 car e⁰ = 1.', 'ln 1 = 0 لأن e⁰ = 1.', 'easy', 1),
  ('ln(a × b) = ?', 'ln(a × b) = ؟',
   '["ln a + ln b","ln a × ln b","ln a − ln b","ln(a+b)"]'::jsonb, '["ln a + ln b","ln a × ln b","ln a − ln b","ln(a+b)"]'::jsonb,
   0, 'Le log transforme les produits en sommes.', 'اللوغاريتم يحول الجداء إلى مجموع.', 'easy', 2),
  ('ln est définie sur…', 'ln معرفة على…',
   '["]0 ; +∞[","R","[0 ; +∞[","R*"]'::jsonb, '["]0 ; +∞[","R","[0 ; +∞[","R*"]'::jsonb,
   0, 'Pas de logarithme d''un nombre négatif ou nul.', 'لا لوغاريتم لعدد سالب أو معدوم.', 'medium', 3),
  ('La dérivée de ln x est…', 'مشتقة ln x هي…',
   '["1/x","ln x","x","eˣ"]'::jsonb, '["1/x","ln x","x","eˣ"]'::jsonb,
   0, '(ln x)'' = 1/x sur ]0;+∞[.', '(ln x)'' = 1/x.', 'easy', 4),
  ('Résous : ln x = 2', 'حل: ln x = 2',
   '["x = e²","x = 2e","x = ln 2","x = 2"]'::jsonb, '["x = e²","x = 2e","x = ln 2","x = 2"]'::jsonb,
   0, 'ln x = k ⟺ x = eᵏ.', 'ln x = k ⟺ x = eᵏ.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'logarithme'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- integrales
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une primitive de 2x est…', 'دالة أصلية لـ 2x هي…',
   '["x²","2","2x²","x²/2"]'::jsonb, '["x²","2","2x²","x²/2"]'::jsonb,
   0, '(x²)'' = 2x.', '(x²)'' = 2x.', 'easy', 1),
  ('∫₀¹ 2x dx = ?', '∫₀¹ 2x dx = ؟',
   '["1","2","0","1/2"]'::jsonb, '["1","2","0","1/2"]'::jsonb,
   0, '[x²]₀¹ = 1 − 0 = 1.', '[x²]₀¹ = 1.', 'medium', 2),
  ('Une primitive de eˣ est…', 'دالة أصلية لـ eˣ هي…',
   '["eˣ","x·eˣ","eˣ/x","ln x"]'::jsonb, '["eˣ","x·eˣ","eˣ/x","ln x"]'::jsonb,
   0, 'L''exponentielle est sa propre dérivée et primitive.', 'الأسية مشتقتها وأصليتها نفسها.', 'easy', 3),
  ('Une primitive de 1/x sur ]0;+∞[ est…', 'دالة أصلية لـ 1/x على ]0;+∞[ هي…',
   '["ln x","1/x²","−1/x²","x"]'::jsonb, '["ln x","1/x²","−1/x²","x"]'::jsonb,
   0, '(ln x)'' = 1/x.', '(ln x)'' = 1/x.', 'medium', 4),
  ('Si f ≥ 0 sur [a;b], ∫ₐᵇ f représente…', 'إذا كانت f ≥ 0 على [a;b] فإن ∫ₐᵇ f يمثل…',
   '["l''aire sous la courbe","la pente","la moyenne","le périmètre"]'::jsonb,
   '["المساحة تحت المنحنى","الميل","المتوسط","المحيط"]'::jsonb,
   0, 'L''intégrale d''une fonction positive = aire sous la courbe.', 'تكامل دالة موجبة = المساحة تحت المنحنى.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'integrales'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- probabilites (3AS)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('P_A(B) = ?', 'P_A(B) = ؟',
   '["P(A∩B)/P(A)","P(A)×P(B)","P(A∪B)","P(B)/P(A)"]'::jsonb, '["P(A∩B)/P(A)","P(A)×P(B)","P(A∪B)","P(B)/P(A)"]'::jsonb,
   0, 'Définition de la probabilité conditionnelle.', 'تعريف الاحتمال الشرطي.', 'easy', 1),
  ('A et B indépendants ⟺ …', 'A وB مستقلتان ⟺ …',
   '["P(A∩B) = P(A)×P(B)","P(A∩B) = 0","P(A∪B) = 1","P(A) = P(B)"]'::jsonb,
   '["P(A∩B) = P(A)×P(B)","P(A∩B) = 0","P(A∪B) = 1","P(A) = P(B)"]'::jsonb,
   0, 'C''est la définition de l''indépendance.', 'هذا تعريف الاستقلالية.', 'medium', 2),
  ('X suit B(5 ; 0,8). E(X) = ?', 'X يتبع B(5 ؛ 0.8). الأمل E(X) = ؟',
   '["4","0,8","5","3,2"]'::jsonb, '["4","0.8","5","3.2"]'::jsonb,
   0, 'E(X) = n·p = 5 × 0,8 = 4.', 'E(X) = n·p = 4.', 'medium', 3),
  ('Sur un arbre, la probabilité d''un chemin est…', 'في الشجرة، احتمال المسار هو…',
   '["le produit des branches","la somme des branches","le maximum","toujours 1"]'::jsonb,
   '["جداء الفروع","مجموع الفروع","الأكبر","دائمًا 1"]'::jsonb,
   0, 'On multiplie les probabilités le long du chemin.', 'نضرب الاحتمالات على طول المسار.', 'easy', 4),
  ('Un dé équilibré : P(obtenir 6 deux fois de suite) = ?', 'زهر متوازن: احتمال الحصول على 6 مرتين متتاليتين؟',
   '["1/36","1/6","1/12","2/6"]'::jsonb, '["1/36","1/6","1/12","2/6"]'::jsonb,
   0, 'Lancers indépendants : 1/6 × 1/6 = 1/36.', 'رميتان مستقلتان: 1/6 × 1/6 = 1/36.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'probabilites'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- complexes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('i² = ?', 'i² = ؟',
   '["−1","1","i","0"]'::jsonb, '["−1","1","i","0"]'::jsonb,
   0, 'Par définition du nombre i.', 'حسب تعريف العدد i.', 'easy', 1),
  ('Le conjugué de z = 3 + 2i est…', 'مرافق z = 3 + 2i هو…',
   '["3 − 2i","−3 + 2i","−3 − 2i","2 + 3i"]'::jsonb, '["3 − 2i","−3 + 2i","−3 − 2i","2 + 3i"]'::jsonb,
   0, 'On change le signe de la partie imaginaire.', 'نغير إشارة الجزء التخيلي.', 'easy', 2),
  ('|3 + 4i| = ?', '|3 + 4i| = ؟',
   '["5","7","25","√7"]'::jsonb, '["5","7","25","√7"]'::jsonb,
   0, '√(9 + 16) = √25 = 5.', '√(9 + 16) = 5.', 'medium', 3),
  ('Un argument de z = 1 + i est…', 'عمدة z = 1 + i هي…',
   '["π/4","π/2","π/3","π"]'::jsonb, '["π/4","π/2","π/3","π"]'::jsonb,
   0, 'cos θ = sin θ = 1/√2 → θ = π/4.', 'جتا θ = جا θ = 1/√2 ← θ = π/4.', 'medium', 4),
  ('z² + 4 = 0. Les solutions sont…', 'z² + 4 = 0. الحلول هي…',
   '["z = 2i ou z = −2i","z = 2 ou z = −2","z = 4i","aucune"]'::jsonb, '["z = 2i أو z = −2i","z = 2 أو z = −2","z = 4i","لا حلول"]'::jsonb,
   0, 'z² = −4 = (2i)² → z = ±2i.', 'z² = −4 ← z = ±2i.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'complexes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie-espace (3AS)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('u(1;2;3) et v(2;−1;0). u·v = ?', 'u(1;2;3) وv(2;−1;0). الجداء السلمي u·v = ؟',
   '["0","4","8","−4"]'::jsonb, '["0","4","8","−4"]'::jsonb,
   0, '1×2 + 2×(−1) + 3×0 = 0 : vecteurs orthogonaux.', '2 − 2 + 0 = 0: الشعاعان متعامدان.', 'medium', 1),
  ('u ⊥ v ⟺ …', 'u ⊥ v ⟺ …',
   '["u·v = 0","u·v = 1","||u|| = ||v||","u = −v"]'::jsonb, '["u·v = 0","u·v = 1","||u|| = ||v||","u = −v"]'::jsonb,
   0, 'Orthogonalité = produit scalaire nul.', 'التعامد = جداء سلمي معدوم.', 'easy', 2),
  ('Le vecteur normal du plan 2x − y + 3z − 8 = 0 est…', 'الشعاع الناظمي للمستوي 2x − y + 3z − 8 = 0 هو…',
   '["n(2;−1;3)","n(2;1;3)","n(−8;0;0)","n(2;−1;−8)"]'::jsonb, '["n(2;−1;3)","n(2;1;3)","n(−8;0;0)","n(2;−1;−8)"]'::jsonb,
   0, 'Les coefficients de x, y, z donnent le vecteur normal.', 'معاملات x وy وz تعطي الشعاع الناظمي.', 'easy', 3),
  ('||u|| pour u(2;−1;2) = ?', 'الطويلة ||u|| حيث u(2;−1;2) = ؟',
   '["3","9","5","√5"]'::jsonb, '["3","9","5","√5"]'::jsonb,
   0, '√(4+1+4) = √9 = 3.', '√(4+1+4) = 3.', 'medium', 4),
  ('Une droite de vecteur directeur u est parallèle au plan de normal n si…', 'مستقيم شعاع توجيهه u يوازي المستوي ذا الناظم n إذا…',
   '["u·n = 0","u = n","u·n = 1","u ⊥ n est faux"]'::jsonb, '["u·n = 0","u = n","u·n = 1","لا يمكن"]'::jsonb,
   0, 'Directeur orthogonal au normal ⟺ droite parallèle au plan.', 'شعاع التوجيه عمودي على الناظم ⟺ التوازي.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
