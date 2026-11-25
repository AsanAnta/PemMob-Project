/**
 * ==============================================================================
 * PRAKTIKUM PEMROGRAMAN MOBILE - MODUL 3
 * Topik: Pemrograman Asynchronous, Objek Promise, Delay, & API Call
 * Laboratorium Informatika - Universitas Muhammadiyah Malang
 * ==============================================================================
 */

// 1. Tipe Data / Interface
interface WorkerApiData {
  id: string;
  name: string;
  job: string;
  rating: number;
}

// 2. Simulasi Delay Berbasis Promise
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 3. Konsep Objek Promise & .resolve() / .reject()
function fetchWorkerFromServer(id: string): Promise<WorkerApiData> {
  return new Promise((resolve, reject) => {
    console.log(`[API] Memulai pencarian tukang ID: ${id}...`);
    setTimeout(() => {
      if (id === "1") {
        resolve({
          id: "1",
          name: "Budi Santoso",
          job: "Tukang Listrik",
          rating: 4.8,
        });
      } else {
        reject(new Error(`Tukang dengan ID "${id}" tidak ditemukan di database.`));
      }
    }, 1000);
  });
}

// 4. Simulasi Pengambilan Data Statistik Tambahan
async function fetchWorkerStats(id: string): Promise<string> {
  await delay(800);
  return `Statistik ID ${id}: 50+ pekerjaan selesai, 98% kepuasan.`;
}

// 5. Demonstrasi Synchronous vs Asynchronous
async function mainDemo() {
  console.log("=== 1. EKSEKUSI SYNCHRONOUS ===");
  console.log("Langkah A: Mulai");
  console.log("Langkah B: Proses synchronous berjalan berurutan");
  console.log("Langkah C: Selesai");

  console.log("\n=== 2. EKSEKUSI ASYNCHRONOUS DENGAN PROMISE CHAIN (.then/.catch) ===");
  fetchWorkerFromServer("1")
    .then((worker) => {
      console.log("[.then] Data diterima:", worker.name, "-", worker.job);
      return worker;
    })
    .catch((error) => {
      console.error("[.catch] Error:", error.message);
    })
    .finally(() => {
      console.log("[.finally] Request Promise chain selesai.");
    });

  // Tunggu jeda agar demo 2 selesai sebelum demo 3
  await delay(1200);

  console.log("\n=== 3. EKSEKUSI ASYNC / AWAIT & PROMISE.ALL (PARALEL) ===");
  const startTime = Date.now();
  try {
    const [worker, stats] = await Promise.all([
      fetchWorkerFromServer("1"),
      fetchWorkerStats("1"),
    ]);
    const duration = Date.now() - startTime;
    console.log(`[Paralel] Berhasil dalam ${duration} ms:`);
    console.log("- Profil:", worker.name);
    console.log("- Stats :", stats);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Terjadi error:", err.message);
    }
  }

  console.log("\n=== 4. DEMO PROMISE REJECT (PENANGANAN ERROR) ===");
  try {
    await fetchWorkerFromServer("999");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("[Sukses Menangkap Reject]:", err.message);
    }
  }
}

// Jalankan demo
mainDemo();
