-- ===============================================================
-- Migration: 20260721_018_lessons_maths_exam_years
--
-- Bilingual lessons (FR + AR) for every remaining maths chapter of the
-- three exam years: 5AP (fin de cycle), 4AM (BEM), 3AS (BAC).
-- Complements migration 017 which seeded fractions/pythagore/rationnels/
-- equations/suites. Idempotent: plain UPDATEs, safe to re-run.
-- ===============================================================

-- ============ 5AP ============

update public.chapters c set
  lesson_fr = 'LES GRANDS NOMBRES

Un nombre s''écrit avec des CLASSES de 3 chiffres :
… millions | milliers | unités simples
Exemple : 4 256 807 se lit « quatre millions deux cent cinquante-six mille huit cent sept ».

TABLEAU DE NUMÉRATION
Chaque chiffre a une valeur selon sa position :
Dans 4 256 807 → le 2 vaut 200 000 (centaines de mille).

COMPARER DEUX GRANDS NOMBRES
1. Celui qui a le PLUS de chiffres est le plus grand.
2. À nombre de chiffres égal, on compare chiffre par chiffre en partant de la gauche.
Exemple : 530 200 > 529 999 car 3 > 2 au rang des dizaines de mille.

À RETENIR : on regroupe les chiffres par 3 depuis la droite pour lire facilement.',
  lesson_ar = 'الأعداد الكبيرة

يُكتب العدد بأقسام من 3 أرقام:
… الملايين | الآلاف | الوحدات البسيطة
مثال: 4 256 807 يُقرأ «أربعة ملايين ومئتان وستة وخمسون ألفًا وثمانمئة وسبعة».

جدول المراتب: لكل رقم قيمة حسب موقعه.
في 4 256 807 ← الرقم 2 يساوي 200 000.

مقارنة عددين كبيرين
1. العدد الذي يملك أرقامًا أكثر هو الأكبر.
2. عند التساوي نقارن رقمًا رقمًا من اليسار.
مثال: 530 200 > 529 999.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres';

update public.chapters c set
  lesson_fr = 'LES NOMBRES DÉCIMAUX

Un nombre décimal a une PARTIE ENTIÈRE et une PARTIE DÉCIMALE séparées par une virgule :
12,45 → 12 est la partie entière, 45 la partie décimale.
4 = 4 dixièmes (0,4) ; 5 = 5 centièmes (0,05).

COMPARER
On compare d''abord les parties entières, puis chiffre par chiffre après la virgule :
3,25 < 3,4 car 2 dixièmes < 4 dixièmes.
Attention : 3,4 = 3,40 (on peut ajouter des zéros à droite).

ADDITIONNER / SOUSTRAIRE
On aligne les virgules l''une sous l''autre :
  12,45
+  3,80
= 16,25

À RETENIR : la virgule sépare les unités des dixièmes — bien l''aligner dans les opérations.',
  lesson_ar = 'الأعداد العشرية

العدد العشري له جزء صحيح وجزء عشري تفصل بينهما فاصلة:
12.45 ← 12 هو الجزء الصحيح و45 الجزء العشري.
4 = 4 أعشار (0.4) ؛ 5 = 5 أجزاء من مئة (0.05).

المقارنة
نقارن الجزأين الصحيحين أولاً، ثم رقمًا رقمًا بعد الفاصلة:
3.25 < 3.4 لأن عُشرين < 4 أعشار.
ملاحظة: 3.4 = 3.40.

الجمع والطرح: نُحاذي الفاصلة تحت الفاصلة ثم نحسب.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'nombres-decimaux';

update public.chapters c set
  lesson_fr = 'LA PROPORTIONNALITÉ

Deux grandeurs sont PROPORTIONNELLES quand on passe de l''une à l''autre en multipliant toujours par le même nombre (le coefficient).

Exemple : 1 baguette coûte 15 DA.
2 baguettes → 30 DA, 5 baguettes → 75 DA. Le coefficient est 15.

LA RÈGLE DE TROIS
3 cahiers coûtent 120 DA. Combien coûtent 7 cahiers ?
1. Prix d''un cahier : 120 ÷ 3 = 40 DA (passage à l''unité).
2. Prix de 7 cahiers : 40 × 7 = 280 DA.

RECONNAÎTRE UN TABLEAU PROPORTIONNEL
Les quotients colonne par colonne doivent être ÉGAUX :
2→10, 3→15, 5→25 : oui (×5 partout).
2→10, 3→14 : non (×5 puis ×4,67).

À RETENIR : proportionnel = même multiplicateur partout.',
  lesson_ar = 'التناسبية

مقداران متناسبان إذا انتقلنا من الأول إلى الثاني بالضرب دائمًا في نفس العدد (معامل التناسب).

مثال: خبزة واحدة بـ 15 دج.
خبزتان ← 30 دج، 5 خبزات ← 75 دج. المعامل هو 15.

قاعدة الثلاثة (المرور بالوحدة)
3 كراريس بـ 120 دج. كم ثمن 7 كراريس؟
1. ثمن الكراس: 120 ÷ 3 = 40 دج.
2. ثمن 7 كراريس: 40 × 7 = 280 دج.

جدول تناسبي: خارج القسمة متساوٍ في كل الأعمدة.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

