export const parseEmailToText = (email: string | undefined | null) => {
  const regex = /^[^@]+/;
  return email?.match(regex)?.[0];
};
