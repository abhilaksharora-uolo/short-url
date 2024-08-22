function base10ToBase62(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }

  return result;
}

exports.seed = async function(knex) {
  const baseNumber = 1000000000;

  const data = [];
  for (let i = 0; i < 10; i++) {
    const shortUrl = base10ToBase62(baseNumber + i);
    data.push({ shortUrl });
  }

  await knex('short-url').insert(data);
};
