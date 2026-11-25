import { 
    ringkasInventaris,  
    filterBerdasarkanLokasi,
    cariAlatBerdasarkanId, 
    formatStringRingkasan 
} from './utils.js';

const output = document.querySelector('#api-output');
const message = document.querySelector('#api-message');
const btnRetry = document.querySelector('#btn-retry');

let dataUsersLokal = [];

const USE_LOCAL_DATA = false; 
const endpoint = 'https://jsonplaceholder.typicode.com/users';

async function loadUsers() {
    if (!output || !message) return;
    if (btnRetry) btnRetry.style.display = 'none';

    message.textContent = 'Memuat data pengguna...';
    output.replaceChildren();

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        dataUsersLokal = await response.json();
        renderDaftarPengguna(dataUsersLokal);

        message.textContent = `Berhasil memuat ${dataUsersLokal.length} data pengguna.`;

    } catch (error) {
        console.error('Fetch error:', error);
        message.textContent = 'Gagal memuat data pengguna. Periksa koneksi internet atau server.';
        if (btnRetry) btnRetry.style.display = 'inline-block';
    }
}

function renderDaftarPengguna(list) {
    if (!output) return;
    output.replaceChildren();

    if (list.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Pengguna tidak ditemukan.';
        output.append(li);
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');
        li.style.padding = '0.5rem 0';
        li.style.borderBottom = '1px solid var(--border)';   
        li.textContent = `${user.name} - ${user.email}`;
        output.append(li);
    });
}

if (btnRetry) {
    btnRetry.addEventListener('click', () => {
        loadUsers();
    });
}

loadUsers();

const inventarisAwal = [
    { id: 1, nama: 'HP Vivo 2007 (Haikal)', kategori: 'Smartphone', jumlah: 1, kondisi: 'Baik', lokasi: 'Sebengkok', status: 'Tersedia' },
    { id: 2, nama: 'HP Infinix GT 30 Pro (Agus)', kategori: 'Smartphone', jumlah: 1, kondisi: 'Baik', lokasi: 'Markoni', status: 'Tersedia' },
    { id: 3, nama: 'Laptop Axioo Pongo (Agus)', kategori: 'Laptop', jumlah: 1, kondisi: 'Baik', lokasi: 'Markoni', status: 'Dipinjam' },
    { id: 4, nama: 'Laptop ThinkPad (Andi)', kategori: 'Laptop', jumlah: 1, kondisi: 'Baik', lokasi: 'Mamburungan', status: 'Dipinjam' },
    { id: 5, nama: 'Terminal / Stopkontak (Aji)', kategori: 'Aksesori', jumlah: 1, kondisi: 'Baik', lokasi: 'Sebengkok', status: 'Tersedia' },
    { id: 6, nama: 'Laptop HP (Ilham)', kategori: 'Laptop', jumlah: 1, kondisi: 'Baik', lokasi: 'Mamburungan', status: 'Dipinjam' }
];

let inventaris = JSON.parse(localStorage.getItem('dataPeminjaman')) ?? inventarisAwal;

const daftar = document.querySelector('#daftar-alat');
const tombolFilter = document.querySelectorAll('[data-filter]');
const inputCari = document.querySelector('#input-cari');
const selectLimit = document.querySelector('#items-per-page');
const themeButton = document.querySelector('#theme-button');

let currentFilter = 'Semua';
let currentSearch = '';

