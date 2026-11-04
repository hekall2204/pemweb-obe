export function ringkasInventaris(data) {
    if (!Array.isArray(data)) {
        throw new TypeError('Data harus berupa array');
    }

    return {
        jenisAlat: data.length,
        totalUnit: data.reduce((sum, item) => sum + item.jumlah, 0),
        perluCek: data.filter(item => item.kondisi !== 'Baik').length
    };
}

export function filterBerdasarkanLokasi(data, lokasiTarget) {
    if (!Array.isArray(data)) {
        throw new TypeError('Data harus berupa array');
    }
    return data.filter(item => item.lokasi.toLowerCase() === lokasiTarget.toLowerCase());
}

export function cariAlatBerdasarkanId(data, idTarget) {
    if (!Array.isArray(data)) {
        throw new TypeError('Data harus berupa array');
    }
    return data.find(item => item.id === idTarget);
}

export function formatStringRingkasan(item) {
    if (!item || typeof item !== 'object') {
        return 'Data alat tidak valid';
    }
    const { id, nama, kategori, jumlah, kondisi, lokasi } = item;
    return `[ID ${id}] ${nama} (${kategori}) - Jumlah: ${jumlah} unit | Kondisi: ${kondisi} | Lokasi: ${lokasi}`;
}