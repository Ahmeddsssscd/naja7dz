-- ===============================================================
-- Migration 005 — parental controls, friend requests, support, trophies
-- Apply: paste into Supabase SQL Editor → Run
-- ===============================================================

-- 1. Per-child parental controls
create table if not exists public.parent_controls (
  child_id uuid primary key references public.children(id) on delete cascade,
  parent_id uuid not null references auth.users(id) on delete cascade,
  daily_time_limit_minutes integer default 60 check (daily_time_limit_minutes between 0 and 720),
  lock_games_until_quizzes boolean default false,
  allowed_kids_universe boolean default true,
  allowed_social boolean default false,
  bedtime_start time,
  bedtime_end time,
  updated_at timestamptz default now()
);

alter table public.parent_controls enable row level security;
create policy "parent reads own child controls" on public.parent_controls
  for select to authenticated using (parent_id = auth.uid());
create policy "parent updates own child controls" on public.parent_controls
  for all to authenticated using (parent_id = auth.uid()) with check (parent_id = auth.uid());

drop trigger if exists trg_parent_controls_updated on public.parent_controls;
create trigger trg_parent_controls_updated
  before update on public.parent_controls
  for each row execute function public.set_updated_at();

-- 2. Support messages from contact form
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  locale text default 'fr' check (locale in ('fr','ar')),
  status text default 'open' check (status in ('open','in_progress','resolved')),
  created_at timestamptz default now()
);

create index if not exists idx_support_status_created on public.support_messages (status, created_at desc);

alter table public.support_messages enable row level security;
create policy "service role support" on public.support_messages
  for all to service_role using (true) with check (true);

