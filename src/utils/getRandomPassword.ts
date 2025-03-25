import generator from 'generate-password';

export function getRandomPassword() {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  return password;
}