update public.chapters c set
  lesson_fr = 'LES MESURES

LONGUEURS — unité principale : le mètre (m)
km | hm | dam | m | dm | cm | mm
1 km = 1 000 m ; 1 m = 100 cm.
Pour convertir : on décale la virgule d''un rang par colonne.
3,5 km = 3 500 m.

MASSES — unité principale : le gramme (g)
kg | hg | dag | g | dg | cg | mg
1 kg = 1 000 g. Une pastèque ≈ 4 kg, une pièce de monnaie ≈ 7 g.

CAPACITÉS — unité principale : le litre (L)
1 L = 100 cL = 1 000 mL. Une bouteille d''eau = 1,5 L.

À RETENIR : toujours vérifier que les deux mesures sont dans la MÊME unité avant de comparer ou d''additionner.',
  lesson_ar = 'القياس

الأطوال — الوحدة الأساسية: المتر (م)
كم | هم | دام | م | دسم | سم | ملم
1 كم = 1000 م ؛ 1 م = 100 سم.
للتحويل ننقل الفاصلة رتبة واحدة لكل عمود: 3.5 كم = 3500 م.

الكتل — الوحدة الأساسية: الغرام (غ)
1 كغ = 1000 غ. دلاعة ≈ 4 كغ، قطعة نقدية ≈ 7 غ.

السعات — الوحدة الأساسية: اللتر (ل)
1 ل = 100 سل = 1000 مل.

تذكر: قبل المقارنة أو الجمع نوحّد الوحدة دائمًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'mesures';

update public.chapters c set
  lesson_fr = 'PÉRIMÈTRES ET AIRES

LE PÉRIMÈTRE = la longueur du tour d''une figure (en m, cm…).
• Carré de côté c : P = 4 × c
• Rectangle : P = 2 × (L + l)
Exemple : rectangle de 8 cm sur 5 cm → P = 2 × 13 = 26 cm.

L''AIRE = la surface occupée (en m², cm²…).
• Carré : A = c × c
• Rectangle : A = L × l
• Triangle : A = (base × hauteur) ÷ 2
Exemple : rectangle 8 × 5 → A = 40 cm².

NE PAS CONFONDRE
Le périmètre se mesure en cm, l''aire en cm².
Deux figures peuvent avoir le même périmètre et des aires différentes !

À RETENIR : périmètre = le tour ; aire = l''intérieur.',
  lesson_ar = 'المحيطات والمساحات

المحيط = طول الدوران حول الشكل (بالمتر أو السم).
• مربع ضلعه c: المحيط = 4 × c
• مستطيل: المحيط = 2 × (الطول + العرض)
مثال: مستطيل 8 سم × 5 سم ← المحيط = 26 سم.

المساحة = السطح المشغول (بالم² أو السم²).
• المربع: c × c
• المستطيل: الطول × العرض
• المثلث: (القاعدة × الارتفاع) ÷ 2
مثال: مستطيل 8 × 5 ← المساحة = 40 سم².

لا تخلط: المحيط بالسم والمساحة بالسم².'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'perimetres-aires';

update public.chapters c set
  lesson_fr = 'FIGURES ET SOLIDES

LES POLYGONES (figures à côtés droits)
• Triangle : 3 côtés — équilatéral (3 égaux), isocèle (2 égaux), rectangle (1 angle droit).
• Quadrilatères : carré (4 côtés égaux + 4 angles droits), rectangle, losange.

LE CERCLE
• Centre O, RAYON r (du centre au bord), DIAMÈTRE d = 2 × r.

LES SOLIDES
• Cube : 6 faces carrées, 8 sommets, 12 arêtes.
• Pavé droit : 6 faces rectangulaires.
• Cylindre, cône, boule : surfaces courbes.

VOCABULAIRE : face (surface plate), arête (segment entre 2 faces), sommet (point de rencontre).

À RETENIR : un carré est aussi un rectangle ET un losange particulier.',
  lesson_ar = 'الأشكال الهندسية والمجسمات

المضلعات
• المثلث: 3 أضلاع — متقايس الأضلاع، متقايس الساقين، قائم.
• الرباعيات: المربع (4 أضلاع متقايسة + 4 زوايا قائمة)، المستطيل، المعيّن.

الدائرة
المركز O، نصف القطر r، القطر = 2 × r.

المجسمات
• المكعب: 6 أوجه مربعة، 8 رؤوس، 12 حرفًا.
• متوازي المستطيلات: 6 أوجه مستطيلة.
• الأسطوانة والمخروط والكرة: سطوح منحنية.

تذكر: المربع هو مستطيل خاص ومعيّن خاص في آن واحد.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'geometrie';

update public.chapters c set
  lesson_fr = 'RÉSOUDRE UN PROBLÈME — LA MÉTHODE

ÉTAPE 1 — LIRE
Lire l''énoncé DEUX fois. Souligner la question.

ÉTAPE 2 — CHERCHER LES DONNÉES
Quelles informations sont utiles ? Y en a-t-il d''inutiles ?

ÉTAPE 3 — CHOISIR L''OPÉRATION
• « en tout », « ensemble » → addition
• « reste », « différence », « de plus que » → soustraction
• « chacun … fois », « par paquet de » → multiplication
• « partager », « répartir » → division

