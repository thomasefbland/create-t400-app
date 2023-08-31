import figlet from "figlet";
import gradient from "gradient-string";

const _title = figlet.textSync("CREATE T400 APP", { font: "Small" });

export const title = gradient.passion.multiline(_title);
