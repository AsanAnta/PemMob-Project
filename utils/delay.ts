/**
 * ==============================================================================
 * MODUL 3: PEMROGRAMAN ASYNCHRONOUS & API CALL
 * Helper: Simulasi Latensi Jaringan menggunakan Objek Promise
 * ==============================================================================
 */

/**
 * Fungsi simulasi delay jaringan berbasis Objek Promise.
 * Mengembalikan Promise<void> yang di-resolve setelah jangka waktu tertentu (ms).
 *
 * @param ms Durasi delay dalam satuan milidetik (misal: 1000 = 1 detik)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
