import { createRoot } from "react-dom/client";
import Pesan from "./pesan";
import Content from "./content";
import "./Style.css";

createRoot(document.getElementById("root"))
    .render(
        <div>
            <Content><Pesan/></Content>
        </div>
    )