function renderItems(items) {
    if (!daftar) return;
    daftar.replaceChildren();

    const limit = parseInt(localStorage.getItem('itemsPerPage') ?? '10', 10);
    const itemsToRender = items.slice(0, limit);

    if (itemsToRender.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Tidak ada perangkat yang ditemukan.';
        daftar.append(emptyMsg);
        return;
    }

    itemsToRender.forEach(item => {
        const article = document.createElement('article');
        article.className = 'card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const title = document.createElement('h3');
        title.textContent = item.nama;

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = item.status;
        badge.style.backgroundColor = item.status === 'Tersedia' ? '#10b981' : '#ef4444';

        cardHeader.append(title, badge);

        const info = document.createElement('p');
        info.className = 'desc';
        info.textContent = `Kategori: ${item.kategori} | Lokasi: ${item.lokasi} (${item.kondisi})`;

        const btnAction = document.createElement('button');
        btnAction.textContent = item.status === 'Tersedia' ? 'Pinjam Perangkat' : 'Kembalikan Perangkat';
        btnAction.className = 'btn-detail';
        btnAction.dataset.id = item.id;

        article.append(cardHeader, info, btnAction);
        daftar.append(article);
    });
}

function filterAndRender() {
    const hasil = inventaris.filter(item => {
        const matchFilter = currentFilter === 'Semua' || item.status === currentFilter;
        const matchSearch = item.nama.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            item.lokasi.toLowerCase().includes(currentSearch.toLowerCase());
        return matchFilter && matchSearch;
    });
    renderItems(hasil);
}

tombolFilter.forEach(button => {
    button.addEventListener('click', () => {
        tombolFilter.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentFilter = button.dataset.filter;
        filterAndRender();
    });
});

if (daftar) {
    daftar.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-detail')) {
            const idTarget = parseInt(e.target.dataset.id, 10);
            const targetItem = inventaris.find(item => item.id === idTarget);
            
            if (targetItem) {
                targetItem.status = targetItem.status === 'Tersedia' ? 'Dipinjam' : 'Tersedia';
                localStorage.setItem('dataPeminjaman', JSON.stringify(inventaris));
                filterAndRender();
            }
        }
    });
}

if (selectLimit) {
    const savedLimit = localStorage.getItem('itemsPerPage') ?? '10';
    selectLimit.value = savedLimit;

    selectLimit.addEventListener('change', (e) => {
        localStorage.setItem('itemsPerPage', e.target.value);
        filterAndRender();
    });
}

const savedTheme = localStorage.getItem('theme') ?? 'light';
document.documentElement.dataset.theme = savedTheme;

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem('theme', nextTheme);
    });
}

filterAndRender();

// EVENT LISTENER PENCARIAN (Menyaring Inventaris & Users API sekaligus)
if (inputCari) {
    inputCari.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndRender();

        if (dataUsersLokal.length > 0) {
            const keyword = currentSearch.toLowerCase();
            const hasilFilter = dataUsersLokal.filter(user => 
                user.name.toLowerCase().includes(keyword) || 
                user.email.toLowerCase().includes(keyword)
            );
            renderDaftarPengguna(hasilFilter);
        }
    });
}

const formAlat = document.querySelector('#form-alat');
const statusForm = document.querySelector('#form-status');
const previewContainer = document.querySelector('#preview-container');
const previewContent = document.querySelector('#preview-content');

function validateForm(data) {
    const errors = {};
    const nama = String(data.get('nama') ?? '').trim();
    const kategori = String(data.get('kategori') ?? '').trim();
    const jumlahRaw = data.get('jumlah');
    const jumlah = Number(jumlahRaw);
    const kondisi = String(data.get('kondisi') ?? '').trim();
    const tanggal = String(data.get('tanggal') ?? '').trim();
    const lokasi = String(data.get('lokasi') ?? '').trim();
    const kategoriValid = ['Smartphone', 'Laptop', 'Aksesori'];

    if (!nama) {
        errors.nama = 'Nama alat wajib diisi.';
    } else if (nama.length < 3) {
        errors.nama = 'Format nama tidak valid. Nama alat minimal 3 karakter.';
    }
    if (!kategori) {
        errors.kategori = 'Kategori wajib dipilih.';
    } else if (!kategoriValid.includes(kategori)) {
        errors.kategori = 'Format kategori tidak valid. Pilih dari opsi yang tersedia.';
    }
    if (jumlahRaw === null || jumlahRaw === '') {
        errors.jumlah = 'Jumlah unit wajib diisi.';
    } else if (!Number.isInteger(jumlah) || jumlah <= 0) {
        errors.jumlah = 'Format jumlah tidak valid. Masukkan angka bulat minimal 1.';
    }
    if (!kondisi) {
        errors.kondisi = 'Kondisi alat wajib dipilih.';
    }
    if (!tanggal) {
        errors.tanggal = 'Tanggal perolehan wajib diisi.';
    } else {
        const inputDate = new Date(tanggal);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(inputDate.getTime())) {
            errors.tanggal = 'Format tanggal tidak valid.';
        } else if (inputDate > today) {
            errors.tanggal = 'Format tanggal tidak valid. Tanggal tidak boleh melebihi hari ini.';
        }
    }
    if (!lokasi) {
        errors.lokasi = 'Lokasi penyimpanan wajib diisi.';
    }

    return errors;
}

