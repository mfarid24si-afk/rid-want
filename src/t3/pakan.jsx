import { useState } from "react";
import kambing from "../assets/kambing.png";
// reusable input
function InputField({ label, name, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded bg-green-50 border border-green-400"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// reusable select
function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded bg-green-50 border border-green-400"
      >
        <option value="">Pilih...</option>
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function Tailwindcss() {
  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    jumlah: "",
    ternak: "",
    pakan: "",
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const validate = () => {
    let err = {};

    // nama
    if (!form.nama) err.nama = "Nama wajib diisi";
    else if (/\d/.test(form.nama)) err.nama = "Tidak boleh angka";
    else if (form.nama.length < 3) err.nama = "Minimal 3 huruf";

    // kontak
    if (!form.kontak) err.kontak = "Kontak wajib diisi";
    else if (/\d/.test(form.kontak) === false)
      err.kontak = "Harus mengandung angka (no HP)";
    else if (form.kontak.length < 10)
      err.kontak = "Minimal 10 digit";

    // jumlah
    if (!form.jumlah) err.jumlah = "Jumlah wajib diisi";
    else if (isNaN(form.jumlah)) err.jumlah = "Harus angka";
    else if (form.jumlah <= 0) err.jumlah = "Harus lebih dari 0";

    // select
    if (!form.ternak) err.ternak = "Pilih jenis ternak";
    if (!form.pakan) err.pakan = "Pilih jenis pakan";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // harga sederhana
      let hargaPerKg = 0;

      if (form.pakan === "Fermentasi Jagung") hargaPerKg = 5000;
      else if (form.pakan === "Fermentasi Dedak") hargaPerKg = 4000;
      else hargaPerKg = 3000;

      const total = form.jumlah * hargaPerKg;

      setResult({
        ...form,
        total,
      });
    }
  };

  const isValid =
    form.nama &&
    form.kontak &&
    form.jumlah &&
    form.ternak &&
    form.pakan &&
    Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center">
          
        <img
  src={kambing}
  alt="Kambing"
  className="hidden md:block w-150 h-150 object-contain"
        />
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg border border-green-400">
        
        <h1 className="text-xl font-bold mb-4 text-center text-green-700">
          🌾 Pemesanan Pakan Ternak
        </h1>
        
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nama Pembeli"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            error={errors.nama}
          />

          <InputField
            label="No HP / Kontak"
            name="kontak"
            value={form.kontak}
            onChange={handleChange}
            error={errors.kontak}
          />

          <InputField
            label="Jumlah (kg)"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
            error={errors.jumlah}
          />

          <SelectField
            label="Jenis Ternak"
            name="ternak"
            value={form.ternak}
            onChange={handleChange}
            options={["Sapi", "Kambing", "Ayam"]}
            error={errors.ternak}
          />

          <SelectField
            label="Jenis Pakan"
            name="pakan"
            value={form.pakan}
            onChange={handleChange}
            options={[
              "Fermentasi Jagung",
              "Fermentasi Dedak",
              "Fermentasi Rumput",
            ]}
            error={errors.pakan}
          />

          {/* tombol muncul kalau valid */}
          {isValid && (
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-3"
            >
              Pesan Sekarang
            </button>
          )}
        </form>

        {/* hasil */}
        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-400 rounded">
            <h2 className="font-bold mb-2 text-green-700">Detail Pesanan:</h2>
            <p>Nama: {result.nama}</p>
            <p>Kontak: {result.kontak}</p>
            <p>Jumlah: {result.jumlah} kg</p>
            <p>Ternak: {result.ternak}</p>
            <p>Pakan: {result.pakan}</p>
            <p className="font-bold">Total: Rp {result.total}</p>
          </div>
        )}
      </div>
    </div>
  );
}