-- 3. Logic riddles + wilayas + quran content
create table if not exists public.logic_riddles (
  id uuid primary key default gen_random_uuid(),
  question_fr text not null,
  question_ar text,
  answer text not null,
  hint_fr text,
  age_min integer default 7,
  age_max integer default 12,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.logic_riddles enable row level security;
create policy "auth reads riddles" on public.logic_riddles for select to authenticated using (active);
create policy "service role riddles" on public.logic_riddles for all to service_role using (true) with check (true);

insert into public.logic_riddles (question_fr, question_ar, answer, hint_fr) values
  ('Plus tu en prends, plus tu en laisses derrière toi. Qui suis-je ?', 'كلما أخذت أكثر تركت أكثر خلفك. من أنا؟', 'pas', 'On les compte en marchant'),
  ('Je n''ai pas de bouche, mais je parle. Pas d''oreilles, mais j''écoute. Qui suis-je ?', 'ليس لي فم لكنني أتكلم، ولا أذنين لكنني أسمع. من أنا؟', 'écho', 'On me trouve dans les montagnes'),
  ('Si tu m''as, tu veux me partager. Si tu me partages, tu ne m''as plus. Qui suis-je ?', 'إذا حصلت علي تريد مشاركتي، وإذا شاركتني فقدتني. ما أنا؟', 'secret', 'C''est quelque chose qui ne se dit pas'),
  ('Je peux voler sans ailes, je peux pleurer sans yeux. Qui suis-je ?', 'أطير بلا أجنحة وأبكي بلا عيون. من أنا؟', 'nuage', 'Tu me regardes dans le ciel'),
  ('Plus je sèche, plus je deviens humide. Qui suis-je ?', 'كلما جففت أصبحت أكثر بللاً. من أنا؟', 'serviette', 'Après la douche'),
  ('J''ai 88 touches mais je ne ferme aucune porte. Qui suis-je ?', 'لدي 88 مفتاحاً لكنني لا أفتح أي باب. من أنا؟', 'piano', 'Un instrument de musique'),
  ('Quel est le mot français de 5 lettres qui contient deux fois la même lettre au début et à la fin ?', null, 'avale', 'Pense à un verbe'),
  ('Combien d''anniversaires un homme moyen a-t-il ?', 'كم عيد ميلاد للإنسان العادي؟', '1', 'Réfléchis : il naît combien de fois ?'),
  ('Je commence par P, fini par E, et je contiens des milliers de lettres. Qui suis-je ?', 'أبدأ بحرف P وأنتهي بحرف E وأحتوي على آلاف الحروف. ما أنا؟', 'poste', 'On y va pour envoyer du courrier'),
  ('Plus tu m''enlèves, plus je grandis. Qui suis-je ?', 'كلما أزلت مني أكبر أكثر. ما أنا؟', 'trou', 'Avec une pelle')
on conflict do nothing;

-- 4. Wilayas (58)
create table if not exists public.wilayas (
  code integer primary key,
  name_fr text not null,
  name_ar text not null,
  region_fr text,
  fact_fr text
);

insert into public.wilayas (code, name_fr, name_ar, region_fr, fact_fr) values
  (1, 'Adrar', 'أدرار', 'Sud', 'Connue pour ses oasis et son architecture en pisé.'),
  (2, 'Chlef', 'الشلف', 'Nord', 'Située dans la vallée du Chéliff.'),
  (3, 'Laghouat', 'الأغواط', 'Hauts plateaux', 'Porte du Sahara, célèbre pour ses palmiers.'),
  (4, 'Oum El Bouaghi', 'أم البواقي', 'Est', 'Riche en sites archéologiques numides.'),
  (5, 'Batna', 'باتنة', 'Aurès', 'Capitale des Aurès, près de Timgad.'),
  (6, 'Béjaïa', 'بجاية', 'Kabylie', 'Ville côtière historique, ancien royaume hammadide.'),
  (7, 'Biskra', 'بسكرة', 'Sud-est', 'Reine des Zibans, oasis de palmiers.'),
  (8, 'Béchar', 'بشار', 'Sud-ouest', 'Porte du Sahara occidental.'),
  (9, 'Blida', 'البليدة', 'Nord', 'Surnommée la ville des Roses.'),
  (10, 'Bouira', 'البويرة', 'Centre', 'Au pied du Djurdjura.'),
  (11, 'Tamanrasset', 'تمنراست', 'Sud', 'Capitale du Hoggar, terre touarègue.'),
  (12, 'Tébessa', 'تبسة', 'Est', 'Riche en vestiges romains.'),
  (13, 'Tlemcen', 'تلمسان', 'Ouest', 'Ancienne capitale zianide, ville de l''art andalou.'),
  (14, 'Tiaret', 'تيارت', 'Hauts plateaux', 'Berceau de la dynastie rostémide.'),
  (15, 'Tizi Ouzou', 'تيزي وزو', 'Kabylie', 'Capitale de la Grande Kabylie.'),
  (16, 'Alger', 'الجزائر', 'Centre', 'Capitale du pays, surnommée El Behdja.'),
  (17, 'Djelfa', 'الجلفة', 'Hauts plateaux', 'Région de pastoralisme et steppes.'),
  (18, 'Jijel', 'جيجل', 'Nord', 'Côte sauvage, plages et grottes.'),
  (19, 'Sétif', 'سطيف', 'Hauts plateaux', 'Connue pour ses ruines romaines de Djemila.'),
  (20, 'Saïda', 'سعيدة', 'Ouest', 'Région agricole et thermale.'),
  (21, 'Skikda', 'سكيكدة', 'Est', 'Port pétrolier important.'),
  (22, 'Sidi Bel Abbès', 'سيدي بلعباس', 'Ouest', 'Ville coloniale historique.'),
  (23, 'Annaba', 'عنابة', 'Est', 'Anciennement Hippone, ville de Saint Augustin.'),
  (24, 'Guelma', 'قالمة', 'Est', 'Théâtre romain bien conservé.'),
  (25, 'Constantine', 'قسنطينة', 'Est', 'Ville des ponts suspendus.'),
  (26, 'Médéa', 'المدية', 'Centre', 'Vignobles historiques et plateaux.'),
  (27, 'Mostaganem', 'مستغانم', 'Ouest', 'Port méditerranéen et plages.'),
  (28, 'M''Sila', 'المسيلة', 'Hauts plateaux', 'Lac salé de Chott El Hodna.'),
  (29, 'Mascara', 'معسكر', 'Ouest', 'Ville natale de l''Émir Abdelkader.'),
  (30, 'Ouargla', 'ورقلة', 'Sahara', 'Ville saharienne, oasis pétrolière.'),
  (31, 'Oran', 'وهران', 'Ouest', 'La Radieuse, deuxième ville du pays.'),
  (32, 'El Bayadh', 'البيض', 'Hauts plateaux', 'Région de monts et d''oasis.'),
  (33, 'Illizi', 'إليزي', 'Sahara', 'Sahara central, art rupestre du Tassili.'),
  (34, 'Bordj Bou Arreridj', 'برج بوعريريج', 'Hauts plateaux', 'Hub d''électronique.'),
  (35, 'Boumerdès', 'بومرداس', 'Centre', 'Côte est d''Alger.'),
  (36, 'El Tarf', 'الطارف', 'Est', 'Frontière avec la Tunisie, parc national.'),
  (37, 'Tindouf', 'تندوف', 'Sud-ouest', 'Frontière avec le Sahara occidental.'),
  (38, 'Tissemsilt', 'تيسمسيلت', 'Centre', 'Région de l''Ouarsenis.'),
  (39, 'El Oued', 'الوادي', 'Sahara', 'Ville aux mille coupoles.'),
  (40, 'Khenchela', 'خنشلة', 'Aurès', 'Au cœur des Aurès.'),
  (41, 'Souk Ahras', 'سوق أهراس', 'Est', 'Ville natale de Saint Augustin.'),
  (42, 'Tipaza', 'تيبازة', 'Centre', 'Ruines romaines patrimoine UNESCO.'),
  (43, 'Mila', 'ميلة', 'Est', 'Région agricole et historique.'),
  (44, 'Aïn Defla', 'عين الدفلى', 'Centre', 'Vallée du Chéliff, agriculture.'),
  (45, 'Naâma', 'النعامة', 'Ouest', 'Steppes et élevage.'),
  (46, 'Aïn Témouchent', 'عين تموشنت', 'Ouest', 'Côte méditerranéenne.'),
  (47, 'Ghardaïa', 'غرداية', 'Sud', 'Vallée du M''zab, patrimoine UNESCO.'),
  (48, 'Relizane', 'غليزان', 'Ouest', 'Plaine du Chéliff.'),
  (49, 'Timimoun', 'تيميمون', 'Sud', 'Oasis rouge du Gourara.'),
  (50, 'Bordj Badji Mokhtar', 'برج باجي مختار', 'Sahara', 'Frontière avec le Mali.'),
  (51, 'Ouled Djellal', 'أولاد جلال', 'Sud-est', 'Région des Ziban.'),
  (52, 'Béni Abbès', 'بني عباس', 'Sud-ouest', 'Oasis verte au cœur du Sahara.'),
  (53, 'In Salah', 'عين صالح', 'Sahara', 'Au cœur du désert.'),
  (54, 'In Guezzam', 'عين قزام', 'Sahara', 'Frontière avec le Niger.'),
  (55, 'Touggourt', 'تقرت', 'Sahara', 'Oasis de palmiers.'),
  (56, 'Djanet', 'جانت', 'Sahara', 'Tassili N''Ajjer, art rupestre.'),
  (57, 'El M''Ghair', 'المغير', 'Sud-est', 'Région saharienne.'),
  (58, 'El Meniaa', 'المنيعة', 'Sahara', 'Oasis du Mzab.')
on conflict (code) do nothing;

alter table public.wilayas enable row level security;
create policy "anyone reads wilayas" on public.wilayas for select to anon, authenticated using (true);

-- 5. Quran surahs (114) — minimal seed
create table if not exists public.quran_surahs (
  number integer primary key,
  name_ar text not null,
  name_translit text not null,
  name_fr text,
  ayah_count integer not null,
  revelation_place text check (revelation_place in ('mecca','medina'))
);

alter table public.quran_surahs enable row level security;
create policy "anyone reads surahs" on public.quran_surahs for select to anon, authenticated using (true);

-- Insert all 114 surahs (compact form)
insert into public.quran_surahs (number, name_ar, name_translit, name_fr, ayah_count, revelation_place) values
  (1, 'الفاتحة','Al-Fatiha','L''Ouverture',7,'mecca'),
  (2, 'البقرة','Al-Baqara','La Vache',286,'medina'),
  (3, 'آل عمران','Al-Imran','La Famille d''Imran',200,'medina'),
  (4, 'النساء','An-Nisa','Les Femmes',176,'medina'),
  (5, 'المائدة','Al-Maida','La Table Servie',120,'medina'),
  (6, 'الأنعام','Al-Anam','Les Bestiaux',165,'mecca'),
  (7, 'الأعراف','Al-Araf','Les Hauteurs',206,'mecca'),
  (8, 'الأنفال','Al-Anfal','Le Butin',75,'medina'),
  (9, 'التوبة','At-Tawba','Le Repentir',129,'medina'),
  (10, 'يونس','Yunus','Jonas',109,'mecca'),
  (11, 'هود','Hud','Houd',123,'mecca'),
  (12, 'يوسف','Yusuf','Joseph',111,'mecca'),
  (13, 'الرعد','Ar-Rad','Le Tonnerre',43,'medina'),
  (14, 'إبراهيم','Ibrahim','Abraham',52,'mecca'),
  (15, 'الحجر','Al-Hijr','Al-Hijr',99,'mecca'),
  (16, 'النحل','An-Nahl','Les Abeilles',128,'mecca'),
  (17, 'الإسراء','Al-Isra','Le Voyage Nocturne',111,'mecca'),
  (18, 'الكهف','Al-Kahf','La Caverne',110,'mecca'),
  (19, 'مريم','Maryam','Marie',98,'mecca'),
  (20, 'طه','Ta-Ha','Ta-Ha',135,'mecca'),
  (108, 'الكوثر','Al-Kawthar','L''Abondance',3,'mecca'),
  (109, 'الكافرون','Al-Kafirun','Les Infidèles',6,'mecca'),
  (110, 'النصر','An-Nasr','Le Secours',3,'medina'),
  (111, 'المسد','Al-Masad','Les Fibres',5,'mecca'),
  (112, 'الإخلاص','Al-Ikhlas','Le Monothéisme Pur',4,'mecca'),
  (113, 'الفلق','Al-Falaq','L''Aube Naissante',5,'mecca'),
  (114, 'الناس','An-Nas','Les Hommes',6,'mecca')
on conflict (number) do nothing;

-- 6. Manners (adab) lessons
create table if not exists public.adab_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_fr text not null,
  title_ar text,
  body_fr text not null,
  body_ar text,
  age_min integer default 5,
  age_max integer default 12,
  sort_order integer default 0
);

