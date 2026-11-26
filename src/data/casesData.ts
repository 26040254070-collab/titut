export interface ForensicClue {
  id: string;
  label: string;
  excerpt: string;
  isRedFlag: boolean;
  analysis: string;
}

export interface DetectiveQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface SourceReference {
  title: string;
  institution: string;
  url?: string;
  yearOrNote: string;
}

export interface CaseMaterialPoint {
  heading: string;
  summary: string;
}

export interface InvestigationCase {
  id: string;
  caseNumber: number;
  topicCode: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
  topicTitle: string;
  artifactName: string;
  artifactHint: string;
  briefing: string;
  evidenceTitle: string;
  evidenceChannel: string;
  evidenceSender: string;
  evidenceTimestamp: string;
  evidenceClues: ForensicClue[];
  requiredRedFlags: number;
  materialPoints: CaseMaterialPoint[];
  questions: DetectiveQuestion[];
  sources: SourceReference[];
  badgeEarned: string;
}

export const INVESTIGATION_CASES: InvestigationCase[] = [
  {
    id: 'case-1',
    caseNumber: 1,
    topicCode: 'a',
    topicTitle: 'Pengertian Warga Negara yang Baik dan Cerdas',
    artifactName: 'Piagam Identitas Warga Digital',
    artifactHint: 'Klik piagam emas & kartu identitas warga di sisi kiri meja',
    briefing:
      'Sebuah akun anonim mengklaim bahwa menjadi warga negara yang baik di era internet cukup hanya dengan tidak melanggar hukum pidana, tanpa perlu peduli pada literasi digital atau partisipasi sosial. Selidiki berkas definisi kewarganegaraan untuk meluruskan konsep ini.',
    evidenceTitle: 'Utas Opini: "Definisi Warga Negara Era Digital"',
    evidenceChannel: 'Forum Publik Warga',
    evidenceSender: '@warga_pasif99',
    evidenceTimestamp: '14 Nov 2026 · 09:12 WIB',
    evidenceClues: [
      {
        id: 'c1-clue-1',
        label: 'Klaim 1: Kepatuhan pasif sudah cukup',
        excerpt: '"Asal tidak dipenjara dan bayar pajak, kita sudah otomatis jadi warga negara yang cerdas."',
        isRedFlag: true,
        analysis:
          'Keliru. Warga negara yang baik dan cerdas (Good & Smart Citizen) tidak bersikap pasif, melainkan aktif memahami hak dan kewajiban, berpikir kritis, serta berkontribusi bagi kebaikan bersama.'
      },
      {
        id: 'c1-clue-2',
        label: 'Klaim 2: Literasi digital dianggap tidak relevan',
        excerpt: '"Kemampuan memverifikasi informasi dan beretika di internet bukan bagian dari kewarganegaraan."',
        isRedFlag: true,
        analysis:
          'Keliru. Di era digital, ruang publik bergeser ke media daring. Kecakapan digital, etika siber, dan kemampuan menjaga kohesi sosial merupakan pilar utama Smart Citizen.'
      },
      {
        id: 'c1-clue-3',
        label: 'Pernyataan 3: Kesadaran konstitusi',
        excerpt: '"Setiap warga negara memiliki kedudukan yang sama di hadapan hukum dan berhak menyampaikan pendapat secara bertanggung jawab."',
        isRedFlag: false,
        analysis:
          'Benar. Kesadaran akan hak dan kewajiban konstitusional yang dijalankan secara bertanggung jawab merupakan fondasi warga negara yang baik.'
      }
    ],
    requiredRedFlags: 2,
    materialPoints: [
      {
        heading: 'Pengertian Warga Negara yang Baik (Good Citizen)',
        summary:
          'Individu yang menyadari status hukum dan moralnya dalam negara, melaksanakan hak serta kewajiban secara seimbang, menaati norma dan konstitusi, serta memiliki kepedulian terhadap kepentingan publik.'
      },
      {
        heading: 'Pengertian Warga Negara yang Cerdas (Smart Citizen)',
        summary:
          'Warga negara abad ke-21 yang mampu memanfaatkan pengetahuan, pemikiran kritis, literasi media, dan teknologi digital secara etis untuk memecahkan masalah bersama dan memperkuat demokrasi.'
      },
      {
        heading: 'Integrasi Keduanya di Era Digital',
        summary:
          'Menurut Cogan & Derricott (1998) serta konsep Pendidikan Kewarganegaraan (Winataputra), Smart Citizen memadukan karakter moral Pancasila, partisipasi aktif, kesadaran global, dan kecakapan digital.'
      }
    ],
    questions: [
      {
        id: 'c1-q1',
        prompt:
          'Manakah pernyataan yang paling tepat menggambarkan pengertian "Smart Citizen" atau warga negara yang baik dan cerdas di era digital?',
        options: [
          {
            id: 'a',
            text: 'Warga negara yang menguasai perangkat teknologi terbaru meskipun jarang memverifikasi kebenaran informasi.',
            isCorrect: false,
            feedback:
              'Kecakapan teknis tanpa literasi kritis dan etika belum menjadikan seseorang Smart Citizen.'
          },
          {
            id: 'b',
            text: 'Warga negara yang sadar hak dan kewajiban, berpikir kritis, beretika di ruang digital, dan berpartisipasi konstruktif demi kebaikan bersama.',
            isCorrect: true,
            feedback:
              'Tepat! Smart Citizen memadukan kesadaran kewarganegaraan, nalar kritis, etika digital, dan kontribusi sosial.'
          },
          {
            id: 'c',
            text: 'Warga negara yang hanya mengikuti opini mayoritas di media sosial agar terhindar dari perdebatan.',
            isCorrect: false,
            feedback:
              'Smart Citizen berpikir mandiri dan reflektif, bukan sekadar ikut-ikutan arus opini.'
          }
        ]
      },
      {
        id: 'c1-q2',
        prompt:
          'Mengapa dimensi kewarganegaraan saat ini tidak bisa dipisahkan dari aktivitas di ruang digital?',
        options: [
          {
            id: 'a',
            text: 'Karena layanan publik, penyampaian aspirasi, dan pembentukan opini masyarakat kini berlangsung intensif di ekosistem digital.',
            isCorrect: true,
            feedback:
              'Benar! Ruang digital telah menjadi ruang publik modern tempat hak, kewajiban, dan etika warga negara diuji setiap hari.'
          },
          {
            id: 'b',
            text: 'Karena aturan hukum negara tidak berlaku di dunia maya.',
            isCorrect: false,
            feedback:
              'Keliru. Hukum dan norma etika tetap berlaku penuh di ruang digital.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Citizenship for the 21st Century: An International Perspective on Education',
        institution: 'Cogan, J. J., & Derricott, R. (Kogan Page)',
        yearOrNote: '1998 — Konsep Multidimensional Citizenship'
      },
      {
        title: 'Pendidikan Kewarganegaraan: Paradigma Baru Smart and Good Citizen',
        institution: 'Winataputra, U. S. — Universitas Terbuka / Kemendikbudristek',
        yearOrNote: '2016 — Landasan PKn Indonesia'
      },
      {
        title: 'Modul Budaya Bermedia Digital (Cakap, Aman, Budaya, Etika Digital)',
        institution: 'Kementerian Komunikasi dan Digital (Komdigi) / Siberkreasi',
        url: 'https://literasidigital.id',
        yearOrNote: 'Kerangka Literasi Digital Nasional'
      }
    ],
    badgeEarned: 'Penjaga Piagam Warga'
  },
  {
    id: 'case-2',
    caseNumber: 2,
    topicCode: 'b',
    topicTitle: 'Karakteristik Warga Negara yang Cerdas',
    artifactName: 'Berkas Profil Karakter Siber',
    artifactHint: 'Klik map berkas kuning "PROFIL KARAKTER" di depan monitor',
    briefing:
      'Tim investigasi menemukan tiga profil akun publik yang mengaku sebagai teladan warga digital. Periksa jejak aktivitas mereka dan temukan dua pola perilaku yang bertentangan dengan karakteristik warga negara cerdas.',
    evidenceTitle: 'Audit Jejak Digital: 3 Pola Interaksi Akun',
    evidenceChannel: 'Log Pemantauan Ruang Publik',
    evidenceSender: 'Arsip Forensik #02',
    evidenceTimestamp: '16 Nov 2026 · 14:30 WIB',
    evidenceClues: [
      {
        id: 'c2-clue-1',
        label: 'Pola A: Reaktif tanpa cek konteks',
        excerpt: 'Langsung membagikan potongan video 10 detik bernada marah dengan judul provokatif tanpa membaca kronologi utuh.',
        isRedFlag: true,
        analysis:
          'Bertentangan dengan karakteristik berpikir reflektif dan rasa ingin tahu intelektual sebelum bertindak.'
      },
      {
        id: 'c2-clue-2',
        label: 'Pola B: Menolak dialog lintas sudut pandang',
        excerpt: 'Memblokir dan melabeli semua pihak yang berbeda pendapat sebagai musuh negara tanpa argumen berbasis data.',
        isRedFlag: true,
        analysis:
          'Bertentangan dengan karakter toleran, terbuka terhadap dialog demokratis, dan empati sosial.'
      },
      {
        id: 'c2-clue-3',
        label: 'Pola C: Transparansi & koreksi diri',
        excerpt: 'Mengakui kekeliruan saat data yang dibagikan ternyata usang, lalu menerbitkan ralat beserta tautan sumber primer.',
        isRedFlag: false,
        analysis:
          'Ini adalah karakteristik nyata warga negara yang cerdas: jujur secara intelektual, bertanggung jawab, dan mengutamakan kebenaran.'
      }
    ],
    requiredRedFlags: 2,
    materialPoints: [
      {
        heading: '1. Berpikir Kritis & Reflektif',
        summary:
          'Tidak mudah terprovokasi emosi sesaat; selalu mengevaluasi klaim, motif, dan bukti di balik informasi.'
      },
      {
        heading: '2. Melek Literasi Media & Informasi',
        summary:
          'Mampu mengakses, menganalisis, mengevaluasi, serta memproduksi informasi secara akurat dan bertanggung jawab.'
      },
      {
        heading: '3. Tanggung Jawab Sosial & Empati Digital',
        summary:
          'Memahami bahwa setiap ketikan dan unggahan berdampak nyata bagi martabat, keamanan, dan keharmonisan masyarakat.'
      },
      {
        heading: '4. Partisipatif, Adaptif & Taat Hukum',
        summary:
          'Aktif terlibat dalam solusi masalah komunitas secara damai, adaptif terhadap perubahan teknologi, dan menjunjung etika serta aturan hukum.'
      }
    ],
    questions: [
      {
        id: 'c2-q1',
        prompt:
          'Ketika seorang warga digital menemukan kekeliruan pada unggahan informasinya sendiri, tindakan mana yang mencerminkan karakteristik Smart Citizen?',
        options: [
          {
            id: 'a',
            text: 'Menghapus unggahan diam-diam lalu menyalahkan pihak lain agar reputasi akun tetap bersih.',
            isCorrect: false,
            feedback:
              'Menghindar dari tanggung jawab tidak mencerminkan integritas intelektual.'
          },
          {
            id: 'b',
            text: 'Membuat klarifikasi terbuka, mencabut informasi keliru, dan menyertakan sumber fakta yang benar.',
            isCorrect: true,
            feedback:
              'Benar! Kejujuran intelektual dan akuntabilitas sosial adalah ciri khas warga negara yang cerdas.'
          },
          {
            id: 'c',
            text: 'Membiarkannya saja selama unggahan tersebut mendapat banyak tanda suka.',
            isCorrect: false,
            feedback:
              'Popularitas tidak membenarkan penyebaran informasi yang salah.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Media and Information Literacy Curriculum for Educators and Learners',
        institution: 'UNESCO',
        url: 'https://www.unesco.org/en/media-information-literacy',
        yearOrNote: '2021 — Karakteristik Warga Melek Informasi'
      },
      {
        title: 'Digital Citizenship in Schools (9 Elements of Digital Citizenship)',
        institution: 'Mike Ribble — ISTE',
        yearOrNote: '2015 — Literasi, Etiket, Hak & Tanggung Jawab Digital'
      }
    ],
    badgeEarned: 'Analis Karakter Warga'
  },
  {
    id: 'case-3',
    caseNumber: 3,
    topicCode: 'c',
    topicTitle: 'Dimensi-Dimensi Kecerdasan Warga Negara',
    artifactName: 'Prisma 5 Dimensi Kecerdasan',
    artifactHint: 'Klik artefak prisma kristal bersinar di tengah kanan meja',
    briefing:
      'Artefak Prisma Kecerdasan Kewarganegaraan mengalami ketidakseimbangan! Ada anggapan bahwa kecerdasan warga negara hanya diukur dari nilai IQ atau kecakapan teknis semata. Periksa pancaran 5 dimensi Civic Intelligence untuk mengembalikan keseimbangannya.',
    evidenceTitle: 'Diagnostik Prisma: Ketimpangan Dimensi Warga',
    evidenceChannel: 'Laboratorium Civic Intelligence',
    evidenceSender: 'Sensor Dimensi 5-Sisi',
    evidenceTimestamp: '18 Nov 2026 · 11:05 WIB',
    evidenceClues: [
      {
        id: 'c3-clue-1',
        label: 'Anomali 1: Reduksi kecerdasan hanya pada aspek kognitif',
        excerpt: '"Seseorang yang hafal pasal undang-undang tetapi gemar merundung di kolom komentar tetap tergolong cerdas sempurna secara kewarganegaraan."',
        isRedFlag: true,
        analysis:
          'Salah! Kecerdasan warga negara bersifat multidimensional: aspek intelektual harus diimbangi oleh kecerdasan emosional, moral/spiritual, dan sosial.'
      },
      {
        id: 'c3-clue-2',
        label: 'Anomali 2: Mengabaikan kecerdasan digital',
        excerpt: '"Kecerdasan kewarganegaraan cukup mencakup kecerdasan sosial tatap muka, tidak perlu memahami keamanan data dan algoritma media."',
        isRedFlag: true,
        analysis:
          'Keliru. Di era masyarakat jaringan, kecerdasan digital (memahami privasi, algoritma, dan jejak digital) merupakan dimensi krusial.'
      },
      {
        id: 'c3-clue-3',
        label: 'Prinsip 3: Sinergi lima dimensi',
        excerpt: '"Kecerdasan intelektual, emosional, spiritual/moral, sosial, dan digital bekerja serentak membimbing keputusan warga."',
        isRedFlag: false,
        analysis:
          'Tepat! Kelima dimensi saling melengkapi agar warga negara tidak hanya pintar secara nalar, tetapi juga berempati, bermoral, dan cakap digital.'
      }
    ],
    requiredRedFlags: 2,
    materialPoints: [
      {
        heading: '1. Dimensi Intelektual (Civic Knowledge & Reasoning)',
        summary:
          'Kemampuan memahami konsep demokrasi, hukum, isu publik, serta menganalisis informasi dan argumen secara logis berbasis bukti.'
      },
      {
        heading: '2. Dimensi Emosional (Emotional Intelligence)',
        summary:
          'Kemampuan mengelola emosi saat menghadapi berita provokatif, menahan diri dari kemarahan impulsif, serta memiliki empati terhadap korban atau kelompok rentan.'
      },
      {
        heading: '3. Dimensi Spiritual & Moral (Ethical & Value-Based)',
        summary:
          'Keteguhan pada nilai kejujuran, keadilan, ketuhanan, serta hati nurani sehingga tidak menyalahgunakan teknologi untuk menipu atau merugikan sesama.'
      },
      {
        heading: '4. Dimensi Sosial-Kewarganegaraan (Civic Participation)',
        summary:
          'Kemampuan berkolaborasi, berdialog secara santun lintas perbedaan, serta berkontribusi dalam aksi sosial maupun pengawasan kebijakan publik.'
      },
      {
        heading: '5. Dimensi Digital (Digital & Cyber Intelligence)',
        summary:
          'Kecakapan melindungi privasi dan keamanan siber, memahami cara kerja algoritma/AI, serta memelihara jejak digital yang sehat dan produktif.'
      }
    ],
    questions: [
      {
        id: 'c3-q1',
        prompt:
          'Saat membaca unggahan yang sangat memancing amarah, seorang pengguna menenangkan diri terlebih dahulu sebelum berkomentar agar tidak terpancing ujaran kebencian. Dimensi kecerdasan apakah yang paling menonjol bekerja?',
        options: [
          {
            id: 'a',
            text: 'Dimensi Emosional yang bersinergi dengan Dimensi Moral.',
            isCorrect: true,
            feedback:
              'Tepat! Pengendalian emosi dan kesadaran etis mencegah kita bereaksi destruktif di ruang digital.'
          },
          {
            id: 'b',
            text: 'Hanya kecerdasan teknis perangkat keras.',
            isCorrect: false,
            feedback:
              'Mengendalikan amarah adalah bagian dari kecerdasan emosional dan etika, bukan teknis perangkat.'
          }
        ]
      },
      {
        id: 'c3-q2',
        prompt:
          'Mengapa Dimensi Intelektual saja tidak cukup tanpa Dimensi Moral dan Sosial?',
        options: [
          {
            id: 'a',
            text: 'Karena kecerdasan intelektual tanpa kompas moral dapat disalahgunakan untuk manipulasi informasi, penipuan siber, atau polarisasi sosial.',
            isCorrect: true,
            feedback:
              'Benar sekali! Kepintaran tanpa etika dan empati justru membahayakan ekosistem publik.'
          },
          {
            id: 'b',
            text: 'Karena dimensi intelektual tidak dibutuhkan dalam demokrasi.',
            isCorrect: false,
            feedback:
              'Dimensi intelektual tetap penting, namun harus berjalan beriringan dengan keempat dimensi lainnya.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Civic Intelligence and the Knowledge Society',
        institution: 'Douglas Schuler — Evergreen State College / Public Sphere Project',
        yearOrNote: '2008 — Kerangka Kecerdasan Kewarganegaraan Kolektif'
      },
      {
        title: 'Penguatan Pendidikan Karakter & Dimensi Profil Pelajar Pancasila',
        institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI',
        url: 'https://kurikulum.kemdikbud.go.id',
        yearOrNote: 'Bernalar Kritis, Berakhlak Mulia, Berkebinekaan Global'
      }
    ],
    badgeEarned: 'Penjaga Prisma 5 Dimensi'
  },
  {
    id: 'case-4',
    caseNumber: 4,
    topicCode: 'd',
    topicTitle: 'Berpikir Kritis dan Pengambilan Keputusan',
    artifactName: 'Terminal Forensik SIFT',
    artifactHint: 'Klik layar laptop forensik di bagian tengah meja',
    briefing:
      'Sebuah portal berita viral berpenampilan profesional menerbitkan artikel berjudul "Studi Rahasia: Minum Air Es Setelah Makan Langsung Menyebabkan Gagal Ginjal Akut!". Gunakan metode berpikir kritis SIFT untuk mengaudit artikel ini sebelum mengambil keputusan.',
    evidenceTitle: 'Artikel Viral: "Peringatan Medis Darurat!"',
    evidenceChannel: 'Situs Berita Tidak Dikenal',
    evidenceSender: 'kabardunia-sehat24[.]xyz',
    evidenceTimestamp: '19 Nov 2026 · 07:45 WIB',
    evidenceClues: [
      {
        id: 'c4-clue-1',
        label: 'Sumber domain mencurigakan',
        excerpt: 'Alamat situs menggunakan domain baru kabardunia-sehat24[.]xyz tanpa halaman redaksi atau alamat kantor yang jelas.',
        isRedFlag: true,
        analysis:
          'Tahap SIFT (Investigate the Source): Domain gratis/acak tanpa rekam jejak redaksi terverifikasi Dewan Pers adalah indikasi kuat situs clickbait atau disinformasi.'
      },
      {
        id: 'c4-clue-2',
        label: 'Klaim absolut tanpa rujukan jurnal/otoritas',
        excerpt: '"Menurut pakar luar negeri yang namanya dirahasiakan, 100% peminum air es mengalami pembekuan organ seketika."',
        isRedFlag: true,
        analysis:
          'Tahap SIFT (Find Better Coverage & Trace Claims): Klaim medis tanpa nama peneliti, institusi kredibel, atau tautan jurnal ilmiah tidak dapat dipercaya.'
      },
      {
        id: 'c4-clue-3',
        label: 'Desakan emosional untuk segera menyebarkan',
        excerpt: '"SEBARKAN SEKARANG sebelum artikel ini dihapus oleh pihak tertentu! Nyawa keluarga Anda taruhannya!"',
        isRedFlag: true,
        analysis:
          'Tahap SIFT (Stop): Ajakan panik dan teori konspirasi penghapusan artikel adalah taktik klasik rekayasa emosi agar pembaca tidak sempat berpikir kritis.'
      }
    ],
    requiredRedFlags: 3,
    materialPoints: [
      {
        heading: 'Metode SIFT (Mike Caulfield)',
        summary:
          '1) Stop (Berhenti sejenak sebelum percaya/membagikan), 2) Investigate the Source (Selidiki kredibilitas penerbit/penulis), 3) Find Better Coverage (Cari liputan media kredibel lain), 4) Trace Claims (Lacak kutipan, data, dan foto hingga ke sumber asli).'
      },
      {
        heading: 'Membedakan Fakta, Opini, dan Manipulasi',
        summary:
          'Fakta dapat diuji dengan bukti objektif dan konsensus ahli; Opini adalah penilaian subjektif; Manipulasi sengaja memelintir konteks atau menciptakan fabrikasi.'
      },
      {
        heading: 'Mewaspadai Bias Kognitif',
        summary:
          'Waspadai Confirmation Bias (hanya percaya kabar yang cocok dengan keyakinan pribadi) dan Availability Heuristic (menganggap informasi yang sering muncul di linimasa pasti benar).'
      }
    ],
    questions: [
      {
        id: 'c4-q1',
        prompt:
          'Dalam metode berpikir kritis SIFT, apa langkah PERTAMA yang harus dilakukan saat melihat berita menghebohkan di linimasa?',
        options: [
          {
            id: 'a',
            text: 'Langsung berkomentar menanyakan kebenarannya sambil menekan tombol bagikan.',
            isCorrect: false,
            feedback:
              'Membagikan meski dengan kalimat tanya tetap ikut menyebarkan jangkauan disinformasi.'
          },
          {
            id: 'b',
            text: 'Stop: berhenti sejenak, kendalikan reaksi emosional, dan cek apakah kita mengenal serta mempercayai sumbernya.',
            isCorrect: true,
            feedback:
              'Tepat! Jeda sejenak (Stop) memutus siklus penyebaran impulsif dan memberi ruang bagi nalar kritis.'
          }
        ]
      },
      {
        id: 'c4-q2',
        prompt:
          'Bagaimana cara terbaik melakukan "Find Better Coverage" untuk klaim kesehatan di atas?',
        options: [
          {
            id: 'a',
            text: 'Membaca kolom komentar di bawah unggahan viral tersebut.',
            isCorrect: false,
            feedback:
              'Kolom komentar sering dipenuhi opini atau bot, bukan bukti ilmiah yang terverifikasi.'
          },
          {
            id: 'b',
            text: 'Mencari topik tersebut di situs otoritas kesehatan resmi seperti Kemenkes RI, WHO, atau kanal cek fakta independen.',
            isCorrect: true,
            feedback:
              'Benar! Verifikasi silang (lateral reading) ke sumber otoritatif adalah kunci pengambilan keputusan berbasis bukti.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'SIFT (The Four Moves) for Evaluating Digital Information',
        institution: 'Mike Caulfield — University of Washington Center for an Informed Public',
        url: 'https://hapgood.us/2019/06/19/sift-the-four-moves/',
        yearOrNote: '2019 — Metode Literasi Kritis Digital'
      },
      {
        title: 'Penjelasan Medis Kemenkes RI tentang Konsumsi Air Dingin & Kesehatan',
        institution: 'Kementerian Kesehatan Republik Indonesia',
        url: 'https://kemkes.go.id',
        yearOrNote: 'Klarifikasi Mitos Kesehatan Masyarakat'
      }
    ],
    badgeEarned: 'Auditor Kritis SIFT'
  },
  {
    id: 'case-5',
    caseNumber: 5,
    topicCode: 'e',
    topicTitle: 'Etika Penggunaan Teknologi dan Media Sosial',
    artifactName: 'Smartphone Bukti Jejak Digital',
    artifactHint: 'Klik smartphone barang bukti di sebelah kanan meja',
    briefing:
      'Ditemukan tangkapan layar dari sebuah grup media sosial siswa/mahasiswa yang mengunggah foto KTP teman dan menyebarkan ejekan fisik terhadap seorang pengguna lain tanpa izin. Identifikasi pelanggaran etika dan hukum digital pada bukti tersebut.',
    evidenceTitle: 'Tangkapan Layar Unggahan Media Sosial',
    evidenceChannel: 'Platform Media Sosial Publik',
    evidenceSender: '@akun_komentar_bebas',
    evidenceTimestamp: '20 Nov 2026 · 21:14 WIB',
    evidenceClues: [
      {
        id: 'c5-clue-1',
        label: 'Doxing data pribadi (Foto KTP & alamat)',
        excerpt: '"Nih alamat rumah dan NIK dia biar kalian bisa datangi ramai-ramai!" (disertai foto KTP tanpa sensor).',
        isRedFlag: true,
        analysis:
          'Pelanggaran berat privasi dan UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022). Menyebarkan data pribadi tanpa izin (doxing) membahayakan keselamatan individu.'
      },
      {
        id: 'c5-clue-2',
        label: 'Perundungan siber (Cyberbullying)',
        excerpt: '"Wajah begini aja sok bikin konten, mending hapus akun selamanya!"',
        isRedFlag: true,
        analysis:
          'Melanggar prinsip Netiket ("Remember the Human") serta ketentuan penghinaan/perundungan di ruang digital yang meninggalkan trauma psikologis dan jejak digital buruk.'
      },
      {
        id: 'c5-clue-3',
        label: 'Pengambilan karya tanpa kredit/izin',
        excerpt: 'Mengunggah ulang ilustrasi seniman lain dengan menghapus watermark pembuatnya lalu diklaim sebagai karya sendiri.',
        isRedFlag: true,
        analysis:
          'Pelanggaran etika hak kekayaan intelektual (Hak Cipta). Smart Citizen wajib menghargai karya orang lain dan mencantumkan atribusi atau izin resmi.'
      }
    ],
    requiredRedFlags: 3,
    materialPoints: [
      {
        heading: 'Prinsip Netiket & Kesadaran Jejak Digital',
        summary:
          'Setiap komentar, foto, dan interaksi meninggalkan Jejak Digital (Digital Footprint) yang sulit dihapus permanen dan mencerminkan reputasi pribadi maupun profesional kita di masa depan.'
      },
      {
        heading: 'Perlindungan Data Pribadi & Anti-Doxing',
        summary:
          'Dilarang membagikan data sensitif (NIK, nomor telepon, alamat, foto pribadi orang lain tanpa persetujuan). Di Indonesia dilindungi oleh UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).'
      },
      {
        heading: 'Anti-Perundungan Siber & Penghormatan Hak Cipta',
        summary:
          'Terapkan prinsip T.H.I.N.K. (True, Helpful, Inspiring, Necessary, Kind) sebelum mengunggah, hormati hak cipta/atribusi, dan patuhi norma kesantunan serta UU ITE.'
      }
    ],
    questions: [
      {
        id: 'c5-q1',
        prompt:
          'Mengapa kita tidak boleh mengunggah foto tiket pesawat, kartu pelajar, atau KTP orang lain (maupun diri sendiri) secara terbuka di media sosial?',
        options: [
          {
            id: 'a',
            text: 'Karena data pribadi dan barcode di dalamnya dapat disalahgunakan untuk pencurian identitas, penipuan finansial, atau doxing.',
            isCorrect: true,
            feedback:
              'Benar! Melindungi privasi diri dan orang lain adalah kewajiban etis dan hukum di era digital.'
          },
          {
            id: 'b',
            text: 'Karena algoritma media sosial tidak menyukai gambar dokumen kertas.',
            isCorrect: false,
            feedback:
              'Risiko utamanya adalah keamanan data pribadi dan penyalahgunaan identitas, bukan sekadar algoritma.'
          }
        ]
      },
      {
        id: 'c5-q2',
        prompt:
          'Jika seseorang mengkritik kebijakan publik di media sosial, bagaimana cara menyampaikannya sesuai etika Smart Citizen?',
        options: [
          {
            id: 'a',
            text: 'Menyampaikan argumen berbasis data dan fakta terhadap substansi kebijakan tanpa menyerang fisik atau menyebar kebencian.',
            isCorrect: true,
            feedback:
              'Tepat! Kritik yang sehat berfokus pada gagasan dan solusi, bukan penghinaan personal.'
          },
          {
            id: 'b',
            text: 'Menggunakan akun anonim agar bebas melontarkan makian.',
            isCorrect: false,
            feedback:
              'Anonimitas bukan alasan untuk meninggalkan etika berkomunikasi.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Undang-Undang RI Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)',
        institution: 'JDIH Pemerintah Republik Indonesia',
        url: 'https://peraturan.bpk.go.id',
        yearOrNote: '2022 — Dasar Hukum Perlindungan Privasi Digital'
      },
      {
        title: 'Etis Bermedia Digital — Seri Modul Literasi Digital',
        institution: 'Kementerian Komunikasi dan Digital (Komdigi) & Japelidi',
        url: 'https://literasidigital.id',
        yearOrNote: 'Panduan Netiket & Jejak Digital Indonesia'
      }
    ],
    badgeEarned: 'Penjaga Etika Siber'
  },
  {
    id: 'case-6',
    caseNumber: 6,
    topicCode: 'f',
    topicTitle: 'Contoh Perilaku Cerdas dalam Kehidupan Sehari-hari',
    artifactName: 'Buku Panduan Aksi Harian',
    artifactHint: 'Klik tumpukan buku panduan biru di sisi kiri belakang meja',
    briefing:
      'Bagaimana wujud nyata Smart Citizen dalam keseharian mahasiswa, pelajar, dan warga masyarakat? Audit catatan kebiasaan harian berikut untuk membedakan praktik cerdas dari kebiasaan berisiko.',
    evidenceTitle: 'Catatan Kebiasaan Digital Harian Warga',
    evidenceChannel: 'Observasi Lapangan Harian',
    evidenceSender: 'Jurnal Lapangan #06',
    evidenceTimestamp: '22 Nov 2026 · 16:00 WIB',
    evidenceClues: [
      {
        id: 'c6-clue-1',
        label: 'Kebiasaan 1: Satu kata sandi untuk semua akun',
        excerpt: '"Saya pakai tanggal lahir sebagai password semua aplikasi bank, email, dan media sosial biar tidak lupa, tanpa mengaktifkan 2FA."',
        isRedFlag: true,
        analysis:
          'Berisiko tinggi! Jika satu layanan mengalami kebocoran data, seluruh akun finansial dan pribadi ikut terancam. Smart Citizen memakai sandi kuat berbeda dan autentikasi dua faktor (2FA).'
      },
      {
        id: 'c6-clue-2',
        label: 'Kebiasaan 2: Menjaga kerukunan grup pesan keluarga',
        excerpt: '"Saat paman meneruskan pesan berantai meragukan di grup WhatsApp keluarga, saya mencari link klarifikasi resmi lalu menanggapi secara sopan dan pribadi tanpa mempermalukannya."',
        isRedFlag: false,
        analysis:
          'Contoh perilaku cerdas terbaik! Meluruskan informasi dengan bukti akurat sekaligus menjaga adab dan empati komunikasi.'
      },
      {
        id: 'c6-clue-3',
        label: 'Kebiasaan 3: Mengeklik APK undangan dari nomor tak dikenal',
        excerpt: '"Ada nomor asing mengirim file Undangan_Pernikahan.apk di WhatsApp, langsung saya instal untuk melihat isinya."',
        isRedFlag: true,
        analysis:
          'Sangat berbahaya! File .apk dari sumber tak resmi merupakan modus malware pencuri OTP perbankan (sniffer). Jangan pernah menginstal aplikasi di luar toko aplikasi resmi.'
      }
    ],
    requiredRedFlags: 2,
    materialPoints: [
      {
        heading: 'Keamanan Digital Sehari-hari (Cyber Hygiene)',
        summary:
          'Gunakan kombinasi kata sandi unik, aktifkan Autentikasi Dua Faktor (2FA), tolak file .apk mencurigakan di pesan instan, dan periksa izin aplikasi sebelum menginstal.'
      },
      {
        heading: 'Konsumsi & Distribusi Informasi Bijak',
        summary:
          'Membiasakan membaca berita secara utuh (bukan hanya judul), meluruskan hoaks di grup keluarga dengan cara santun berbasis fakta, serta mengikuti akun edukatif.'
      },
      {
        heading: 'Kontribusi Positif & Jejak Digital Produktif',
        summary:
          'Menggunakan media digital untuk belajar, berkarya kreatif, berdonasi melalui platform resmi terverifikasi, dan mempromosikan budaya positif serta toleransi.'
      }
    ],
    questions: [
      {
        id: 'c6-q1',
        prompt:
          'Anggota keluarga di grup WhatsApp membagikan informasi bantuan sosial palsu berisi tautan formulir. Apa perilaku Smart Citizen yang paling tepat?',
        options: [
          {
            id: 'a',
            text: 'Mengisi tautan tersebut untuk mencoba apakah benar mendapat hadiah.',
            isCorrect: false,
            feedback:
              'Tautan palsu dapat mencuri data pribadi dan mengambil alih akun Anda (phishing).'
          },
          {
            id: 'b',
            text: 'Memeriksa situs resmi kementerian terkait (misalnya kemensos.go.id), lalu menginformasikan dengan sopan bahwa tautan tersebut penipuan agar anggota grup lain tidak menjadi korban.',
            isCorrect: true,
            feedback:
              'Tepat! Anda memutus rantai penipuan sekaligus mengedukasi lingkungan terdekat secara santun.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Panduan Aman Bermedia Digital: Waspada Penipuan Phishing & File APK',
        institution: 'Badan Siber dan Sandi Negara (BSSN) & Komdigi',
        url: 'https://bssn.go.id',
        yearOrNote: '2024 — Edukasi Keamanan Siber Masyarakat'
      },
      {
        title: 'Waspada Modus Penipuan Digital Berkedok Undangan & Bansos',
        institution: 'Otoritas Jasa Keuangan (OJK) — Kontak 157',
        url: 'https://sikapiuangmu.ojk.go.id',
        yearOrNote: '2024 — Literasi Keamanan Finansial Digital'
      }
    ],
    badgeEarned: 'Praktisi Harian Cerdas'
  },
  {
    id: 'case-7',
    caseNumber: 7,
    topicCode: 'g',
    topicTitle: 'Masalah Informasi / Hoaks, Cara Menyikapi & Sumber Akurat',
    artifactName: 'Brankas Verifikasi & Peta Hoaks',
    artifactHint: 'Klik kaca pembesar & papan bukti di bagian belakang meja',
    briefing:
      'Kasus Puncak! Tiga pesan berantai yang pernah ramai beredar di Indonesia masuk ke meja forensik: isu prediksi gempa bumi berkekuatan besar dari "BMKG", penipuan tautan bansos/undian bank, dan hoaks kesehatan. Bongkar seluruh indikatornya dan pastikan saluran verifikasi resmi!',
    evidenceTitle: 'Kompilasi 3 Kasus Hoaks Terdokumentasi di Indonesia',
    evidenceChannel: 'Layanan Aduan Konten & Cek Fakta',
    evidenceSender: 'Arsip Kasus Publik Indonesia',
    evidenceTimestamp: '24 Nov 2026 · 19:20 WIB',
    evidenceClues: [
      {
        id: 'c7-clue-1',
        label: 'Hoaks 1: Prediksi Gempa Megathrust Tanggal & Jam Spesifik',
        excerpt: '"Info resmi BMKG: Malam ini pukul 23.15 WIB akan terjadi gempa 8,9 SR di Pulau Jawa, segera mengungsi!"',
        isRedFlag: true,
        analysis:
          'HOAKS! BMKG berkali-kali menegaskan bahwa hingga saat ini belum ada teknologi di dunia yang mampu memprediksi waktu, tanggal, dan kekuatan gempa bumi secara pasti. Sumber cek: bmkg.go.id & @infoBMKG.'
      },
      {
        id: 'c7-clue-2',
        label: 'Hoaks 2: Tautan Undian Resmi / Bansos Berdomain Palsu',
        excerpt: '"Selamat! Rekening Anda terpilih menerima dana Rp15 juta. Klaim di daftar-bansos-resmi[.]com sebelum hangus dalam 2 jam."',
        isRedFlag: true,
        analysis:
          'HOAKS PHISHING! Situs resmi pemerintah memakai domain .go.id dan bank resmi hanya memakai domain terverifikasi. Desakan waktu "sebelum hangus" adalah jebakan pencurian OTP/data. Cek: komdigi.go.id / cekfakta.com / OJK 157.'
      },
      {
        id: 'c7-clue-3',
        label: 'Hoaks 3: Klaim Obat Mujarab Instan Tanpa Uji Klinis',
        excerpt: '"Cukup rebus 3 lembar daun ini selama 5 menit, dijamin 100% menyembuhkan semua penyakit jantung tanpa obat dokter!"',
        isRedFlag: true,
        analysis:
          'HOAKS KESEHATAN! Klaim "100% menyembuhkan semua penyakit" tanpa bukti uji klinis BPOM/Kemenkes sangat menyesatkan dan membahayakan pasien. Cek: cekbpom.pom.go.id, kemkes.go.id, & turnbackhoax.id.'
      }
    ],
    requiredRedFlags: 3,
    materialPoints: [
      {
        heading: 'Jenis Gangguan Informasi (Claire Wardle / First Draft)',
        summary:
          '1) Misinformasi (informasi salah yang disebarkan tanpa niat menipu), 2) Disinformasi (informasi palsu yang sengaja dibuat untuk menipu/memanipulasi), 3) Malinformasi (informasi fakta/pribadi yang disebarkan untuk merusak nama baik atau membahayakan, seperti doxing).'
      },
      {
        heading: '5 Langkah Menyikapi Hoaks Secara Sistematis',
        summary:
          '1) Hentikan penyebaran (Stop), 2) Periksa alamat situs & identitas pengirim, 3) Lakukan pencarian terbalik gambar (Reverse Image Search) untuk foto/video lama yang didaur ulang, 4) Verifikasi di kanal cek fakta resmi, 5) Laporkan ke kanal Aduan Konten Komdigi atau fitur Report platform.'
      },
      {
        heading: 'Kanal Cek Fakta Resmi & Akurat di Indonesia',
        summary:
          'TurnBackHoax.id (Mafindo), CekFakta.com (kolaborasi AJI, AMSI, Mafindo), TrustPositif / AduanKonten.id (Komdigi RI), serta situs instansi primer: bmkg.go.id, kemkes.go.id, cekbpom.pom.go.id, dan ojk.go.id.'
      }
    ],
    questions: [
      {
        id: 'c7-q1',
        prompt:
          'Seorang teman tidak sengaja meneruskan foto bencana tahun 2018 karena mengira itu terjadi hari ini. Dalam klasifikasi gangguan informasi, peristiwa tersebut termasuk:',
        options: [
          {
            id: 'a',
            text: 'Misinformasi — informasi keliru yang dibagikan tanpa niat jahat untuk menipu.',
            isCorrect: true,
            feedback:
              'Benar! Karena ketidaktahuan dan tidak ada niat jahat, ini disebut misinformasi. Namun tetap perlu diluruskan.'
          },
          {
            id: 'b',
            text: 'Malinformasi — kebocoran data rahasia negara.',
            isCorrect: false,
            feedback:
              'Malinformasi adalah fakta/data asli yang sengaja disebar untuk merugikan pihak lain (misal doxing).'
          }
        ]
      },
      {
        id: 'c7-q2',
        prompt:
          'Manakah kombinasi kanal verifikasi yang paling akurat untuk mengecek pesan berantai tentang isu bencana gempa dan obat-obatan di Indonesia?',
        options: [
          {
            id: 'a',
            text: 'Situs resmi BMKG (bmkg.go.id), BPOM (pom.go.id) / Kemenkes RI, serta portal TurnBackHoax.id dan CekFakta.com.',
            isCorrect: true,
            feedback:
              'Sempurna! Mengonfirmasi ke otoritas primer dan konsorsium pemeriksa fakta independen menjamin akurasi informasi.'
          },
          {
            id: 'b',
            text: 'Menanyakan langsung di grup percakapan umum tanpa mengecek situs otoritas.',
            isCorrect: false,
            feedback:
              'Bertanya di grup tanpa rujukan primer justru rentan menghasilkan informasi simpang siur.'
          }
        ]
      }
    ],
    sources: [
      {
        title: 'Database Pemeriksaan Fakta & Anti-Hoaks Nasional',
        institution: 'MAFINDO — TurnBackHoax.id',
        url: 'https://turnbackhoax.id',
        yearOrNote: 'Arsip Ribuan Klarifikasi Hoaks Indonesia'
      },
      {
        title: 'Kanal Kolaborasi Cek Fakta Indonesia',
        institution: 'CekFakta.com (AJI, AMSI, Mafindo, Google News Initiative)',
        url: 'https://cekfakta.com',
        yearOrNote: 'Konsorsium Jurnalisme Verifikasi Indonesia'
      },
      {
        title: 'Laporan Isu Hoaks & Kanal Aduan Konten Negatif',
        institution: 'Kementerian Komunikasi dan Digital (Komdigi RI)',
        url: 'https://aduankonten.id',
        yearOrNote: 'Portal Resmi Pelaporan & Klarifikasi Disinformasi'
      },
      {
        title: 'Klarifikasi Resmi Prediksi Gempa Bumi & Peringatan Dini',
        institution: 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)',
        url: 'https://www.bmkg.go.id',
        yearOrNote: 'Otoritas Resmi Kebencanaan Geologi/Iklim'
      },
      {
        title: 'Information Disorder: Toward an Interdisciplinary Framework',
        institution: 'Claire Wardle & Hossein Derakhshan — Council of Europe',
        yearOrNote: '2017 — Taksonomi Misinformasi, Disinformasi, Malinformasi'
      }
    ],
    badgeEarned: 'Detektif Anti-Hoaks Utama'
  }
];
