export const testData = {
  validEmails: {
    basic: 'newuser@example.com',
    withPlus: 'user+test@example.com',
    withDot: 'first.last@example.com',
    withDigits: 'user123@example.com',
    withSubdomain: 'user@mail.example.com',
    withHyphen: 'user@my-site.com',
    withUnderscore: 'user_name@example.com',
  },

  invalidEmails: {
    noAt: 'userexample.com',
    noDomain: 'user@',
    noLocalPart: '@example.com',
    spaceInMiddle: 'user @example.com',
    doubleAt: 'user@@example.com',
    doubleDot: 'user@example..com',
    dotAtStart: '.user@example.com',
    dotAtEnd: 'user.@example.com',
    noTld: 'user@localhost',
    tooShort: 'a@b.c',
    tooLong: 'a'.repeat(250) + '@example.com',
    onlySpaces: '   ',
    cyrillic: 'тест@пример.рф',
  },

  validPasswords: {
    min8: 'Pass1234',
    basic: 'Password123',
    long: 'Password1234567890',
    withSpecial: 'P@ssw0rd!#$',
  },

  invalidPasswords: {
    empty: '',
    oneChar: 'a',
    sevenChars: 'Pass123',
    onlySpaces: '        ',
    withLeadingSpace: ' Password123',
    withoutDigits: 'Password',
    withoutUppercase: 'password123',
    withoutSpecial: 'Password123',
    cyrillic: 'Пароль123',
    emoji: '😀😀😀😀😀😀😀😀',
    tooLong: 'a'.repeat(300),
  },

  mismatchedPasswords: {
    first: 'Password123',
    second: 'DifferentPass123',
    caseDifferent: 'password123',  // отличается только регистром
  },

  login: {
    validEmail: 'user@example.com',
    validPassword: 'Password123',
    wrongPassword: 'WrongPassword',
  },
};