export const getDaysLeft = (end) => {
  if (!end) return null;

  const now = new Date();

  const diff = end - now;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getMembershipStatus = (start, end) => {
  const now = new Date();

  if (!end) return "sin_plan";

  if (end < now) return "vencido";

  const totalDuration = end - start;
  const remaining = end - now;

  const threeDays = 3 * 24 * 60 * 60 * 1000;

  if (totalDuration > threeDays && remaining <= threeDays) {
    return "vence_pronto";
  }

  return "activo";
};