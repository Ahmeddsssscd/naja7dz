-- ===============================================================
-- Migration: 20260722_023_primaire_maths
--
-- Primaire (1AP–4AP) maths: these grades had subjects seeded (migration
-- 017) but NO chapters. This creates age-appropriate maths chapters +
-- bilingual lessons + quiz banks for each. 5AP was already done in 017/018.
-- Idempotent: ON CONFLICT DO NOTHING chapters, guarded lesson UPDATEs,
-- NOT EXISTS quiz inserts.
-- ===============================================================

-- ===== 1. Create chapters =====

-- 1AP maths (very basic: numbers to 100, simple add/subtract, shapes)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-0-100',  'Les nombres de 0 à 100',  'الأعداد من 0 إلى 100', 'Lire, écrire et compter jusqu''à 100.', 1),
  ('addition',       'L''addition',             'الجمع',                'Ajouter deux nombres jusqu''à 20.', 2),
  ('soustraction',   'La soustraction',         'الطرح',                'Retirer, trouver ce qui reste.', 3),
  ('formes',         'Les formes',              'الأشكال',              'Carré, rond, triangle, rectangle.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 2AP maths (numbers to 1000, add/subtract with carry, intro multiplication)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-0-1000', 'Les nombres jusqu''à 1000', 'الأعداد حتى 1000', 'Lire, écrire, comparer jusqu''à 1000.', 1),
  ('addition-retenue','L''addition avec retenue',  'الجمع مع الاحتفاظ', 'Poser et calculer une addition.', 2),
  ('soustraction-retenue','La soustraction avec retenue','الطرح مع الاحتفاظ','Poser et calculer une soustraction.', 3),
  ('multiplication', 'La multiplication',          'الضرب',            'Découvrir le sens de la multiplication.', 4),
  ('mesures-temps',  'Le temps et les mesures',    'الوقت والقياس',     'Heures, jours, longueurs simples.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 3AP maths (numbers to 10000, tables, intro division, perimeter)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-10000',  'Les nombres jusqu''à 10 000', 'الأعداد حتى 10000', 'Lire, écrire et ranger les grands nombres.', 1),
  ('tables',         'Les tables de multiplication', 'جداول الضرب',     'Mémoriser les tables de 1 à 9.', 2),
  ('division',       'La division',                 'القسمة',           'Partager en parts égales.', 3),
  ('perimetre',      'Le périmètre',                'المحيط',           'Mesurer le tour d''une figure.', 4),
  ('problemes',      'Résoudre des problèmes',      'حل المشكلات',      'Choisir la bonne opération.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 4AP maths (numbers to millions, intro fractions/decimals, area, angles)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('grands-nombres', 'Les grands nombres',        'الأعداد الكبيرة',   'Lire et écrire jusqu''au million.', 1),
  ('fractions',      'Les fractions',             'الكسور',            'Découvrir les fractions simples.', 2),
  ('decimaux',       'Les nombres décimaux',      'الأعداد العشرية',   'La virgule, les dixièmes.', 3),
  ('operations',     'Les quatre opérations',     'العمليات الأربع',   'Poser addition, soustraction, ×, ÷.', 4),
  ('aires',          'Les aires',                 'المساحات',          'Aire du carré et du rectangle.', 5),
  ('angles',         'Les angles',                'الزوايا',           'Angle droit, aigu, obtus.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ===== 2. Lessons =====

update public.chapters c set
  lesson_fr = 'LES NOMBRES DE 0 À 100

COMPTER
On compte 1, 2, 3… jusqu''à 100. Les nombres se regroupent par DIZAINES :
10, 20, 30… Après 19 vient 20, après 29 vient 30.

DIZAINES ET UNITÉS
Le nombre 34 = 3 dizaines et 4 unités. Le premier chiffre compte les
dizaines, le deuxième compte les unités.

COMPARER
Pour dire quel nombre est le plus grand :
• On regarde d''abord les dizaines : 52 > 47 car 5 dizaines > 4 dizaines.
• Si les dizaines sont pareilles, on regarde les unités : 34 < 38.

Signes : > veut dire « plus grand que », < veut dire « plus petit que ».

À RETENIR : dans un nombre à deux chiffres, le chiffre de gauche compte
les dizaines.',
  lesson_ar = 'الأعداد من 0 إلى 100

العدّ
نعدّ 1، 2، 3… حتى 100. تُجمع الأعداد بالعشرات: 10، 20، 30… بعد 19 يأتي 20.

العشرات والوحدات
العدد 34 = 3 عشرات و4 وحدات. الرقم الأول يعدّ العشرات والثاني يعدّ الوحدات.

المقارنة
لمعرفة العدد الأكبر:
• ننظر أولاً إلى العشرات: 52 > 47 لأن 5 عشرات > 4 عشرات.
• إذا تساوت العشرات ننظر إلى الوحدات: 34 < 38.

الرموز: > تعني «أكبر من» و< تعني «أصغر من».

تذكر: في عدد من رقمين، الرقم على اليسار يعدّ العشرات.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-100';

update public.chapters c set
  lesson_fr = 'L''ADDITION

AJOUTER, C''EST RÉUNIR
Additionner, c''est mettre ensemble. 3 + 2 = 5 : j''ai 3 billes, j''en ajoute
2, j''ai 5 billes en tout. Le résultat s''appelle la SOMME.

LE SIGNE +
Le signe + veut dire « plus » ou « et ». 4 + 1 se lit « quatre plus un ».

ADDITION ASTUCIEUSE
• Ajouter 0 ne change rien : 7 + 0 = 7.
• On peut changer l''ordre : 2 + 6 = 6 + 2 = 8.
• Pour ajouter 10, on ajoute 1 dizaine : 23 + 10 = 33.

CALCULER JUSQU''À 20
5 + 5 = 10 ; 6 + 4 = 10. Bien connaître les paires qui font 10 aide beaucoup !

À RETENIR : le mot « en tout » ou « ensemble » veut souvent dire qu''il faut
additionner.',
  lesson_ar = 'الجمع

الجمع هو الضمّ
الجمع يعني وضع الأشياء معًا. 3 + 2 = 5: عندي 3 كرات أضيف 2 فيصبح لدي 5.
النتيجة تُسمى المجموع.

الرمز +
الرمز + يعني «زائد» أو «و». 4 + 1 تُقرأ «أربعة زائد واحد».

الجمع الذكي
• إضافة 0 لا تغيّر شيئًا: 7 + 0 = 7.
• يمكن تبديل الترتيب: 2 + 6 = 6 + 2 = 8.
• لإضافة 10 نضيف عشرة واحدة: 23 + 10 = 33.

الحساب حتى 20
5 + 5 = 10 ؛ 6 + 4 = 10. معرفة الأزواج التي مجموعها 10 مفيدة جدًا!

تذكر: عبارة «في المجموع» أو «معًا» تعني غالبًا الجمع.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'addition';

update public.chapters c set
  lesson_fr = 'LA SOUSTRACTION

RETIRER, C''EST ENLEVER
Soustraire, c''est enlever. 5 − 2 = 3 : j''ai 5 bonbons, j''en mange 2, il
m''en reste 3. Le résultat s''appelle la DIFFÉRENCE.

LE SIGNE −
Le signe − veut dire « moins ». 7 − 3 se lit « sept moins trois ».

CE QU''IL FAUT SAVOIR
• Enlever 0 ne change rien : 8 − 0 = 8.
• Un nombre moins lui-même fait 0 : 6 − 6 = 0.
• On ne peut pas enlever plus que ce qu''on a (au primaire).

LIEN AVEC L''ADDITION
La soustraction est le contraire de l''addition :
si 3 + 2 = 5, alors 5 − 2 = 3 et 5 − 3 = 2.

À RETENIR : les mots « reste », « enlève », « perd » veulent souvent dire
qu''il faut soustraire.',
  lesson_ar = 'الطرح

الطرح هو الإزالة
الطرح يعني أن نُزيل. 5 − 2 = 3: عندي 5 حلويات آكل 2 فيبقى 3.
النتيجة تُسمى الفرق.

الرمز −
الرمز − يعني «ناقص». 7 − 3 تُقرأ «سبعة ناقص ثلاثة».

ما يجب معرفته
• إزالة 0 لا تغيّر شيئًا: 8 − 0 = 8.
• عدد ناقص نفسه = 0: 6 − 6 = 0.

العلاقة بالجمع
الطرح عكس الجمع:
إذا كان 3 + 2 = 5 فإن 5 − 2 = 3 و 5 − 3 = 2.

تذكر: كلمات «الباقي»، «يُزيل»، «يفقد» تعني غالبًا الطرح.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'soustraction';

update public.chapters c set
  lesson_fr = 'LES FORMES

LES FORMES QU''ON VOIT PARTOUT
• Le CARRÉ : 4 côtés égaux, 4 coins droits. (une fenêtre)
• Le RECTANGLE : 4 coins droits, mais 2 côtés longs et 2 côtés courts.
  (une porte, un cahier)
• Le TRIANGLE : 3 côtés et 3 coins. (un panneau)
• Le ROND (cercle) : tout arrondi, sans coin. (une roue, le soleil)

CÔTÉS ET COINS
Un CÔTÉ est un bord droit. Un COIN (sommet) est l''endroit où deux côtés se
rencontrent. Le carré a 4 côtés et 4 coins.

RECONNAÎTRE
On reconnaît une forme en comptant ses côtés :
3 côtés → triangle, 4 côtés → carré ou rectangle, 0 côté droit → rond.

À RETENIR : le carré a tous ses côtés de la même longueur ; le rectangle a
des côtés longs et des côtés courts.',
  lesson_ar = 'الأشكال

أشكال نراها في كل مكان
• المربع: 4 أضلاع متساوية و4 زوايا قائمة. (نافذة)
• المستطيل: 4 زوايا قائمة، ضلعان طويلان وضلعان قصيران. (باب، كراس)
• المثلث: 3 أضلاع و3 زوايا. (لوحة إشارة)
• الدائرة: مستديرة تمامًا بلا زوايا. (عجلة، الشمس)

الأضلاع والزوايا
الضلع حافة مستقيمة. الزاوية (الرأس) هي مكان التقاء ضلعين. المربع له 4 أضلاع و4 زوايا.

التعرّف
نتعرّف على الشكل بعدّ أضلاعه:
3 أضلاع ← مثلث، 4 أضلاع ← مربع أو مستطيل، بلا أضلاع مستقيمة ← دائرة.

تذكر: المربع أضلاعه متساوية، والمستطيل له أضلاع طويلة وأخرى قصيرة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'formes';

update public.chapters c set
  lesson_fr = 'LES NOMBRES JUSQU''À 1000

CENTAINES, DIZAINES, UNITÉS
Le nombre 356 = 3 centaines, 5 dizaines, 6 unités.
• 100 = 1 centaine = 10 dizaines.
• Le chiffre le plus à gauche compte les centaines.

LIRE ET ÉCRIRE
356 se lit « trois cent cinquante-six ». On écrit les centaines, puis les
dizaines, puis les unités.

COMPARER
On compare d''abord les centaines, puis les dizaines, puis les unités :
420 > 399 car 4 centaines > 3 centaines.

RANGER
Ranger dans l''ordre croissant = du plus petit au plus grand.
Ordre décroissant = du plus grand au plus petit.

À RETENIR : dans un nombre à trois chiffres, on lit de gauche à droite :
centaines, dizaines, unités.',
  lesson_ar = 'الأعداد حتى 1000

المئات والعشرات والوحدات
العدد 356 = 3 مئات و5 عشرات و6 وحدات.
• 100 = مئة واحدة = 10 عشرات.
• الرقم الأقصى يسارًا يعدّ المئات.

القراءة والكتابة
356 يُقرأ «ثلاثمئة وستة وخمسون». نكتب المئات ثم العشرات ثم الوحدات.

المقارنة
نقارن المئات أولاً ثم العشرات ثم الوحدات:
420 > 399 لأن 4 مئات > 3 مئات.

الترتيب
الترتيب التصاعدي = من الأصغر إلى الأكبر. التنازلي = من الأكبر إلى الأصغر.

تذكر: في عدد من ثلاثة أرقام نقرأ من اليسار: مئات، عشرات، وحدات.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-1000';

update public.chapters c set
  lesson_fr = 'L''ADDITION AVEC RETENUE

POSER UNE ADDITION
On écrit les nombres l''un sous l''autre en alignant les unités sous les
unités, les dizaines sous les dizaines.

LA RETENUE
Quand la somme d''une colonne dépasse 9, on écrit les unités et on
« retient » la dizaine dans la colonne suivante.
Exemple : 27 + 15.
• Unités : 7 + 5 = 12 → j''écris 2, je retiens 1.
• Dizaines : 2 + 1 + 1 (retenue) = 4.
• Résultat : 42.

VÉRIFIER
On peut vérifier en changeant l''ordre : 15 + 27 doit donner le même résultat.

À RETENIR : on calcule toujours en commençant par la colonne des UNITÉS
(à droite), et la retenue va vers la gauche.',
  lesson_ar = 'الجمع مع الاحتفاظ

وضع عملية الجمع
نكتب الأعداد بعضها تحت بعض مع محاذاة الوحدات تحت الوحدات والعشرات تحت العشرات.

الاحتفاظ
عندما يتجاوز مجموع عمود العدد 9، نكتب الوحدات و«نحتفظ» بالعشرة في العمود التالي.
مثال: 27 + 15.
• الوحدات: 7 + 5 = 12 ← نكتب 2 ونحتفظ بـ 1.
• العشرات: 2 + 1 + 1 = 4.
• النتيجة: 42.

التحقق
يمكن التحقق بتبديل الترتيب: 15 + 27 يعطي نفس النتيجة.

تذكر: نبدأ الحساب دائمًا من عمود الوحدات (يمينًا)، والاحتفاظ يتجه يسارًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'addition-retenue';

update public.chapters c set
  lesson_fr = 'LA SOUSTRACTION AVEC RETENUE

POSER UNE SOUSTRACTION
On aligne les unités sous les unités, les dizaines sous les dizaines. Le plus
grand nombre est en haut.

QUAND ON NE PEUT PAS ENLEVER
Si le chiffre du haut est plus petit que celui du bas, on « emprunte » une
dizaine.
Exemple : 42 − 15.
• Unités : 2 − 5 impossible → on emprunte 1 dizaine : 12 − 5 = 7.
• Dizaines : il reste 3 (car on a prêté 1), 3 − 1 = 2.
• Résultat : 27.

VÉRIFIER AVEC L''ADDITION
On vérifie : 27 + 15 = 42. Si ça retombe sur le grand nombre, c''est juste !

À RETENIR : on commence par les unités ; si on ne peut pas enlever, on
emprunte une dizaine à la colonne de gauche.',
  lesson_ar = 'الطرح مع الاحتفاظ

وضع عملية الطرح
نحاذي الوحدات تحت الوحدات والعشرات تحت العشرات. العدد الأكبر في الأعلى.

عندما لا نستطيع الطرح
إذا كان رقم الأعلى أصغر من رقم الأسفل، «نستلف» عشرة.
مثال: 42 − 15.
• الوحدات: 2 − 5 مستحيل ← نستلف عشرة: 12 − 5 = 7.
• العشرات: يبقى 3، ثم 3 − 1 = 2.
• النتيجة: 27.

التحقق بالجمع
نتحقق: 27 + 15 = 42. إذا رجعنا إلى العدد الكبير فالجواب صحيح!

تذكر: نبدأ بالوحدات، وإذا تعذّر الطرح نستلف عشرة من العمود على اليسار.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'soustraction-retenue';

update public.chapters c set
  lesson_fr = 'LA MULTIPLICATION

MULTIPLIER, C''EST ADDITIONNER PLUSIEURS FOIS
3 × 4 veut dire « 3 fois 4 », c''est-à-dire 4 + 4 + 4 = 12.
On peut aussi voir 4 paquets de 3 : 3 + 3 + 3 + 3 = 12.

LE SIGNE ×
Le signe × se lit « multiplié par » ou « fois ». Le résultat s''appelle le
PRODUIT.

CE QUI AIDE
• Multiplier par 1 ne change rien : 7 × 1 = 7.
• Multiplier par 0 donne toujours 0 : 8 × 0 = 0.
• On peut changer l''ordre : 3 × 4 = 4 × 3 = 12.
• Multiplier par 2, c''est doubler : 6 × 2 = 12.

LES DÉBUTS DES TABLES
Table de 2 : 2, 4, 6, 8, 10… Table de 5 : 5, 10, 15, 20…

À RETENIR : « fois » veut dire multiplier ; 3 × 4 = 4 + 4 + 4.',
  lesson_ar = 'الضرب

الضرب هو الجمع المتكرر
3 × 4 تعني «3 مرات 4»، أي 4 + 4 + 4 = 12.
ويمكن رؤيتها 4 مجموعات من 3: 3 + 3 + 3 + 3 = 12.

الرمز ×
الرمز × يُقرأ «مضروب في» أو «مرة». النتيجة تُسمى الجداء.

ما يساعد
• الضرب في 1 لا يغيّر شيئًا: 7 × 1 = 7.
• الضرب في 0 يعطي 0 دائمًا: 8 × 0 = 0.
• يمكن تبديل الترتيب: 3 × 4 = 4 × 3.
• الضرب في 2 هو المضاعفة: 6 × 2 = 12.

بدايات الجداول
جدول 2: 2، 4، 6، 8، 10… جدول 5: 5، 10، 15، 20…

تذكر: «مرة» تعني الضرب؛ 3 × 4 = 4 + 4 + 4.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'multiplication';

update public.chapters c set
  lesson_fr = 'LE TEMPS ET LES MESURES

LIRE L''HEURE
Une journée a 24 heures. L''horloge a une petite aiguille (les heures) et une
grande aiguille (les minutes). Quand la grande aiguille est sur 12, il est
« pile » l''heure. 1 heure = 60 minutes.

LES JOURS ET LES MOIS
La semaine a 7 jours (de samedi à vendredi en Algérie). L''année a 12 mois et
365 jours.

MESURER LES LONGUEURS
On mesure avec une règle. L''unité est le CENTIMÈTRE (cm) et le MÈTRE (m).
1 mètre = 100 centimètres.
Un crayon fait environ 15 cm ; une porte fait environ 2 m.

COMPARER
Pour comparer, il faut la même unité : 1 m est plus long que 50 cm car
1 m = 100 cm.

À RETENIR : 1 heure = 60 minutes ; 1 mètre = 100 centimètres.',
  lesson_ar = 'الوقت والقياس

قراءة الساعة
اليوم 24 ساعة. للساعة عقرب صغير (الساعات) وعقرب كبير (الدقائق). عندما يكون العقرب
الكبير على 12 تكون الساعة «تمامًا». 1 ساعة = 60 دقيقة.

الأيام والأشهر
الأسبوع 7 أيام. السنة 12 شهرًا و365 يومًا.

قياس الأطوال
نقيس بالمسطرة. الوحدة هي السنتيمتر (سم) والمتر (م). 1 متر = 100 سنتيمتر.
القلم حوالي 15 سم؛ الباب حوالي 2 م.

المقارنة
للمقارنة نحتاج نفس الوحدة: 1 م أطول من 50 سم لأن 1 م = 100 سم.

تذكر: 1 ساعة = 60 دقيقة؛ 1 متر = 100 سنتيمتر.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'mesures-temps';

update public.chapters c set
  lesson_fr = 'LES NOMBRES JUSQU''À 10 000

LES CLASSES
Le nombre 4 573 = 4 milliers, 5 centaines, 7 dizaines, 3 unités.
1 000 = 1 millier = 10 centaines.

LIRE UN GRAND NOMBRE
4 573 se lit « quatre mille cinq cent soixante-treize ». On lit d''abord les
milliers, puis le reste.

COMPARER ET RANGER
On compare d''abord la classe la plus grande (les milliers), puis on descend.
2 999 < 3 001 car 2 milliers < 3 milliers.

LA DROITE GRADUÉE
Chaque nombre a une place sur la droite graduée. On peut situer 3 500 entre
3 000 et 4 000, au milieu.

À RETENIR : pour comparer deux grands nombres, on regarde d''abord le chiffre
des milliers.',
  lesson_ar = 'الأعداد حتى 10000

الأقسام
العدد 4573 = 4 آلاف و5 مئات و7 عشرات و3 وحدات.
1000 = ألف واحد = 10 مئات.

قراءة عدد كبير
4573 يُقرأ «أربعة آلاف وخمسمئة وثلاثة وسبعون». نقرأ الآلاف أولاً ثم الباقي.

المقارنة والترتيب
نقارن القسم الأكبر (الآلاف) أولاً ثم ننزل.
2999 < 3001 لأن 2 ألف < 3 آلاف.

المستقيم المدرّج
لكل عدد مكان على المستقيم المدرّج. نضع 3500 بين 3000 و4000 في المنتصف.

تذكر: لمقارنة عددين كبيرين ننظر أولاً إلى رقم الآلاف.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'nombres-10000';

update public.chapters c set
  lesson_fr = 'LES TABLES DE MULTIPLICATION

À QUOI ÇA SERT ?
Connaître ses tables permet de calculer vite, sans compter sur les doigts.
C''est la base de toutes les maths qui suivent.

LES ASTUCES
• Table de 2 : on double. 2×7 = 14.
• Table de 5 : le résultat finit toujours par 0 ou 5. 5×6 = 30.
• Table de 10 : on ajoute un 0. 10×4 = 40.
• Table de 9 : les dizaines montent, les unités descendent (9, 18, 27, 36…).
• 3×4 = 4×3 : apprendre une moitié suffit (on retourne).

LE PRODUIT
Le résultat d''une multiplication s''appelle le produit. Dans 6 × 7 = 42,
42 est le produit.

À RETENIR : apprendre ses tables par cœur fait gagner beaucoup de temps.
Réviser un peu chaque jour est la meilleure méthode.',
  lesson_ar = 'جداول الضرب

ما فائدتها؟
معرفة الجداول تتيح الحساب بسرعة دون العدّ بالأصابع، وهي أساس كل الرياضيات اللاحقة.

الحيل
• جدول 2: نضاعف. 2×7 = 14.
• جدول 5: النتيجة تنتهي دائمًا بـ 0 أو 5. 5×6 = 30.
• جدول 10: نضيف صفرًا. 10×4 = 40.
• جدول 9: العشرات تصعد والوحدات تنزل (9، 18، 27، 36…).
• 3×4 = 4×3: يكفي حفظ نصف الجدول.

الجداء
نتيجة الضرب تُسمى الجداء. في 6 × 7 = 42، العدد 42 هو الجداء.

تذكر: حفظ الجداول عن ظهر قلب يوفّر وقتًا كبيرًا، والمراجعة اليومية أفضل طريقة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'tables';

update public.chapters c set
  lesson_fr = 'LA DIVISION

PARTAGER EN PARTS ÉGALES
Diviser, c''est partager équitablement. 12 ÷ 3 = 4 : je partage 12 bonbons
entre 3 enfants, chacun reçoit 4.

LE SIGNE ÷
12 ÷ 3 se lit « douze divisé par trois ». Le résultat s''appelle le QUOTIENT.

LIEN AVEC LA MULTIPLICATION
La division est le contraire de la multiplication :
si 3 × 4 = 12, alors 12 ÷ 3 = 4 et 12 ÷ 4 = 3.
Connaître ses tables aide énormément pour diviser !

LE RESTE
Parfois le partage n''est pas exact. 13 ÷ 4 : chacun a 3 (car 4×3 = 12) et il
RESTE 1. On écrit : 13 = 4 × 3 + 1.

À RETENIR : diviser, c''est partager en parts égales ; le reste est toujours
plus petit que le nombre par lequel on divise.',
  lesson_ar = 'القسمة

التقسيم إلى أجزاء متساوية
القسمة تعني التوزيع بالتساوي. 12 ÷ 3 = 4: أوزّع 12 حلوى على 3 أطفال فينال كل واحد 4.

الرمز ÷
12 ÷ 3 يُقرأ «اثنا عشر مقسوم على ثلاثة». النتيجة تُسمى الحاصل (خارج القسمة).

العلاقة بالضرب
القسمة عكس الضرب:
إذا كان 3 × 4 = 12 فإن 12 ÷ 3 = 4 و 12 ÷ 4 = 3.
معرفة الجداول تساعد كثيرًا في القسمة!

الباقي
أحيانًا لا يكون التقسيم تامًا. 13 ÷ 4: لكل واحد 3 (لأن 4×3 = 12) ويبقى 1.
نكتب: 13 = 4 × 3 + 1.

تذكر: القسمة تقسيم متساوٍ، والباقي دائمًا أصغر من العدد الذي نقسم عليه.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'division';

update public.chapters c set
  lesson_fr = 'LE PÉRIMÈTRE

C''EST QUOI LE PÉRIMÈTRE ?
Le périmètre, c''est la longueur du TOUR d''une figure. Si tu marches tout
autour d''un terrain, la distance parcourue est son périmètre.

COMMENT LE CALCULER
On additionne la longueur de tous les côtés.
• Triangle de côtés 3, 4, 5 cm : P = 3 + 4 + 5 = 12 cm.
• Carré de côté 5 cm : les 4 côtés sont égaux → P = 5 + 5 + 5 + 5 = 20 cm,
  ou plus vite : P = 4 × 5 = 20 cm.
• Rectangle de 6 cm et 4 cm : P = 6 + 4 + 6 + 4 = 20 cm,
  ou P = 2 × (6 + 4) = 20 cm.

L''UNITÉ
Le périmètre est une longueur : il se mesure en cm, m, km…

À RETENIR : périmètre = on fait le tour et on additionne tous les côtés.',
  lesson_ar = 'المحيط

ما هو المحيط؟
المحيط هو طول الدوران حول الشكل. إذا مشيت حول أرض، فالمسافة التي قطعتها هي محيطها.

كيف نحسبه
نجمع أطوال كل الأضلاع.
• مثلث أضلاعه 3 و4 و5 سم: المحيط = 3 + 4 + 5 = 12 سم.
• مربع ضلعه 5 سم: الأضلاع الأربعة متساوية ← 5 + 5 + 5 + 5 = 20 سم،
  أو أسرع: 4 × 5 = 20 سم.
• مستطيل 6 سم و4 سم: 6 + 4 + 6 + 4 = 20 سم، أو 2 × (6 + 4) = 20 سم.

الوحدة
المحيط طول: يُقاس بالسم والم والكم…

تذكر: المحيط = ندور حول الشكل ونجمع كل الأضلاع.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'perimetre';

update public.chapters c set
  lesson_fr = 'RÉSOUDRE DES PROBLÈMES

LES 3 ÉTAPES
1. LIRE l''énoncé et bien comprendre la question.
2. CHOISIR la bonne opération.
3. CALCULER et écrire une phrase-réponse avec l''unité.

LES MOTS QUI AIDENT
• « en tout », « ensemble », « au total » → addition (+).
• « reste », « il enlève », « de moins » → soustraction (−).
• « chaque … fois », « par paquets de » → multiplication (×).
• « partager », « répartir également » → division (÷).

EXEMPLE
« Un fermier a 4 caisses de 8 oranges. Combien d''oranges en tout ? »
Mot clé : « en tout » + « caisses de » → 4 × 8 = 32.
Réponse : le fermier a 32 oranges.

À RETENIR : on écrit toujours une phrase-réponse complète avec l''unité
(oranges, DA, cm…).',
  lesson_ar = 'حل المشكلات

الخطوات الثلاث
1. نقرأ النص ونفهم السؤال جيدًا.
2. نختار العملية الصحيحة.
3. نحسب ونكتب جملة الجواب مع الوحدة.

الكلمات المساعدة
• «في المجموع»، «معًا» ← الجمع (+).
• «الباقي»، «يُزيل»، «أقل بـ» ← الطرح (−).
• «كل … مرة»، «مجموعات من» ← الضرب (×).
• «نقسم»، «نوزّع بالتساوي» ← القسمة (÷).

مثال
«فلاح لديه 4 صناديق من 8 برتقالات. كم برتقالة في المجموع؟»
الكلمة المفتاحية: «في المجموع» + «صناديق من» ← 4 × 8 = 32.
الجواب: لدى الفلاح 32 برتقالة.

تذكر: نكتب دائمًا جملة جواب كاملة مع الوحدة (برتقالة، دج، سم…).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'problemes';

update public.chapters c set
  lesson_fr = 'LES GRANDS NOMBRES

LES CLASSES
Un grand nombre se lit par classes de 3 chiffres :
… | millions | milliers | unités.
Exemple : 1 254 630 = 1 million, 254 milliers, 630 unités.

LIRE ET ÉCRIRE
On lit chaque classe puis on ajoute son nom : « un million deux cent
cinquante-quatre mille six cent trente ». On laisse un petit espace entre
les classes pour lire plus facilement.

VALEUR D''UN CHIFFRE
Dans 1 254 630, le 2 vaut 200 000 (il est au rang des centaines de mille).

COMPARER
On compare classe par classe, en partant de la gauche.
1 254 630 > 998 000 car il y a plus de classes (7 chiffres contre 6).

À RETENIR : on regroupe les chiffres par 3 depuis la droite pour lire
facilement les grands nombres.',
  lesson_ar = 'الأعداد الكبيرة

الأقسام
يُقرأ العدد الكبير بأقسام من 3 أرقام:
… | ملايين | آلاف | وحدات.
مثال: 1254630 = مليون و254 ألفًا و630.

القراءة والكتابة
نقرأ كل قسم ثم نضيف اسمه: «مليون ومئتان وأربعة وخمسون ألفًا وستمئة وثلاثون».
نترك فراغًا صغيرًا بين الأقسام لتسهيل القراءة.

قيمة الرقم
في 1254630، الرقم 2 يساوي 200000 (في مرتبة مئات الآلاف).

المقارنة
نقارن قسمًا قسمًا من اليسار.
1254630 > 998000 لأن أرقامه أكثر (7 مقابل 6).

تذكر: نجمع الأرقام ثلاثة ثلاثة من اليمين لقراءة الأعداد الكبيرة بسهولة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres';

update public.chapters c set
  lesson_fr = 'LES FRACTIONS

UNE FRACTION, C''EST UN PARTAGE
Quand on partage un gâteau en parts égales, chaque part est une fraction.
3/4 (trois quarts) : on a coupé en 4 parts et on en prend 3.
• Le nombre du bas (dénominateur) = en combien de parts on coupe.
• Le nombre du haut (numérateur) = combien de parts on prend.

DES FRACTIONS QU''ON CONNAÎT
• 1/2 = un demi (la moitié).
• 1/4 = un quart.
• 3/4 = trois quarts.

COMPARER À 1
• Si le haut est plus petit que le bas → la fraction est plus petite que 1
  (2/3 < 1).
• Si le haut = le bas → la fraction vaut 1 (4/4 = 1).

À RETENIR : le dénominateur (en bas) dit en combien de parts on coupe ; le
numérateur (en haut) dit combien on en prend.',
  lesson_ar = 'الكسور

الكسر تجزئة
عندما نقسم كعكة إلى أجزاء متساوية، كل جزء كسر.
3/4 (ثلاثة أرباع): قطعناها إلى 4 أجزاء وأخذنا 3.
• العدد السفلي (المقام) = إلى كم جزء نقطع.
• العدد العلوي (البسط) = كم جزءًا نأخذ.

كسور نعرفها
• 1/2 = نصف. • 1/4 = ربع. • 3/4 = ثلاثة أرباع.

المقارنة بـ 1
• إذا كان الأعلى أصغر من الأسفل ← الكسر أصغر من 1 (2/3 < 1).
• إذا تساوى الأعلى والأسفل ← الكسر يساوي 1 (4/4 = 1).

تذكر: المقام (الأسفل) يقول إلى كم جزء نقطع، والبسط (الأعلى) يقول كم نأخذ.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'fractions';

update public.chapters c set
  lesson_fr = 'LES NOMBRES DÉCIMAUX

LA VIRGULE
Un nombre décimal a une partie entière et une partie décimale séparées par
une virgule. 3,5 : le 3 est la partie entière, le 5 est la partie décimale.

LES DIXIÈMES
Après la virgule, le premier chiffre compte les DIXIÈMES.
3,5 = 3 unités et 5 dixièmes.
On peut le voir comme une fraction : 3,5 = 3 + 5/10.

LIEN AVEC L''ARGENT ET LES MESURES
• 2,50 DA = 2 dinars et 50 centimes.
• 1,5 m = 1 mètre et 50 centimètres.

COMPARER
On compare d''abord la partie entière : 4,2 > 3,9.
Si la partie entière est la même, on regarde après la virgule : 3,7 > 3,2.

À RETENIR : le premier chiffre après la virgule, ce sont les dixièmes.
3,5 = 3,50 (on peut ajouter un zéro à droite).',
  lesson_ar = 'الأعداد العشرية

الفاصلة
للعدد العشري جزء صحيح وجزء عشري تفصل بينهما فاصلة. 3.5: العدد 3 جزء صحيح والعدد 5 جزء عشري.

الأعشار
بعد الفاصلة، الرقم الأول يعدّ الأعشار.
3.5 = 3 وحدات و5 أعشار.
ويمكن رؤيته ككسر: 3.5 = 3 + 5/10.

العلاقة بالمال والقياس
• 2.50 دج = 2 دينار و50 سنتيمًا.
• 1.5 م = 1 متر و50 سنتيمترًا.

المقارنة
نقارن الجزء الصحيح أولاً: 4.2 > 3.9.
إذا تساوى الجزء الصحيح ننظر بعد الفاصلة: 3.7 > 3.2.

تذكر: أول رقم بعد الفاصلة هو الأعشار. 3.5 = 3.50.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'decimaux';

update public.chapters c set
  lesson_fr = 'LES QUATRE OPÉRATIONS

LES QUATRE OPÉRATIONS
• Addition (+) : réunir. 45 + 27 = 72.
• Soustraction (−) : enlever. 72 − 27 = 45.
• Multiplication (×) : répéter. 6 × 7 = 42.
• Division (÷) : partager. 42 ÷ 6 = 7.

CE QUI SE VÉRIFIE
• L''addition et la soustraction se vérifient l''une l''autre.
• La multiplication et la division se vérifient l''une l''autre.

L''ORDRE DES CALCULS
Quand il y a plusieurs opérations, on fait d''abord la multiplication et la
division, ensuite l''addition et la soustraction.
5 + 3 × 2 = 5 + 6 = 11 (et non 16).

CHOISIR LA BONNE OPÉRATION
On repère les mots-clés : « en tout » (addition), « reste » (soustraction),
« fois » (multiplication), « partager » (division).

À RETENIR : dans un calcul mélangé, la multiplication et la division passent
AVANT l''addition et la soustraction.',
  lesson_ar = 'العمليات الأربع

العمليات الأربع
• الجمع (+): الضمّ. 45 + 27 = 72.
• الطرح (−): الإزالة. 72 − 27 = 45.
• الضرب (×): التكرار. 6 × 7 = 42.
• القسمة (÷): التقسيم. 42 ÷ 6 = 7.

ما يتحقق
• الجمع والطرح يتحقق أحدهما بالآخر.
• الضرب والقسمة يتحقق أحدهما بالآخر.

ترتيب الحساب
عند وجود عدة عمليات، نبدأ بالضرب والقسمة ثم الجمع والطرح.
5 + 3 × 2 = 5 + 6 = 11 (وليس 16).

اختيار العملية الصحيحة
نبحث عن الكلمات المفتاحية: «في المجموع» (جمع)، «الباقي» (طرح)، «مرة» (ضرب)، «نقسم» (قسمة).

تذكر: في الحساب المختلط الضرب والقسمة قبل الجمع والطرح.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'operations';

update public.chapters c set
  lesson_fr = 'LES AIRES

C''EST QUOI UNE AIRE ?
L''aire, c''est la SURFACE à l''intérieur d''une figure, la place qu''elle
occupe. On la mesure en cm² (centimètres carrés).

L''AIRE DU CARRÉ
On multiplie le côté par lui-même.
Carré de côté 5 cm : A = 5 × 5 = 25 cm².

L''AIRE DU RECTANGLE
On multiplie la Longueur par la largeur.
Rectangle de 6 cm sur 4 cm : A = 6 × 4 = 24 cm².

NE PAS CONFONDRE AVEC LE PÉRIMÈTRE
• Le périmètre = le tour (en cm).
• L''aire = l''intérieur (en cm²).
Deux jardins peuvent avoir le même tour mais pas la même surface !

À RETENIR : aire du rectangle = Longueur × largeur ; elle se mesure en cm²
(unités carrées).',
  lesson_ar = 'المساحات

ما هي المساحة؟
المساحة هي السطح داخل الشكل، المكان الذي يشغله. تُقاس بالسم² (سنتيمتر مربع).

مساحة المربع
نضرب الضلع في نفسه.
مربع ضلعه 5 سم: المساحة = 5 × 5 = 25 سم².

مساحة المستطيل
نضرب الطول في العرض.
مستطيل 6 سم × 4 سم: المساحة = 6 × 4 = 24 سم².

لا نخلط مع المحيط
• المحيط = الدوران (بالسم).
• المساحة = الداخل (بالسم²).
حديقتان قد يكون لهما نفس المحيط لكن ليس نفس المساحة!

تذكر: مساحة المستطيل = الطول × العرض، وتُقاس بالسم².'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'aires';

update public.chapters c set
  lesson_fr = 'LES ANGLES

C''EST QUOI UN ANGLE ?
Un angle, c''est l''écartement entre deux lignes (deux côtés) qui se
rencontrent en un point (le sommet). Plus l''écartement est grand, plus
l''angle est grand.

LES TROIS ANGLES À CONNAÎTRE
• L''ANGLE DROIT : c''est le coin d''une feuille, d''une fenêtre. On le
  reconnaît avec l''équerre. Il mesure 90°.
• L''ANGLE AIGU : plus fermé que l''angle droit (plus petit que 90°).
• L''ANGLE OBTUS : plus ouvert que l''angle droit (plus grand que 90°).

LE PETIT CARRÉ
Pour montrer qu''un angle est droit, on dessine un petit carré dans le coin.

L''ÉQUERRE
L''équerre sert à tracer et à vérifier les angles droits.

À RETENIR : angle droit = coin parfait (comme la feuille) ; aigu = plus
fermé ; obtus = plus ouvert.',
  lesson_ar = 'الزوايا

ما هي الزاوية؟
الزاوية هي الانفراج بين خطين (ضلعين) يلتقيان في نقطة (الرأس). كلما زاد الانفراج
كبرت الزاوية.

الزوايا الثلاث الواجب معرفتها
• الزاوية القائمة: هي زاوية ورقة أو نافذة. نتعرّف عليها بالكوس. تقيس 90°.
• الزاوية الحادة: أكثر انغلاقًا من القائمة (أصغر من 90°).
• الزاوية المنفرجة: أكثر انفتاحًا من القائمة (أكبر من 90°).

المربع الصغير
لبيان أن الزاوية قائمة نرسم مربعًا صغيرًا في الزاوية.

الكوس (المثلث القائم)
الكوس يُستعمل لرسم الزوايا القائمة والتحقق منها.

تذكر: القائمة = زاوية تامة (كالورقة)، الحادة = أكثر انغلاقًا، المنفرجة = أكثر انفتاحًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'angles';

-- ===== 3. Quiz banks =====

-- 1AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 34, combien y a-t-il de dizaines ?', 'في العدد 34، كم عشرة؟',
   '["3","4","34","7"]'::jsonb, '["3","4","34","7"]'::jsonb, 0,
   'Le chiffre de gauche = 3 dizaines.', 'رقم اليسار = 3 عشرات.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'أي عدد أكبر؟',
   '["52","47","39","50"]'::jsonb, '["52","47","39","50"]'::jsonb, 0,
   '52 a 5 dizaines, c''est le plus grand.', '52 له 5 عشرات فهو الأكبر.', 'easy', 2),
  ('Quel nombre vient juste après 29 ?', 'ما العدد الذي يأتي بعد 29 مباشرة؟',
   '["30","28","40","31"]'::jsonb, '["30","28","40","31"]'::jsonb, 0,
   'Après 29 vient 30.', 'بعد 29 يأتي 30.', 'medium', 3),
  ('Complète : 5 dizaines et 3 unités = ?', 'أكمل: 5 عشرات و3 وحدات = ؟',
   '["53","35","8","503"]'::jsonb, '["53","35","8","503"]'::jsonb, 0,
   '5 dizaines = 50, plus 3 = 53.', '5 عشرات = 50 زائد 3 = 53.', 'medium', 4),
  ('Range du plus petit au plus grand : 40, 14, 41', 'رتّب من الأصغر إلى الأكبر: 40، 14، 41',
   '["14, 40, 41","40, 41, 14","41, 40, 14","14, 41, 40"]'::jsonb, '["14, 40, 41","40, 41, 14","41, 40, 14","14, 41, 40"]'::jsonb, 0,
   '14 < 40 < 41.', '14 < 40 < 41.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-100'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 3 + 2', 'احسب: 3 + 2',
   '["5","6","4","1"]'::jsonb, '["5","6","4","1"]'::jsonb, 0, '3 + 2 = 5.', '3 + 2 = 5.', 'easy', 1),
  ('Calcule : 6 + 4', 'احسب: 6 + 4',
   '["10","9","11","2"]'::jsonb, '["10","9","11","2"]'::jsonb, 0, '6 + 4 = 10.', '6 + 4 = 10.', 'easy', 2),
  ('Calcule : 7 + 0', 'احسب: 7 + 0',
   '["7","0","8","70"]'::jsonb, '["7","0","8","70"]'::jsonb, 0, 'Ajouter 0 ne change rien.', 'إضافة 0 لا تغيّر شيئًا.', 'medium', 3),
  ('Calcule : 8 + 5', 'احسب: 8 + 5',
   '["13","12","14","3"]'::jsonb, '["13","12","14","3"]'::jsonb, 0, '8 + 5 = 13.', '8 + 5 = 13.', 'medium', 4),
  ('23 + 10 = ?', '23 + 10 = ؟',
   '["33","24","32","13"]'::jsonb, '["33","24","32","13"]'::jsonb, 0, 'Ajouter 10 = +1 dizaine.', 'إضافة 10 = عشرة واحدة.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'addition'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 5 − 2', 'احسب: 5 − 2',
   '["3","2","7","4"]'::jsonb, '["3","2","7","4"]'::jsonb, 0, '5 − 2 = 3.', '5 − 2 = 3.', 'easy', 1),
  ('Calcule : 8 − 0', 'احسب: 8 − 0',
   '["8","0","7","80"]'::jsonb, '["8","0","7","80"]'::jsonb, 0, 'Enlever 0 ne change rien.', 'إزالة 0 لا تغيّر شيئًا.', 'easy', 2),
  ('Calcule : 6 − 6', 'احسب: 6 − 6',
   '["0","6","12","1"]'::jsonb, '["0","6","12","1"]'::jsonb, 0, 'Un nombre moins lui-même = 0.', 'عدد ناقص نفسه = 0.', 'medium', 3),
  ('Calcule : 10 − 4', 'احسب: 10 − 4',
   '["6","7","5","14"]'::jsonb, '["6","7","5","14"]'::jsonb, 0, '10 − 4 = 6.', '10 − 4 = 6.', 'medium', 4),
  ('J''ai 9 billes, j''en perds 3. Il me reste…', 'لديّ 9 كرات فقدت 3. يبقى…',
   '["6","12","3","9"]'::jsonb, '["6","12","3","9"]'::jsonb, 0, '9 − 3 = 6.', '9 − 3 = 6.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'soustraction'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de côtés a un triangle ?', 'كم ضلعًا للمثلث؟',
   '["3","4","5","0"]'::jsonb, '["3","4","5","0"]'::jsonb, 0, 'Le triangle a 3 côtés.', 'للمثلث 3 أضلاع.', 'easy', 1),
  ('Quelle forme n''a pas de coin ?', 'أي شكل بلا زوايا؟',
   '["le rond","le carré","le triangle","le rectangle"]'::jsonb, '["الدائرة","المربع","المثلث","المستطيل"]'::jsonb, 0,
   'Le rond est tout arrondi, sans coin.', 'الدائرة مستديرة بلا زوايا.', 'easy', 2),
  ('Combien de côtés a un carré ?', 'كم ضلعًا للمربع؟',
   '["4","3","5","6"]'::jsonb, '["4","3","5","6"]'::jsonb, 0, 'Le carré a 4 côtés.', 'للمربع 4 أضلاع.', 'medium', 3),
  ('Une porte a la forme d''un…', 'الباب له شكل…',
   '["rectangle","rond","triangle","carré"]'::jsonb, '["مستطيل","دائرة","مثلث","مربع"]'::jsonb, 0,
   'La porte est un rectangle (côtés longs et courts).', 'الباب مستطيل.', 'medium', 4),
  ('Le carré a tous ses côtés…', 'المربع كل أضلاعه…',
   '["égaux","différents","arrondis","de 3"]'::jsonb, '["متساوية","مختلفة","مستديرة","ثلاثة"]'::jsonb, 0,
   'Le carré a 4 côtés égaux.', 'المربع له 4 أضلاع متساوية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'formes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 2AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 356, combien de centaines ?', 'في 356، كم مئة؟',
   '["3","5","6","356"]'::jsonb, '["3","5","6","356"]'::jsonb, 0, 'Le chiffre de gauche = 3 centaines.', 'رقم اليسار = 3 مئات.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'أي عدد أكبر؟',
   '["420","399","350","401"]'::jsonb, '["420","399","350","401"]'::jsonb, 0, '420 a 4 centaines.', '420 له 4 مئات.', 'easy', 2),
  ('100 = combien de dizaines ?', '100 = كم عشرة؟',
   '["10","100","1","1000"]'::jsonb, '["10","100","1","1000"]'::jsonb, 0, '100 = 10 dizaines.', '100 = 10 عشرات.', 'medium', 3),
  ('Comment se lit 205 ?', 'كيف يُقرأ 205؟',
   '["deux cent cinq","deux cent cinquante","vingt-cinq","deux mille cinq"]'::jsonb, '["مئتان وخمسة","مئتان وخمسون","خمسة وعشرون","ألفان وخمسة"]'::jsonb, 0,
   '205 = deux cent cinq.', '205 = مئتان وخمسة.', 'medium', 4),
  ('Range dans l''ordre croissant : 250, 205, 502', 'رتّب تصاعديًا: 250، 205، 502',
   '["205, 250, 502","250, 205, 502","502, 250, 205","205, 502, 250"]'::jsonb, '["205, 250, 502","250, 205, 502","502, 250, 205","205, 502, 250"]'::jsonb, 0,
   '205 < 250 < 502.', '205 < 250 < 502.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-1000'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('27 + 15 = ?', '27 + 15 = ؟',
   '["42","32","41","52"]'::jsonb, '["42","32","41","52"]'::jsonb, 0, '7+5=12 (retenue), puis 2+1+1=4 → 42.', '7+5=12 ثم 4 → 42.', 'medium', 1),
  ('Dans 8 + 5 = 13, la retenue est…', 'في 8 + 5 = 13، الاحتفاظ هو…',
   '["1","3","8","5"]'::jsonb, '["1","3","8","5"]'::jsonb, 0, 'On écrit 3, on retient 1.', 'نكتب 3 ونحتفظ بـ 1.', 'medium', 2),
  ('45 + 5 = ?', '45 + 5 = ؟',
   '["50","40","55","4"]'::jsonb, '["50","40","55","4"]'::jsonb, 0, '45 + 5 = 50.', '45 + 5 = 50.', 'easy', 3),
  ('On commence l''addition par la colonne des…', 'نبدأ الجمع من عمود…',
   '["unités","dizaines","centaines","milliers"]'::jsonb, '["الوحدات","العشرات","المئات","الآلاف"]'::jsonb, 0,
   'On commence par les unités (à droite).', 'نبدأ بالوحدات (يمينًا).', 'easy', 4),
  ('38 + 24 = ?', '38 + 24 = ؟',
   '["62","52","61","63"]'::jsonb, '["62","52","61","63"]'::jsonb, 0, '8+4=12, retenue; 3+2+1=6 → 62.', '8+4=12 ثم 6 → 62.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'addition-retenue'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('42 − 15 = ?', '42 − 15 = ؟',
   '["27","37","33","28"]'::jsonb, '["27","37","33","28"]'::jsonb, 0, 'On emprunte : 12−5=7, 3−1=2 → 27.', 'نستلف: 27.', 'medium', 1),
  ('Pour vérifier 42 − 15 = 27, on calcule…', 'للتحقق من 42 − 15 = 27 نحسب…',
   '["27 + 15","27 − 15","42 + 15","42 + 27"]'::jsonb, '["27 + 15","27 − 15","42 + 15","42 + 27"]'::jsonb, 0,
   '27 + 15 = 42 : c''est juste.', '27 + 15 = 42: صحيح.', 'medium', 2),
  ('50 − 20 = ?', '50 − 20 = ؟',
   '["30","70","20","40"]'::jsonb, '["30","70","20","40"]'::jsonb, 0, '50 − 20 = 30.', '50 − 20 = 30.', 'easy', 3),
  ('Le plus grand nombre se met…', 'العدد الأكبر يوضع…',
   '["en haut","en bas","à droite","au milieu"]'::jsonb, '["في الأعلى","في الأسفل","يمينًا","في الوسط"]'::jsonb, 0,
   'Le plus grand nombre en haut.', 'العدد الأكبر في الأعلى.', 'easy', 4),
  ('63 − 28 = ?', '63 − 28 = ؟',
   '["35","45","41","31"]'::jsonb, '["35","45","41","31"]'::jsonb, 0, 'On emprunte : 13−8=5, 5−2=3 → 35.', 'نستلف: 35.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'soustraction-retenue'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('3 × 4 veut dire…', '3 × 4 تعني…',
   '["4 + 4 + 4","3 + 4","4 − 3","3 + 3"]'::jsonb, '["4 + 4 + 4","3 + 4","4 − 3","3 + 3"]'::jsonb, 0,
   '3 fois 4 = 4+4+4 = 12.', '3 مرات 4 = 12.', 'easy', 1),
  ('7 × 1 = ?', '7 × 1 = ؟',
   '["7","1","8","70"]'::jsonb, '["7","1","8","70"]'::jsonb, 0, 'Multiplier par 1 ne change rien.', 'الضرب في 1 لا يغيّر.', 'easy', 2),
  ('8 × 0 = ?', '8 × 0 = ؟',
   '["0","8","80","1"]'::jsonb, '["0","8","80","1"]'::jsonb, 0, 'Multiplier par 0 donne 0.', 'الضرب في 0 = 0.', 'medium', 3),
  ('5 × 3 = ?', '5 × 3 = ؟',
   '["15","8","10","53"]'::jsonb, '["15","8","10","53"]'::jsonb, 0, '5 × 3 = 15.', '5 × 3 = 15.', 'medium', 4),
  ('6 × 2 = ? (doubler 6)', '6 × 2 = ؟ (ضعف 6)',
   '["12","8","62","16"]'::jsonb, '["12","8","62","16"]'::jsonb, 0, 'Doubler 6 = 12.', 'ضعف 6 = 12.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'multiplication'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('1 heure = combien de minutes ?', '1 ساعة = كم دقيقة؟',
   '["60","100","30","24"]'::jsonb, '["60","100","30","24"]'::jsonb, 0, '1 heure = 60 minutes.', '1 ساعة = 60 دقيقة.', 'easy', 1),
  ('1 mètre = combien de centimètres ?', '1 متر = كم سنتيمتر؟',
   '["100","10","1000","60"]'::jsonb, '["100","10","1000","60"]'::jsonb, 0, '1 m = 100 cm.', '1 م = 100 سم.', 'easy', 2),
  ('Combien de jours dans une semaine ?', 'كم يومًا في الأسبوع؟',
   '["7","12","30","365"]'::jsonb, '["7","12","30","365"]'::jsonb, 0, 'La semaine = 7 jours.', 'الأسبوع = 7 أيام.', 'medium', 3),
  ('Qu''est-ce qui est le plus long ?', 'أيهما أطول؟',
   '["1 m","50 cm","20 cm","99 cm"]'::jsonb, '["1 م","50 سم","20 سم","99 سم"]'::jsonb, 0,
   '1 m = 100 cm > 99 cm.', '1 م = 100 سم > 99 سم.', 'medium', 4),
  ('Combien de mois dans une année ?', 'كم شهرًا في السنة؟',
   '["12","7","365","24"]'::jsonb, '["12","7","365","24"]'::jsonb, 0, 'L''année = 12 mois.', 'السنة = 12 شهرًا.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'mesures-temps'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 3AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 4 573, combien de milliers ?', 'في 4573، كم ألفًا؟',
   '["4","5","7","3"]'::jsonb, '["4","5","7","3"]'::jsonb, 0, 'Le chiffre de gauche = 4 milliers.', 'رقم اليسار = 4 آلاف.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'أي عدد أكبر؟',
   '["3 001","2 999","3 000","2 998"]'::jsonb, '["3 001","2 999","3 000","2 998"]'::jsonb, 0, '3 001 a 3 milliers.', '3001 له 3 آلاف.', 'easy', 2),
  ('1 000 = combien de centaines ?', '1000 = كم مئة؟',
   '["10","100","1","1000"]'::jsonb, '["10","100","1","1000"]'::jsonb, 0, '1 000 = 10 centaines.', '1000 = 10 مئات.', 'medium', 3),
  ('Comment se lit 4 573 ?', 'كيف يُقرأ 4573؟',
   '["quatre mille cinq cent soixante-treize","quatre cent cinquante-sept","quarante-cinq mille","quatre mille sept cent"]'::jsonb,
   '["أربعة آلاف وخمسمئة وثلاثة وسبعون","أربعمئة وسبعة وخمسون","خمسة وأربعون ألفًا","أربعة آلاف وسبعمئة"]'::jsonb, 0,
   '4 573 = quatre mille cinq cent soixante-treize.', 'أربعة آلاف وخمسمئة وثلاثة وسبعون.', 'medium', 4),
  ('3 500 se situe entre…', '3500 يقع بين…',
   '["3 000 et 4 000","2 000 et 3 000","4 000 et 5 000","3 500 et 3 600"]'::jsonb, '["3000 و4000","2000 و3000","4000 و5000","3500 و3600"]'::jsonb, 0,
   '3 500 est entre 3 000 et 4 000.', '3500 بين 3000 و4000.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'nombres-10000'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('7 × 8 = ?', '7 × 8 = ؟',
   '["56","54","63","49"]'::jsonb, '["56","54","63","49"]'::jsonb, 0, '7 × 8 = 56.', '7 × 8 = 56.', 'medium', 1),
  ('6 × 9 = ?', '6 × 9 = ؟',
   '["54","56","45","63"]'::jsonb, '["54","56","45","63"]'::jsonb, 0, '6 × 9 = 54.', '6 × 9 = 54.', 'medium', 2),
  ('Dans la table de 5, les résultats finissent par…', 'في جدول 5، النتائج تنتهي بـ…',
   '["0 ou 5","1 ou 2","toujours 5","toujours 0"]'::jsonb, '["0 أو 5","1 أو 2","دائمًا 5","دائمًا 0"]'::jsonb, 0,
   'Table de 5 : 5, 10, 15, 20…', 'جدول 5: 5، 10، 15، 20…', 'easy', 3),
  ('8 × 10 = ?', '8 × 10 = ؟',
   '["80","18","800","88"]'::jsonb, '["80","18","800","88"]'::jsonb, 0, 'Table de 10 : on ajoute un 0.', 'جدول 10: نضيف صفرًا.', 'easy', 4),
  ('Combien font 9 × 9 ?', 'كم يساوي 9 × 9؟',
   '["81","72","90","99"]'::jsonb, '["81","72","90","99"]'::jsonb, 0, '9 × 9 = 81.', '9 × 9 = 81.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'tables'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('12 ÷ 3 = ?', '12 ÷ 3 = ؟',
   '["4","3","6","9"]'::jsonb, '["4","3","6","9"]'::jsonb, 0, '12 partagé en 3 = 4.', '12 على 3 = 4.', 'easy', 1),
  ('20 ÷ 5 = ?', '20 ÷ 5 = ؟',
   '["4","5","15","10"]'::jsonb, '["4","5","15","10"]'::jsonb, 0, '20 ÷ 5 = 4.', '20 ÷ 5 = 4.', 'easy', 2),
  ('Si 3 × 4 = 12, alors 12 ÷ 4 = ?', 'إذا كان 3 × 4 = 12 فإن 12 ÷ 4 = ؟',
   '["3","4","12","8"]'::jsonb, '["3","4","12","8"]'::jsonb, 0, 'Division = contraire de multiplication.', 'القسمة عكس الضرب.', 'medium', 3),
  ('On partage 15 bonbons entre 3 enfants. Chacun a…', 'نقسم 15 حلوى على 3 أطفال. لكل واحد…',
   '["5","3","12","6"]'::jsonb, '["5","3","12","6"]'::jsonb, 0, '15 ÷ 3 = 5.', '15 ÷ 3 = 5.', 'medium', 4),
  ('13 ÷ 4 : combien reste-t-il ?', '13 ÷ 4: كم الباقي؟',
   '["1","3","0","2"]'::jsonb, '["1","3","0","2"]'::jsonb, 0, '4×3=12, reste 1.', '4×3=12، الباقي 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'division'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Périmètre d''un triangle de côtés 3, 4, 5 cm ?', 'محيط مثلث أضلاعه 3 و4 و5 سم؟',
   '["12 cm","9 cm","15 cm","60 cm"]'::jsonb, '["12 سم","9 سم","15 سم","60 سم"]'::jsonb, 0, '3+4+5 = 12 cm.', '3+4+5 = 12 سم.', 'easy', 1),
  ('Périmètre d''un carré de côté 5 cm ?', 'محيط مربع ضلعه 5 سم؟',
   '["20 cm","25 cm","10 cm","5 cm"]'::jsonb, '["20 سم","25 سم","10 سم","5 سم"]'::jsonb, 0, '4 × 5 = 20 cm.', '4 × 5 = 20 سم.', 'easy', 2),
  ('Le périmètre, c''est…', 'المحيط هو…',
   '["le tour de la figure","l''intérieur","la hauteur","le nombre de côtés"]'::jsonb, '["دوران الشكل","الداخل","الارتفاع","عدد الأضلاع"]'::jsonb, 0,
   'Le périmètre = le tour.', 'المحيط = الدوران.', 'medium', 3),
  ('Rectangle 6 cm et 4 cm : périmètre ?', 'مستطيل 6 سم و4 سم: المحيط؟',
   '["20 cm","24 cm","10 cm","48 cm"]'::jsonb, '["20 سم","24 سم","10 سم","48 سم"]'::jsonb, 0, '2×(6+4)=20 cm.', '2×(6+4)=20 سم.', 'medium', 4),
  ('Le périmètre se mesure en…', 'المحيط يُقاس بـ…',
   '["cm","cm²","kg","litres"]'::jsonb, '["سم","سم²","كغ","لترات"]'::jsonb, 0, 'Le périmètre est une longueur (cm).', 'المحيط طول (سم).', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'perimetre'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('« en tout » indique souvent…', '«في المجموع» تدل غالبًا على…',
   '["une addition","une soustraction","une division","rien"]'::jsonb, '["الجمع","الطرح","القسمة","لا شيء"]'::jsonb, 0,
   '« en tout » → addition.', '«في المجموع» ← الجمع.', 'easy', 1),
  ('« partager également » indique…', '«نوزّع بالتساوي» تدل على…',
   '["une division","une addition","une multiplication","une soustraction"]'::jsonb, '["القسمة","الجمع","الضرب","الطرح"]'::jsonb, 0,
   '« partager » → division.', '«نقسم» ← القسمة.', 'easy', 2),
  ('4 caisses de 8 oranges : combien en tout ?', '4 صناديق من 8 برتقالات: كم في المجموع؟',
   '["32","12","4","24"]'::jsonb, '["32","12","4","24"]'::jsonb, 0, '4 × 8 = 32.', '4 × 8 = 32.', 'medium', 3),
  ('Yacine a 50 DA, il dépense 30 DA. Il reste…', 'ياسين لديه 50 دج أنفق 30 دج. يبقى…',
   '["20 DA","80 DA","30 DA","10 DA"]'::jsonb, '["20 دج","80 دج","30 دج","10 دج"]'::jsonb, 0, '50 − 30 = 20 DA.', '50 − 30 = 20 دج.', 'medium', 4),
  ('« de moins que » indique…', '«أقل بـ» تدل على…',
   '["une soustraction","une addition","une multiplication","une division"]'::jsonb, '["الطرح","الجمع","الضرب","القسمة"]'::jsonb, 0,
   '« de moins » → soustraction.', '«أقل بـ» ← الطرح.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'problemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 4AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 1 254 630, que vaut le chiffre 2 ?', 'في 1254630، كم يساوي الرقم 2؟',
   '["200 000","2 000","20 000","2 000 000"]'::jsonb, '["200 000","2 000","20 000","2 000 000"]'::jsonb, 0,
   'Le 2 est au rang des centaines de mille.', 'الرقم 2 في مرتبة مئات الآلاف.', 'medium', 1),
  ('Quel est le plus grand ?', 'أي عدد أكبر؟',
   '["1 254 630","998 000","875 999","1 000 000"]'::jsonb, '["1 254 630","998 000","875 999","1 000 000"]'::jsonb, 0,
   '1 254 630 a 7 chiffres.', '1254630 له 7 أرقام.', 'easy', 2),
  ('Un million s''écrit…', 'المليون يُكتب…',
   '["1 000 000","100 000","10 000","1 000"]'::jsonb, '["1 000 000","100 000","10 000","1 000"]'::jsonb, 0,
   'Un million = 6 zéros.', 'المليون = 6 أصفار.', 'easy', 3),
  ('On regroupe les chiffres par… pour lire', 'نجمع الأرقام… لتسهيل القراءة',
   '["3","2","4","5"]'::jsonb, '["3","2","4","5"]'::jsonb, 0,
   'Par classes de 3 chiffres.', 'بأقسام من 3 أرقام.', 'medium', 4),
  ('Combien de chiffres a le nombre "deux cent mille" ?', 'كم رقمًا للعدد «مئتا ألف»؟',
   '["6","5","4","7"]'::jsonb, '["6","5","4","7"]'::jsonb, 0,
   '200 000 a 6 chiffres.', '200000 له 6 أرقام.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 3/4, quel est le dénominateur ?', 'في 3/4، ما المقام؟',
   '["4","3","7","1"]'::jsonb, '["4","3","7","1"]'::jsonb, 0, 'Le nombre du bas = dénominateur.', 'العدد السفلي = المقام.', 'easy', 1),
  ('Quelle fraction est la moitié ?', 'أي كسر يمثل النصف؟',
   '["1/2","1/4","3/4","2/3"]'::jsonb, '["1/2","1/4","3/4","2/3"]'::jsonb, 0, '1/2 = la moitié.', '1/2 = النصف.', 'easy', 2),
  ('4/4 vaut…', '4/4 يساوي…',
   '["1","4","0","1/2"]'::jsonb, '["1","4","0","1/2"]'::jsonb, 0, 'Haut = bas → la fraction vaut 1.', 'البسط = المقام ← يساوي 1.', 'medium', 3),
  ('Une pizza en 4 parts, j''en prends 3 :', 'بيتزا في 4 أجزاء آخذ 3:',
   '["3/4","4/3","3/1","1/4"]'::jsonb, '["3/4","4/3","3/1","1/4"]'::jsonb, 0, '3 parts sur 4 = 3/4.', '3 من 4 = 3/4.', 'medium', 4),
  ('2/3 comparé à 1 :', '2/3 مقارنة بـ 1:',
   '["plus petit que 1","plus grand que 1","égal à 1","égal à 2"]'::jsonb, '["أصغر من 1","أكبر من 1","يساوي 1","يساوي 2"]'::jsonb, 0,
   'Haut < bas → plus petit que 1.', 'البسط < المقام ← أصغر من 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'fractions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 3,5, quelle est la partie décimale ?', 'في 3.5، ما الجزء العشري؟',
   '["5","3","35","0"]'::jsonb, '["5","3","35","0"]'::jsonb, 0, 'Après la virgule = 5.', 'بعد الفاصلة = 5.', 'easy', 1),
  ('Le premier chiffre après la virgule, ce sont les…', 'أول رقم بعد الفاصلة هو…',
   '["dixièmes","unités","dizaines","centièmes"]'::jsonb, '["الأعشار","الوحدات","العشرات","أجزاء المئة"]'::jsonb, 0,
   '1er après la virgule = dixièmes.', 'أول رقم = الأعشار.', 'medium', 2),
  ('2,50 DA = ?', '2.50 دج = ؟',
   '["2 dinars et 50 centimes","250 dinars","2 dinars et 5 centimes","25 dinars"]'::jsonb, '["2 دينار و50 سنتيمًا","250 دينارًا","2 دينار و5 سنتيمات","25 دينارًا"]'::jsonb, 0,
   '2,50 = 2 dinars et 50 centimes.', '2.50 = 2 دينار و50 سنتيمًا.', 'medium', 3),
  ('Compare : 4,2 … 3,9', 'قارن: 4.2 … 3.9',
   '["4,2 > 3,9","4,2 < 3,9","4,2 = 3,9","impossible"]'::jsonb, '["4.2 > 3.9","4.2 < 3.9","4.2 = 3.9","مستحيل"]'::jsonb, 0,
   'Partie entière 4 > 3.', 'الجزء الصحيح 4 > 3.', 'easy', 4),
  ('3,5 est égal à…', '3.5 يساوي…',
   '["3,50","3,05","35","0,35"]'::jsonb, '["3.50","3.05","35","0.35"]'::jsonb, 0,
   'On peut ajouter un zéro à droite.', 'يمكن إضافة صفر على اليمين.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 5 + 3 × 2', 'احسب: 5 + 3 × 2',
   '["11","16","13","10"]'::jsonb, '["11","16","13","10"]'::jsonb, 0, 'Multiplication d''abord.', 'الضرب أولاً.', 'medium', 1),
  ('Le contraire de la multiplication est…', 'عكس الضرب هو…',
   '["la division","l''addition","la soustraction","rien"]'::jsonb, '["القسمة","الجمع","الطرح","لا شيء"]'::jsonb, 0,
   'Division = contraire de ×.', 'القسمة عكس الضرب.', 'easy', 2),
  ('45 + 27 = ?', '45 + 27 = ؟',
   '["72","62","71","73"]'::jsonb, '["72","62","71","73"]'::jsonb, 0, '45 + 27 = 72.', '45 + 27 = 72.', 'easy', 3),
  ('Dans un calcul mélangé, on fait d''abord…', 'في حساب مختلط نبدأ بـ…',
   '["× et ÷","+ et −","de gauche à droite","au hasard"]'::jsonb, '["× و÷","+ و−","من اليسار","عشوائيًا"]'::jsonb, 0,
   'Multiplication/division avant addition/soustraction.', 'الضرب والقسمة قبل الجمع والطرح.', 'medium', 4),
  ('6 × 7 = ?', '6 × 7 = ؟',
   '["42","36","48","13"]'::jsonb, '["42","36","48","13"]'::jsonb, 0, '6 × 7 = 42.', '6 × 7 = 42.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Aire d''un carré de côté 5 cm ?', 'مساحة مربع ضلعه 5 سم؟',
   '["25 cm²","20 cm²","10 cm²","25 cm"]'::jsonb, '["25 سم²","20 سم²","10 سم²","25 سم"]'::jsonb, 0, '5 × 5 = 25 cm².', '5 × 5 = 25 سم².', 'easy', 1),
  ('Aire d''un rectangle 6 cm × 4 cm ?', 'مساحة مستطيل 6 سم × 4 سم؟',
   '["24 cm²","20 cm²","10 cm²","24 cm"]'::jsonb, '["24 سم²","20 سم²","10 سم²","24 سم"]'::jsonb, 0, '6 × 4 = 24 cm².', '6 × 4 = 24 سم².', 'easy', 2),
  ('L''aire se mesure en…', 'المساحة تُقاس بـ…',
   '["cm²","cm","kg","min"]'::jsonb, '["سم²","سم","كغ","دقيقة"]'::jsonb, 0, 'L''aire est une surface : cm².', 'المساحة سطح: سم².', 'medium', 3),
  ('L''aire, c''est…', 'المساحة هي…',
   '["l''intérieur de la figure","le tour","le nombre de côtés","la hauteur"]'::jsonb, '["داخل الشكل","الدوران","عدد الأضلاع","الارتفاع"]'::jsonb, 0,
   'L''aire = la surface intérieure.', 'المساحة = السطح الداخلي.', 'medium', 4),
  ('Aire d''un carré de côté 10 cm ?', 'مساحة مربع ضلعه 10 سم؟',
   '["100 cm²","40 cm²","20 cm²","1000 cm²"]'::jsonb, '["100 سم²","40 سم²","20 سم²","1000 سم²"]'::jsonb, 0, '10 × 10 = 100 cm².', '10 × 10 = 100 سم².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'aires'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un angle droit ressemble au coin d''une…', 'الزاوية القائمة تشبه زاوية…',
   '["feuille","balle","assiette","roue"]'::jsonb, '["ورقة","كرة","صحن","عجلة"]'::jsonb, 0,
   'L''angle droit = coin d''une feuille.', 'الزاوية القائمة = زاوية ورقة.', 'easy', 1),
  ('Un angle plus fermé que l''angle droit est…', 'زاوية أكثر انغلاقًا من القائمة هي…',
   '["aigu","obtus","plat","rond"]'::jsonb, '["حادة","منفرجة","مستقيمة","دائرية"]'::jsonb, 0,
   'Plus fermé = aigu.', 'أكثر انغلاقًا = حادة.', 'easy', 2),
  ('Un angle plus ouvert que l''angle droit est…', 'زاوية أكثر انفتاحًا من القائمة هي…',
   '["obtus","aigu","droit","nul"]'::jsonb, '["منفرجة","حادة","قائمة","معدومة"]'::jsonb, 0,
   'Plus ouvert = obtus.', 'أكثر انفتاحًا = منفرجة.', 'medium', 3),
  ('Quel outil sert à tracer un angle droit ?', 'أي أداة ترسم زاوية قائمة؟',
   '["l''équerre","la règle seule","le compas","la gomme"]'::jsonb, '["الكوس","المسطرة وحدها","البركار","الممحاة"]'::jsonb, 0,
   'L''équerre trace/vérifie l''angle droit.', 'الكوس يرسم الزاوية القائمة.', 'medium', 4),
  ('Pour montrer un angle droit, on dessine…', 'لبيان الزاوية القائمة نرسم…',
   '["un petit carré","un rond","une flèche","une croix"]'::jsonb, '["مربعًا صغيرًا","دائرة","سهمًا","صليبًا"]'::jsonb, 0,
   'Un petit carré dans le coin.', 'مربعًا صغيرًا في الزاوية.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'angles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
