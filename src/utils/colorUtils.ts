// Function to generate random pastel colors
export const generatePastelColor = (seed: string) => {
  // Generate a hash from the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate pastel color components
  const h = hash % 360;
  const s = 50 + (hash % 30); // 50-80%
  const l = 75 + (hash % 15); // 75-90%

  return `hsl(${h}, ${s}%, ${l}%)`;
};