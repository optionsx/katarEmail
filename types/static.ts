const APIKEY = "4d5c3e8161mshac903277a07093bp1162d5jsnedfb6847bc0b";
export const onlyHeader: OnlyHeader = {
  accept: "application/json, text/plain, */*",
  "x-rapidapi-key": APIKEY,
  "x-rapidapi-host": "gmailnator.p.rapidapi.com",
  Host: "gmailnator.p.rapidapi.com",
  Connection: "Keep-Alive",
  "User-Agent": "okhttp/4.9.2",
  "Accept-Encoding": "gzip, deflate",
};

export interface EmailContent {
  from: string;
  subject: string;
  date: number;
  content: string;
}
export type EmailInfo = {
  id: string;
  message?: string;
  from: string;
  subject: string;
  date: number;
};

type OnlyHeader = {
  accept: string;
  "x-rapidapi-key": string;
  "x-rapidapi-host": string;
  "Content-Type"?: string;
  Host: string;
  Connection: string;
  "User-Agent": string;
  "Accept-Encoding": string;
};
