import * as postmark from 'postmark';

let client: postmark.ServerClient | null = null;

export const postmarkClient = (): postmark.ServerClient => {
  if (!client) {
    client = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);
  }
  return client;
};
