// import Nama from "./components/Nama";
// import Foto from "./components/Foto";
// import Tentang from "./components/Tentang";
// import skill from "./components/skill";
// import pendidikan from "./components/pendidikan";
// import kontak from "./components/kontak";

// export default function BiodataDiri() {
//   return (
//     <div>
//       <foto />
//       <nama />
//       <tentang />
//       <skill />
//       <pendidikan />
//       <kontak />
//     </div>
//   );
// }

import Nama from "./components/Nama";
import Foto from "./components/Foto";
import Tentang from "./components/Tentang";
import Skill from "./components/Skill";
import Pendidikan from "./components/Pendidikan";
import Kontak from "./components/Kontak";

export default function BiodataDiri() {
  return (
    <div>
      <Foto />
      <Nama />
      <Tentang />
      <Skill />
      <Pendidikan />
      <Kontak />
    </div>
  );
}