ÉTAPE 4 — CALCULER PUIS VÉRIFIER
Poser l''opération, écrire la PHRASE RÉPONSE avec l''unité.
Se demander : « ma réponse est-elle logique ? »

EXEMPLE : Un car transporte 4 groupes de 27 élèves. Combien d''élèves en tout ?
4 × 27 = 108. → Le car transporte 108 élèves.',
  lesson_ar = 'حل المشكلات — الطريقة

الخطوة 1 — القراءة: نقرأ النص مرتين ونسطّر تحت السؤال.

الخطوة 2 — البحث عن المعطيات المفيدة.

الخطوة 3 — اختيار العملية
• «في المجموع»، «معًا» ← الجمع
• «الباقي»، «الفرق» ← الطرح
• «كل واحد … مرة» ← الضرب
• «نقسم»، «نوزع» ← القسمة

الخطوة 4 — الحساب ثم التحقق
ننجز العملية ونكتب جملة الجواب مع الوحدة، ونتساءل: هل الجواب منطقي؟

مثال: حافلة تنقل 4 أفواج من 27 تلميذًا. كم تلميذًا في المجموع؟
4 × 27 = 108 تلميذًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'problemes';

-- ============ 4AM ============

update public.chapters c set
  lesson_fr = 'CALCUL LITTÉRAL ET IDENTITÉS REMARQUABLES

DÉVELOPPER = transformer un produit en somme.
• Simple distributivité : k(a + b) = ka + kb
• Double distributivité : (a + b)(c + d) = ac + ad + bc + bd

LES 3 IDENTITÉS REMARQUABLES
• (a + b)² = a² + 2ab + b²
• (a − b)² = a² − 2ab + b²
• (a + b)(a − b) = a² − b²

Exemples :
(x + 3)² = x² + 6x + 9
(2x − 5)² = 4x² − 20x + 25
(x + 4)(x − 4) = x² − 16

FACTORISER = transformer une somme en produit (sens inverse).
• Facteur commun : 3x² + 6x = 3x(x + 2)
• Avec les identités : x² − 25 = (x + 5)(x − 5)

À RETENIR AU BEM : reconnaître a² − b² est le réflexe le plus payant.',
  lesson_ar = 'الحساب الحرفي والمتطابقات الشهيرة

النشر = تحويل جداء إلى مجموع.
• التوزيعية البسيطة: k(a + b) = ka + kb
• التوزيعية المضاعفة: (a + b)(c + d) = ac + ad + bc + bd

المتطابقات الشهيرة الثلاث
• (a + b)² = a² + 2ab + b²
• (a − b)² = a² − 2ab + b²
• (a + b)(a − b) = a² − b²

أمثلة:
(x + 3)² = x² + 6x + 9
(x + 4)(x − 4) = x² − 16

التحليل = تحويل مجموع إلى جداء.
• العامل المشترك: 3x² + 6x = 3x(x + 2)
• بالمتطابقات: x² − 25 = (x + 5)(x − 5)'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral';

update public.chapters c set
  lesson_fr = 'ÉQUATIONS ET INÉQUATIONS DU 1er DEGRÉ

RÉSOUDRE UNE ÉQUATION
Isoler x en faisant la même opération des deux côtés :
7x − 4 = 3x + 12
7x − 3x = 12 + 4
4x = 16 → x = 4

ÉQUATION PRODUIT NUL
Un produit est nul si l''un des facteurs est nul :
(x − 2)(x + 5) = 0 → x = 2 ou x = −5

LES INÉQUATIONS
Mêmes règles, avec UNE exception capitale :
quand on multiplie ou divise par un nombre NÉGATIF, on CHANGE le sens de l''inégalité.
−2x < 10 → x > −5

On représente les solutions sur une droite graduée (crochet vers les solutions).

À RETENIR : toujours vérifier la solution en la remplaçant dans l''équation de départ.',
  lesson_ar = 'المعادلات والمتراجحات من الدرجة الأولى

حل معادلة: نعزل x بإجراء نفس العملية على الطرفين:
7x − 4 = 3x + 12
4x = 16 ← x = 4

معادلة جداء معدوم
الجداء معدوم إذا انعدم أحد عوامله:
(x − 2)(x + 5) = 0 ← x = 2 أو x = −5

المتراجحات
نفس القواعد مع استثناء مهم:
عند الضرب أو القسمة على عدد سالب نغيّر اتجاه المتراجحة.
−2x < 10 ← x > −5

نمثل الحلول على مستقيم مدرج.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'equations';

update public.chapters c set
  lesson_fr = 'SYSTÈMES DE DEUX ÉQUATIONS

