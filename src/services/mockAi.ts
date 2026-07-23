export const getMockResponse = (
  userPrompt: string,
  enabledPlugins: string[] = [],
  conversationHistory: any[] = [],
  attachedFile?: any | null
): Promise<{
  text: string;
  pluginUsed?: string;
  functionCall?: {
    name: string;
    args: any;
  };
}> => {
  const allPluginsEnabled = enabledPlugins.length === 0;
  const hasPlugin = (name: string) => allPluginsEnabled || enabledPlugins.includes(name);

  return new Promise((resolve) => {
    const delay = 600 + Math.random() * 400; // Sedikit lebih cepat untuk responsivitas mock

    setTimeout(() => {
      const prompt = userPrompt.toLowerCase();

      // A. Tangani offline double-turn (percakapan setelah tool dieksekusi)
      if (!userPrompt.trim() && conversationHistory && conversationHistory.length > 0) {
        const lastMsg = conversationHistory[conversationHistory.length - 1];
        const lastPart = lastMsg.parts?.[0];
        if (lastPart && 'functionResponse' in lastPart) {
          const responseName = lastPart.functionResponse.name;
          const responseData = lastPart.functionResponse.response;
          let text = 'Data berhasil dicatat ke dasbor Anda!';
          if (responseData && responseData.status === 'success') {
            if (responseName === 'add_water') {
              text = `Saya telah mencatat asupan air minum Anda sebesar **${responseData.added} ml**. Total asupan air Anda hari ini menjadi **${responseData.newTotal} ml** (Target: ${responseData.goal} ml). Jaga terus hidrasi tubuh Anda!`;
            } else if (responseName === 'add_calorie') {
              text = `Makanan **"${responseData.foodName}"** sebesar **${responseData.added} kcal** berhasil dicatat ke kategori **${responseData.mealType}**. Total asupan kalori hari ini adalah **${responseData.newTotal} kcal** dari target **${responseData.goal} kcal**.`;
            } else if (responseName === 'add_exercise') {
              text = `Aktivitas **"${responseData.activityType}"** selama **${responseData.duration} menit** berhasil disimpan. Total durasi olahraga Anda hari ini adalah **${responseData.newTotalDuration} menit** dengan total **${responseData.newSteps} langkah**. Bagus sekali!`;
            } else if (responseName === 'add_sleep') {
              text = `Tidur selama **${responseData.duration} jam** dengan kualitas **"${responseData.quality}"** telah dicatat. Pastikan Anda tidur cukup secara konsisten ya!`;
            } else if (responseName === 'calculate_bmi') {
              text = `IMT Anda telah dihitung! Nilai BMI Anda adalah **${responseData.bmi}** yang termasuk kategori **${responseData.category}** (Berat: ${responseData.weight} kg, Tinggi: ${responseData.height} cm).`;
            }
          }
          resolve({ text });
          return;
        }
      }

      // C. Tangani analisis makanan via gambar (Offline Vision Mock)
      if (attachedFile && hasPlugin('Nutrition')) {
        const baseName = attachedFile.name ? attachedFile.name.split('.')[0] : 'Makanan';
        const cleanFoodName = baseName.replace(/[-_]/g, ' ');
        const amount = 350; // default calorie estimate
        const mealType = 'snack';
        resolve({
          text: '',
          functionCall: {
            name: 'add_calorie',
            args: { foodName: cleanFoodName, amount, mealType }
          }
        });
        return;
      }

      // B. Deteksi kata kunci untuk memicu Tool Call secara luring (Regex Mock Parser)
      
      // 0. Forwarded Dashboard Health Report Analysis (Terapkan SEBELUM Tool Call Triggers)
      const isJournalQuery = prompt.includes('refrensi') || prompt.includes('referensi') || prompt.includes('journal') || prompt.includes('jurnal') || prompt.includes('literatur') || prompt.includes('dapus');
      const isReportPrompt = prompt.includes('[laporan kesehatan dasbor saya]') || prompt.includes('laporan kesehatan dasbor') || prompt.includes('analisis dasbor harian');
      
      if (isReportPrompt || (isJournalQuery && prompt.includes('dasbor'))) {
        const text = `### 📚 Referensi Jurnal Medis & Analisis Klinis Laporan Kesehatan Dasbor

Berikut adalah evaluasi medis terstruktur beserta **Daftar Jurnal Ilmiah Medis Peer-Reviewed & Panduan WHO** yang menjadi acuan ilmiah untuk 5 pilar metrik pada **[Laporan Kesehatan Dasbor Saya]**:

---

#### 1. ⚖️ Komposisi Tubuh & IMT (BMI)
- **Status Evaluasi:** Indeks massa tubuh Anda dipantau sesuai standar kualifikasi metabolik populasi Asia.
- **📖 Referensi Jurnal Utama:**
  - **WHO Expert Consultation (2004).** *Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies.* **The Lancet**, 363(9403), 157–163. DOI: [10.1016/S0140-6736(03)15268-3](https://doi.org/10.1016/S0140-6736(03)15268-3).
  - **WHO Regional Office for the Western Pacific (2000).** *The Asia-Pacific perspective: Redefining obesity and its treatment.* Health Communications Australia.

#### 2. 💧 Hidrasi & Keseimbangan Cairan Tubuh
- **Status Evaluasi:** Pemenuhan kebutuhan air minum harian esensial untuk filtrasi glomerulus ginjal dan regulasi osmotik sel.
- **📖 Referensi Jurnal Utama:**
  - **Popkin, B. M., D'Anci, K. E., & Rosenberg, I. H. (2010).** *Water, hydration, and health.* **Nutrition Reviews**, 68(8), 439–458. DOI: [10.1111/j.1753-4887.2010.00304.x](https://doi.org/10.1111/j.1753-4887.2010.00304.x).
  - **EFSA Panel on Dietetic Products, Nutrition, and Allergies (2010).** *Scientific Opinion on Dietary Reference Values for water.* **EFSA Journal**, 8(3), 1459.

#### 3. 🍎 Keseimbangan Energi & Nutrisi Kalori
- **Status Evaluasi:** Keseimbangan asupan energi harian dengan *Total Daily Energy Expenditure* (TDEE) mendukung pemeliharaan massa otot bebas lemak.
- **📖 Referensi Jurnal Utama:**
  - **Hall, K. D., et al. (2012).** *Energy balance and its components: implications for body weight regulation.* **The American Journal of Clinical Nutrition**, 95(4), 989–994. DOI: [10.3945/ajcn.112.036350](https://doi.org/10.3945/ajcn.112.036350).
  - **FAO/WHO/UNU Expert Consultation (2004).** *Human energy requirements.* WHO Technical Report Series No. 1.

#### 4. 🏃 Kebugaran & Aktivitas Fisik
- **Status Evaluasi:** Aktivitas kardio dan akumulasi langkah harian terbukti klinis menurunkan risiko kardiometabolik.
- **📖 Referensi Jurnal Utama:**
  - **Bull, F. C., et al. (2020).** *World Health Organization 2020 guidelines on physical activity and sedentary behaviour.* **British Journal of Sports Medicine**, 54(24), 1451–1462. DOI: [10.1136/bjsports-2020-102955](https://doi.org/10.1136/bjsports-2020-102955).
  - **Lee, I. M., et al. (2012).** *Effect of physical inactivity on major non-communicable diseases worldwide.* **The Lancet**, 380(9838), 219–229. DOI: [10.1016/S0140-6736(12)61031-9](https://doi.org/10.1016/S0140-6736(12)61031-9).

#### 5. 💤 Siklus Pemulihan & Kualitas Tidur
- **Status Evaluasi:** Durasi tidur ideal (7-9 jam/malam) mengoptimalkan pembersihan limfatik otak (*Glymphatic Clearance*) dan imunitas seluler.
- **📖 Referensi Jurnal Utama:**
  - **Hirshkowitz, M., et al. (2015).** *National Sleep Foundation’s sleep time duration recommendations: methodology and results summary.* **Sleep Health**, 1(1), 40–43. DOI: [10.1016/j.sleh.2014.12.010](https://doi.org/10.1016/j.sleh.2014.12.010).
  - **Besedovsky, L., Lange, T., & Haack, M. (2019).** *The sleep-immune crosstalk in health and disease.* **Physiological Reviews**, 99(3), 1325–1380. DOI: [10.1152/physrev.00010.2018](https://doi.org/10.1152/physrev.00010.2018).

---

### 💡 Ringkasan Implikasi Klinis:
Semua indikator pada **[Laporan Kesehatan Dasbor Saya]** dirancang mengikuti ambang batas rekomendasi kedokteran pencegahan (*Preventive Medicine*) berbasis bukti (*Evidence-Based Medicine*).

> [!NOTE]
> *Seluruh referensi di atas dipublikasikan dalam jurnal medis internasional terindeks PubMed/MEDLINE.*`;

        resolve({ text });
        return;
      }

      // 1. Air (Water)
      if (hasPlugin('Water') && !isReportPrompt) {
        const waterMatch = prompt.match(/(?:minum|drink|air|water)\s*(\d+)/i) || prompt.match(/(\d+)\s*(?:ml|mili|gelas|glass)/i);
        if (waterMatch) {
          let amount = parseInt(waterMatch[1]);
          if (prompt.includes('gelas') || prompt.includes('glass')) {
            amount = amount * 250;
          }
          if (amount > 0) {
            resolve({
              text: '',
              functionCall: {
                name: 'add_water',
                args: { amount }
              }
            });
            return;
          }
        }
      }

      // 2. Makanan / Kalori (Calories)
      if (hasPlugin('Nutrition')) {
        const calorieMatch = prompt.match(/(\d+)\s*(?:kalori|kcal|calories)/i);
        if (calorieMatch) {
          const amount = parseInt(calorieMatch[1]);
          let foodName = 'Makanan';
          const foodMatch = prompt.match(/(?:makan|eat|konsumsi)\s+([a-zA-Z\s\u00C0-\u017F]+?)(?:\s*(?:sebesar|sekitar)?\s*\d+|\s*$)/i);
          if (foodMatch && foodMatch[1].trim()) {
            foodName = foodMatch[1].trim();
          }
          
          let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch';
          if (prompt.includes('pagi') || prompt.includes('sarapan') || prompt.includes('breakfast')) mealType = 'breakfast';
          else if (prompt.includes('malam') || prompt.includes('dinner')) mealType = 'dinner';
          else if (prompt.includes('cemilan') || prompt.includes('snack') || prompt.includes('sore') || prompt.includes('kopi')) mealType = 'snack';

          resolve({
            text: '',
            functionCall: {
              name: 'add_calorie',
              args: { foodName, amount, mealType }
            }
          });
          return;
        }
      }

      // 3. Olahraga / Aktivitas Fisik (Workout)
      if (hasPlugin('Workout')) {
        const isSymptomContext = prompt.includes('pusing') || prompt.includes('sakit') || prompt.includes('nyeri') || prompt.includes('mendingan') || prompt.includes('gejala') || prompt.includes('keluhan') || prompt.includes('kemudian') || prompt.includes('lalu') || prompt.includes('merasa') || prompt.includes('terasa') || prompt.includes('agak');
        const hasExplicitWorkoutKeyword = prompt.includes('olahraga') || prompt.includes('workout') || prompt.includes('latihan') || prompt.includes('lari') || prompt.includes('run') || prompt.includes('jalan') || prompt.includes('walk') || prompt.includes('sepeda') || prompt.includes('cycle') || prompt.includes('senam') || prompt.includes('gym') || prompt.includes('beban') || prompt.includes('renang') || prompt.includes('swim') || prompt.includes('jogging') || prompt.includes('pushup') || prompt.includes('situp') || prompt.includes('treadmill') || prompt.includes('aerobik');

        const durationMatch = prompt.match(/(\d+)\s*(?:menit|min|minute)/i);
        if (durationMatch && hasExplicitWorkoutKeyword && !isSymptomContext) {
          const duration = parseInt(durationMatch[1]);
          const stepsMatch = prompt.match(/(\d+)\s*(?:langkah|step)/i);
          const steps = stepsMatch ? parseInt(stepsMatch[1]) : undefined;

          let activityType = 'Olahraga';
          if (prompt.includes('lari') || prompt.includes('run') || prompt.includes('jogging')) activityType = 'Lari';
          else if (prompt.includes('jalan') || prompt.includes('walk')) activityType = 'Jalan Kaki';
          else if (prompt.includes('sepeda') || prompt.includes('cycle')) activityType = 'Bersepeda';
          else if (prompt.includes('senam') || prompt.includes('aerobik')) activityType = 'Senam';
          else if (prompt.includes('gym') || prompt.includes('beban')) activityType = 'Angkat Beban';
          else {
            const actMatch = prompt.match(/(?:olahraga|workout|latihan)\s+([a-zA-Z\s]+?)(?:\s*\d+|\s*$)/i);
            if (actMatch && actMatch[1].trim()) {
              activityType = actMatch[1].trim();
            }
          }

          resolve({
            text: '',
            functionCall: {
              name: 'add_exercise',
              args: { activityType, duration, steps }
            }
          });
          return;
        }
      }

      // 4. Tidur (Sleep)
      if (hasPlugin('Sleep')) {
        const sleepMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:jam|hour)/i);
        if (sleepMatch) {
          const duration = parseFloat(sleepMatch[1]);
          let quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
          if (prompt.includes('nyenyak') || prompt.includes('puas') || prompt.includes('segar') || prompt.includes('excellent')) {
            quality = 'Excellent';
          } else if (prompt.includes('buruk') || prompt.includes('kurang') || prompt.includes('poor') || prompt.includes('terbangun')) {
            quality = 'Poor';
          }

          resolve({
            text: '',
            functionCall: {
              name: 'add_sleep',
              args: { duration, quality }
            }
          });
          return;
        }
      }

      // 5. BMI (Tinggi & Berat Badan)
      if (hasPlugin('BMI') && (prompt.includes('bmi') || prompt.includes('imt') || (prompt.includes('berat') && prompt.includes('tinggi')))) {
        const weightMatch = prompt.match(/(?:berat|weight|bb)\s*(\d+(?:\.\d+)?)/i);
        const heightMatch = prompt.match(/(?:tinggi|height|tb)\s*(\d+)/i);
        if (weightMatch && heightMatch) {
          const weight = parseFloat(weightMatch[1]);
          const height = parseFloat(heightMatch[1]);
          resolve({
            text: '',
            functionCall: {
              name: 'calculate_bmi',
              args: { weight, height }
            }
          });
          return;
        }
      }

      // Fallback ke tanggapan teks standar jika tidak ada pemicu tool call

      // 0. Forwarded Dashboard Health Report Analysis
      if (prompt.includes('[laporan kesehatan dasbor saya]') || prompt.includes('laporan kesehatan dasbor') || prompt.includes('analisis dasbor harian')) {
        const text = `### 📊 Analisis Komprehensif Laporan Kesehatan Dasbor

Terima kasih telah meneruskan laporan kesehatan harian Anda ke **HealthMate AI**! Berdasarkan data real-time dasbor Anda, berikut adalah evaluasi klinis dan analisis gaya hidup komprehensif:

---

#### 1. ⚖️ Komposisi Tubuh & IMT (BMI)
- **Evaluasi:** Indeks massa tubuh Anda terpantau berada pada alur pemantauan aktif. Pastikan menjaga indeks massa tubuh dalam kisaran ideal **18.5 – 22.9 kg/m²** (Standar WHO Asia-Pasifik) untuk meminimalkan risiko gangguan kardiovaskular dan metabolisme.

#### 2. 💧 Hidrasi & Keseimbangan Cairan
- **Evaluasi:** Asupan cairan harian Anda berperan penting dalam menjaga elastisitas kulit, kesehatan ginjal, pelumasan sendi, serta konsentrasi mental. Pertahankan konsumsi air secara berkala sepanjang hari.

#### 3. 🍎 Nutrisi & Keseimbangan Kalori
- **Evaluasi:** Keseimbangan asupan energi harian dengan kebutuhan kalori basal (BMR) Anda sangat baik untuk menjaga massa otot dan mencegah penumpukan lemak visceral.

#### 4. 🏃 Aktivitas Fisik & Kebugaran
- **Evaluasi:** Aktivitas fisik dan langkah harian Anda mendukung sirkulasi darah yang lancar serta meningkatkan sensitivitas insulin tubuh.

#### 5. 💤 Pemulihan & Kualitas Tidur
- **Evaluasi:** Durasi tidur yang optimal (7-8 jam per malam) sangat penting untuk sekresi hormon pertumbuhan, regulasi kortisol (stres), serta pemulihan fungsi sel otak.

---

### 💡 Rekomendasi Terpersonalisasi Medi AI:
1. **Hidrasi Teratur:** Minum 1-2 gelas air putih setiap 2-3 jam untuk mencapai target harian secara alami.
2. **Keseimbangan Gizi:** Utamakan sumber karbohidrat kompleks, protein nirlemak, serta serat sayuran hijau pada setiap porsi makan.
3. **Istirahat Berkualitas:** Hindari paparan *blue light* layar smartphone 30 menit sebelum tidur untuk mengoptimalkan fase tidur nyenyak (*Deep Sleep*).

> [!NOTE]
> *Laporan ini merupakan evaluasi edukasi gaya hidup berbasis data dasbor Anda dan bukan diagnosis medis formal. Konsultasikan dengan dokter spesialis untuk pemeriksaan laboratorium klinis berkala.*`;

        resolve({ text });
        return;
      }

      // 1. Panduan Gejala (Symptom Checker)
      if (
        hasPlugin('Symptom') &&
        (prompt.includes('gejala') ||
        prompt.includes('demam') ||
        prompt.includes('batuk') ||
        prompt.includes('pusing') ||
        prompt.includes('sakit') ||
        prompt.includes('nyeri') ||
        prompt.includes('lambung') ||
        prompt.includes('flu') ||
        prompt.includes('gigi') ||
        prompt.includes('mata') ||
        prompt.includes('otot') ||
        prompt.includes('sendi') ||
        prompt.includes('kelamin') ||
        prompt.includes('kemih') ||
        prompt.includes('gatal'))
      ) {
        let text = '';
        
        if (prompt.includes('demam') || prompt.includes('batuk') || prompt.includes('flu') || prompt.includes('pilek')) {
          text = `### 🩺 Edukasi Kesehatan: Demam & Batuk / Flu
          
Terima kasih telah membagikan kondisi Anda. Demam dan batuk umumnya merupakan respons pertahanan alami sistem kekebalan tubuh Anda untuk melawan infeksi virus atau bakteri.

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Perbanyak Cairan:** Minum air putih hangat, sup bening, atau teh herbal hangat untuk melonggarkan tenggorokan dan menjaga hidrasi.
2. **Istirahat Total:** Kurangi aktivitas fisik berat untuk memberikan energi penuh pada sistem kekebalan tubuh.
3. **Kompres Hangat:** Letakkan kompres hangat di dahi atau lipatan ketiak untuk membantu menurunkan demam secara bertahap.

> [!WARNING]
> Segera hubungi dokter jika demam berlangsung lebih dari 3 hari, suhu tubuh melebihi 39°C, atau disertai sesak napas berat.`;
        } 
        else if (prompt.includes('pusing') || prompt.includes('sakit kepala') || prompt.includes('migrain')) {
          text = `### 🩺 Edukasi Kesehatan: Sakit Kepala & Pusing
          
Sakit kepala atau pusing sering disebabkan oleh ketegangan otot leher, stres emosional, kelelahan, kurang tidur, dehidrasi, atau telat makan.

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Relaksasi di Ruang Gelap:** Berbaringlah di ruangan yang tenang, redup, dan sejuk.
2. **Hidrasi Cukup:** Minum segelas air putih dingin secara perlahan untuk rehidrasi tubuh.
3. **Pijat Ringan:** Pijat pelipis, dahi, dan otot leher belakang Anda dengan lembut menggunakan minyak aromaterapi hangat.

> [!WARNING]
> Segera kunjungi IGD terdekat jika sakit kepala terasa sangat hebat secara mendadak (seperti petir), disertai muntah menyembur, mati rasa, atau kesulitan berbicara.`;
        }
        else if (prompt.includes('lambung') || prompt.includes('perut') || prompt.includes('maag') || prompt.includes('diare') || prompt.includes('mual')) {
          text = `### 🩺 Edukasi Kesehatan: Gangguan Lambung / Perut
          
Nyeri perut atau lambung umumnya berkaitan dengan gangguan pencernaan seperti gastritis (maag), asam lambung naik (GERD), keracunan makanan ringan, atau iritasi usus.

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Pola Makan Halus:** Konsumsi makanan lunak (seperti bubur) dalam porsi kecil namun sering.
2. **Hindari Makanan Pemicu:** Batasi makanan pedas, asam, bersantan, kopi, dan minuman bersoda untuk sementara waktu.
3. **Minuman Jahe Hangat:** Jahe hangat terbukti membantu meredakan mual dan merilekskan otot lambung.

> [!WARNING]
> Konsultasikan dengan tenaga medis jika nyeri perut terasa sangat menusuk (terutama di perut kanan bawah), tinja berwarna hitam, atau muntah darah.`;
        }
        else if (prompt.includes('gigi') || prompt.includes('gusi')) {
          text = `### 🩺 Edukasi Kesehatan: Sakit Gigi & Gusi
          
Sakit gigi biasanya disebabkan oleh gigi berlubang, infeksi akar gigi (abses), atau peradangan pada gusi (gingivitis).

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Kumur Air Garam Hangat:** Larutkan 1/2 sendok teh garam dalam segelas air hangat dan gunakan untuk berkumur guna mengurangi kuman di rongga mulut.
2. **Kompres Es:** Tempelkan kompres es di pipi luar bagian yang sakit untuk meredakan nyeri dan pembengkakan.
3. **Jaga Kebersihan Rongga Mulut:** Sikat gigi secara perlahan dengan sikat berbulu halus dan hindari makanan manis atau terlalu panas/dingin.

> [!WARNING]
> Segera kunjungi dokter gigi jika pembengkakan meluas ke pipi atau leher, atau jika Anda mengalami kesulitan menelan.`;
        }
        else if (prompt.includes('mata')) {
          text = `### 🩺 Edukasi Kesehatan: Gangguan atau Sakit Mata
          
Mata merah, perih, atau berair dapat dipicu oleh iritasi debu, mata kering karena layar gadget, atau infeksi selaput mata (konjungtivitis).

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Kompres Dingin:** Tutup mata Anda dan letakkan kompres dingin bersih di atas kelopak mata selama 10 menit.
2. **Tetes Air Mata Buatan:** Gunakan tetes mata pelembap (artificial tears) tanpa pengawet untuk meredakan iritasi ringan.
3. **Istirahatkan Mata:** Gunakan aturan 20-20-20 (tiap 20 menit menatap layar, tatap objek berjarak 20 kaki selama 20 detik).

> [!WARNING]
> Segera temui dokter spesialis mata jika terjadi penurunan penglihatan secara mendadak, mata terasa sangat nyeri, atau sensitif berlebih terhadap cahaya.`;
        }
        else if (prompt.includes('kelamin') || prompt.includes('kemih') || prompt.includes('penis') || prompt.includes('urin') || prompt.includes('pipis') || prompt.includes('testis') || prompt.includes('vagina') || prompt.includes('intim')) {
          text = `### 🩺 Edukasi Kesehatan: Kesehatan Saluran Kemih & Reproduksi
          
Keluhan perih atau tidak nyaman pada saluran kemih atau area reproduksi sering kali disebabkan oleh Infeksi Saluran Kemih (ISK), iritasi sabun pembersih, kelembapan berlebih, atau ketegangan otot panggul.

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Jangan Menahan Pipis:** Segera buang air kecil saat terasa dorongan untuk membersihkan bakteri dari saluran kemih.
2. **Tingkatkan Hidrasi:** Minum air putih minimal 2-2.5 liter per hari untuk membantu membilas kuman keluar dari tubuh.
3. **Jaga Kehigienisan:** Gunakan pakaian dalam berbahan katun yang longgar dan hindari penggunaan cairan antiseptik berparfum berlebih.

> [!WARNING]
> Temui dokter jika keluhan disertai demam menggigil, urine keruh/berdarah, atau adanya luka/cairan tidak biasa pada area intim.`;
        }
        else {
          let organ = '';
          const organMatch = prompt.match(/(?:sakit|nyeri|gejala)\s+([a-zA-Z]+)/i);
          if (organMatch && organMatch[1]) {
            organ = organMatch[1];
          }
          const organTitle = organ ? organ.charAt(0).toUpperCase() + organ.slice(1) : 'Tubuh';
          
          text = `### 🩺 Edukasi Kesehatan: Rasa Sakit atau Nyeri pada ${organTitle}
          
Rasa nyeri atau tidak nyaman pada bagian ${organTitle} dapat terjadi akibat ketegangan otot, peradangan ringan, atau kelelahan fisik setelah beraktivitas.

#### Langkah Penanganan Awal yang Direkomendasikan:
1. **Istirahatkan Area Terkait:** Hindari membebani bagian ${organTitle} secara berlebihan untuk sementara waktu.
2. **Terapi Suhu:** Gunakan kompres es untuk nyeri baru/bengkak (akut), atau kompres hangat untuk ketegangan otot kronis/pegal.
3. **Jaga Posisi Tubuh:** Pastikan posisi duduk, tidur, dan beraktivitas ergonomis untuk mengurangi beban mekanis.

> [!WARNING]
> Konsultasikan dengan dokter jika nyeri terasa makin memburuk seiring waktu, membatasi ruang gerak secara signifikan, atau disertai pembengkakan dan kemerahan hebat.`;
        }

        resolve({
          text: text + `\n\n*Edukasi Kesehatan: Informasi ini ditujukan untuk edukasi umum dan bukan merupakan diagnosis medis resmi.*`,
          pluginUsed: 'Symptom',
        });
        return;
      }

      // 2. Nutrisi & Pola Makan
      if (
        hasPlugin('Nutrition') &&
        (prompt.includes('nutrisi') ||
        prompt.includes('diet') ||
        prompt.includes('makan') ||
        prompt.includes('sehat') ||
        prompt.includes('kalori') ||
        prompt.includes('resep') ||
        prompt.includes('protein'))
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
        hasPlugin('Workout') &&
        (prompt.includes('olahraga') ||
        prompt.includes('aktivitas') ||
        prompt.includes('gym') ||
        prompt.includes('lari') ||
        prompt.includes('cardio') ||
        prompt.includes('latihan') ||
        prompt.includes('fitness'))
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
        hasPlugin('Water') &&
        (prompt.includes('air') ||
        prompt.includes('minum') ||
        prompt.includes('hidrasi') ||
        prompt.includes('dehidrasi'))
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
        hasPlugin('Sleep') &&
        (prompt.includes('tidur') ||
        prompt.includes('istirahat') ||
        prompt.includes('insomnia') ||
        prompt.includes('lelah') ||
        prompt.includes('malam') ||
        prompt.includes('begadang'))
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
        hasPlugin('BMI') &&
        (prompt.includes('bmi') ||
        prompt.includes('indeks massa tubuh') ||
        prompt.includes('berat badan') ||
        prompt.includes('tinggi badan'))
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
