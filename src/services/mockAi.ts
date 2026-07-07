export const getMockResponse = (userPrompt: string): Promise<{ text: string; pluginUsed?: string }> => {
  return new Promise((resolve) => {
    // Simulasi delay pengetikan alami (800ms - 1500ms)
    const delay = 800 + Math.random() * 700;

    setTimeout(() => {
      const prompt = userPrompt.toLowerCase();

      // 1. Panduan Gejala (Symptom Checker)
      if (
        prompt.includes('gejala') ||
        prompt.includes('demam') ||
        prompt.includes('batuk') ||
        prompt.includes('pusing') ||
        prompt.includes('sakit') ||
        prompt.includes('nyeri') ||
        prompt.includes('lambung') ||
        prompt.includes('flu')
      ) {
        resolve({
          text: `### 🩺 Edukasi & Pemahaman Gejala Kesehatan

Terima kasih telah membagikan kondisi yang Anda rasakan. Memahami gejala awal adalah langkah penting dalam menjaga kesehatan tubuh, namun perlu diingat bahwa satu gejala dapat disebabkan oleh berbagai faktor yang berbeda.

#### Kemungkinan Penyebab Umum:
*   **Demam & Batuk:** Sering kali merupakan mekanisme pertahanan alami tubuh untuk melawan infeksi virus atau bakteri (seperti selesma, flu, atau infeksi saluran pernapasan).
*   **Sakit Kepala / Pusing:** Dapat dipicu oleh kelelahan fisik, stres emosional, kurang tidur, dehidrasi, atau telat makan.
*   **Nyeri Lambung / Sakit Perut:** Umumnya berhubungan dengan masalah pencernaan seperti gastritis (maag), pola makan tidak teratur, makanan pedas/asam, atau stres.

#### Rekomendasi Perawatan Mandiri di Rumah:
1.  **Istirahat Cukup:** Berikan waktu bagi tubuh untuk memulihkan energi dan memperbaiki jaringan yang terganggu.
2.  **Cukupi Kebutuhan Cairan:** Minumlah air hangat secara teratur untuk menjaga kelembapan tenggorokan dan mencegah dehidrasi.
3.  **Pantau Gejala:** Catat kapan gejala mulai dirasakan, tingkat keparahannya, serta hal yang memperingan atau memperburuk keluhan.

> [!WARNING]
> **Segera konsultasikan dengan tenaga medis apabila:**
> Gejala tidak membaik dalam 3 hari, atau Anda mengalami tanda kedaruratan seperti sesak napas, nyeri dada hebat, demam tinggi yang tidak turun dengan obat penurun panas, muntah terus-menerus, atau leher kaku.
>
> *Edukasi Kesehatan: Informasi ini ditujukan untuk edukasi umum dan bukan merupakan diagnosis medis resmi.*`,
          pluginUsed: 'Symptom',
        });
        return;
      }

      // 2. Nutrisi & Pola Makan
      if (
        prompt.includes('nutrisi') ||
        prompt.includes('diet') ||
        prompt.includes('makan') ||
        prompt.includes('sehat') ||
        prompt.includes('kalori') ||
        prompt.includes('resep') ||
        prompt.includes('protein')
      ) {
        resolve({
          text: `### 🍎 Nutrisi Seimbang & Pola Makan Sehat

Pola makan yang seimbang adalah pilar utama dari tubuh yang sehat. Memenuhi kebutuhan makronutrisi (karbohidrat, protein, lemak) dan mikronutrisi (vitamin, mineral) secara tepat dapat meningkatkan energi, imunitas, dan produktivitas Anda.

#### Panduan Piring Makan Sehat (Isi Piringku Kemenkes RI):
*   **Lauk Pauk (Sumber Protein):** Dada ayam panggang, tempe, tahu, ikan, telur, dan yoghurt Yunani. Protein penting untuk pertumbuhan dan perbaikan jaringan sel tubuh.
*   **Makanan Pokok (Karbohidrat Kompleks):** Nasi merah, kentang rebus, ubi, atau kinoa yang memberikan energi stabil tanpa memicu lonjakan gula darah mendadak.
*   **Sayuran & Buah-buahan:** Bayam, brokoli, wortel, apel, dan pepaya sebagai sumber serat larut, vitamin, dan antioksidan untuk melancarkan pencernaan.

#### Kebiasaan Baik yang Direkomendasikan:
*   Batasi konsumsi makanan olahan, gula tambahan, dan lemak jenuh berlebih.
*   Kunyah makanan dengan perlahan untuk membantu enzim pencernaan bekerja optimal.
*   Jadwalkan waktu makan yang teratur guna menjaga kestabilan metabolisme tubuh.

> [!NOTE]
> **Edukasi Kesehatan:**
> Pemenuhan nutrisi harian yang tepat sangat mendukung kesehatan metabolisme jangka panjang. Jika Anda memiliki kondisi medis tertentu seperti diabetes atau hipertensi, silakan konsultasikan dengan dokter atau spesialis gizi untuk menu yang disesuaikan.`,
          pluginUsed: 'Nutrition',
        });
        return;
      }

      // 3. Aktivitas Fisik (Workout)
      if (
        prompt.includes('olahraga') ||
        prompt.includes('aktivitas') ||
        prompt.includes('gym') ||
        prompt.includes('lari') ||
        prompt.includes('cardio') ||
        prompt.includes('latihan') ||
        prompt.includes('fitness')
      ) {
        resolve({
          text: `### 🏃 Panduan Aktivitas Fisik & Olahraga

Melakukan aktivitas fisik secara konsisten sangat baik untuk kesehatan fisik maupun mental Anda. Program olahraga yang seimbang sebaiknya memadukan latihan kekuatan otot dengan latihan ketahanan jantung (kardiovaskular).

#### Rekomendasi Aktivitas Fisik Mingguan (WHO & Kemenkes):
1.  **Aktivitas Kardio (150 menit per minggu):** Olahraga intensitas sedang seperti jalan cepat, bersepeda, atau berenang yang dibagi dalam 3–5 hari.
2.  **Latihan Kekuatan (2 hari per minggu):** Latihan yang melatih kelompok otot besar (seperti squat, push-up, plank) untuk menjaga kekuatan tulang dan otot.
3.  **Latihan Kelenturan & Keseimbangan:** Peregangan statis, yoga, atau mobilitas sendi untuk mencegah risiko cedera otot.

#### Contoh Jadwal Latihan Mingguan Sederhana:
*   **Senin:** Latihan kekuatan tubuh (squat, push-up, lunge menggunakan berat badan).
*   **Rabu:** 30 menit jalan cepat atau lari santai (jogging) diikuti dengan peregangan otot leher dan kaki.
*   **Jumat:** Latihan kekuatan fokus otot inti (plank, sit-up, core workout).
*   **Akhir Pekan:** Pemulihan aktif seperti berjalan santai atau yoga bersama keluarga.

> [!TIP]
> Selalu luangkan waktu 5 menit untuk pemanasan (warming-up) sebelum berolahraga dan pendinginan (cooling-down) sesudahnya demi mencegah cedera otot dan sendi.`,
          pluginUsed: 'Workout',
        });
        return;
      }

      // 4. Asupan Air & Hidrasi
      if (
        prompt.includes('air') ||
        prompt.includes('minum') ||
        prompt.includes('hidrasi') ||
        prompt.includes('dehidrasi')
      ) {
        resolve({
          text: `### 💧 Kebutuhan Hidrasi & Asupan Air Harian

Sekitar 60% tubuh manusia terdiri atas air. Memenuhi asupan cairan sangat penting untuk berbagai proses metabolisme, menjaga suhu tubuh, melancarkan pencernaan, serta membantu fungsi ginjal membuang racun.

#### Parameter Kebutuhan Cairan:
*   **Target Umum:** Sekitar 2 hingga 2,5 liter (8–10 gelas) per hari untuk orang dewasa sehat. Kebutuhan ini bertambah saat berolahraga, cuaca panas, atau ketika sedang sakit demam.
*   **Indikator Warna Urine:** Cara termudah mengukur tingkat hidrasi adalah memantau warna urine Anda. Warna kuning pucat/jernih menandakan tubuh terhidrasi dengan baik. Warna kuning pekat mengindikasikan tubuh kekurangan cairan (dehidrasi).

#### Kebiasaan Praktis untuk Memenuhi Kebutuhan Air:
1.  **Gelas Pertama:** Biasakan minum satu gelas air putih hangat sesaat setelah bangun tidur di pagi hari.
2.  **Sediakan Botol Minum:** Letakkan botol air minum di meja kerja atau di tas Anda agar selalu terlihat sebagai pengingat visual.
3.  **Minum Sebelum Makan:** Minumlah segelas air sekitar 30 menit sebelum makan untuk membantu melancarkan lambung.

> [!NOTE]
> Jangan menunggu hingga Anda merasa sangat haus untuk minum. Rasa haus yang berlebih menandakan tubuh Anda sudah mulai memasuki fase dehidrasi ringan yang dapat memicu pusing dan penurunan konsentrasi.`,
          pluginUsed: 'Water',
        });
        return;
      }

      // 5. Pola Tidur & Istirahat
      if (
        prompt.includes('tidur') ||
        prompt.includes('istirahat') ||
        prompt.includes('insomnia') ||
        prompt.includes('lelah') ||
        prompt.includes('malam') ||
        prompt.includes('begadang')
      ) {
        resolve({
          text: `### 😴 Kebiasaan Tidur Sehat (Sleep Hygiene)

Tidur berkualitas sama pentingnya dengan nutrisi seimbang dan olahraga teratur. Kurang tidur kronis dapat mengganggu konsentrasi, menurunkan imunitas, serta meningkatkan risiko gangguan kesehatan metabolik.

#### Langkah Menjaga Kualitas Tidur (Sleep Hygiene):
*   **Jadwal Konsisten:** Usahakan untuk tidur dan bangun pada jam yang sama setiap hari, termasuk di hari libur.
*   **Kondisi Kamar:** Buatlah suasana kamar tidur yang tenang, gelap, dan sejuk guna merangsang produksi hormon melatonin alami.
*   **Rutinitas Sebelum Tidur:** Lakukan aktivitas relaksasi selama 30–60 menit sebelum tidur, seperti membaca buku fisik, menulis jurnal, atau meditasi pernapasan. Hindari penggunaan gadget.

#### Hal yang Perlu Dibatasi:
*   **Paparan Layar Elektronik:** Sinar biru (blue light) dari HP atau laptop dapat menekan produksi melatonin, sehingga Anda lebih sulit mengantuk.
*   **Kafein & Kafe:** Hindari konsumsi kopi, teh pekat, atau minuman bersoda setelah jam 2 siang.
*   **Makan Berat:** Usahakan tidak makan besar dalam waktu 2–3 jam sebelum waktu tidur Anda.

> [!TIP]
> Paparan sinar matahari pagi selama 10–15 menit setelah bangun dapat membantu menyinkronkan jam biologis tubuh (ritme sirkadian) agar Anda lebih mudah tidur di malam hari.`,
          pluginUsed: 'Sleep',
        });
        return;
      }

      // 6. Indeks Massa Tubuh (BMI)
      if (
        prompt.includes('bmi') ||
        prompt.includes('indeks massa tubuh') ||
        prompt.includes('berat badan') ||
        prompt.includes('tinggi badan')
      ) {
        resolve({
          text: `### 📈 Pemahaman Indeks Massa Tubuh (BMI)

Indeks Massa Tubuh (IMT / BMI) adalah metode skrining sederhana untuk memperkirakan kategori berat badan seseorang berdasarkan perbandingan tinggi dan berat badannya. Rumusnya adalah berat badan (kg) dibagi kuadrat tinggi badan dalam meter ($IMT = kg/m^2$).

#### Klasifikasi IMT menurut Kemenkes RI:
*   **Sangat Kurus (Underweight):** IMT kurang dari 18,5
*   **Normal:** IMT 18,5 hingga 25,0
*   **Gemuk (Overweight):** IMT 25,1 hingga 27,0
*   **Sangat Gemuk (Obese):** IMT lebih dari 27,0

#### Keterbatasan Analisis IMT:
*   **Massa Otot:** IMT tidak membedakan massa otot dengan lemak. Atlet binaraga dapat tergolong "overweight" karena massa ototnya yang padat, meskipun kadar lemak tubuhnya rendah.
*   **Distribusi Lemak:** Metode ini tidak menunjukkan lokasi penumpukan lemak tubuh (misalnya lemak viseral di area perut yang berisiko lebih tinggi memicu penyakit kardiovaskular).

> [!NOTE]
> **Edukasi Kesehatan:**
> IMT merupakan panduan awal yang baik, namun untuk mengetahui kondisi kesehatan tubuh secara menyeluruh, dokter biasanya juga mengevaluasi lingkar pinggang, tekanan darah, dan profil lipid darah Anda. Anda dapat menggunakan fitur hitung otomatis pada halaman **Dasbor Kesehatan** kami.`,
          pluginUsed: 'BMI',
        });
        return;
      }

      // 7. Gaya Hidup & Kesehatan Jantung
      if (
        prompt.includes('gaya hidup') ||
        prompt.includes('jantung') ||
        prompt.includes('stres') ||
        prompt.includes('meditasi') ||
        prompt.includes('pikiran') ||
        prompt.includes('hipertensi')
      ) {
        resolve({
          text: `### ❤️ Gaya Hidup Sehat & Kesehatan Jantung

Menjaga kesehatan jantung memerlukan pendekatan menyeluruh yang mencakup pengelolaan stres, aktivitas fisik teratur, serta pola makan seimbang. Jantung adalah motor utama sirkulasi darah Anda yang perlu dijaga kebugarannya setiap hari.

#### Pilar Gaya Hidup Sehat:
1.  **Kelola Stres:** Stres kronis memicu produksi hormon kortisol yang dapat meningkatkan tekanan darah. Sempatkan meditasi, latihan pernapasan dalam (deep breathing), atau berjalan santai di taman selama 10 menit.
2.  **Pola Makan Ramah Jantung:** Kurangi konsumsi garam berlebih (natrium), gorengan, dan batasi konsumsi daging olahan. Perbanyak asupan makanan tinggi kalium seperti pisang, sayuran hijau, dan minyak zaitun.
3.  **Hindari Asap Rokok:** Menjauhi rokok dan paparan asap rokok adalah langkah paling krusial untuk menurunkan risiko penyakit jantung koroner secara signifikan.
4.  **Kontrol Tekanan Darah:** Lakukan pengukuran tekanan darah secara berkala. Tekanan darah normal orang dewasa berada di kisaran 120/80 mmHg.

> [!NOTE]
> **Edukasi Kesehatan:**
> Langkah kecil yang konsisten seperti berjalan kaki 8.000 langkah sehari dan membatasi konsumsi makanan tinggi garam sangat berharga bagi kesehatan pembuluh darah dan jantung Anda di masa depan.`,
          pluginUsed: 'Lifestyle',
        });
        return;
      }

      // Default Response
      resolve({
        text: `### Halo! Saya HealthMate AI 🩺

Saya adalah asisten kesehatan edukatif pribadi Anda. Saya di sini untuk membantu memberikan informasi kesehatan umum, edukasi gejala ringan, serta rekomendasi gaya hidup sehat seperti olahraga, nutrisi, hidrasi, dan pola tidur.

#### Ada yang bisa saya bantu hari ini?
*   "Apa penyebab sakit kepala tegang?"
*   "Bagaimana cara menjaga pola makan sehat?"
*   "Berapa kebutuhan air minum harian saya?"
*   "Saya mengalami demam, apa yang harus dilakukan?"

Untuk mencatat asupan air secara mandiri, mengukur Indeks Massa Tubuh (IMT), atau mencatat kalori harian, silakan kunjungi menu **Dasbor Kesehatan**.

> [!IMPORTANT]
> **Penafian Medis Penting:**
> HealthMate AI hanya menyediakan informasi kesehatan untuk tujuan edukasi umum. Layanan ini bukan merupakan diagnosis medis dan tidak dapat menggantikan konsultasi langsung dengan dokter atau tenaga kesehatan profesional. Jika Anda mengalami gejala parah atau kondisi darurat medis, mohon segera hubungi layanan darurat atau kunjungi fasilitas kesehatan terdekat.`,
      });
    }, delay);
  });
};