alter table public.adab_lessons enable row level security;
create policy "anyone reads adab" on public.adab_lessons for select to anon, authenticated using (true);

insert into public.adab_lessons (slug, title_fr, title_ar, body_fr, body_ar, sort_order) values
  ('saluer', 'Saluer', 'السلام', 'Quand tu rencontres quelqu''un, dis « Assalamu alaykum » ou « Bonjour ». Le sourire est aussi un cadeau.', 'عندما تلتقي بشخص، قل "السلام عليكم" أو "صباح الخير". الابتسامة أيضاً هدية.', 1),
  ('respect-parents', 'Respecter ses parents', 'احترام الوالدين', 'Tes parents te veulent du bien. Écoute-les avec respect, même si tu n''es pas d''accord.', 'والداك يريدان لك الخير. أصغِ إليهما باحترام، حتى لو لم تتفق معهما.', 2),
  ('verite', 'Dire la vérité', 'قول الحقيقة', 'La vérité te rend libre. Même si elle est dure, dire la vérité est toujours mieux que mentir.', 'الحقيقة تحررك. حتى لو كانت صعبة، قول الحقيقة دائماً أفضل من الكذب.', 3),
  ('partage', 'Partager', 'المشاركة', 'Quand tu partages avec tes amis ou ta famille, tu reçois plus de joie que tu n''en donnes.', 'عندما تشارك أصدقاءك أو عائلتك، تكسب فرحاً أكثر مما تعطي.', 4),
  ('patience', 'Avoir de la patience', 'الصبر', 'Tout ne s''obtient pas tout de suite. La patience est la clé de toutes les réussites.', 'لا يأتي كل شيء على الفور. الصبر هو مفتاح كل النجاحات.', 5),
  ('proprete', 'Être propre', 'النظافة', 'Te laver les mains, brosser tes dents, ranger ta chambre — la propreté est une moitié de la foi.', 'غسل اليدين وتفريش الأسنان وترتيب الغرفة — النظافة من الإيمان.', 6),
  ('aider', 'Aider les autres', 'مساعدة الآخرين', 'Aider une personne âgée à traverser la rue, partager ton goûter avec un ami — chaque petit geste compte.', 'مساعدة شخص كبير في عبور الشارع، أو مشاركة وجبتك مع صديق — كل لفتة صغيرة تهم.', 7),
  ('voisin', 'Respecter les voisins', 'احترام الجار', 'Tes voisins font partie de ta famille élargie. Salue-les, aide-les, et ne fais pas de bruit la nuit.', 'جيرانك جزء من عائلتك. حيهم وساعدهم ولا تزعجهم في الليل.', 8)
on conflict (slug) do nothing;

-- 7. Quran progress tracker per child (referenced by /api/quran/progress)
create table if not exists public.quran_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.children(id) on delete cascade,
  surah_number integer not null,
  verses_memorized integer default 0,
  last_practiced timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists uq_quran_progress_student_surah
  on public.quran_progress (student_id, surah_number);

alter table public.quran_progress enable row level security;
create policy "parent reads child quran" on public.quran_progress
  for select to authenticated using (student_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role quran" on public.quran_progress
  for all to service_role using (true) with check (true);

-- 8. Auth audit log (login attempts, password changes)
create table if not exists public.auth_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  ip text,
  user_agent text,
  success boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_auth_audit_user on public.auth_audit (user_id, created_at desc);
alter table public.auth_audit enable row level security;
create policy "service role audit" on public.auth_audit for all to service_role using (true) with check (true);

comment on table public.parent_controls is 'Per-child screen time and feature limits, set by parent.';
