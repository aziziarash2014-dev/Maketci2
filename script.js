// 1. Supabase-ə qoşulun (Öz URL və Key məlumatlarınızı yazın)
const SUPABASE_URL = 'https://iktngczlingbdueobpor.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdG5nY3psaW5nYmR1ZW9icG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzU1OTgsImV4cCI6MjEwNTIxMTU5OH0.EOwKNY5nqwXrY5YnKl_B8j4BgKyjmg-HX_WbrBYmAiQ';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Bazadan məlumatları çəkən və ekranda göstərən funksiya
async function maketleriGoster() {
  const siyahıKonteyneri = document.getElementById('maket-siyahisi');

  // Supabase-dəki 'maketler' cədvəlindən bütün məlumatları alırıq
  const { data, error } = await _supabase
    .from('maketler')
    .select('*');

  if (error) {
    console.error('Xəta baş verdi:', error);
    siyahıKonteyneri.innerHTML = 'Məlumatları yükləmək mümkün olmadı.';
    return;
  }

  // Əgər bazada heç bir maket yoxdursa
  if (data.length === 0) {
    siyahıKonteyneri.innerHTML = 'Hələ ki heç bir maket əlavə olunmayıb.';
    return;
  }

  // Məlumatları HTML-ə çeviririk
  siyahıKonteyneri.innerHTML = data.map(item => `
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
      <h3>${item.ad}</h3>
      <p>Qiymət: <strong>${item.qiymet} AZN</strong></p>
    </div>
  `).join('');
}

// 3. Formadan yeni məlumatı bazaya göndərən funksiya
document.getElementById('maket-formu').addEventListener('submit', async (e) => {
  e.preventDefault(); // Səhifənin yenilənməsinin qarşısını alırıq

  const ad = document.getElementById('ad').value;
  const qiymet = document.getElementById('qiymet').value;

  // Supabase bazasına yeni sətir əlavə edirik
  const { error } = await _supabase
    .from('maketler')
    .insert([{ ad: ad, qiymet: parseFloat(qiymet) }]);

  if (error) {
    alert('Əlavə edilərkən xəta baş verdi: ' + error.message);
  } else {
    alert('Maket uğurla əlavə olundu!');
    document.getElementById('maket-formu').reset(); // Formu təmizləyirik
    maketleriGoster(); // Siyahını yeniləyirik
  }
});

// Səhifə açılanda məlumatları göstər
maketleriGoster();