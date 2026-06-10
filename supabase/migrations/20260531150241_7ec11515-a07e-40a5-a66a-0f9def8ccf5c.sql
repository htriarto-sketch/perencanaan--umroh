
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  city TEXT,
  departure_date DATE,
  doa_display_mode TEXT NOT NULL DEFAULT 'full', -- 'full' | 'arabic_only'
  night_mode BOOLEAN NOT NULL DEFAULT false,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own_profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users_insert_own_profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PRAYER CATEGORIES ============
CREATE TABLE public.prayer_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.prayer_categories TO anon, authenticated;
GRANT ALL ON public.prayer_categories TO service_role;
ALTER TABLE public.prayer_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prayer_categories_public_read" ON public.prayer_categories FOR SELECT TO anon, authenticated USING (true);

-- ============ PRAYERS ============
CREATE TABLE public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES public.prayer_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context TEXT,
  arabic TEXT NOT NULL,
  latin TEXT NOT NULL,
  translation TEXT NOT NULL,
  audio_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prayers TO anon, authenticated;
GRANT ALL ON public.prayers TO service_role;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prayers_public_read" ON public.prayers FOR SELECT TO anon, authenticated USING (true);

-- ============ USER FAVORITES (doa) ============
CREATE TABLE public.user_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_id UUID NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, prayer_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_favorites TO authenticated;
GRANT ALL ON public.user_favorites TO service_role;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own_select" ON public.user_favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorites_own_insert" ON public.user_favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_own_delete" ON public.user_favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ GUIDE STAGES (panduan ibadah) ============
CREATE TABLE public.guide_stages (
  id TEXT PRIMARY KEY,
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT,
  icon TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT ON public.guide_stages TO anon, authenticated;
GRANT ALL ON public.guide_stages TO service_role;
ALTER TABLE public.guide_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guide_public_read" ON public.guide_stages FOR SELECT TO anon, authenticated USING (true);

-- ============ USER GUIDE PROGRESS ============
CREATE TABLE public.user_guide_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL REFERENCES public.guide_stages(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  tawaf_count INT NOT NULL DEFAULT 0,
  sai_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, stage_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_guide_progress TO authenticated;
GRANT ALL ON public.user_guide_progress TO service_role;
ALTER TABLE public.user_guide_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own_all" ON public.user_guide_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ PHOTO SPOTS ============
CREATE TABLE public.photo_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  city TEXT NOT NULL, -- 'makkah' | 'madinah'
  best_time TEXT NOT NULL, -- 'pagi' | 'siang' | 'malam'
  best_time_label TEXT,
  popularity INT NOT NULL DEFAULT 0,
  location_desc TEXT,
  gps_link TEXT,
  best_time_reason TEXT,
  angle_tips TEXT,
  camera_tips TEXT,
  warnings TEXT,
  tags TEXT[],
  image_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.photo_spots TO anon, authenticated;
GRANT ALL ON public.photo_spots TO service_role;
ALTER TABLE public.photo_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photo_spots_public_read" ON public.photo_spots FOR SELECT TO anon, authenticated USING (true);

-- ============ CHECKLIST ITEMS (template) ============
CREATE TABLE public.checklist_items (
  id TEXT PRIMARY KEY,
  phase TEXT NOT NULL, -- 'h6m','h3m','h1m','h1w','h1d'
  label TEXT NOT NULL,
  info TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.checklist_items TO anon, authenticated;
GRANT ALL ON public.checklist_items TO service_role;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checklist_public_read" ON public.checklist_items FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.user_checklist (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_checklist TO authenticated;
GRANT ALL ON public.user_checklist TO service_role;
ALTER TABLE public.user_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checklist_own_all" ON public.user_checklist FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ TIPS (panduan praktis) ============
CREATE TABLE public.practical_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'transport','emergency','health','shopping','tech'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.practical_tips TO anon, authenticated;
GRANT ALL ON public.practical_tips TO service_role;
ALTER TABLE public.practical_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tips_public_read" ON public.practical_tips FOR SELECT TO anon, authenticated USING (true);

-- ============ USER NOTES & ITINERARY ============
CREATE TABLE public.user_notes (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  travel_notes TEXT,
  contacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  flight_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_notes TO authenticated;
GRANT ALL ON public.user_notes TO service_role;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_own_all" ON public.user_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template TEXT NOT NULL, -- '9d','12d','14d'
  days JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_itinerary TO authenticated;
GRANT ALL ON public.user_itinerary TO service_role;
ALTER TABLE public.user_itinerary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "itinerary_own_all" ON public.user_itinerary FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ SEED: prayer categories ============
INSERT INTO public.prayer_categories (id, name, icon, sort_order) VALUES
  ('perjalanan', 'Doa Perjalanan', '📍', 1),
  ('masjidil-haram', 'Doa di Masjidil Haram', '🕌', 2),
  ('sai', 'Doa Sa''i', '🏃', 3),
  ('masjid-nabawi', 'Doa di Masjid Nabawi', '🕌', 4),
  ('dzikir', 'Dzikir & Wirid Harian', '🤲', 5);

-- ============ SEED: guide stages ============
INSERT INTO public.guide_stages (id, step_number, title, short_desc, icon) VALUES
  ('miqat', 1, 'Miqat & Niat Ihram', 'Memulai dengan niat suci dan pakaian ihram', '🤍'),
  ('tawaf', 2, 'Tawaf (7 Putaran)', 'Mengelilingi Ka''bah sebanyak 7 kali', '🕋'),
  ('sholat-makam', 3, 'Sholat di Makam Ibrahim', 'Dua rakaat di belakang Makam Ibrahim', '🤲'),
  ('multazam-zamzam', 4, 'Doa di Multazam & Zamzam', 'Berdoa di Multazam dan minum air Zamzam', '💧'),
  ('sai', 5, 'Sa''i (7 Perjalanan)', 'Berjalan antara Shafa dan Marwa', '🏃'),
  ('tahallul', 6, 'Tahallul', 'Mencukur rambut dan menyelesaikan ihram', '✂️');

-- ============ SEED: prayers ============
INSERT INTO public.prayers (category_id, title, context, arabic, latin, translation, sort_order) VALUES
  ('perjalanan','Doa Keluar Rumah','Dibaca saat hendak berangkat dari rumah','بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ','Bismillāhi tawakkaltu ''alallāh, wa lā ḥawla wa lā quwwata illā billāh','Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan upaya kecuali dengan pertolongan Allah.',1),
  ('perjalanan','Doa Naik Kendaraan','Dibaca saat naik kendaraan','سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ','Subḥānalladzī sakhkhara lanā hādzā wa mā kunnā lahū muqrinīn','Maha Suci Allah yang telah menundukkan semua ini bagi kami, padahal kami sebelumnya tidak mampu menguasainya.',2),
  ('perjalanan','Doa Masuk Kota Makkah','Dibaca ketika tiba di kota Makkah','اللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ فَحَرِّمْ لَحْمِي وَدَمِي عَلَى النَّارِ','Allāhumma hādzā ḥaramuka wa amnuka, faḥarrim laḥmī wa damī ''alan-nār','Ya Allah, ini adalah tanah haram-Mu dan tempat aman-Mu, maka haramkanlah daging dan darahku dari api neraka.',3),
  ('masjidil-haram','Doa Pertama Melihat Ka''bah','Sangat dianjurkan saat pertama kali melihat Ka''bah','اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً','Allāhumma zid hādzal-baita tasyrīfan wa ta''zhīman wa takrīman wa mahābah','Ya Allah, tambahkanlah pada Baitullah ini kemuliaan, keagungan, kehormatan, dan kewibawaan.',1),
  ('masjidil-haram','Doa Masuk Masjidil Haram','Dibaca ketika hendak masuk Masjidil Haram','اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ','Allāhummaftaḥ lī abwāba raḥmatik','Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',2),
  ('masjidil-haram','Doa Tawaf (Umum)','Dibaca selama tawaf','رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ','Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ''adzāban-nār','Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa api neraka.',3),
  ('masjidil-haram','Doa Minum Air Zamzam','Dibaca sebelum minum air Zamzam','اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ','Allāhumma innī as''aluka ''ilman nāfi''an wa rizqan wāsi''an wa syifā''an min kulli dā''','Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit.',4),
  ('sai','Doa di Bukit Shafa','Dibaca ketika berada di Shafa','إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ','Innaṣ-ṣafā wal-marwata min sya''ā''irillāh','Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar (agama) Allah. (QS. Al-Baqarah: 158)',1),
  ('sai','Doa di Bukit Marwah','Dibaca ketika berada di Marwah','اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ','Allāhu akbar, Allāhu akbar, Allāhu akbar, wa lillāhil-ḥamd','Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, dan segala puji bagi Allah.',2),
  ('masjid-nabawi','Doa Masuk Masjid Nabawi','Dibaca saat memasuki Masjid Nabawi','اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ','Allāhumma ṣalli ''alā Muḥammad waftaḥ lī abwāba raḥmatik','Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan bukakanlah untukku pintu-pintu rahmat-Mu.',1),
  ('masjid-nabawi','Salam kepada Rasulullah ﷺ','Dibaca saat ziarah ke makam Nabi','السَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ','Assalāmu ''alaika yā Rasūlallāh wa raḥmatullāhi wa barakātuh','Semoga keselamatan, rahmat Allah, dan keberkahan-Nya tercurah kepadamu, wahai Rasulullah.',2),
  ('dzikir','Istighfar','Memohon ampun kepada Allah','أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ','Astaghfirullāhal-''azhīm','Aku memohon ampun kepada Allah Yang Maha Agung.',1),
  ('dzikir','Sholawat Nabi','Bersholawat kepada Nabi Muhammad ﷺ','اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ','Allāhumma ṣalli ''alā Muḥammad wa ''alā āli Muḥammad','Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarga Nabi Muhammad.',2),
  ('dzikir','Tasbih, Tahmid, Takbir','Dzikir setelah sholat','سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ','Subḥānallāh, walḥamdulillāh, wallāhu akbar','Maha Suci Allah, segala puji bagi Allah, dan Allah Maha Besar.',3);

-- ============ SEED: checklist items ============
INSERT INTO public.checklist_items (id, phase, label, info, sort_order) VALUES
  ('h6m-1','h6m','Paspor valid minimal 6 bulan dari tanggal kembali','Cek tanggal expired di paspor dan perpanjang bila perlu',1),
  ('h6m-2','h6m','Foto paspor latar putih (50 lembar)','Untuk berbagai keperluan visa dan dokumen',2),
  ('h6m-3','h6m','Akte nikah / buku nikah (untuk suami istri)','Wajib bagi yang berangkat berpasangan',3),
  ('h6m-4','h6m','Kartu Keluarga terbaru','Cetak terbaru di kelurahan',4),
  ('h6m-5','h6m','KTP yang masih berlaku','Pastikan tidak expired',5),
  ('h3m-1','h3m','Daftar ke travel agent atau urus visa mandiri','Pilih jalur sesuai kebutuhan',1),
  ('h3m-2','h3m','Booking tiket pesawat','Lebih awal lebih murah',2),
  ('h3m-3','h3m','Booking hotel Makkah','Cari yang dekat Masjidil Haram',3),
  ('h3m-4','h3m','Booking hotel Madinah','Cari yang dekat Masjid Nabawi',4),
  ('h3m-5','h3m','Vaksin meningitis','Wajib, min. 2 minggu sebelum berangkat',5),
  ('h3m-6','h3m','Download aplikasi Nusuk','Wajib dari Pemerintah Arab Saudi',6),
  ('h1m-1','h1m','Pakaian ihram (2 set untuk pria)','Pilih bahan handuk berkualitas',1),
  ('h1m-2','h1m','Mukena / sajadah ringan (untuk wanita)','Pilih yang adem dan mudah dilipat',2),
  ('h1m-3','h1m','Koper sesuai aturan maskapai','Cek berat maksimal',3),
  ('h1m-4','h1m','Tas kecil untuk dokumen','Untuk dibawa di kabin',4),
  ('h1m-5','h1m','Sandal nyaman untuk berjalan jauh','Hindari sandal baru',5),
  ('h1m-6','h1m','Obat-obatan pribadi + P3K','Bawa resep dokter bila perlu',6),
  ('h1m-7','h1m','Masker (untuk cuaca panas)','Bawa stok cukup',7),
  ('h1m-8','h1m','Botol minum refillable','Untuk isi air Zamzam',8),
  ('h1w-1','h1w','Cek jadwal penerbangan','Pastikan tidak ada perubahan',1),
  ('h1w-2','h1w','Download semua doa untuk offline','Buka menu Settings → Offline',2),
  ('h1w-3','h1w','Charge power bank','Pastikan full',3),
  ('h1w-4','h1w','Konfirmasi hotel','Hubungi hotel via email/WhatsApp',4),
  ('h1w-5','h1w','Beritahu keluarga jadwal keberangkatan','Berikan salinan itinerary',5),
  ('h1d-1','h1d','Siapkan semua dokumen di tas tangan','Paspor, tiket, visa, asuransi',1),
  ('h1d-2','h1d','Timbang koper','Pastikan tidak overweight',2),
  ('h1d-3','h1d','Mandi sunnah','Sebelum berangkat',3),
  ('h1d-4','h1d','Sholat sunnah safar','Dua rakaat sebelum berangkat',4);

-- ============ SEED: photo spots ============
INSERT INTO public.photo_spots (title, city, best_time, best_time_label, popularity, location_desc, gps_link, best_time_reason, angle_tips, camera_tips, warnings, tags, is_premium) VALUES
  ('Ka''bah dari Lantai 2 Masjidil Haram','makkah','pagi','Setelah Subuh 05:30-06:30',5,'Lantai 2 Masjidil Haram, area depan-tengah','https://maps.google.com/?q=21.4225,39.8262','Setelah Subuh: cahaya golden hour dari timur, jumlah jamaah masih sedikit, langit biru keemasan.','Berdiri di koridor tengah, Ka''bah tepat di tengah frame. Gunakan portrait atau wide angle.','Aktifkan HDR, kecerahan +1, timer 3 detik agar tidak goyang.','Hormati jamaah yang sedang ibadah. Dilarang foto di dalam Ka''bah.',ARRAY['MasjidilHaram','Makkah','Umroh'],false),
  ('Payung Ka''bah Malam Hari','makkah','malam','21:00-23:00 WIB',5,'Halaman utama Masjidil Haram','https://maps.google.com/?q=21.4225,39.8262','Malam hari payung dibuka penuh dengan pencahayaan dramatis.','Foto dari bawah ke atas, sertakan payung dan bintang langit.','Mode Night di HP, ISO rendah, gunakan tripod kecil.','Jangan halangi jalur jamaah.',ARRAY['MasjidilHaram','Malam'],false),
  ('Eskalator Viral Masjidil Haram','makkah','siang','Siang hari',4,'Pintu King Fahd, eskalator utama','https://maps.google.com/?q=21.4225,39.8262','Pencahayaan natural dari skylight terlihat indah.','Foto dari atas eskalator dengan komposisi simetris.','Mode portrait dengan blur background.','Hati-hati saat berhenti foto agar tidak menghalangi jamaah.',ARRAY['MasjidilHaram','Viral'],false),
  ('Abraj Al Bait / Clock Tower','makkah','malam','Maghrib & malam',4,'Halaman Masjidil Haram','https://maps.google.com/?q=21.4189,39.8262','Lampu clock tower menyala spektakuler di malam hari.','Foto dengan Ka''bah di depan, clock tower di belakang.','Wide angle, ISO sedang.','Jaga jarak aman.',ARRAY['Makkah','ClockTower'],false),
  ('Jabal Nur (Gua Hira)','makkah','pagi','Subuh sebelum mendaki',3,'Sekitar 4 km dari Masjidil Haram','https://maps.google.com/?q=21.4566,39.8597','Pemandangan kota Makkah dari puncak saat sunrise.','Foto panorama dari puncak.','Wide angle, pakai filter polarizer.','Pendakian cukup berat, siapkan fisik.',ARRAY['Makkah','Sejarah'],true),
  ('Kubah Hijau Masjid Nabawi','madinah','pagi','Golden hour 06:00-07:00',5,'Halaman Masjid Nabawi sisi Selatan','https://maps.google.com/?q=24.4672,39.6111','Cahaya pagi menyinari kubah dengan warna emas.','Foto dari halaman dengan komposisi rule of thirds.','HDR aktif, exposure +0.5.','Jangan masuk area khusus jamaah.',ARRAY['Madinah','MasjidNabawi'],false),
  ('Payung Raksasa Masjid Nabawi','madinah','siang','Sebelum Dzuhur saat payung terbuka',5,'Halaman utama Masjid Nabawi','https://maps.google.com/?q=24.4672,39.6111','Payung terbuka membentuk pola geometris yang indah.','Foto dari bawah ke atas dengan ultra wide angle.','Wide angle, fokus tengah.','Cuaca panas, gunakan masker.',ARRAY['Madinah','Payung'],false),
  ('Pintu Gerbang Masjid Nabawi','madinah','pagi','Pagi setelah Subuh',4,'Gerbang utama Bab As-Salam','https://maps.google.com/?q=24.4672,39.6111','Cahaya lembut menyinari ornamen pintu.','Foto detail ornamen dengan portrait mode.','Portrait mode HP, blur background.','Tidak boleh menghalangi jalur jamaah.',ARRAY['Madinah','Arsitektur'],false),
  ('Koridor Pilar Putih Masjid Nabawi','madinah','siang','Setelah Dzuhur',4,'Koridor utama','https://maps.google.com/?q=24.4672,39.6111','Pilar putih simetris membentuk pola minimalis.','Foto perspektif satu titik di tengah koridor.','Ultra wide, simetri.','Jangan ganggu jamaah yang itikaf.',ARRAY['Madinah','Minimalis'],true),
  ('Masjid Quba','madinah','pagi','Sebelum Dzuhur',3,'Sekitar 5 km dari Masjid Nabawi','https://maps.google.com/?q=24.4392,39.6172','Fasad putih masjid bersih dengan langit biru.','Foto fasad simetris dengan jalan masuk.','Wide angle, exposure normal.','—',ARRAY['Madinah','Quba'],true),
  ('Jabal Uhud','madinah','siang','Pagi-siang',3,'Sekitar 5 km utara Madinah','https://maps.google.com/?q=24.5042,39.6122','Panorama gunung dengan langit biru.','Foto landscape lebar.','Wide angle, polarizer.','Panas, bawa air.',ARRAY['Madinah','Sejarah'],true),
  ('Kebun Kurma Madinah','madinah','pagi','Pagi saat panen',3,'Di sekitar Madinah','https://maps.google.com/?q=24.5,39.6','Cahaya pagi pada buah kurma yang segar.','Detail close-up buah, atau wide untuk pohon.','Macro mode untuk detail.','Minta izin pemilik.',ARRAY['Madinah','Kurma'],true);

-- ============ SEED: practical tips ============
INSERT INTO public.practical_tips (category, title, content, sort_order) VALUES
  ('transport','Bus Sholawat Makkah','Bus gratis dari pemerintah Arab Saudi yang menghubungkan hotel-hotel di sekitar Masjidil Haram. Tap kartu di mesin, jangan bayar tunai. Rute utama: Aziziyah, Misfalah, Shisha. Beroperasi 24 jam kecuali saat puncak musim haji.',1),
  ('transport','Taksi & Uber','Uber dan Careem tersedia di Makkah dan Madinah. Tarif standar lebih murah dari taksi argo. Pastikan tujuan jelas, simpan nama hotel dalam bahasa Arab di HP.',2),
  ('transport','Kereta Haramain','Kereta cepat Makkah-Madinah, tempuh ~2,5 jam. Beli tiket via app Haramain Train atau di stasiun. Jadwal: tiap 1-2 jam. Bawa paspor.',3),
  ('emergency','Nomor Darurat KJRI Jeddah','+966-12-671-1271 (24 jam). Untuk kehilangan paspor, kasus hukum, atau bantuan darurat WNI.',1),
  ('emergency','Polisi Arab Saudi','911 (darurat umum). Bisa juga 999 di beberapa wilayah.',2),
  ('emergency','Bila Tersesat','Cari security/petugas (askar) berseragam coklat. Sebut nama hotel atau alamat. Titik kumpul: Pintu King Fahd Masjidil Haram, Bab As-Salam Masjid Nabawi.',3),
  ('emergency','Lapor Kehilangan Paspor','Segera ke KJRI/KBRI atau hotline +966-12-671-1271. Bawa fotokopi paspor (selalu pisahkan dengan aslinya).',4),
  ('health','Suhu Tanah Suci per Bulan','Jan-Feb: 18-28°C, Mar-Apr: 22-35°C, Mei-Sep: 30-45°C (puncak panas), Okt-Des: 22-32°C. Bulan terbaik: November-Februari.',1),
  ('health','Hindari Dehidrasi','Minum 500ml air sebelum tawaf. Bawa botol refillable, isi Zamzam. Minum tiap 1-2 jam meski tidak haus.',2),
  ('health','Tanda Heat Stroke','Pusing, mual, kulit panas tapi tidak berkeringat, bingung. Segera ke tempat teduh, minum air, kompres dingin, panggil tim medis.',3),
  ('health','Hemat Baterai HP','Matikan 5G, kurangi kecerahan, gunakan mode hemat daya, bawa power bank min. 10.000 mAh.',4),
  ('shopping','Pasar Zamzam Tower','Pusat oleh-oleh paling lengkap. Negosiasi bisa 30-50% dari harga awal. Beli oleh-oleh di hari terakhir agar tidak terlalu berat.',1),
  ('shopping','Oleh-oleh Wajib','Kurma Ajwa (Rp 200-500rb/kg), air Zamzam (gratis di masjid), sajadah (Rp 50-200rb), tasbih (Rp 20-100rb), kismis, kacang Arab.',2),
  ('shopping','Tips Negosiasi','Senyum dan sapa "Assalamualaikum". Tawar mulai 30-50% dari harga awal. Bandingkan 2-3 toko. Bayar tunai bisa diskon ekstra.',3),
  ('tech','SIM Card Lokal','STC, Mobily, Zain. Beli di bandara atau toko resmi. Paket turis 7-30 hari mulai SAR 50. Wajib registrasi paspor.',1),
  ('tech','Hemat Kuota Internet','Download peta Google Maps offline. Download semua konten Program Perencanaan Umroh untuk mode offline. WhatsApp gunakan WiFi hotel saja.',2),
  ('tech','Peta Offline Google Maps','Buka Google Maps → ketik Makkah/Madinah → menu titik 3 → Download offline map. Sangat membantu saat tidak ada sinyal.',3);
