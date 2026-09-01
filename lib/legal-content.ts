export const legalContent = {
  terms: {
    title: "Syarat & Ketentuan",
    intro: "Ketentuan ini mengatur penggunaan platform Market Snap, pembuatan akun, pemesanan, pembayaran, dan layanan terkait.",
    sections: [
      { title: "Akun dan penggunaan layanan", paragraphs: ["Pengguna bertanggung jawab memberikan data yang akurat, menjaga keamanan akses akun, dan tidak menyalahgunakan platform. Akses dapat dibatasi bila terdapat indikasi penipuan atau pelanggaran hukum."] },
      { title: "Harga, stok, dan pesanan", paragraphs: ["Harga, promo, dan stok divalidasi ulang oleh server saat checkout. Pesanan baru mengikat setelah sistem menerima data yang valid; status pembayaran hanya dinyatakan berhasil setelah verifikasi penyedia pembayaran."] },
      { title: "Batasan layanan", paragraphs: ["Jangkauan, jadwal, dan ketersediaan pengiriman bergantung pada cabang serta penyedia logistik. Perubahan yang material akan diinformasikan melalui status pesanan atau kanal kontak yang tersedia."] }
    ]
  },
  privacy: {
    title: "Kebijakan Privasi",
    intro: "Kebijakan ini menjelaskan data yang diproses untuk menyediakan akun, transaksi, pengiriman, dukungan, dan keamanan Market Snap.",
    sections: [
      { title: "Data yang dikumpulkan", paragraphs: ["Data dapat mencakup identitas dan kontak, alamat dan koordinat yang Anda berikan, isi keranjang, riwayat pesanan, status pembayaran, data perangkat, log keamanan, serta komunikasi dukungan."] },
      { title: "Tujuan dan pembagian data", paragraphs: ["Data digunakan untuk menjalankan layanan, memverifikasi transaksi, mencegah penyalahgunaan, memenuhi kewajiban hukum, dan menangani dukungan. Data yang diperlukan dapat dibagikan secara terbatas kepada penyedia pembayaran, pengiriman, hosting, email, dan pemantauan keamanan."] },
      { title: "Penyimpanan dan hak pengguna", paragraphs: ["Data disimpan selama diperlukan untuk layanan, keamanan, sengketa, dan kewajiban hukum. Pengguna dapat meminta akses, koreksi, atau penghapusan sesuai peraturan yang berlaku, dengan pengecualian untuk data yang wajib dipertahankan."] }
    ]
  },
  shipping: {
    title: "Kebijakan Pengiriman",
    intro: "Pengiriman tersedia berdasarkan cabang aktif, alamat, radius layanan, stok, dan kapasitas jadwal.",
    sections: [
      { title: "Biaya dan estimasi", paragraphs: ["Biaya dan estimasi ditampilkan sebelum pesanan dibuat serta dihitung ulang oleh backend. Estimasi bukan jaminan waktu pasti karena dapat dipengaruhi cuaca, lalu lintas, dan kondisi operasional."] },
      { title: "Penerimaan pesanan", paragraphs: ["Pastikan penerima dan nomor telepon dapat dihubungi. Periksa kondisi barang saat diterima dan dokumentasikan masalah sesegera mungkin melalui dukungan."] }
    ]
  },
  refund: {
    title: "Kebijakan Refund & Retur",
    intro: "Permintaan refund atau retur dinilai berdasarkan status pembayaran, kondisi produk, bukti pendukung, dan ketentuan yang berlaku.",
    sections: [
      { title: "Produk bermasalah", paragraphs: ["Laporkan barang rusak, salah, kurang, atau tidak layak disertai nomor pesanan dan bukti yang relevan. Produk segar dapat memerlukan pelaporan lebih cepat karena sifatnya mudah rusak."] },
      { title: "Proses pengembalian dana", paragraphs: ["Refund yang disetujui diproses melalui metode yang didukung. Waktu dana diterima bergantung pada penyedia pembayaran dan bank; sistem tidak menjanjikan durasi yang belum dikonfirmasi provider."] }
    ]
  },
  cancellation: {
    title: "Kebijakan Pembatalan",
    intro: "Pembatalan dapat diajukan sebelum pesanan masuk tahap pemrosesan yang tidak dapat dibatalkan.",
    sections: [
      { title: "Sebelum dan setelah pembayaran", paragraphs: ["Pesanan yang belum dibayar dapat kedaluwarsa otomatis dan reservasi stok dilepas. Pesanan berbayar membutuhkan alur pembatalan dan refund terverifikasi; perubahan status dari halaman frontend tidak dianggap sebagai refund."] },
      { title: "Pembatalan oleh toko", paragraphs: ["Toko dapat membatalkan bagian atau seluruh pesanan bila stok tidak dapat dipenuhi atau terdapat kendala keselamatan dan operasional, dengan pemberitahuan serta penyelesaian dana sesuai status pembayaran."] }
    ]
  },
  payment: {
    title: "Kebijakan Pembayaran",
    intro: "Pembayaran elektronik diproses melalui Xendit pada halaman aman milik penyedia pembayaran.",
    sections: [
      { title: "Status pembayaran", paragraphs: ["Redirect kembali ke Market Snap tidak membuktikan pembayaran berhasil. Status paid hanya ditetapkan setelah backend memverifikasi webhook atau melakukan rekonsiliasi langsung dengan Xendit."] },
      { title: "Keamanan", paragraphs: ["Market Snap tidak menyimpan secret key Xendit di browser. Jangan mengirim PIN, OTP, password, atau credential pembayaran melalui formulir kontak."] }
    ]
  },
  cookie: {
    title: "Kebijakan Cookie",
    intro: "Market Snap menggunakan cookie dan penyimpanan browser yang diperlukan untuk sesi, keamanan, preferensi, serta guest cart.",
    sections: [
      { title: "Cookie esensial", paragraphs: ["Cookie sesi HttpOnly digunakan untuk autentikasi dan tidak dapat dibaca JavaScript. Cookie state OAuth membantu mencegah pemalsuan callback. Menonaktifkannya dapat membuat login dan checkout tidak berfungsi."] },
      { title: "Penyimpanan lokal", paragraphs: ["Guest cart dan preferensi lokasi dapat disimpan pada perangkat. Informasi ini dapat dihapus melalui pengaturan browser. Data pembayaran sensitif tidak boleh disimpan di cache offline."] }
    ]
  }
} as const;
