import {fetch_json} from "./fetch.js";
import {render_data} from "./render.js";


async function main() {

    const processed_data = await fetch_json();
    render_data(processed_data);
}


window.addEventListener("DOMContentLoaded", () => {
    main();
});