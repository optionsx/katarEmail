/*
.
.
.
.
.
.
.
.
.
.
.
.
.
#initially i started with the Web version but the owner added Cloudflare to the website so i had to switch to the API version.
#update he removed it so i will continue working on this version once i finish the API version.
.
.
.
.
.
.
.
.
.
.
.
.
.
*/

import { wrapFetch } from "https://deno.land/x/another_cookiejar@v5.0.3/mod.ts";
const f = wrapFetch();
// TODO: was working on it, but the owner added CF right where about i was going to finish.
let count = 0;
const genEmail = async (): Promise<string | undefined> => {
  const _homepage = await f("https://www.emailnator.com/", {
    method: "GET",
    headers: onlyHeader,
  });
  const setCookieHeader = _homepage.headers.get("set-cookie");
  const csrfToken = decodeURIComponent(
    setCookieHeader?.split("=")[1].split(";")[0] ?? ""
  );
  onlyHeader["x-xsrf-token"] = csrfToken;
  onlyHeader["Cookies"] = setCookieHeader ?? "";
  const bodyContent = JSON.stringify({
    email: ["domain", "plusGmail", "dotGmail"],
  });
  try {
    const response = await f("https://www.emailnator.com/generate-email", {
      method: "POST",
      body: bodyContent,
      headers: onlyHeader,
    }),
      { email } = await response.json();

    if (!email && count < 3) {
      count++;
      console.log("retrying.. ", count);
      if (count === 3) throw new Error("Failed to generate email");
      return await genEmail();
    }
    return email[0];
  } catch (e) {
    console.log(`[ERROR]: ${e}`);
  }
};

const email = await genEmail();
console.log(email);
