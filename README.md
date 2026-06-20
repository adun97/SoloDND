# 🎲 Solo DnD — Cerita Buatan Sendiri

Aplikasi web untuk bermain Dungeons & Dragons sendirian dengan cerita yang **kamu tulis sendiri**.
Tidak ada AI, **tidak ada API key, tidak ada biaya, dan bisa jalan offline**. Kamu menyusun cerita
lewat **editor visual** (bikin scene, sambungkan dengan pilihan, tambahkan roll dadu), lalu memainkannya
dengan karakter ber-stat, HP, inventory, dan dadu d20.

## Fitur

- **Editor visual** — buat scene, tulis narasi, tambahkan pilihan, sambungkan antar-scene.
- **Roll dadu** — pilihan bisa memicu uji d20 vs DC yang bercabang ke hasil sukses/gagal.
- **Karakter** — 4 kelas, 6 atribut (STR/DEX/CON/INT/WIS/CHA), HP, inventory.
- **Efek scene** — ubah HP, tambah/buang item saat memasuki scene.
- **Tersimpan otomatis** di browser (localStorage). Beberapa cerita bisa disimpan sekaligus.
- **Sepenuhnya offline & gratis** — murni berjalan di browser.

## Prasyarat

- **Node.js 18 atau lebih baru** (disarankan Node 20 LTS) — hanya untuk menjalankan/men-build.
  Cek: `node --version`. Versi 16 ke bawah tidak didukung tooling-nya.

> Tidak perlu akun, API key, atau koneksi internet untuk bermain.

## Cara menjalankan

```bash
npm install      # sekali saja
npm run dev      # jalankan aplikasi
```

Buka http://localhost:5173

Untuk versi siap-pakai (statis): `npm run build`, lalu hasilnya ada di folder `dist/`
(bisa di-host gratis di mana saja, atau dibuka langsung).

## Cara membuat cerita

1. Di menu utama, klik **+ Buat Cerita Baru** (atau Edit cerita contoh "Gua Berkabut").
2. Di editor:
   - Beri **judul** cerita.
   - Tiap **scene** punya judul singkat + narasi.
   - **Perubahan HP / item** diterapkan saat pemain masuk scene itu.
   - Tambahkan **pilihan**. Tiap pilihan bisa:
     - **Langsung pindah** ke scene lain, atau
     - **Roll dadu dulu** — pilih stat + DC, lalu tentukan scene tujuan untuk **sukses** dan **gagal**.
   - Tandai scene sebagai **akhir** (🏆 menang / 💀 kalah) bila perlu.
   - Tentukan **scene awal** lewat dropdown di atas.
3. Klik **▶ Main** untuk mencoba.

## Struktur folder

```
src/
  App.tsx                  # router: menu ↔ editor ↔ main
  types.ts                 # tipe data (Story, Scene, Choice, Character…)
  game/
    dice.ts                # roll d20, modifier, resolusi vs DC
    character.ts           # kelas, stat, HP, inventory, efek
    storyFactory.ts        # bikin story/scene/choice baru + id
    storyStorage.ts        # simpan/muat cerita (localStorage)
    exampleStory.ts        # cerita contoh bawaan
  components/
    HomeMenu.tsx           # daftar cerita
    PlayView.tsx           # mesin bermain (navigasi scene + dadu + HP)
    CharacterCreation.tsx  # pembuatan karakter
    CharacterSheet.tsx     # panel karakter
    StoryLog.tsx           # log cerita
    DiceRoller.tsx         # animasi & resolusi dadu
  editor/
    StoryEditor.tsx        # editor cerita
    SceneCard.tsx          # kartu edit satu scene
```

## Mekanik

- **Modifier stat** = ⌊(nilai − 10) / 2⌋ (aturan D&D standar).
- **Roll** = d20 + modifier stat vs **DC**. Natural **20** selalu sukses, natural **1** selalu gagal.
- **HP habis (≤ 0)** → game over otomatis.
