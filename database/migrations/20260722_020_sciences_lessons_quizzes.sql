-- ===============================================================
-- Migration: 20260722_020_sciences_lessons_quizzes
--
-- Bilingual lessons + 5-question quiz banks for the science chapters of
-- the two exam years: 4AM (physique + SVT, for the BEM) and 3AS
-- (physique + SVT, for the BAC sciences streams).
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- Reusable insert helper is inlined per chapter (same pattern as 019).

-- ================= 4AM PHYSIQUE =================

update public.chapters c set
  lesson_fr = 'PHÉNOMÈNES ÉLECTRIQUES

LE CIRCUIT ÉLECTRIQUE
Un circuit fermé laisse passer le courant ; ouvert, le courant ne passe pas.
Composants : générateur (pile), récepteurs (lampe, moteur), interrupteur, fils.

INTENSITÉ (I) — le débit du courant
• Se mesure avec un AMPÈREMÈTRE branché EN SÉRIE.
• Unité : l''ampère (A).
• En série, l''intensité est la MÊME partout.
• En dérivation, l''intensité principale = somme des intensités des branches.

TENSION (U) — la « poussée » électrique
• Se mesure avec un VOLTMÈTRE branché EN DÉRIVATION (aux bornes).
• Unité : le volt (V).
• En série, la tension du générateur = somme des tensions des récepteurs.
• En dérivation, la tension est la même aux bornes de chaque branche.

LA LOI D''OHM (résistance)
U = R × I    (U en volts, R en ohms Ω, I en ampères)
Une résistance s''oppose au passage du courant.

SÉCURITÉ : ne jamais brancher un ampèremètre en dérivation (court-circuit).',
  lesson_ar = 'الظواهر الكهربائية

الدارة الكهربائية
الدارة المغلقة تسمح بمرور التيار، والمفتوحة تمنعه.
مكوناتها: مولد (بطارية)، مستقبلات (مصباح، محرك)، قاطعة، أسلاك.

شدة التيار (I)
• تُقاس بالأمبيرمتر المركّب على التسلسل.
• الوحدة: الأمبير (A).
• على التسلسل: الشدة نفسها في كل النقاط.
• على التفرع: الشدة الرئيسية = مجموع شدات الفروع.

التوتر (U)
• يُقاس بالفولتمتر المركّب على التفرع.
• الوحدة: الفولط (V).

قانون أوم
U = R × I (المقاومة R بالأوم Ω).

