import { createRoot } from "react-dom/client";
import BookService from "./bookService"
import AdminView from "./adminView"
import GuestView from "./guestView"
import "./tailwind.css";
createRoot(document.getElementById("root"))
    .render(
        <div>
            <BookService />
            {/* <GuestView /> */}
            {/* <AdminView/> */}
        </div>
    )