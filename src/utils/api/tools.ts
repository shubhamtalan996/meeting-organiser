export const convertTimeToMinutes = (time: string): number => {
  if (time) {
    const [hours, minutes] = time?.toString().split(":");
    return 60 * Number(hours) + Number(minutes);
  }
  return 0;
};

export const dateFieldToEpoch = (date: string): Date | undefined => {
  if (date) {
    const [year, month, day] = date?.toString().split("-");
    return new Date(`${month}/${day}/${year}`);
  }
  return;
};

export const localeDateFieldToEpoch = (date: string): Date | undefined => {
  if (date) {
    const [day, month, year] = date?.toString().split("/");
    return new Date(`${month}/${day}/${year}`);
  }
  return;
};

export const dateFieldToLocaleDate = (date: string): string | undefined => {
  if (date) {
    const [year, month, day] = date?.toString().split("-");
    return `${day}/${month}/${year}`;
  }
  return;
};
