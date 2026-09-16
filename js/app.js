import { 
    ringkasInventaris,  
    cariAlatBerdasarkanId, 
    formatStringRingkasan 
} from './utils.js';

const inventaris = [
    { id: 1, nama: 'Router', kategori: 'Jaringan', jumlah: 4, kondisi: 'Baik'},
    { id: 2, nama: 'Multimeter', kategori: 'Elektronika', jumlah: 6, kondisi: 'Baik'},
    { id: 3, nama: 'Kabel UTP', kategori: 'Jaringan', jumlah: 20, kondisi: 'Perlu Cek'},
    { id: 4, nama: 'Switch Managed', kategori: 'Jaringan', jumlah: 2, kondisi: 'Baik'},
    { id: 5, nama: 'Solder Kit', kategori: 'Elektronika', jumlah: 10, kondisi: 'Perlu Cek' }
];

const alatBaik = inventaris.filter(item => item.kondisi === 'Baik');
console.log('Alat dengan kondisi Baik:');
console.table(alatBaik);

const namaAlat = inventaris.map(({ nama }) => nama);
console.log('Daftar nama alat:', namaAlat);

const totalUnit = inventaris.reduce((total, item) => total + item.jumlah, 0);
console.log('Total unit alat:', totalUnit);

try {
    const ringkasan = ringkasInventaris(inventaris);
    console.log('Ringkasan Inventaris:', ringkasan);
} catch (error) {
    console.error('Terjadi kesalahan:', error.message);
}

const idCari = 2;
const hasilCari = cariAlatBerdasarkanId(inventaris, idCari);
console.log(`Hasil pencarian ID ${idCari}:`, hasilCari);

console.log('Ringkasan String Teks:');
inventaris.forEach(item => {
    console.log(formatStringRingkasan(item));
});