export const testData = {
  validEmails: {
    basic: 'newuser@example.com',
    withPlus: 'user+test@example.com',
    withDot: 'first.last@example.com',
    withDigits: 'user123@example.com',
    withSubdomain: 'user@mail.example.com',
    withHyphen: 'user@my-site.com',
    withUnderscore: 'user_name@example.com',
    minLength: 'a@b.r',
    maxLength: 'a'.repeat(242) + '@example.com',
  },

  invalidEmails: {
    empty:'',
    noAt: 'userexample.com',
    noDomain: 'user@',
    noLocalPart: '@example.com',
    spaceInMiddle: 'user @example.com',
    doubleAt: 'user@@example.com',
    doubleDot: 'user@example..com',
    dotAtStart: '.user@example.com',
    dotAtEnd: 'user.@example.com',
    noTld: 'user@localhost',
    tooShort: 'a@.c',
    tooLong: 'a'.repeat(243) + '@example.com',
    onlySpaces: '   ',
    cyrillic: 'тест@пример.рф',
  },

  validPasswords: {
    min8: 'Pass1234',
    withoutUppercase: 'password123',
    basic: 'Password123',
    long: 'Password1234567890',
    withSpecial: 'P@ssw0rd!#$',
    max64: 'a'.repeat(63) + '1',

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
    withInnerSpace: " Pass Word 123",
    cyrillic: 'Пароль123',
    emoji: '😀😀😀😀😀😀😀😀',
    tooLong: 'a'.repeat(64) + '1',
    sameAsEmail: 'newuser@example.com',
    onlyDigits: "123456789",
  },

  mismatchedPasswords: {
    first: 'Password123',
    second: 'DifferentPass123',
    caseDifferent: 'password123',  // отличается только регистром
  },

  errorMessages: {
    emailRequired: 'Введите email',
    emailNoAt: 'Email должен содержать символ @',
    emailNoDomain: 'Email должен содержать домен',
    emailHasSpaces: 'Email не должен содержать пробелы',
    emailInvalid: 'Некорректный email',
    emailTooLong: 'Email слишком длинный',
    emailAlreadyExists: 'Пользователь с таким email уже зарегистрирован',
    passwordRequired: 'Введите пароль',
    passwordTooShort: 'Пароль должен содержать минимум 8 символов',
    passwordTooLong: 'Пароль не должен быть длиннее 64 символов',
    passwordNeedsDigits: 'Пароль должен содержать хотя бы одну цифру',
    passwordInvalidChars: 'символы или пробелы',
    passwordSameAsEmail: 'Пароль не должен совпадать с email',
    passwordsMismatch: 'Пароли не совпадают',
  },

  login: {
    validEmail: 'user@example.com',
    validPassword: 'Password123',
    wrongPassword: 'WrongPassword',
  },
};