السلامة: لا نركّب الأمبيرمتر على التفرع أبدًا (دارة قصيرة).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-electriques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Avec quel appareil mesure-t-on l''intensité du courant ?', 'بأي جهاز نقيس شدة التيار؟',
   '["L''ampèremètre","Le voltmètre","Le thermomètre","La balance"]'::jsonb, '["الأمبيرمتر","الفولتمتر","الميزان الحراري","الميزان"]'::jsonb,
   0, 'L''ampèremètre, branché en série, mesure l''intensité (en ampères).', 'الأمبيرمتر المركّب على التسلسل يقيس الشدة.', 'easy', 1),
  ('L''unité de la tension électrique est…', 'وحدة التوتر الكهربائي هي…',
   '["le volt (V)","l''ampère (A)","l''ohm (Ω)","le watt (W)"]'::jsonb, '["الفولط (V)","الأمبير (A)","الأوم (Ω)","الواط (W)"]'::jsonb,
   0, 'La tension se mesure en volts.', 'التوتر يُقاس بالفولط.', 'easy', 2),
  ('Dans un circuit en série, l''intensité du courant est…', 'في دارة على التسلسل، شدة التيار…',
   '["la même partout","différente partout","nulle","maximale à la pile"]'::jsonb, '["نفسها في كل النقاط","مختلفة","معدومة","أكبر عند البطارية"]'::jsonb,
   0, 'En série, le courant a la même intensité en tout point.', 'على التسلسل الشدة نفسها في كل نقطة.', 'medium', 3),
  ('Loi d''Ohm : U = 12 V, R = 4 Ω. Que vaut I ?', 'قانون أوم: U = 12 V و R = 4 Ω. كم I؟',
   '["3 A","48 A","8 A","0,33 A"]'::jsonb, '["3 A","48 A","8 A","0.33 A"]'::jsonb,
   0, 'I = U/R = 12/4 = 3 A.', 'I = U/R = 12/4 = 3 A.', 'medium', 4),
  ('Le voltmètre se branche…', 'الفولتمتر يُركّب…',
   '["en dérivation","en série","à la place de la pile","n''importe comment"]'::jsonb, '["على التفرع","على التسلسل","مكان البطارية","بأي طريقة"]'::jsonb,
   0, 'Le voltmètre se branche en dérivation, aux bornes du dipôle.', 'الفولتمتر يُركّب على التفرع بين طرفي الثنائي القطب.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-electriques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PHÉNOMÈNES LUMINEUX

PROPAGATION DE LA LUMIÈRE
Dans un milieu transparent et homogène, la lumière se propage en LIGNE DROITE.
C''est ce qui explique les ombres et les éclipses.

SOURCES ET RÉCEPTEURS
• Source primaire : produit sa lumière (Soleil, lampe, flamme).
• Objet diffusant : renvoie la lumière qu''il reçoit (la Lune, un mur).

LA RÉFLEXION (miroir)
Le rayon incident et le rayon réfléchi font le même angle avec la normale :
angle d''incidence = angle de réflexion.

LES LENTILLES
• Lentille CONVERGENTE (bords minces) : fait converger les rayons en un foyer F.
• Lentille DIVERGENTE (bords épais) : écarte les rayons.
La distance focale caractérise la lentille.

L''ŒIL ET LA VISION
Le cristallin est une lentille convergente ; l''image se forme sur la rétine.
Myopie et hypermétropie se corrigent avec des lentilles adaptées.',
  lesson_ar = 'الظواهر الضوئية

انتشار الضوء
في وسط شفاف ومتجانس ينتشر الضوء في خط مستقيم، وهذا يفسر الظلال والكسوف.

المنابع والمستقبلات
• منبع أولي: ينتج ضوءه (الشمس، المصباح).
• جسم ناشر: يعيد الضوء الذي يستقبله (القمر، الجدار).

الانعكاس (المرآة)
زاوية الورود = زاوية الانعكاس بالنسبة للناظم.

العدسات
• عدسة مجمّعة (حوافها رقيقة): تجمع الأشعة في بؤرة F.
• عدسة مفرّقة (حوافها سميكة): تفرّق الأشعة.

العين والرؤية
البلورية عدسة مجمّعة، وتتشكل الصورة على الشبكية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-lumineux';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un milieu transparent et homogène, la lumière se propage…', 'في وسط شفاف ومتجانس ينتشر الضوء…',
   '["en ligne droite","en courbe","en zigzag","en cercle"]'::jsonb, '["في خط مستقيم","في منحنى","بشكل متعرج","في دائرة"]'::jsonb,
   0, 'Propagation rectiligne de la lumière.', 'الانتشار المستقيم للضوء.', 'easy', 1),
  ('La Lune est…', 'القمر…',
   '["un objet diffusant","une source primaire","une lentille","un miroir"]'::jsonb, '["جسم ناشر","منبع أولي","عدسة","مرآة"]'::jsonb,
   0, 'La Lune renvoie la lumière du Soleil, elle ne la produit pas.', 'القمر يعيد ضوء الشمس ولا ينتجه.', 'medium', 2),
  ('Loi de la réflexion : l''angle d''incidence est…', 'قانون الانعكاس: زاوية الورود…',
   '["égal à l''angle de réflexion","double de l''angle de réflexion","nul","toujours 90°"]'::jsonb, '["تساوي زاوية الانعكاس","ضعف زاوية الانعكاس","معدومة","دائمًا 90°"]'::jsonb,
   0, 'Angle d''incidence = angle de réflexion.', 'زاوية الورود = زاوية الانعكاس.', 'medium', 3),
  ('Une lentille à bords minces est…', 'عدسة حوافها رقيقة هي…',
   '["convergente","divergente","plane","opaque"]'::jsonb, '["مجمّعة","مفرّقة","مستوية","معتمة"]'::jsonb,
   0, 'Bords minces = lentille convergente.', 'الحواف الرقيقة = عدسة مجمّعة.', 'easy', 4),
  ('Dans l''œil, l''image se forme sur…', 'في العين تتشكل الصورة على…',
   '["la rétine","le cristallin","la pupille","la cornée"]'::jsonb, '["الشبكية","البلورية","البؤبؤ","القرنية"]'::jsonb,
   0, 'La rétine reçoit l''image formée par le cristallin.', 'الشبكية تستقبل الصورة التي تكوّنها البلورية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-lumineux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PHÉNOMÈNES MÉCANIQUES

LE MOUVEMENT
Un corps est en mouvement par rapport à un référentiel si sa position change.
Le mouvement est RELATIF : il dépend du référentiel choisi.

LA VITESSE
v = distance ÷ temps      (v en m/s ou km/h)
Exemple : 120 km en 2 h → v = 60 km/h.
Mouvement uniforme : vitesse constante.

LES FORCES
Une force peut : mettre en mouvement, arrêter, dévier, ou déformer un corps.
Représentée par un vecteur (point d''application, direction, sens, intensité).
L''intensité se mesure avec un DYNAMOMÈTRE, en newtons (N).

LE POIDS
Le poids P est la force de gravité :  P = m × g
avec g ≈ 9,8 N/kg en Algérie, m en kg, P en newtons.
Ne pas confondre : la MASSE (kg) ne change pas ; le POIDS (N) dépend de g.

ÉQUILIBRE
Un corps soumis à deux forces est en équilibre si elles ont même intensité,
même direction et sens opposés.',
  lesson_ar = 'الظواهر الميكانيكية

الحركة
جسم متحرك بالنسبة لمرجع إذا تغيّر موضعه. الحركة نسبية تتعلق بالمرجع المختار.

السرعة
v = المسافة ÷ الزمن (بالمتر/ثانية أو كلم/سا)
مثال: 120 كلم في ساعتين ← v = 60 كلم/سا.

القوى
القوة تحرّك أو توقف أو تحرف أو تشوّه جسمًا. تُمثّل بشعاع، وتُقاس بالدينامومتر بالنيوتن (N).

الثقل
P = m × g حيث g ≈ 9.8 نيوتن/كغ.
لا نخلط: الكتلة (كغ) ثابتة، والثقل (نيوتن) يتعلق بـ g.

التوازن
جسم خاضع لقوتين يكون متوازنًا إذا تساوت شدتاهما واتجاههما وتعاكس منحاهما.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-mecaniques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une voiture parcourt 120 km en 2 h. Sa vitesse moyenne est…', 'سيارة تقطع 120 كلم في ساعتين. سرعتها المتوسطة…',
   '["60 km/h","240 km/h","122 km/h","30 km/h"]'::jsonb, '["60 كلم/سا","240 كلم/سا","122 كلم/سا","30 كلم/سا"]'::jsonb,
   0, 'v = d/t = 120/2 = 60 km/h.', 'v = d/t = 60 كلم/سا.', 'easy', 1),
  ('L''intensité d''une force se mesure avec…', 'شدة القوة تُقاس بـ…',
   '["un dynamomètre","un thermomètre","un voltmètre","une règle"]'::jsonb, '["الدينامومتر","الميزان الحراري","الفولتمتر","المسطرة"]'::jsonb,
   0, 'Le dynamomètre mesure les forces en newtons.', 'الدينامومتر يقيس القوى بالنيوتن.', 'easy', 2),
  ('Le poids d''un objet de 5 kg (g = 9,8 N/kg) vaut…', 'ثقل جسم كتلته 5 كغ (g = 9.8) يساوي…',
   '["49 N","5 N","9,8 N","0,5 N"]'::jsonb, '["49 N","5 N","9.8 N","0.5 N"]'::jsonb,
   0, 'P = m × g = 5 × 9,8 = 49 N.', 'P = m × g = 49 N.', 'medium', 3),
  ('La masse d''un objet, sur la Lune, par rapport à la Terre…', 'كتلة جسم على القمر مقارنة بالأرض…',
   '["ne change pas","diminue","augmente","devient nulle"]'::jsonb, '["لا تتغير","تنقص","تزيد","تنعدم"]'::jsonb,
   0, 'La masse est invariable ; seul le poids change avec g.', 'الكتلة ثابتة، الثقل وحده يتغير مع g.', 'medium', 4),
  ('Le mouvement est dit « relatif » car il dépend…', 'الحركة «نسبية» لأنها تتعلق بـ…',
   '["du référentiel choisi","de la couleur","de la masse","du temps seulement"]'::jsonb, '["المرجع المختار","اللون","الكتلة","الزمن فقط"]'::jsonb,
   0, 'Le mouvement dépend du référentiel d''étude.', 'الحركة تتعلق بمرجع الدراسة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-mecaniques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'MATIÈRE ET TRANSFORMATIONS

ATOMES, MOLÉCULES ET IONS
• Atome : plus petite particule d''un élément (noyau + électrons).
• Molécule : groupe d''atomes liés (ex. H₂O, CO₂).
• Ion : atome ayant gagné ou perdu des électrons (charge + ou −).

TRANSFORMATION CHIMIQUE
Des réactifs se transforment en produits. On l''écrit par une ÉQUATION :
réactifs → produits.
La combustion du carbone : C + O₂ → CO₂.

CONSERVATION DE LA MASSE (loi de Lavoisier)
« Rien ne se perd, rien ne se crée, tout se transforme. »
La masse totale des réactifs = masse totale des produits.
On ÉQUILIBRE l''équation pour conserver chaque type d''atome.

LES COMBUSTIONS
• Combustion complète du carbone → dioxyde de carbone (CO₂).
• Combustion incomplète → monoxyde de carbone (CO), gaz toxique.
Un combustible + un comburant (dioxygène) + une énergie d''activation.

À RETENIR : dans une équation équilibrée, le nombre d''atomes de chaque élément
est le même avant et après la flèche.',
  lesson_ar = 'المادة وتحولاتها

الذرات والجزيئات والشوارد
• الذرة: أصغر جزء من عنصر (نواة + إلكترونات).
• الجزيء: مجموعة ذرات مرتبطة (H₂O، CO₂).
• الشاردة: ذرة كسبت أو فقدت إلكترونات (شحنة + أو −).

التحول الكيميائي
تتحول المتفاعلات إلى نواتج، ونكتبه بمعادلة: متفاعلات ← نواتج.
احتراق الكربون: C + O₂ → CO₂.

انحفاظ الكتلة (قانون لافوازييه)
«لا شيء يُفقد ولا شيء يُخلق، كل شيء يتحول.»
كتلة المتفاعلات = كتلة النواتج، ونوازن المعادلة.

الاحتراقات
• احتراق تام للكربون ← ثاني أكسيد الكربون CO₂.
• احتراق ناقص ← أول أكسيد الكربون CO (غاز سام).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'matiere-transformations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La formule chimique de l''eau est…', 'الصيغة الكيميائية للماء هي…',
   '["H₂O","CO₂","O₂","H₂"]'::jsonb, '["H₂O","CO₂","O₂","H₂"]'::jsonb,
   0, 'L''eau : 2 atomes d''hydrogène + 1 d''oxygène.', 'الماء: ذرتا هيدروجين وذرة أكسجين.', 'easy', 1),
  ('Un ion est un atome qui a…', 'الشاردة ذرة…',
   '["gagné ou perdu des électrons","gagné un noyau","changé de couleur","disparu"]'::jsonb, '["كسبت أو فقدت إلكترونات","اكتسبت نواة","تغيّر لونها","اختفت"]'::jsonb,
   0, 'Gain/perte d''électrons → charge électrique.', 'كسب/فقد إلكترونات ← شحنة كهربائية.', 'medium', 2),
  ('La combustion complète du carbone donne…', 'الاحتراق التام للكربون يعطي…',
   '["du dioxyde de carbone (CO₂)","du monoxyde (CO)","de l''eau","de l''hydrogène"]'::jsonb, '["ثاني أكسيد الكربون CO₂","أول أكسيد CO","الماء","الهيدروجين"]'::jsonb,
   0, 'C + O₂ → CO₂.', 'C + O₂ → CO₂.', 'medium', 3),
  ('Selon la loi de Lavoisier, lors d''une réaction la masse totale…', 'حسب قانون لافوازييه، أثناء التفاعل الكتلة الكلية…',
   '["se conserve","augmente","diminue","disparaît"]'::jsonb, '["تنحفظ","تزيد","تنقص","تختفي"]'::jsonb,
   0, 'La masse des réactifs = masse des produits.', 'كتلة المتفاعلات = كتلة النواتج.', 'easy', 4),
  ('Le gaz toxique produit par une combustion incomplète est…', 'الغاز السام الناتج عن احتراق ناقص هو…',
   '["le monoxyde de carbone (CO)","le dioxygène","l''azote","la vapeur d''eau"]'::jsonb, '["أول أكسيد الكربون CO","ثنائي الأكسجين","الآزوت","بخار الماء"]'::jsonb,
   0, 'CO est un gaz toxique, dangereux dans les pièces mal ventilées.', 'CO غاز سام خطير في الأماكن سيئة التهوية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'matiere-transformations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 4AM SVT =================

update public.chapters c set
  lesson_fr = 'LA COORDINATION NERVEUSE

LE SYSTÈME NERVEUX
• Système nerveux central : encéphale (cerveau, cervelet, bulbe) + moelle épinière.
• Système nerveux périphérique : les nerfs.

LE NEURONE
Cellule de base du système nerveux. Il conduit le MESSAGE NERVEUX, de nature
électrique, toujours dans un seul sens (dendrites → corps cellulaire → axone).

L''ACTE VOLONTAIRE
Décidé par le cerveau. Trajet : organe des sens → nerf → cerveau (décision) →
nerf → muscle. Ex. attraper un objet que l''on vise.

L''ACTE RÉFLEXE
Rapide, involontaire, protège l''organisme. Il passe par la MOELLE ÉPINIÈRE,
pas par le cerveau. Trajet (arc réflexe) : récepteur → nerf sensitif →
moelle épinière → nerf moteur → muscle. Ex. retirer la main d''une surface chaude.

L''HYGIÈNE DU SYSTÈME NERVEUX
Sommeil suffisant, éviter alcool et drogues qui perturbent la transmission
du message nerveux.',
  lesson_ar = 'التنسيق العصبي

الجهاز العصبي
• مركزي: الدماغ (المخ، المخيخ، البصلة) + النخاع الشوكي.
• محيطي: الأعصاب.

العصبون (الخلية العصبية)
الوحدة الأساسية، ينقل الرسالة العصبية ذات الطبيعة الكهربائية في اتجاه واحد.

الفعل الإرادي
يقرره المخ. المسار: عضو حسي ← عصب ← المخ (القرار) ← عصب ← عضلة.

الفعل الانعكاسي
سريع لاإرادي يحمي الجسم، يمر عبر النخاع الشوكي لا المخ.
القوس الانعكاسي: مستقبل ← عصب حسي ← النخاع الشوكي ← عصب حركي ← عضلة.

حفظ صحة الجهاز العصبي
نوم كافٍ، تجنب الكحول والمخدرات التي تعيق نقل الرسالة العصبية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-nerveuse';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La cellule de base du système nerveux est…', 'الوحدة الأساسية للجهاز العصبي هي…',
   '["le neurone","le globule rouge","le muscle","l''os"]'::jsonb, '["العصبون","الكرية الحمراء","العضلة","العظم"]'::jsonb,
   0, 'Le neurone conduit le message nerveux.', 'العصبون ينقل الرسالة العصبية.', 'easy', 1),
  ('L''acte réflexe passe par…', 'الفعل الانعكاسي يمر عبر…',
   '["la moelle épinière","le cerveau","le cœur","l''estomac"]'::jsonb, '["النخاع الشوكي","المخ","القلب","المعدة"]'::jsonb,
   0, 'Le réflexe passe par la moelle épinière, pas le cerveau.', 'الفعل الانعكاسي يمر عبر النخاع الشوكي لا المخ.', 'medium', 2),
  ('Le message nerveux est de nature…', 'الرسالة العصبية ذات طبيعة…',
   '["électrique","chimique uniquement","lumineuse","sonore"]'::jsonb, '["كهربائية","كيميائية فقط","ضوئية","صوتية"]'::jsonb,
   0, 'Le long du neurone, le message est électrique.', 'على طول العصبون الرسالة كهربائية.', 'medium', 3),
  ('Retirer sa main d''une surface chaude est un acte…', 'سحب اليد من سطح ساخن فعل…',
   '["réflexe","volontaire","réfléchi","lent"]'::jsonb, '["انعكاسي","إرادي","مدروس","بطيء"]'::jsonb,
   0, 'C''est un réflexe : rapide et involontaire.', 'إنه فعل انعكاسي سريع لاإرادي.', 'easy', 4),
  ('Le système nerveux central comprend…', 'الجهاز العصبي المركزي يشمل…',
   '["l''encéphale et la moelle épinière","les nerfs seulement","les muscles","les os"]'::jsonb, '["الدماغ والنخاع الشوكي","الأعصاب فقط","العضلات","العظام"]'::jsonb,
   0, 'Encéphale + moelle épinière = système nerveux central.', 'الدماغ + النخاع الشوكي = الجهاز المركزي.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-nerveuse'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA COORDINATION HORMONALE

LES HORMONES
Une hormone est un messager CHIMIQUE fabriqué par une glande, transporté par
le SANG jusqu''à un organe cible. La coordination hormonale est plus lente
que la nerveuse mais ses effets durent plus longtemps.

LES GLANDES ENDOCRINES
• Hypophyse : « chef d''orchestre » qui commande d''autres glandes.
• Thyroïde : règle le métabolisme.
• Pancréas : règle la glycémie (insuline et glucagon).
• Glandes sexuelles : testicules et ovaires.

LA RÉGULATION DE LA GLYCÉMIE
La glycémie (taux de sucre dans le sang) est maintenue autour de 1 g/L.
• Trop de sucre → le pancréas libère de l''INSULINE (fait baisser la glycémie).
• Pas assez → le pancréas libère du GLUCAGON (fait monter la glycémie).
Le diabète est un défaut de cette régulation.

NERVEUX vs HORMONAL
Nerveux : rapide, bref, message électrique, voie = nerfs.
Hormonal : lent, durable, message chimique, voie = sang.',
  lesson_ar = 'التنسيق الهرموني

الهرمونات
الهرمون رسول كيميائي تصنعه غدة، ينقله الدم إلى عضو مستهدف. التنسيق الهرموني
أبطأ من العصبي لكن آثاره تدوم أطول.

الغدد الصماء
• النخامية: «قائد الأوركسترا» يتحكم في غدد أخرى.
• الدرقية: تنظّم الاستقلاب.
• البنكرياس: ينظّم نسبة السكر (الأنسولين والغلوكاغون).
• الغدد التناسلية: الخصيتان والمبيضان.

تنظيم نسبة السكر (التحلون)
تُحفظ حوالي 1 غ/ل.
• سكر زائد ← يفرز البنكرياس الأنسولين (يخفض السكر).
• سكر ناقص ← يفرز الغلوكاغون (يرفع السكر).
السكري خلل في هذا التنظيم.

عصبي مقابل هرموني
العصبي: سريع، قصير، كهربائي، عبر الأعصاب.
الهرموني: بطيء، دائم، كيميائي، عبر الدم.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-hormonale';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une hormone est transportée par…', 'ينقل الهرمون بواسطة…',
   '["le sang","les nerfs","l''air","la lymphe seulement"]'::jsonb, '["الدم","الأعصاب","الهواء","اللمف فقط"]'::jsonb,
   0, 'L''hormone circule dans le sang jusqu''à l''organe cible.', 'الهرمون ينتقل عبر الدم إلى العضو المستهدف.', 'easy', 1),
  ('Quelle glande règle la glycémie ?', 'أي غدة تنظّم نسبة السكر؟',
   '["le pancréas","la thyroïde","l''hypophyse","le foie"]'::jsonb, '["البنكرياس","الدرقية","النخامية","الكبد"]'::jsonb,
   0, 'Le pancréas sécrète insuline et glucagon.', 'البنكرياس يفرز الأنسولين والغلوكاغون.', 'medium', 2),
  ('L''hormone qui fait BAISSER la glycémie est…', 'الهرمون الذي يخفض نسبة السكر هو…',
   '["l''insuline","le glucagon","l''adrénaline","la thyroxine"]'::jsonb, '["الأنسولين","الغلوكاغون","الأدرينالين","الثيروكسين"]'::jsonb,
   0, 'L''insuline fait baisser la glycémie.', 'الأنسولين يخفض نسبة السكر.', 'medium', 3),
  ('La coordination hormonale, comparée à la nerveuse, est…', 'التنسيق الهرموني مقارنة بالعصبي…',
   '["plus lente et durable","plus rapide et brève","identique","instantanée"]'::jsonb, '["أبطأ وأطول أثرًا","أسرع وأقصر","مماثلة","لحظية"]'::jsonb,
   0, 'Hormonal = lent mais durable.', 'الهرموني بطيء لكنه دائم.', 'easy', 4),
  ('La glycémie normale est d''environ…', 'نسبة السكر الطبيعية حوالي…',
   '["1 g/L","10 g/L","0,1 g/L","5 g/L"]'::jsonb, '["1 غ/ل","10 غ/ل","0.1 غ/ل","5 غ/ل"]'::jsonb,
   0, 'Environ 1 g/L à jeun.', 'حوالي 1 غ/ل على الريق.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-hormonale'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''IMMUNITÉ

LES DÉFENSES DE L''ORGANISME
Le corps se défend contre les microbes (bactéries, virus) qui sont des
ANTIGÈNES (éléments étrangers = « non-soi »).

LA DÉFENSE NON SPÉCIFIQUE (immédiate)
• La peau et les muqueuses : première barrière.
• La PHAGOCYTOSE : les phagocytes (globules blancs) englobent et digèrent
  les microbes. Se déroule en étapes : adhésion → absorption → digestion.

LA DÉFENSE SPÉCIFIQUE (plus lente, ciblée)
• Réponse à MÉDIATION HUMORALE : les lymphocytes B produisent des ANTICORPS
  qui neutralisent un antigène précis (clé-serrure).
• Réponse à MÉDIATION CELLULAIRE : les lymphocytes T détruisent les cellules
  infectées.

LA MÉMOIRE IMMUNITAIRE ET LA VACCINATION
Après une première rencontre, l''organisme garde des cellules mémoire.
La VACCINATION introduit un antigène affaibli pour créer cette mémoire
sans tomber malade. La SÉROTHÉRAPIE injecte directement des anticorps
(action rapide mais brève).',
  lesson_ar = 'المناعة

دفاعات الجسم
يدافع الجسم عن نفسه ضد الميكروبات (بكتيريا، فيروسات) وهي مستضدات (عناصر غريبة = لاذات).

الدفاع اللانوعي (فوري)
• الجلد والأغشية المخاطية: الحاجز الأول.
• البلعمة: تحيط الخلايا البلعمية (كريات بيضاء) بالميكروب وتهضمه:
  التصاق ← إحاطة ← هضم.

الدفاع النوعي (أبطأ، موجّه)
• استجابة خلطية: تنتج اللمفاويات B أجسامًا مضادة تعادل مستضدًا محددًا (مفتاح-قفل).
• استجابة خلوية: تتلف اللمفاويات T الخلايا المصابة.

الذاكرة المناعية والتلقيح
يحتفظ الجسم بخلايا ذاكرة. التلقيح يُدخل مستضدًا مضعّفًا لبناء الذاكرة دون مرض.
الاستمصال يحقن أجسامًا مضادة مباشرة (أثر سريع لكن قصير).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'immunite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un élément étranger reconnu par l''organisme s''appelle…', 'العنصر الغريب الذي يتعرفه الجسم يُسمى…',
   '["un antigène","un anticorps","un phagocyte","une hormone"]'::jsonb, '["مستضد","جسم مضاد","خلية بلعمية","هرمون"]'::jsonb,
   0, 'L''antigène est le « non-soi » qui déclenche la réponse.', 'المستضد هو اللاذات الذي يثير الاستجابة.', 'easy', 1),
  ('La phagocytose est réalisée par…', 'البلعمة تقوم بها…',
   '["les phagocytes (globules blancs)","les globules rouges","les plaquettes","les neurones"]'::jsonb, '["الخلايا البلعمية (كريات بيضاء)","الكريات الحمراء","الصفيحات","العصبونات"]'::jsonb,
   0, 'Les globules blancs phagocytent les microbes.', 'الكريات البيضاء تبلعم الميكروبات.', 'medium', 2),
  ('Les anticorps sont produits par…', 'الأجسام المضادة تنتجها…',
   '["les lymphocytes B","les lymphocytes T","les phagocytes","les neurones"]'::jsonb, '["اللمفاويات B","اللمفاويات T","الخلايا البلعمية","العصبونات"]'::jsonb,
   0, 'Les lymphocytes B produisent les anticorps.', 'اللمفاويات B تنتج الأجسام المضادة.', 'medium', 3),
  ('La vaccination introduit dans l''organisme…', 'التلقيح يُدخل إلى الجسم…',
   '["un antigène affaibli","des anticorps prêts","un microbe virulent","du sucre"]'::jsonb, '["مستضدًا مضعّفًا","أجسامًا مضادة جاهزة","ميكروبًا شرسًا","سكرًا"]'::jsonb,
   0, 'Le vaccin = antigène affaibli → crée une mémoire immunitaire.', 'اللقاح مستضد مضعّف يبني الذاكرة المناعية.', 'easy', 4),
  ('La relation anticorps-antigène est de type…', 'العلاقة بين الجسم المضاد والمستضد من نوع…',
   '["spécifique (clé-serrure)","aléatoire","non spécifique","impossible"]'::jsonb, '["نوعية (مفتاح-قفل)","عشوائية","لانوعية","مستحيلة"]'::jsonb,
   0, 'Un anticorps neutralise un antigène précis.', 'الجسم المضاد يعادل مستضدًا محددًا.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'immunite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA TRANSMISSION DES CARACTÈRES (génétique)

LES CARACTÈRES HÉRÉDITAIRES
Un caractère héréditaire se transmet des parents aux enfants (couleur des yeux,
groupe sanguin…). Il est porté par l''information génétique.

CHROMOSOMES ET GÈNES
• Le noyau de chaque cellule contient les CHROMOSOMES.
• L''espèce humaine a 46 chromosomes (23 paires), dont 1 paire sexuelle :
  XX chez la fille, XY chez le garçon.
• Un GÈNE est une portion de chromosome responsable d''un caractère.
• L''ADN est la molécule qui porte cette information.

CELLULES ET REPRODUCTION
• Cellules du corps : 46 chromosomes.
• Cellules reproductrices (gamètes : ovule, spermatozoïde) : 23 chromosomes.
• À la fécondation : 23 (ovule) + 23 (spermatozoïde) = 46 → l''enfant reçoit
  la moitié de ses chromosomes de chaque parent.

LE SEXE DE L''ENFANT
Il est déterminé par le spermatozoïde : X → fille (XX), Y → garçon (XY).',
  lesson_ar = 'انتقال الصفات (الوراثة)

الصفات الوراثية
تنتقل الصفة الوراثية من الآباء إلى الأبناء (لون العينين، الزمرة الدموية…)،
تحملها المعلومة الوراثية.

الصبغيات والمورثات
• نواة كل خلية تحتوي على الصبغيات (الكروموزومات).
• للإنسان 46 صبغيًا (23 زوجًا)، منها زوج جنسي: XX للأنثى وXY للذكر.
• المورثة جزء من صبغي مسؤول عن صفة.
• الـ ADN هو الجزيء الحامل للمعلومة.

الخلايا والتكاثر
• خلايا الجسم: 46 صبغيًا.
• الخلايا التناسلية (البيضة، النطفة): 23 صبغيًا.
• عند الإخصاب: 23 + 23 = 46.

جنس المولود
تحدده النطفة: X ← أنثى (XX)، Y ← ذكر (XY).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'genetique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de chromosomes possède une cellule humaine du corps ?', 'كم صبغيًا في خلية جسمية بشرية؟',
   '["46","23","2","92"]'::jsonb, '["46","23","2","92"]'::jsonb,
   0, '46 chromosomes = 23 paires.', '46 صبغيًا = 23 زوجًا.', 'easy', 1),
  ('Les chromosomes sexuels d''une fille sont…', 'الصبغيان الجنسيان للأنثى هما…',
   '["XX","XY","YY","X seul"]'::jsonb, '["XX","XY","YY","X فقط"]'::jsonb,
   0, 'Fille = XX, garçon = XY.', 'الأنثى XX والذكر XY.', 'medium', 2),
  ('Un gène est…', 'المورثة هي…',
   '["une portion de chromosome","une cellule entière","un organe","une hormone"]'::jsonb, '["جزء من صبغي","خلية كاملة","عضو","هرمون"]'::jsonb,
   0, 'Le gène porte l''information d''un caractère.', 'المورثة تحمل معلومة صفة.', 'medium', 3),
  ('Un gamète (ovule ou spermatozoïde) contient… chromosomes', 'الخلية التناسلية (بيضة أو نطفة) تحتوي… صبغيًا',
   '["23","46","92","2"]'::jsonb, '["23","46","92","2"]'::jsonb,
   0, 'Les gamètes ont la moitié : 23 chromosomes.', 'الأمشاج تحمل النصف: 23 صبغيًا.', 'easy', 4),
  ('Le sexe de l''enfant est déterminé par…', 'جنس المولود يحدده…',
   '["le spermatozoïde","l''ovule","la mère","le hasard total"]'::jsonb, '["النطفة","البيضة","الأم","الصدفة التامة"]'::jsonb,
   0, 'Le spermatozoïde apporte X (fille) ou Y (garçon).', 'النطفة تحمل X (أنثى) أو Y (ذكر).', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'genetique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS SVT (BAC) =================

update public.chapters c set
  lesson_fr = 'DU GÈNE À LA PROTÉINE

L''ADN ET L''INFORMATION GÉNÉTIQUE
L''ADN porte l''information sous forme d''une SÉQUENCE DE NUCLÉOTIDES (A, T, G, C).
Un gène = une portion d''ADN qui code une protéine.

LA TRANSCRIPTION (noyau)
L''ADN est copié en ARN messager (ARNm). Différence clé : dans l''ARN, la base
T (thymine) est remplacée par U (uracile). L''ARNm sort du noyau vers le cytoplasme.

LA TRADUCTION (ribosomes)
L''ARNm est lu par CODONS (groupes de 3 nucléotides). Chaque codon correspond
à un ACIDE AMINÉ selon le CODE GÉNÉTIQUE. Les acides aminés s''enchaînent →
protéine. Codon « start » (AUG) et codons « stop » bornent la lecture.

LE CODE GÉNÉTIQUE
• Universel (le même chez presque tous les êtres vivants).
• Redondant (plusieurs codons pour un même acide aminé).
• Non chevauchant, lu dans un seul sens.

DE LA PROTÉINE AU CARACTÈRE
La séquence des acides aminés détermine la forme et la fonction de la protéine,
donc le caractère (ex. une enzyme, la couleur…). Une MUTATION de l''ADN peut
changer la protéine.',
  lesson_ar = 'من المورثة إلى البروتين

الـ ADN والمعلومة الوراثية
يحمل الـ ADN المعلومة على شكل تسلسل نيكليوتيدات (A, T, G, C). المورثة جزء من ADN يشفّر بروتينًا.

الاستنساخ (في النواة)
يُنسخ الـ ADN إلى ARN رسول. الفرق: في الـ ARN تُستبدل القاعدة T بـ U (يوراسيل).
يخرج الـ ARNm من النواة إلى الهيولى.

الترجمة (في الريبوزومات)
يُقرأ الـ ARNm برامزات (كل 3 نيكليوتيدات). كل رامزة توافق حمضًا أمينيًا حسب الشيفرة الوراثية.
تتسلسل الأحماض الأمينية ← بروتين. رامزة البداية AUG ورامزات التوقف تحدّد القراءة.

الشيفرة الوراثية
• عالمية، مكررة (عدة رامزات لحمض واحد)، غير متداخلة، تُقرأ في اتجاه واحد.

من البروتين إلى الصفة
تسلسل الأحماض الأمينية يحدد شكل ووظيفة البروتين ومنه الصفة. الطفرة قد تغيّر البروتين.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'gene-proteine';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans l''ARN, la base T de l''ADN est remplacée par…', 'في الـ ARN تُستبدل القاعدة T بـ…',
   '["U (uracile)","G","C","A"]'::jsonb, '["U (يوراسيل)","G","C","A"]'::jsonb,
   0, 'ARN : U remplace T.', 'في الـ ARN تحل U محل T.', 'easy', 1),
  ('La transcription se déroule…', 'يحدث الاستنساخ في…',
   '["dans le noyau","dans les ribosomes","dans la membrane","dans le sang"]'::jsonb, '["النواة","الريبوزومات","الغشاء","الدم"]'::jsonb,
   0, 'La transcription (ADN→ARNm) a lieu dans le noyau.', 'الاستنساخ يحدث في النواة.', 'medium', 2),
  ('Un codon est formé de… nucléotides', 'الرامزة تتكون من… نيكليوتيدات',
   '["3","1","2","4"]'::jsonb, '["3","1","2","4"]'::jsonb,
   0, 'Un codon = 3 nucléotides = 1 acide aminé.', 'الرامزة = 3 نيكليوتيدات = حمض أميني واحد.', 'medium', 3),
  ('La traduction a lieu au niveau…', 'تحدث الترجمة على مستوى…',
   '["des ribosomes","du noyau","des mitochondries seulement","de la membrane"]'::jsonb, '["الريبوزومات","النواة","الميتوكندري فقط","الغشاء"]'::jsonb,
   0, 'Les ribosomes lisent l''ARNm et assemblent la protéine.', 'الريبوزومات تقرأ الـ ARNm وتركّب البروتين.', 'easy', 4),
  ('Le code génétique est dit « universel » car…', 'الشيفرة الوراثية «عالمية» لأنها…',
   '["le même chez presque tous les êtres vivants","différent pour chaque espèce","propre à l''humain","change chaque jour"]'::jsonb, '["نفسها عند معظم الكائنات","مختلفة لكل نوع","خاصة بالإنسان","تتغير يوميًا"]'::jsonb,
   0, 'Un même codon code le même acide aminé dans le vivant.', 'نفس الرامزة تشفّر نفس الحمض عند الكائنات.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'gene-proteine'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''ACTIVITÉ ENZYMATIQUE

QU''EST-CE QU''UNE ENZYME ?
Une enzyme est une protéine qui accélère une réaction chimique (BIOCATALYSEUR)
sans être consommée. Ex. l''amylase digère l''amidon.

LA SPÉCIFICITÉ
• Spécificité de SUBSTRAT : une enzyme n''agit que sur un substrat donné.
• Spécificité d''ACTION : elle ne catalyse qu''un seul type de réaction.
Cette double spécificité s''explique par la complémentarité de forme entre
le SITE ACTIF de l''enzyme et le substrat (modèle clé-serrure).

LE COMPLEXE ENZYME-SUBSTRAT
Enzyme + Substrat → complexe E-S → Enzyme + Produit.
L''enzyme est intacte à la fin et peut recommencer.

LES FACTEURS QUI INFLUENCENT L''ACTIVITÉ
• La TEMPÉRATURE : une activité optimale (≈ 37 °C chez l''humain) ; trop chaud
  → l''enzyme se dénature (perd sa forme, donc son activité).
• Le pH : chaque enzyme a un pH optimal (la pepsine agit en milieu acide).
• La concentration en substrat et en enzyme.',
  lesson_ar = 'النشاط الأنزيمي

ما هو الأنزيم؟
الأنزيم بروتين يسرّع تفاعلاً كيميائيًا (وسيط حيوي) دون أن يُستهلك. مثال: الأميلاز يهضم النشا.

النوعية
• نوعية الركيزة: يؤثر الأنزيم على ركيزة معينة فقط.
• نوعية الفعل: يحفّز نوعًا واحدًا من التفاعل.
تفسّر هذه النوعية بالتكامل بين الموقع الفعّال للأنزيم والركيزة (نموذج مفتاح-قفل).

المعقّد أنزيم-ركيزة
أنزيم + ركيزة ← معقّد ← أنزيم + ناتج. يبقى الأنزيم سليمًا ويعيد الكرّة.

العوامل المؤثرة
• الحرارة: نشاط أعظمي (≈ 37 °م عند الإنسان)؛ الحرارة الزائدة تفسد الأنزيم.
• الـ pH: لكل أنزيم pH أمثل (الببسين يعمل في وسط حمضي).
• تركيز الركيزة والأنزيم.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'enzymes';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une enzyme est de nature…', 'الأنزيم ذو طبيعة…',
   '["protéique","lipidique","glucidique","minérale"]'::jsonb, '["بروتينية","دهنية","سكرية","معدنية"]'::jsonb,
   0, 'Les enzymes sont des protéines.', 'الأنزيمات بروتينات.', 'easy', 1),
  ('La partie de l''enzyme qui fixe le substrat s''appelle…', 'الجزء من الأنزيم الذي يثبّت الركيزة يُسمى…',
   '["le site actif","le noyau","la membrane","le codon"]'::jsonb, '["الموقع الفعّال","النواة","الغشاء","الرامزة"]'::jsonb,
   0, 'Le site actif reçoit le substrat (clé-serrure).', 'الموقع الفعّال يستقبل الركيزة (مفتاح-قفل).', 'medium', 2),
  ('À la fin de la réaction, l''enzyme est…', 'في نهاية التفاعل يكون الأنزيم…',
   '["intacte et réutilisable","détruite","consommée","transformée en substrat"]'::jsonb, '["سليمًا وقابلاً لإعادة الاستعمال","متلفًا","مستهلكًا","محوّلاً إلى ركيزة"]'::jsonb,
   0, 'Un catalyseur n''est pas consommé.', 'الوسيط لا يُستهلك.', 'medium', 3),
  ('Une température trop élevée provoque… de l''enzyme', 'الحرارة المرتفعة جدًا تسبب… للأنزيم',
   '["la dénaturation","l''activation permanente","la duplication","la coloration"]'::jsonb, '["التمسّخ (فقدان البنية)","تنشيطًا دائمًا","التضاعف","التلوين"]'::jsonb,
   0, 'La chaleur excessive dénature l''enzyme (perte de forme).', 'الحرارة الزائدة تمسّخ الأنزيم.', 'easy', 4),
  ('La « spécificité de substrat » signifie qu''une enzyme…', '«نوعية الركيزة» تعني أن الأنزيم…',
   '["n''agit que sur un substrat donné","agit sur tout","change de forme","produit de l''ADN"]'::jsonb, '["يؤثر على ركيزة معينة فقط","يؤثر على كل شيء","يغيّر شكله","ينتج ADN"]'::jsonb,
   0, 'Chaque enzyme reconnaît un substrat précis.', 'كل أنزيم يتعرف ركيزة محددة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'enzymes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA CONVERSION DE L''ÉNERGIE

L''ATP — LA MONNAIE ÉNERGÉTIQUE
L''ATP (adénosine triphosphate) stocke et libère l''énergie de la cellule.
ATP → ADP + Pi + énergie (utilisable pour le travail cellulaire).

LA RESPIRATION CELLULAIRE
Se déroule dans les MITOCHONDRIES, en présence de dioxygène (aérobie).
Glucose + O₂ → CO₂ + H₂O + beaucoup d''ATP.
C''est le mode le plus rentable de production d''énergie.

LA FERMENTATION
Sans dioxygène (anaérobie), dans le cytoplasme. Rendement faible.
• Fermentation lactique (muscle en effort) → acide lactique + peu d''ATP.
• Fermentation alcoolique (levures) → éthanol + CO₂ + peu d''ATP.

LA PHOTOSYNTHÈSE
Chez les végétaux chlorophylliens, dans les CHLOROPLASTES, à la lumière :
CO₂ + H₂O → glucose + O₂ (matière organique produite à partir de minéral).

BILAN : la respiration LIBÈRE l''énergie contenue dans le glucose ;
la photosynthèse la STOCKE dans le glucose grâce à la lumière.',
  lesson_ar = 'تحويل الطاقة

الـ ATP — العملة الطاقوية
يخزّن الـ ATP (ثلاثي فوسفات الأدينوزين) الطاقة ويحررها.
ATP ← ADP + Pi + طاقة تُستعمل في العمل الخلوي.

التنفس الخلوي
يحدث في الميتوكندري بوجود الأكسجين (هوائي).
غلوكوز + O₂ ← CO₂ + H₂O + كمية كبيرة من ATP. أكثر الطرق مردودية.

التخمر
دون أكسجين (لاهوائي) في الهيولى، مردوده ضعيف.
• تخمر لبني (العضلة أثناء الجهد) ← حمض لبني + قليل من ATP.
• تخمر كحولي (الخمائر) ← إيثانول + CO₂ + قليل من ATP.

التركيب الضوئي
عند النباتات الخضراء في الصانعات الخضراء وبوجود الضوء:
CO₂ + H₂O ← غلوكوز + O₂.

الحوصلة: التنفس يحرر الطاقة، والتركيب الضوئي يخزّنها في الغلوكوز بفضل الضوء.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'energie';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La molécule qui stocke l''énergie utilisable par la cellule est…', 'الجزيء الذي يخزّن الطاقة القابلة للاستعمال هو…',
   '["l''ATP","l''ADN","le glucose seul","l''oxygène"]'::jsonb, '["الـ ATP","الـ ADN","الغلوكوز وحده","الأكسجين"]'::jsonb,
   0, 'L''ATP est la « monnaie énergétique ».', 'الـ ATP هو العملة الطاقوية.', 'easy', 1),
  ('La respiration cellulaire se déroule dans…', 'يحدث التنفس الخلوي في…',
   '["les mitochondries","les chloroplastes","le noyau","les ribosomes"]'::jsonb, '["الميتوكندري","الصانعات الخضراء","النواة","الريبوزومات"]'::jsonb,
   0, 'La respiration a lieu dans les mitochondries.', 'التنفس يحدث في الميتوكندري.', 'medium', 2),
  ('La photosynthèse produit…', 'ينتج التركيب الضوئي…',
   '["du glucose et de l''O₂","du CO₂ seulement","de l''ATP uniquement","de l''acide lactique"]'::jsonb, '["الغلوكوز والأكسجين","CO₂ فقط","ATP فقط","حمضًا لبنيًا"]'::jsonb,
   0, 'CO₂ + H₂O + lumière → glucose + O₂.', 'CO₂ + H₂O + ضوء ← غلوكوز + O₂.', 'medium', 3),
  ('La fermentation se produit…', 'يحدث التخمر…',
   '["en absence de dioxygène","seulement avec O₂","dans le noyau","à la lumière"]'::jsonb, '["في غياب الأكسجين","فقط بوجود O₂","في النواة","في الضوء"]'::jsonb,
   0, 'La fermentation est anaérobie (sans O₂).', 'التخمر لاهوائي (دون أكسجين).', 'easy', 4),
  ('Comparée à la fermentation, la respiration produit…', 'مقارنة بالتخمر ينتج التنفس…',
   '["beaucoup plus d''ATP","moins d''ATP","autant d''ATP","aucun ATP"]'::jsonb, '["كمية أكبر من ATP","أقل ATP","نفس الكمية","لا ATP"]'::jsonb,
   0, 'La respiration est bien plus rentable en ATP.', 'التنفس أكثر مردودية بكثير في ATP.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'energie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA COMMUNICATION NERVEUSE

LE MESSAGE NERVEUX
Le long d''un neurone, le message est un signal ÉLECTRIQUE appelé POTENTIEL
D''ACTION (PA). Au repos, la membrane est polarisée (potentiel de repos ≈ −70 mV).
Une stimulation suffisante (seuil) déclenche un PA qui se propage.

LA LOI DU TOUT OU RIEN
Si la stimulation atteint le seuil, le PA apparaît toujours avec la même
amplitude. En dessous du seuil : rien. L''intensité du stimulus est codée
par la FRÉQUENCE des PA, pas leur amplitude.

LA SYNAPSE
Zone de communication entre deux neurones (ou neurone-muscle). Le message
y devient CHIMIQUE : le neurone libère un NEUROTRANSMETTEUR dans la fente
synaptique, capté par des récepteurs du neurone suivant. La transmission
est donc à sens unique.

L''INTÉGRATION
Un neurone reçoit de nombreux messages (excitateurs et inhibiteurs) et fait
la somme : il émet un PA seulement si le bilan atteint le seuil.

SUBSTANCES ET DANGERS : drogues et alcool perturbent les synapses.',
  lesson_ar = 'الاتصال العصبي

الرسالة العصبية
على طول العصبون، الرسالة إشارة كهربائية تُسمى كمون العمل (PA). في الراحة يكون
الغشاء مستقطبًا (كمون الراحة ≈ −70 ملي فولط). تنبيه كافٍ (العتبة) يولّد كمون عمل ينتشر.

قانون الكل أو اللاشيء
إذا بلغ التنبيه العتبة يظهر PA بنفس الاتساع دائمًا. تحت العتبة: لا شيء.
تُرمّز شدة المنبه بتواتر كمونات العمل لا باتساعها.

المشبك
منطقة التواصل بين عصبونين (أو عصبون-عضلة). تصبح الرسالة كيميائية: يحرر العصبون
مبلّغًا عصبيًا في الشق المشبكي تلتقطه مستقبلات العصبون التالي. النقل باتجاه واحد.

التكامل
يستقبل العصبون رسائل عديدة (منبّهة ومثبّطة) ويجمعها: يصدر PA فقط إذا بلغت الحصيلة العتبة.

مواد وأخطار: المخدرات والكحول تعيق عمل المشابك.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'communication-nerveuse';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Le signal qui se propage le long d''un neurone est…', 'الإشارة التي تنتشر على طول العصبون هي…',
   '["le potentiel d''action","une hormone","un anticorps","une enzyme"]'::jsonb, '["كمون العمل","هرمون","جسم مضاد","أنزيم"]'::jsonb,
   0, 'Le PA est le message électrique du neurone.', 'كمون العمل هو الرسالة الكهربائية للعصبون.', 'easy', 1),
  ('Au niveau de la synapse, le message devient…', 'على مستوى المشبك تصبح الرسالة…',
   '["chimique","électrique","lumineuse","mécanique"]'::jsonb, '["كيميائية","كهربائية","ضوئية","ميكانيكية"]'::jsonb,
   0, 'La synapse transmet via un neurotransmetteur (chimique).', 'المشبك ينقل عبر مبلّغ عصبي (كيميائي).', 'medium', 2),
  ('L''intensité d''un stimulus est codée par…', 'تُرمّز شدة المنبه بـ…',
   '["la fréquence des PA","l''amplitude des PA","la couleur","la taille du neurone"]'::jsonb, '["تواتر كمونات العمل","اتساع كمونات العمل","اللون","حجم العصبون"]'::jsonb,
   0, 'Loi du tout ou rien : c''est la fréquence qui code l''intensité.', 'قانون الكل أو اللاشيء: التواتر يرمّز الشدة.', 'medium', 3),
  ('La transmission synaptique se fait…', 'النقل المشبكي يتم…',
   '["dans un seul sens","dans les deux sens","au hasard","sans récepteurs"]'::jsonb, '["في اتجاه واحد","في الاتجاهين","عشوائيًا","دون مستقبلات"]'::jsonb,
   0, 'Le neurotransmetteur va du neurone émetteur au récepteur : sens unique.', 'يذهب المبلّغ من العصبون المرسل إلى المستقبل: اتجاه واحد.', 'easy', 4),
  ('Le potentiel de repos de la membrane est d''environ…', 'كمون راحة الغشاء حوالي…',
   '["−70 mV","+70 mV","0 mV","−700 mV"]'::jsonb, '["−70 mV","+70 mV","0 mV","−700 mV"]'::jsonb,
   0, 'Environ −70 mV au repos.', 'حوالي −70 ملي فولط في الراحة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'communication-nerveuse'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''IMMUNITÉ — SOI ET NON-SOI

LE SOI ET LE NON-SOI
Le SOI = les molécules propres à l''organisme (marqueurs CMH sur les cellules).
Le NON-SOI = tout élément étranger (microbe, greffe, cellule anormale).
Le système immunitaire tolère le soi et attaque le non-soi.

LES CELLULES DE L''IMMUNITÉ
• Lymphocytes B (LB) : produisent les ANTICORPS (immunité humorale).
• Lymphocytes T4 (LT auxiliaires) : « chefs d''orchestre », activent les autres.
• Lymphocytes T8 (LT cytotoxiques) : détruisent les cellules infectées
  (immunité cellulaire).
• Macrophages : phagocytent et présentent l''antigène.

LA RÉPONSE IMMUNITAIRE
1. Reconnaissance de l''antigène.
2. Sélection et multiplication des lymphocytes spécifiques.
3. Différenciation : plasmocytes (anticorps) et cellules mémoire.
4. Élimination de l''antigène.

LE VIH ET LE SIDA
Le VIH détruit les LT4, « chefs d''orchestre » de la réponse. Sans eux, le
système s''effondre → SIDA (immunodéficience). D''où l''importance de la
prévention.',
  lesson_ar = 'المناعة — الذات واللاذات

الذات واللاذات
الذات = جزيئات الجسم الخاصة (مؤشرات CMH على الخلايا).
اللاذات = كل عنصر غريب (ميكروب، طعم، خلية شاذة).
يتحمل الجهاز المناعي الذات ويهاجم اللاذات.

خلايا المناعة
• اللمفاويات B: تنتج الأجسام المضادة (مناعة خلطية).
• اللمفاويات T4 (المساعدة): «قائدة الأوركسترا» تنشّط البقية.
• اللمفاويات T8 (السامة): تتلف الخلايا المصابة (مناعة خلوية).
• البلعميات: تبلعم وتعرض المستضد.

الاستجابة المناعية
1. التعرف على المستضد. 2. انتقاء وتكاثر اللمفاويات النوعية.
3. التمايز: خلايا بلازمية (أجسام مضادة) وخلايا ذاكرة. 4. القضاء على المستضد.

الـ VIH والسيدا
يتلف الـ VIH اللمفاويات T4 قائدة الاستجابة، فينهار الجهاز ← السيدا (عوز مناعي).
لذلك تُعدّ الوقاية أساسية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'immunite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les marqueurs du « soi » portés par nos cellules sont…', 'مؤشرات «الذات» على خلايانا هي…',
   '["les molécules du CMH","les anticorps","les virus","les hormones"]'::jsonb, '["جزيئات الـ CMH","الأجسام المضادة","الفيروسات","الهرمونات"]'::jsonb,
   0, 'Le CMH marque les cellules du soi.', 'الـ CMH يميّز خلايا الذات.', 'easy', 1),
  ('Les lymphocytes T8 cytotoxiques…', 'اللمفاويات T8 السامة…',
   '["détruisent les cellules infectées","produisent des anticorps","fabriquent des hormones","digèrent le glucose"]'::jsonb, '["تتلف الخلايا المصابة","تنتج أجسامًا مضادة","تصنع هرمونات","تهضم الغلوكوز"]'::jsonb,
   0, 'Les LT8 assurent l''immunité cellulaire.', 'اللمفاويات T8 تؤمّن المناعة الخلوية.', 'medium', 2),
  ('Le VIH détruit principalement…', 'يتلف الـ VIH بشكل رئيسي…',
   '["les lymphocytes T4","les globules rouges","les neurones","les os"]'::jsonb, '["اللمفاويات T4","الكريات الحمراء","العصبونات","العظام"]'::jsonb,
   0, 'Le VIH détruit les LT4 → effondrement immunitaire.', 'الـ VIH يتلف اللمفاويات T4 ← انهيار مناعي.', 'medium', 3),
  ('Les anticorps sont produits par les plasmocytes issus des…', 'تنتج الأجسام المضادة من خلايا بلازمية مصدرها…',
   '["lymphocytes B","lymphocytes T8","macrophages","hématies"]'::jsonb, '["اللمفاويات B","اللمفاويات T8","البلعميات","الكريات الحمراء"]'::jsonb,
   0, 'Les LB se différencient en plasmocytes producteurs d''anticorps.', 'اللمفاويات B تتمايز إلى خلايا بلازمية منتجة للأجسام المضادة.', 'easy', 4),
  ('Après une infection, les cellules qui assurent une réponse plus rapide la 2ᵉ fois sont…', 'بعد العدوى، الخلايا التي تؤمّن استجابة أسرع في المرة الثانية هي…',
   '["les cellules mémoire","les globules rouges","les plaquettes","les neurones"]'::jsonb, '["خلايا الذاكرة","الكريات الحمراء","الصفيحات","العصبونات"]'::jsonb,
   0, 'Les cellules mémoire accélèrent la réponse secondaire.', 'خلايا الذاكرة تسرّع الاستجابة الثانوية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'immunite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS PHYSIQUE (BAC) — flagship chapters =================

update public.chapters c set
  lesson_fr = 'SUIVI TEMPOREL D''UNE TRANSFORMATION CHIMIQUE (cinétique)

VITESSE D''UNE RÉACTION
Certaines réactions sont lentes, d''autres rapides. La CINÉTIQUE étudie leur
évolution dans le temps. On suit une grandeur (concentration, volume de gaz,
conductivité…) au cours du temps.

LA VITESSE VOLUMIQUE
v = (1/V) × (dx/dt), où x est l''avancement. La vitesse est MAXIMALE au début
(réactifs abondants) puis DIMINUE et tend vers zéro quand la réaction s''achève.

LE TEMPS DE DEMI-RÉACTION t½
C''est la durée au bout de laquelle l''avancement atteint la MOITIÉ de sa valeur
finale (x = x_max/2). Il sert à comparer la rapidité des réactions.

LES FACTEURS CINÉTIQUES (qui accélèrent une réaction)
• La TEMPÉRATURE : plus il fait chaud, plus la réaction est rapide.
• La CONCENTRATION des réactifs : plus elle est grande, plus c''est rapide.
• Le CATALYSEUR : accélère sans être consommé (ex. enzymes, ions métalliques).
• La surface de contact (état de division du solide).

À RETENIR : la vitesse décroît au cours du temps car les réactifs se raréfient.',
  lesson_ar = 'المتابعة الزمنية لتحول كيميائي (الحركية)

سرعة التفاعل
بعض التفاعلات بطيئة وأخرى سريعة. تدرس الحركية تطورها في الزمن بمتابعة مقدار
(تركيز، حجم غاز، ناقلية…) عبر الزمن.

السرعة الحجمية
v = (1/V) × (dx/dt) حيث x التقدّم. السرعة أعظمية في البداية (وفرة المتفاعلات)
ثم تتناقص وتؤول إلى الصفر عند انتهاء التفاعل.

زمن نصف التفاعل t½
المدة التي يبلغ عندها التقدّم نصف قيمته النهائية (x = x_max/2)، تُستعمل لمقارنة السرعات.

العوامل الحركية (تسرّع التفاعل)
• الحرارة: كلما ارتفعت زادت السرعة.
• تركيز المتفاعلات: كلما زاد زادت السرعة.
• الوسيط: يسرّع دون أن يُستهلك (أنزيمات، شوارد معدنية).
• سطح التماس (درجة تجزئة الصلب).

تذكر: تتناقص السرعة مع الزمن لأن المتفاعلات تندر.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'cinetique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La vitesse d''une réaction chimique est généralement… au début', 'سرعة التفاعل الكيميائي عمومًا… في البداية',
   '["maximale","nulle","minimale","négative"]'::jsonb, '["أعظمية","معدومة","أصغرية","سالبة"]'::jsonb,
   0, 'Au début les réactifs sont abondants → vitesse maximale.', 'في البداية المتفاعلات وفيرة ← سرعة أعظمية.', 'easy', 1),
  ('Le temps de demi-réaction t½ correspond à un avancement égal à…', 'زمن نصف التفاعل يوافق تقدّمًا يساوي…',
   '["la moitié de l''avancement final","l''avancement final","le double","zéro"]'::jsonb, '["نصف التقدّم النهائي","التقدّم النهائي","الضعف","صفر"]'::jsonb,
   0, 'x = x_max / 2 au temps t½.', 'x = x_max / 2 عند t½.', 'medium', 2),
  ('Lequel N''EST PAS un facteur cinétique ?', 'أي مما يلي ليس عاملاً حركيًا؟',
   '["la couleur du récipient","la température","la concentration","le catalyseur"]'::jsonb, '["لون الإناء","الحرارة","التركيز","الوسيط"]'::jsonb,
   0, 'La couleur du récipient n''influence pas la vitesse.', 'لون الإناء لا يؤثر في السرعة.', 'medium', 3),
  ('Un catalyseur…', 'الوسيط…',
   '["accélère sans être consommé","ralentit la réaction","est un réactif","change les produits"]'::jsonb, '["يسرّع دون أن يُستهلك","يبطئ التفاعل","متفاعل","يغيّر النواتج"]'::jsonb,
   0, 'Le catalyseur accélère et se retrouve intact.', 'الوسيط يسرّع ويبقى سليمًا.', 'easy', 4),
  ('Au cours du temps, la vitesse de réaction…', 'مع مرور الزمن، سرعة التفاعل…',
   '["diminue","augmente","reste constante","devient infinie"]'::jsonb, '["تتناقص","تتزايد","تبقى ثابتة","تصبح لانهائية"]'::jsonb,
   0, 'Les réactifs se raréfient → la vitesse diminue.', 'المتفاعلات تندر ← السرعة تتناقص.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'cinetique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'ÉVOLUTION D''UN SYSTÈME MÉCANIQUE

LES TROIS LOIS DE NEWTON
• 1ʳᵉ loi (inertie) : un corps isolé (ou pseudo-isolé) garde une vitesse
  constante en ligne droite, ou reste immobile.
• 2ᵉ loi : ΣF = m·a. La somme des forces égale masse × accélération.
• 3ᵉ loi (action-réaction) : si A exerce une force sur B, B exerce sur A une
  force de même intensité, même direction, sens opposé.

LA CHUTE LIBRE
Un corps en chute libre n''est soumis qu''à son poids. Son accélération est g
(≈ 9,8 m/s²), INDÉPENDANTE de la masse : une plume et une bille tombent
de la même façon dans le vide.

MOUVEMENTS DANS UN CHAMP UNIFORME
• Champ de pesanteur : trajectoire parabolique d''un projectile.
• Champ électrique uniforme (entre deux plaques) : déviation d''une particule
  chargée.

REPÈRES ET ÉQUATIONS HORAIRES
On projette la 2ᵉ loi sur les axes pour obtenir a, puis v(t) et x(t) par
intégrations successives, à partir des conditions initiales.',
  lesson_ar = 'تطور جملة ميكانيكية

قوانين نيوتن الثلاثة
• القانون الأول (العطالة): جسم معزول يحافظ على سرعة ثابتة في خط مستقيم أو يبقى ساكنًا.
• القانون الثاني: ΣF = m·a (مجموع القوى = الكتلة × التسارع).
• القانون الثالث (الفعل ورد الفعل): إذا أثّر A على B بقوة، أثّر B على A بقوة مساوية ومعاكسة.

السقوط الحر
الجسم في سقوط حر لا يخضع إلا لثقله، وتسارعه g (≈ 9.8 م/ثا²) مستقل عن الكتلة:
الريشة والكرية تسقطان بنفس الطريقة في الخلاء.

الحركات في حقل منتظم
• حقل الثقالة: مسار قذيفة على شكل قطع مكافئ.
• حقل كهربائي منتظم (بين صفيحتين): انحراف جسيم مشحون.

المعالم والمعادلات الزمنية
نُسقط القانون الثاني على المحاور لإيجاد a ثم v(t) وx(t) بالتكامل انطلاقًا من الشروط الابتدائية.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'mecanique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La deuxième loi de Newton s''écrit…', 'يُكتب قانون نيوتن الثاني…',
   '["ΣF = m·a","F = m/a","ΣF = a/m","F = m + a"]'::jsonb, '["ΣF = m·a","F = m/a","ΣF = a/m","F = m + a"]'::jsonb,
   0, 'Somme des forces = masse × accélération.', 'مجموع القوى = الكتلة × التسارع.', 'easy', 1),
  ('En chute libre, l''accélération d''un corps…', 'في السقوط الحر، تسارع الجسم…',
   '["ne dépend pas de sa masse","augmente avec la masse","est nulle","dépend de la couleur"]'::jsonb, '["لا يتعلق بكتلته","يزيد مع الكتلة","معدوم","يتعلق باللون"]'::jsonb,
   0, 'a = g, indépendante de la masse.', 'a = g مستقل عن الكتلة.', 'medium', 2),
  ('La trajectoire d''un projectile dans le champ de pesanteur est…', 'مسار قذيفة في حقل الثقالة…',
   '["parabolique","circulaire","rectiligne verticale toujours","hélicoïdale"]'::jsonb, '["قطع مكافئ","دائري","مستقيم شاقولي دائمًا","حلزوني"]'::jsonb,
   0, 'Mouvement parabolique dans un champ uniforme.', 'حركة على شكل قطع مكافئ في حقل منتظم.', 'medium', 3),
  ('« Action-réaction » est la… loi de Newton', '«الفعل ورد الفعل» هو القانون… لنيوتن',
   '["troisième","première","deuxième","quatrième"]'::jsonb, '["الثالث","الأول","الثاني","الرابع"]'::jsonb,
   0, '3ᵉ loi : forces opposées entre A et B.', 'القانون الثالث: قوتان متعاكستان بين A وB.', 'easy', 4),
  ('Un corps « pseudo-isolé » a un mouvement…', 'جسم شبه معزول له حركة…',
   '["rectiligne uniforme ou immobile","accéléré","circulaire","imprévisible"]'::jsonb, '["مستقيمة منتظمة أو ساكن","متسارعة","دائرية","غير متوقعة"]'::jsonb,
   0, '1ʳᵉ loi : vitesse constante ou repos.', 'القانون الأول: سرعة ثابتة أو سكون.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'mecanique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'TRANSFORMATIONS NUCLÉAIRES

LE NOYAU ATOMIQUE
Noté ᴬ_Z X : Z = nombre de protons (numéro atomique), A = nombre de nucléons
(protons + neutrons). Des isotopes ont le même Z mais des A différents.

LA RADIOACTIVITÉ
Certains noyaux instables se désintègrent spontanément en émettant un rayonnement :
• Radioactivité α : émission d''un noyau d''hélium ⁴₂He.
• Radioactivité β⁻ : un neutron → proton + électron émis.
• Radioactivité β⁺ : un proton → neutron + positon émis.
• Rayonnement γ : photon très énergétique accompagnant les précédentes.

LOIS DE CONSERVATION (lois de Soddy)
Dans une réaction nucléaire, on conserve A (nucléons) et Z (charge) :
la somme des A et la somme des Z sont identiques avant et après.

LA DÉCROISSANCE RADIOACTIVE
N(t) = N₀ · e^(−λt), où λ est la constante radioactive.
La DEMI-VIE t½ = ln2 / λ : durée au bout de laquelle la moitié des noyaux
s''est désintégrée. Application : datation (carbone 14).

ÉNERGIE : E = m·c² (équivalence masse-énergie d''Einstein). Fission et fusion
libèrent d''énormes énergies.',
  lesson_ar = 'التحولات النووية

النواة الذرية
تُرمز ᴬ_Z X: Z عدد البروتونات (العدد الذري)، A عدد النويات (بروتونات + نيوترونات).
النظائر لها نفس Z وأعداد A مختلفة.

النشاط الإشعاعي
تتفكك بعض النوى غير المستقرة تلقائيًا بإصدار إشعاع:
• إشعاع α: إصدار نواة هيليوم ⁴₂He.
• إشعاع β⁻: نيوترون ← بروتون + إلكترون.
• إشعاع β⁺: بروتون ← نيوترون + بوزيترون.
• إشعاع γ: فوتون عالي الطاقة يرافق السابقة.

قوانين الانحفاظ (قوانين صودي)
ينحفظ A (النويات) وZ (الشحنة) قبل التفاعل وبعده.

التناقص الإشعاعي
N(t) = N₀ · e^(−λt) حيث λ الثابت الإشعاعي.
عمر النصف t½ = ln2 / λ. تطبيق: التأريخ (الكربون 14).

الطاقة: E = m·c² (تكافؤ الكتلة والطاقة). الانشطار والاندماج يحرران طاقة هائلة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'nucleaire';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans la notation ᴬ_Z X, Z représente…', 'في الرمز ᴬ_Z X، يمثل Z…',
   '["le nombre de protons","le nombre de neutrons","le nombre de nucléons","la masse"]'::jsonb, '["عدد البروتونات","عدد النيوترونات","عدد النويات","الكتلة"]'::jsonb,
   0, 'Z = numéro atomique = nombre de protons.', 'Z العدد الذري = عدد البروتونات.', 'easy', 1),
  ('La radioactivité α correspond à l''émission d''un…', 'يوافق النشاط α إصدار…',
   '["noyau d''hélium","électron","photon seul","proton isolé"]'::jsonb, '["نواة هيليوم","إلكترون","فوتون فقط","بروتون منفرد"]'::jsonb,
   0, 'Particule α = noyau d''hélium ⁴₂He.', 'الجسيم α نواة هيليوم.', 'medium', 2),
  ('Lors d''une réaction nucléaire, on conserve…', 'أثناء تفاعل نووي، ينحفظ…',
   '["A et Z","la couleur","la température","le volume"]'::jsonb, '["A و Z","اللون","الحرارة","الحجم"]'::jsonb,
   0, 'Lois de Soddy : conservation de A et de Z.', 'قوانين صودي: انحفاظ A وZ.', 'medium', 3),
  ('La demi-vie t½ est la durée pour désintégrer… des noyaux', 'عمر النصف t½ هو مدة تفكك… من النوى',
   '["la moitié","le quart","la totalité","le dixième"]'::jsonb, '["النصف","الربع","الكل","العُشر"]'::jsonb,
   0, 'À t½, la moitié des noyaux s''est désintégrée.', 'عند t½ يتفكك نصف النوى.', 'easy', 4),
  ('La relation d''Einstein masse-énergie est…', 'علاقة أينشتاين بين الكتلة والطاقة هي…',
   '["E = mc²","E = mc","E = m/c²","E = m²c"]'::jsonb, '["E = mc²","E = mc","E = m/c²","E = m²c"]'::jsonb,
   0, 'E = mc² relie masse et énergie.', 'E = mc² تربط الكتلة بالطاقة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'nucleaire'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
