export const socialUtils = {
  getTwitterUrl: (input: string): string => {
    if (!input) return "";
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
    const username = input.replace("@", "");
    return `https://twitter.com/${username}`;
  },
  getTelegramUrl: (input: string): string => {
    if (!input) return "";

    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
    const username = input.replace("@", "");
    return `https://t.me/${username}`;
  },
};
