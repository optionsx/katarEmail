import { mainApi, genEmail } from "./core/v2_api.ts";
import { log, isValidEmail } from "./util/util.ts";

// # CLI
if (Deno.args.length === 1 || Deno.args.length === 2) {
  const email = Deno.args[0];
  if (!isValidEmail(email)) console.clear(), log(`%c${Deno.args[0]} <= invalid input\n%cUsage: KatarEmail OR KatarEmail validEmail(previewsly generated)`, "color: red", "color:green"), Deno.exit();
  if (Deno.args.length === 2) await mainApi(email, true); // # if we got 2 args, keep listening for arg1 email
  await mainApi(email);
}
// # GEN THE EMAILS
const genTheMails = () => Promise.all([
  genEmail(1),
  genEmail(2),
  genEmail(3),
]);

refresh: while (true) {
  console.clear();
  genTheMails();
  const [custom, gmailplus, dotgmail] = await genTheMails();
  log(`%c[1] ${custom}\n[2] ${gmailplus}\n[3] ${dotgmail}\n%c[4] Previously Generated\n[5] Random\n[6] Refresh\n[7] Exit`, "color: yellow", "color: green");
  const chosen = prompt("Choose one of the options[1,2,3,4,5,6,7]: ");
  if (chosen && chosen.match(/^(1|2|3|)$/)) { // # one of the emails [1,2,3]
    const email = [custom, gmailplus, dotgmail][parseInt(chosen) - 1];
    await mainApi(email);
    break;
  }
  if (chosen === "4"/*prev*/) {
    const prev = prompt("Enter the email: ") as string;
    // # check if the email is valid
    if (!isValidEmail(prev)) {
      log(`%cprev <= Invalid email`, "color: red");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue refresh;
    }
    await mainApi(prev);
    break;
  }
  if (chosen === "5"/*random*/) {
    const random = Math.floor(Math.random() * 3) + 1;
    const email = [custom, gmailplus, dotgmail][random - 1];
    await mainApi(email);
    break;
  }
  if (chosen === "6"/*refresh*/) continue refresh;
  if (chosen === "7"/*exit*/) break;
}