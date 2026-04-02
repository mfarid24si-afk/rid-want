export default function Pesan() {
    return (
        <div className="container">
            <h1>Selamat Datang</h1>
            <p>Saya Mahasiswa Sistem Informasi</p>
            <UserCard 
                nama="M. Farid Fadillah" 
                nim="2457301079"
                // tanggal={new Date().toLocaleDateString()}
                tanggal="13-05-2006"
                kelas="2 SI D"
                G="24"
            />
            <Greeting />
            <Text />
            <Hobi />
            <Skill />
            <Pendidikan />
            <Kontak />
            <Footer />
        </div>
    )
}

function Greeting() {
    return (
        <small className="small-note">
Mahasiswa Sistem Informasi angkatan 2024 yang fokus mengembangkan kemampuan di bidang teknologi dan sistem informasi.
</small>
    )
}

function Text() {
    return (
        <div className="card">
            <h3>Tentang</h3>
            <p>
                Saya memiliki minat dalam pengembangan sistem dan teknologi digital. 
                Saat ini sedang aktif mempelajari dasar-dasar pemrograman serta 
                terus mengasah kemampuan untuk mendukung pengembangan di bidang IT.
            </p>
        </div>
    )
}

function UserCard(props){
    return (
        <div 
            className="card" 
            style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "15px" 
            }}
        >
            
            <img 
                src="/img/pic-1.jpeg" 
                alt="Foto Profil"
                style={{ width: "100px", borderRadius: "10%" }}
            />

            <div>
                <h3>Nama: {props.nama}</h3>
                <p>NIM: {props.nim}</p>
                <p>Tanggal Lahir: {props.tanggal}</p>
                <p>Kelas: {props.kelas}</p>
                <p>Generasi: {props.G }</p>
            </div>

        </div>
    )
}

function Nama() {
  return (
    <div>
      <h2>M. Farid Fadillah</h2>
    </div>
  )
}

function Tentang() {
  return (
    <div>
      <p>
        Mahasiswa Sistem Informasi yang sedang belajar dan mengembangkan skill di bidang IT.
      </p>
    </div>
  )
}

function Hobi() {
  return (
    <div className="card">
      <h3>Hobi</h3>
      <p>Main game, ngoding, dan olahraga</p>
    </div>
  )
}

function Skill() {
  return (
    <div className="card">
      <h3>Skill</h3>
      <p>HTML, CSS, JavaScript dasar</p>
    </div>
  )
}

function Pendidikan() {
  return (
    <div className="card">
      <h3>Pendidikan</h3>
      <p>S1 Sistem Informasi</p>
    </div>
  )
}

function Kontak() {
  return (
    <div className="card">
      <h3>Kontak</h3>
      <p>Email: farid@email.com</p>
    </div>
  )
}

function Footer() {
  return (
    <div className="footer">
      <p>
        Diakses pada: {new Date().toLocaleDateString()}
      </p>
    </div>
  )
}