if (formAlat) {
    formAlat.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(formAlat);
        const errors = validateForm(data);

        formAlat.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        formAlat.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));

        if (Object.keys(errors).length > 0) {
            for (const [field, message] of Object.entries(errors)) {
                const errorEl = document.querySelector(`#error-${field}`);
                if (errorEl) errorEl.textContent = message;
                
                if (formAlat.elements[field]) {
                    formAlat.elements[field].setAttribute('aria-invalid', 'true');
                }
            }

            const firstField = Object.keys(errors)[0];
            if (formAlat.elements[firstField]) {
                formAlat.elements[firstField].focus();
            }

            if (statusForm) statusForm.textContent = 'Periksa kembali data yang belum valid.';
            if (previewContainer) previewContainer.style.display = 'none';
            return;
        }

        if (statusForm) statusForm.textContent = 'Data valid dan siap dikirim.';

        const newAlat = {
            id: Date.now(),
            nama: data.get('nama').trim(),
            kategori: data.get('kategori').trim(),
            jumlah: Number(data.get('jumlah')),
            kondisi: data.get('kondisi'),
            tanggal: data.get('tanggal'),
            lokasi: data.get('lokasi').trim(),
            status: 'Tersedia'
        };

        if (previewContent && previewContainer) {
    while (previewContent.firstChild) {
        previewContent.removeChild(previewContent.firstChild);
    }

    const items = [
        { label: 'Nama Alat:', value: newAlat.nama },
        { label: 'Kategori:', value: newAlat.kategori },
        { label: 'Jumlah:', value: `${newAlat.jumlah} unit` },
        { label: 'Kondisi:', value: newAlat.kondisi },
        { label: 'Tanggal Perolehan:', value: newAlat.tanggal },
        { label: 'Lokasi:', value: newAlat.lokasi }
    ];

    items.forEach(item => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = item.label + ' ';
        
        p.appendChild(strong);
        p.appendChild(document.createTextNode(item.value));
        previewContent.appendChild(p);
    });

    previewContainer.style.display = 'block';
}

        inventaris.push(newAlat);
        localStorage.setItem('dataPeminjaman', JSON.stringify(inventaris));
        filterAndRender();

        formAlat.reset();
    });
}

try {
    const ringkasan = ringkasInventaris(inventaris);
    console.log('Ringkasan Inventaris:', ringkasan);
} catch (error) {
    console.error('Terjadi kesalahan:', error.message);
}

try {
    const alatSebengkok = filterBerdasarkanLokasi(inventaris, 'Sebengkok');
    console.log('Alat di "Sebengkok":', alatSebengkok);
} catch (error) {
    console.error('Terjadi kesalahan:', error.message);
}

try {
    const idCari = 2;
    const hasilCari = cariAlatBerdasarkanId(inventaris, idCari);
    console.log(`Hasil pencarian ID ${idCari}:`, hasilCari);
} catch (error) {
    console.error('Terjadi kesalahan:', error.message);
}

try {
    inventaris.forEach(item => {
        console.log(formatStringRingkasan(item));
    });
} catch (error) {
    console.error('Terjadi kesalahan:', error.message);
}