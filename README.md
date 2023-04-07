## Deskripsi Branch

Terdapat beberapa branch dengan detail sebagai berikut:
Nama Branch | Deskripsi
------------- | -------------
main | branch untuk core project

## Git Commit Convention

Bekerja dengan **atomic git commits**, _berarti commit Anda berukuran sekecil mungkin. Setiap komit melakukan satu, dan hanya satu hal sederhana, yang dapat diringkas dalam kalimat sederhana. Jumlah perubahan kode tidak masalah._

beberapa contoh untuk melakukan pesan:

```
[Ticket] - (feature/improvement/fix): Jelaskan apa yang terjadi pada perubahan ini.
```

# Git Branch Convention

Gunakan awalan **feature/** saat mengerjakan fitur DAN **fixing/** saat Anda memperbaiki masalah.

beberapa contoh untuk nama cabang:

```
feature/master-karyawan
```

```
fixing/error-on-create-employee
```

# Merge Request Convention

Saat membuat merge request di platform gitlab, ada beberapa informasi yang perlu Anda masukkan diantaranya:

### Title

Isikan judul dengan ringkasan perubahan (disertakan dengan ticket). contoh: **[Ticket] - (type): Create employee module**

### Description

Isikan informasi perubahan yang lebih detail dan langkah-langkah yang perlu disesuaikan jika ada. contoh:

```
- [Ticket] - Feature: Create an employee page.
- [Ticket] - Improvements: Added the authorization process on the employee page. ref(#FEATURE002)

Notes: Please install library before deploy.
```

Catatan: Harap **pisahkan** MR untuk fitur dan hotfix agar memudahkan proses pelacakan perubahan di masa mendatang.
