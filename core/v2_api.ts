import { onlyHeader, EmailContent, EmailInfo } from "../types/static.ts";
import { log } from "../util/util.ts";
import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
const [_host, _generate_email, _inbox, _msgid] = [
  "https://gmailnator.p.rapidapi.com",
  "/generate-email",
  "/inbox",
  "/messageid?id=",
];
/**
 * [1]CustomMail, [2]plusGmail, [3]dotGmail
 */
export const genEmail = async (emailType = 1): Promise<string> => {
  if (!emailType.toString().match(/^(1|2|3)$/)) {
    throw "number only, [1]CustomMail, [2]plusGmail, [3]dotGmail";
  }
  onlyHeader["Content-Type"] = "application/json";
  const options = {
    method: "POST",
    headers: onlyHeader,
    body: JSON.stringify({ options: [emailType] }),
  };
  const _email = await fetch(_host + _generate_email, options),
    { email } = await _email.json();
  return email;
};
export const getInbox = async (
  email: string,
  limit = 10
): Promise<EmailInfo[]> => {
  const response = await fetch(`${_host}${_inbox}`, {
    method: "POST",
    headers: onlyHeader,
    body: JSON.stringify({ email, limit }),
  });
  if (!response.ok) return [];
  return (await response.json()) as EmailInfo[];
};

export const getEmailContent = async (id: string): Promise<EmailContent> => {
  const response = await fetch(`${_host}${_msgid}${id}`, {
    headers: onlyHeader,
  });
  const { content, ...rest } = await response.json();
  return { ...rest, content: content.replaceAll(/\r\n|\\/g, "") };
};
export const mainApi = async (email: string, keepListen = false) => {
  let inbox = await getInbox(email);
  const amountOfEmail = inbox.length;
  let count = 30 // # 30 * 5s = 150s = 2.5m = 2m30s wait time
  let time = 0;
  let dotCount = 0
  // # wait for email to arrive
  while (amountOfEmail === inbox.length) {
    console.clear();
    if (count-- === 0 && keepListen === false) log(`%cno email arrived within 2m30s listening, to keep listening run below command:\n%cdeno task start ${email} anythingHere`, "color: red", "color: blue"),
      Deno.exit(1);
    log(email);
    log(`%clistening for email${'.'.repeat(dotCount++)} - ${time++ * 5}s elapsed`, "color: yellow");
    if (dotCount > 3) dotCount = 0;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    inbox = await getInbox(email);
  }
  // # some improper formatting of date
  const { from, subject, date } = inbox[0];
  const d = new Date(date * 1000);
  const datestring =
    ("0" + d.getDate()).slice(-2) +
    "/" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    d.getFullYear() +
    " " +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2);
  log(`From: ${from}\nSubject: ${subject}\nDate: ${datestring}`);

  // # Open the email content in browser?
  const result = prompt("? Open the email content in browser? (y/n) » ");
  if (!result?.toLocaleLowerCase().startsWith("n")) {
    const { id } = inbox[0];
    const { content } = await getEmailContent(id);
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    await Deno.writeFile("inbox.html", data);
    open("inbox.html");
  }
};