Un système : trouver x ET y qui vérifient DEUX équations à la fois.
{ x + y = 10
{ 2x − y = 2

MÉTHODE PAR SUBSTITUTION
1. Isoler une inconnue : y = 10 − x.
2. Remplacer dans l''autre équation : 2x − (10 − x) = 2 → 3x = 12 → x = 4.
3. En déduire y = 10 − 4 = 6.

MÉTHODE PAR COMBINAISON
On additionne les deux équations pour éliminer y :
(x + y) + (2x − y) = 10 + 2 → 3x = 12 → x = 4, puis y = 6.

VÉRIFICATION : 4 + 6 = 10 ✓ et 2×4 − 6 = 2 ✓

PROBLÈMES TYPES BEM : « 5 stylos et 3 cahiers coûtent 310 DA… » →
poser x = prix du stylo, y = prix du cahier, traduire en 2 équations.',
  lesson_ar = 'جملة معادلتين من الدرجة الأولى

الجملة: إيجاد x وy يحققان معادلتين معًا.
{ x + y = 10
{ 2x − y = 2

طريقة التعويض
1. نعزل مجهولاً: y = 10 − x.
2. نعوض في المعادلة الأخرى: 2x − (10 − x) = 2 ← 3x = 12 ← x = 4.
3. نستنتج y = 6.

طريقة الجمع (التآلف)
نجمع المعادلتين لحذف y:
3x = 12 ← x = 4 ثم y = 6.

التحقق: 4 + 6 = 10 ✓ و 8 − 6 = 2 ✓'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'systemes';

update public.chapters c set
  lesson_fr = 'FONCTIONS LINÉAIRES ET AFFINES

FONCTION LINÉAIRE : f(x) = a·x
• Traduit une situation de PROPORTIONNALITÉ.
• Représentation : droite passant par l''ORIGINE.
• a est le coefficient : f(x) = 3x → f(5) = 15.

FONCTION AFFINE : f(x) = a·x + b
• Droite ne passant pas forcément par l''origine.
• a = COEFFICIENT DIRECTEUR (la pente) ; b = ORDONNÉE À L''ORIGINE.
• f(x) = 2x + 3 : la droite coupe l''axe des ordonnées en 3.

CALCULER a À PARTIR DE DEUX POINTS
a = (f(x₂) − f(x₁)) ÷ (x₂ − x₁)

LIRE UN GRAPHIQUE
• Image de 2 : la valeur de f(2) (on lit verticalement).
• Antécédent de 5 : le x tel que f(x) = 5 (on lit horizontalement).

À RETENIR : linéaire = proportionnalité = droite par l''origine.',
  lesson_ar = 'الدوال الخطية والتآلفية

الدالة الخطية: f(x) = a·x
• تعبّر عن وضعية تناسبية.
• تمثيلها مستقيم يمر بالمبدأ.
• a هو المعامل: f(x) = 3x ← f(5) = 15.

الدالة التآلفية: f(x) = a·x + b
• مستقيم لا يمر بالضرورة بالمبدأ.
• a المعامل الموجه (الميل) و b الترتيب إلى المبدأ.

حساب a من نقطتين:
a = (f(x₂) − f(x₁)) ÷ (x₂ − x₁)

قراءة البيان:
• صورة 2 هي f(2). • سابقة 5 هي x حيث f(x) = 5.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'fonctions';

update public.chapters c set
  lesson_fr = 'STATISTIQUES

VOCABULAIRE
• Effectif : nombre de fois qu''une valeur apparaît.
• Effectif total N : somme de tous les effectifs.
• Fréquence = effectif ÷ N (en fraction, décimal ou %).

MOYENNE PONDÉRÉE
Notes : 12 (coef 2) et 15 (coef 3).
Moyenne = (12×2 + 15×3) ÷ (2+3) = 69 ÷ 5 = 13,8.

MÉDIANE
La valeur qui partage la série ORDONNÉE en deux moitiés.
Série : 8, 10, 12, 15, 19 → médiane = 12.
(Avec un nombre pair de valeurs : moyenne des deux du milieu.)

ÉTENDUE = valeur max − valeur min.
Série ci-dessus : 19 − 8 = 11.

À RETENIR : toujours ORDONNER la série avant de chercher la médiane.',
  lesson_ar = 'الإحصاء

مصطلحات
• التكرار: عدد مرات ظهور القيمة.
• التكرار الكلي N: مجموع التكرارات.
• التواتر = التكرار ÷ N (كسر أو نسبة مئوية).

المعدل المتوازن
علامتان: 12 (معامل 2) و15 (معامل 3).
المعدل = (12×2 + 15×3) ÷ 5 = 13.8.

الوسيط (القيمة الوسطى)
القيمة التي تقسم السلسلة المرتبة إلى نصفين.
السلسلة: 8، 10، 12، 15، 19 ← الوسيط = 12.

المدى = أكبر قيمة − أصغر قيمة = 19 − 8 = 11.

تذكر: نرتب السلسلة دائمًا قبل البحث عن الوسيط.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'statistiques';

update public.chapters c set
  lesson_fr = 'LE THÉORÈME DE THALÈS

CONFIGURATION
Deux droites sécantes en A, coupées par deux droites PARALLÈLES (MN) // (BC),
avec M sur (AB) et N sur (AC).

LE THÉORÈME
AM/AB = AN/AC = MN/BC

CALCULER UNE LONGUEUR
AM = 3, AB = 5, BC = 10. MN = ?
MN/BC = AM/AB → MN = 10 × 3/5 = 6.

LA RÉCIPROQUE
Si AM/AB = AN/AC (points alignés dans le même ordre),
alors (MN) // (BC).

AGRANDISSEMENT / RÉDUCTION
Le rapport k = AM/AB est le coefficient de réduction du triangle AMN
par rapport à ABC. Les aires sont multipliées par k².

À RETENIR AU BEM : écrire les 3 rapports AVANT de remplacer par les valeurs.',
  lesson_ar = 'مبرهنة طالس

الوضعية
مستقيمان متقاطعان في A يقطعهما مستقيمان متوازيان (MN) // (BC)،
حيث M على (AB) وN على (AC).

المبرهنة
AM/AB = AN/AC = MN/BC

حساب طول
AM = 3، AB = 5، BC = 10. كم MN؟
MN = 10 × 3/5 = 6.

عكس مبرهنة طالس
إذا كان AM/AB = AN/AC (بنفس الترتيب) فإن (MN) // (BC).

التكبير والتصغير: النسبة k = AM/AB، والمساحات تُضرب في k².

نصيحة للبيم: اكتب النسب الثلاث قبل التعويض بالقيم.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'thales';

update public.chapters c set
  lesson_fr = 'TRIGONOMÉTRIE DANS LE TRIANGLE RECTANGLE

Dans un triangle rectangle, pour un angle aigu α :
• cos α = côté ADJACENT ÷ hypoténuse
• sin α = côté OPPOSÉ ÷ hypoténuse
• tan α = côté OPPOSÉ ÷ côté ADJACENT

Moyen mnémotechnique : CAH — SOH — TOA.

CALCULER UNE LONGUEUR
Triangle rectangle, angle 30°, hypoténuse 10 cm. Côté opposé ?
sin 30° = opposé/10 → opposé = 10 × sin 30° = 10 × 0,5 = 5 cm.

CALCULER UN ANGLE
cos α = 4/5 = 0,8 → α = cos⁻¹(0,8) ≈ 37° (touche 2nde cos de la calculatrice).

RELATION FONDAMENTALE
cos²α + sin²α = 1
et tan α = sin α / cos α.

À RETENIR : cos et sin sont toujours entre 0 et 1 (l''hypoténuse est le plus grand côté).',
  lesson_ar = 'حساب المثلثات في المثلث القائم

من أجل زاوية حادة α في مثلث قائم:
• جتا α = الضلع المجاور ÷ الوتر
• جا α = الضلع المقابل ÷ الوتر
• ظا α = الضلع المقابل ÷ الضلع المجاور

حساب طول
مثلث قائم، زاوية 30°، الوتر 10 سم. الضلع المقابل؟
جا 30° = المقابل/10 ← المقابل = 10 × 0.5 = 5 سم.

حساب زاوية
جتا α = 0.8 ← α = جتا⁻¹(0.8) ≈ 37°.

العلاقة الأساسية
جتا²α + جا²α = 1 ، و ظا α = جا α ÷ جتا α.

تذكر: جتا وجا محصوران دائمًا بين 0 و1.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'trigonometrie';

update public.chapters c set
  lesson_fr = 'GÉOMÉTRIE DANS L''ESPACE

VOLUMES À CONNAÎTRE
• Pavé droit : V = L × l × h
• Cube : V = c³
• Cylindre : V = π r² h
• PYRAMIDE : V = (aire de la base × hauteur) ÷ 3
• CÔNE : V = (π r² × h) ÷ 3
• BOULE : V = (4/3) π r³ ; sphère (surface) : A = 4 π r²

EXEMPLE
Cône de rayon 3 cm et hauteur 7 cm :
V = π × 9 × 7 ÷ 3 = 21π ≈ 65,9 cm³.

SECTIONS
• Section d''un pavé par un plan parallèle à une face → rectangle identique.
• Section d''une pyramide par un plan parallèle à la base → réduction de la base (rapport k, aires ×k², volumes ×k³).

CONVERSIONS : 1 L = 1 dm³ ; 1 000 L = 1 m³.

À RETENIR : pyramide et cône = « le tiers » du prisme/cylindre correspondant.',
  lesson_ar = 'الهندسة في الفضاء

الحجوم الواجب حفظها
• متوازي المستطيلات: V = الطول × العرض × الارتفاع
• المكعب: V = c³
• الأسطوانة: V = π r² h
• الهرم: V = (مساحة القاعدة × الارتفاع) ÷ 3
• المخروط: V = (π r² × h) ÷ 3
• الكرة: V = (4/3) π r³ ومساحة سطحها A = 4 π r²

مثال: مخروط نصف قطره 3 سم وارتفاعه 7 سم:
V = 21π ≈ 65.9 سم³.

المقاطع: مقطع هرم بمستوٍ موازٍ للقاعدة = تصغير بنسبة k (المساحات ×k² والحجوم ×k³).

تحويلات: 1 ل = 1 دسم³ ؛ 1000 ل = 1 م³.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace';

-- ============ 3AS ============

update public.chapters c set
  lesson_fr = 'LIMITES ET CONTINUITÉ

LIMITES USUELLES EN ±∞
• lim xⁿ = +∞ (n pair) ; pour un polynôme, seule compte la plus haute puissance.
• lim 1/x = 0 quand x → ±∞.

FORMES INDÉTERMINÉES : « ∞ − ∞ », « ∞/∞ », « 0/0 », « 0×∞ ».
Pour un quotient de polynômes en ∞ : factoriser par les plus hautes puissances.

ASYMPTOTES
• lim f = b (x→∞) → asymptote HORIZONTALE y = b.
• lim f = ±∞ (x→a) → asymptote VERTICALE x = a.
• f(x) − (ax+b) → 0 → asymptote OBLIQUE y = ax + b.

CONTINUITÉ
f est continue en a si lim f(x) = f(a) quand x → a.

THÉORÈME DES VALEURS INTERMÉDIAIRES (TVI)
Si f est continue et STRICTEMENT MONOTONE sur [a;b] et si k est compris
entre f(a) et f(b), alors l''équation f(x) = k admet une UNIQUE solution
dans [a;b]. → C''est l''outil classique du BAC pour prouver l''existence
d''une solution α et l''encadrer.',
  lesson_ar = 'النهايات والاستمرارية

نهايات مألوفة عند ±∞
• نهاية كثير حدود يحددها الحد الأعلى درجة.
• نهاية 1/x تساوي 0 عندما x → ±∞.

حالات عدم التعيين: «∞ − ∞»، «∞/∞»، «0/0»، «0×∞».
لحساب نهاية حاصل قسمة كثيري حدود عند ∞ نُخرج أكبر قوة عاملاً مشتركًا.

المستقيمات المقاربة
• نهاية f تساوي b عند ∞ ← مقارب أفقي y = b.
• نهاية f تساوي ±∞ عند a ← مقارب شاقولي x = a.

الاستمرارية: f مستمرة في a إذا كانت نهاية f عند a تساوي f(a).

مبرهنة القيم المتوسطة: إذا كانت f مستمرة ورتيبة تمامًا على [a;b]
وكان k محصورًا بين f(a) وf(b) فإن المعادلة f(x) = k تقبل حلاً وحيدًا.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'limites-continuite';

update public.chapters c set
  lesson_fr = 'DÉRIVATION ET ÉTUDE DE FONCTIONS

DÉRIVÉES USUELLES
• (xⁿ)'' = n·xⁿ⁻¹   • (1/x)'' = −1/x²   • (√x)'' = 1/(2√x)
• (u + v)'' = u'' + v''   • (u·v)'' = u''v + uv''
• (u/v)'' = (u''v − uv'')/v²

TANGENTE AU POINT D''ABSCISSE a
y = f''(a)(x − a) + f(a)
f''(a) est le coefficient directeur de la tangente.

SENS DE VARIATION — LE CŒUR DE L''ÉTUDE
• f''(x) > 0 sur I → f CROISSANTE sur I.
• f''(x) < 0 sur I → f DÉCROISSANTE sur I.
• f'' s''annule en changeant de signe → EXTREMUM local.

PLAN D''ÉTUDE TYPE BAC
1. Domaine et limites aux bornes (+ asymptotes).
2. Calculer f''(x), étudier son signe.
3. Dresser le tableau de variations.
4. Tangentes / points particuliers, puis tracer la courbe.',
  lesson_ar = 'الاشتقاقية ودراسة الدوال

مشتقات مألوفة
• (xⁿ)'' = n·xⁿ⁻¹   • (1/x)'' = −1/x²   • (√x)'' = 1/(2√x)
• (u·v)'' = u''v + uv''   • (u/v)'' = (u''v − uv'')/v²

معادلة المماس عند النقطة ذات الفاصلة a
y = f''(a)(x − a) + f(a)

اتجاه التغير — جوهر الدراسة
• f''(x) > 0 على مجال ← f متزايدة عليه.
• f''(x) < 0 ← f متناقصة.
• انعدام f'' مع تغير الإشارة ← قيمة حدية محلية.

خطة الدراسة في البكالوريا
1. مجموعة التعريف والنهايات (والمقاربات).
2. حساب f'' ودراسة إشارتها.
3. جدول التغيرات.
4. المماسات والنقاط الخاصة ثم رسم المنحنى.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'derivation';

update public.chapters c set
  lesson_fr = 'LA FONCTION EXPONENTIELLE

DÉFINITION : exp(x) = eˣ, définie sur R, à valeurs dans ]0 ; +∞[.
eˣ > 0 pour TOUT x — c''est l''argument clé de nombreux signes au BAC.

PROPRIÉTÉS ALGÉBRIQUES
• e^(a+b) = eᵃ × eᵇ    • e^(a−b) = eᵃ ÷ eᵇ
• (eᵃ)ⁿ = e^(na)       • e⁰ = 1, e¹ = e ≈ 2,718

DÉRIVÉE : (eˣ)'' = eˣ ; (e^u)'' = u'' · e^u.

LIMITES
• lim eˣ = +∞ (x→+∞) ; lim eˣ = 0 (x→−∞)
• CROISSANCES COMPARÉES : lim eˣ/x = +∞ ; lim x·eˣ = 0 (x→−∞).
« L''exponentielle l''emporte toujours sur x. »

ÉQUATIONS : eˣ = k (k > 0) ⟺ x = ln k.
e^u = e^v ⟺ u = v (car exp est strictement croissante).',
  lesson_ar = 'الدالة الأسية

التعريف: exp(x) = eˣ معرفة على R وقيمها في ]0 ; +∞[.
eˣ > 0 من أجل كل x — حجة أساسية لدراسة الإشارة في البكالوريا.

خواص جبرية
• e^(a+b) = eᵃ × eᵇ    • e^(a−b) = eᵃ ÷ eᵇ
• (eᵃ)ⁿ = e^(na)       • e⁰ = 1

المشتقة: (eˣ)'' = eˣ ؛ (e^u)'' = u'' · e^u.

النهايات
• نهاية eˣ عند +∞ هي +∞ وعند −∞ هي 0.
• التزايدات المقارنة: eˣ/x ← +∞. «الأسية تتغلب دائمًا على x.»

المعادلات: eˣ = k (بشرط k > 0) ⟺ x = ln k.
e^u = e^v ⟺ u = v.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'exponentielle';

update public.chapters c set
  lesson_fr = 'LA FONCTION LOGARITHME NÉPÉRIEN

DÉFINITION : ln est définie sur ]0 ; +∞[ (jamais de ln d''un nombre ≤ 0 !).
ln 1 = 0 ; ln e = 1 ; ln(eˣ) = x ; e^(ln x) = x.

PROPRIÉTÉS ALGÉBRIQUES
• ln(a × b) = ln a + ln b
• ln(a/b) = ln a − ln b
• ln(aⁿ) = n · ln a
• ln(√a) = (ln a)/2

DÉRIVÉE : (ln x)'' = 1/x ; (ln u)'' = u''/u.

LIMITES
• lim ln x = +∞ (x→+∞) ; lim ln x = −∞ (x→0⁺)
• Croissances comparées : lim (ln x)/x = 0 (x→+∞).
« x l''emporte sur ln x. »

ÉQUATIONS / INÉQUATIONS
ln x = k ⟺ x = eᵏ.
ln u = ln v ⟺ u = v (avec u, v > 0 — TOUJOURS vérifier le domaine).
Applications type BAC : résoudre 0,8ⁿ < 0,01 → n > ln 0,01 / ln 0,8.',
  lesson_ar = 'الدالة اللوغاريتمية النيبيرية

التعريف: ln معرفة على ]0 ; +∞[ فقط (لا لوغاريتم لعدد سالب أو معدوم!).
ln 1 = 0 ؛ ln e = 1 ؛ ln(eˣ) = x ؛ e^(ln x) = x.

خواص جبرية
• ln(a × b) = ln a + ln b
• ln(a/b) = ln a − ln b
• ln(aⁿ) = n · ln a

المشتقة: (ln x)'' = 1/x ؛ (ln u)'' = u''/u.

النهايات
• نهاية ln x عند +∞ هي +∞ وعند 0⁺ هي −∞.
• التزايدات المقارنة: (ln x)/x ← 0.

المعادلات: ln x = k ⟺ x = eᵏ ، و ln u = ln v ⟺ u = v
(بشرط u وv موجبين — تحقق من مجموعة التعريف دائمًا).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'logarithme';

update public.chapters c set
  lesson_fr = 'CALCUL INTÉGRAL

PRIMITIVE : F est une primitive de f si F'' = f.
Deux primitives diffèrent d''une constante.

PRIMITIVES USUELLES
• xⁿ → xⁿ⁺¹/(n+1)     • 1/x → ln|x|
• eˣ → eˣ              • u''·e^u → e^u
• u''/u → ln|u|         • u''·uⁿ → uⁿ⁺¹/(n+1)

INTÉGRALE DÉFINIE
∫ₐᵇ f(x) dx = F(b) − F(a)
Exemple : ∫₀¹ 2x dx = [x²]₀¹ = 1 − 0 = 1.

PROPRIÉTÉS
• Linéarité : ∫(αf + βg) = α∫f + β∫g
• Relation de Chasles : ∫ₐᵇ + ∫ᵇᶜ = ∫ₐᶜ
• Si f ≥ 0 sur [a;b], l''AIRE sous la courbe = ∫ₐᵇ f (en unités d''aire).

VALEUR MOYENNE de f sur [a;b] : μ = (1/(b−a)) ∫ₐᵇ f(x) dx.',
  lesson_ar = 'الحساب التكاملي

الدالة الأصلية: F أصلية لـ f إذا كان F'' = f.
دالتان أصليتان تختلفان بثابت.

أصليات مألوفة
• xⁿ ← xⁿ⁺¹/(n+1)     • 1/x ← ln|x|
• eˣ ← eˣ              • u''·e^u ← e^u
• u''/u ← ln|u|

التكامل المحدد
∫ₐᵇ f(x) dx = F(b) − F(a)
مثال: ∫₀¹ 2x dx = [x²]₀¹ = 1.

خواص
• الخطية، وعلاقة شال: ∫ₐᵇ + ∫ᵇᶜ = ∫ₐᶜ
• إذا كانت f ≥ 0 على [a;b] فالمساحة تحت المنحنى = ∫ₐᵇ f.

القيمة المتوسطة: μ = (1/(b−a)) ∫ₐᵇ f(x) dx.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'integrales';

update public.chapters c set
  lesson_fr = 'PROBABILITÉS

PROBABILITÉ CONDITIONNELLE
P_A(B) = P(A ∩ B) / P(A) — probabilité de B sachant que A est réalisé.

ARBRE PONDÉRÉ — les 3 règles
1. La somme des probabilités issues d''un même nœud vaut 1.
2. Probabilité d''un chemin = PRODUIT des probabilités des branches.
3. Probabilité d''un événement = SOMME des chemins qui y mènent
   (formule des probabilités totales).

INDÉPENDANCE
A et B indépendants ⟺ P(A ∩ B) = P(A) × P(B) ⟺ P_A(B) = P(B).

LOI BINOMIALE B(n ; p)
On répète n fois, de façon indépendante, une épreuve à deux issues
(succès p, échec 1−p).
P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ
ESPÉRANCE : E(X) = n·p ; VARIANCE : V(X) = n·p·(1−p).

Exemple : 5 tirs, p = 0,8 → P(5 réussites) = 0,8⁵ ≈ 0,33 ; E(X) = 4.',
  lesson_ar = 'الاحتمالات

الاحتمال الشرطي
P_A(B) = P(A ∩ B) ÷ P(A) — احتمال B علمًا أن A محقق.

الشجرة الاحتمالية — القواعد الثلاث
1. مجموع احتمالات الفروع من نفس العقدة يساوي 1.
2. احتمال مسار = جداء احتمالات فروعه.
3. احتمال حادثة = مجموع المسارات المؤدية إليها (الاحتمالات الكلية).

الاستقلالية
A وB مستقلتان ⟺ P(A ∩ B) = P(A) × P(B).

قانون ثنائي الحد B(n ; p)
نكرر n مرة تجربة ذات نتيجتين (نجاح p).
P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ
الأمل الرياضي: E(X) = n·p ؛ التباين: V(X) = n·p·(1−p).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'probabilites';

update public.chapters c set
  lesson_fr = 'LES NOMBRES COMPLEXES

FORME ALGÉBRIQUE : z = a + ib, avec i² = −1.
a = partie réelle Re(z), b = partie imaginaire Im(z).

CONJUGUÉ : z̄ = a − ib.
z·z̄ = a² + b² — sert à rendre réel un dénominateur.

MODULE : |z| = √(a² + b²) — la distance OM.

ARGUMENT θ : cos θ = a/|z| et sin θ = b/|z|.
FORME EXPONENTIELLE : z = |z| · e^(iθ) = r(cos θ + i sin θ).

Exemple : z = 1 + i → |z| = √2, θ = π/4, z = √2·e^(iπ/4).

ÉQUATION DU SECOND DEGRÉ (Δ < 0)
az² + bz + c = 0 avec Δ < 0 :
z = (−b ± i√(−Δ)) / 2a — deux solutions conjuguées.

GÉOMÉTRIE : |z_B − z_A| = distance AB ;
arg((z_C−z_A)/(z_B−z_A)) = angle (AB, AC).',
  lesson_ar = 'الأعداد المركبة

الشكل الجبري: z = a + ib حيث i² = −1.
a الجزء الحقيقي وb الجزء التخيلي.

المرافق: z̄ = a − ib ، و z·z̄ = a² + b².

الطويلة: |z| = √(a² + b²).

العمدة θ: جتا θ = a/|z| و جا θ = b/|z|.
الشكل الأسي: z = |z| · e^(iθ).

مثال: z = 1 + i ← |z| = √2 والعمدة π/4.

معادلة الدرجة الثانية (Δ < 0)
z = (−b ± i√(−Δ)) ÷ 2a — حلان مترافقان.

هندسيًا: |z_B − z_A| = المسافة AB.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'complexes';

update public.chapters c set
  lesson_fr = 'GÉOMÉTRIE DANS L''ESPACE

PRODUIT SCALAIRE dans un repère orthonormé :
u·v = xx'' + yy'' + zz''
u ⊥ v ⟺ u·v = 0.
Norme : ||u|| = √(x² + y² + z²).

ÉQUATION CARTÉSIENNE D''UN PLAN
ax + by + cz + d = 0, de VECTEUR NORMAL n(a ; b ; c).
Plan passant par A(1;0;2) de normal n(2;−1;3) :
2(x−1) − (y−0) + 3(z−2) = 0 → 2x − y + 3z − 8 = 0.

REPRÉSENTATION PARAMÉTRIQUE D''UNE DROITE
Passant par A, de vecteur directeur u :
x = x_A + t·a ; y = y_A + t·b ; z = z_A + t·c (t ∈ R).

DISTANCE D''UN POINT M AU PLAN P
d(M, P) = |ax_M + by_M + cz_M + d| / √(a² + b² + c²)

POSITIONS RELATIVES : droite // plan ⟺ u·n = 0 ;
droite ⊥ plan ⟺ u colinéaire à n.',
  lesson_ar = 'الهندسة في الفضاء

الجداء السلمي في معلم متعامد ومتجانس:
u·v = xx'' + yy'' + zz''
u ⊥ v ⟺ u·v = 0.
الطويلة: ||u|| = √(x² + y² + z²).

المعادلة الديكارتية للمستوي
ax + by + cz + d = 0 وشعاعه الناظمي n(a ; b ; c).

التمثيل الوسيطي لمستقيم
يمر بـ A وشعاع توجيهه u:
x = x_A + t·a ؛ y = y_A + t·b ؛ z = z_A + t·c.

بعد نقطة M عن المستوي P
d(M, P) = |ax_M + by_M + cz_M + d| ÷ √(a² + b² + c²)

الأوضاع النسبية: المستقيم يوازي المستوي ⟺ u·n = 0.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace';
