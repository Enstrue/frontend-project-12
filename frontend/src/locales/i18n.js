import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      header: {
        brand: 'Hexlet Chat',  // Используем одинарные кавычки
        logout: 'Выйти',
      },
      login: {
        title: 'Войти',
        username: 'Ваш ник',
        password: 'Пароль',
        login: 'Войти',
        noAccount: 'Нет аккаунта?',
        signup: 'Регистрация',
        error: 'Неверные имя пользователя или пароль',
      },
      signup: {
        title: 'Регистрация в Hexlet Chat',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        signup: 'Зарегистрироваться',
        alreadyRegistered: 'Зарегистрированы в Hexlet Chat?',
        login: 'Войти',
        usernameTaken: 'Такой пользователь уже существует',
        validation: {
          username: 'От 3 до 20 символов',
          password: 'Не менее 6 символов',
          confirmPassword: 'Пароли должны совпадать',
          required: 'Обязательное поле',
        },
      },
      chat: {
        actions: 'Действия',
        channels: 'Каналы',
        chatIn: 'Чат в',
        newMessage: 'Введите сообщение...',
        addChannel: 'Добавить канал',
        renameChannel: 'Переименовать канал',
        deleteChannel: 'Удалить канал',
        confirmDelete: 'Вы уверены, что хотите удалить канал?',
        cancel: 'Отмена',
        delete: 'Удалить',
        send: 'Отправить',
        notifications: {
          networkError: 'Ошибка сети. Проверьте подключение.',
          fetchError: 'Ошибка загрузки данных.',
          channelCreated: 'Канал создан',
          channelRenamed: 'Канал переименован',
          channelDeleted: 'Канал удалён',
        },
      },
      validation: {
        unique: 'Имя канала уже занято',
        username: 'От 3 до 20 символов',
        password: 'Не менее 6 символов',
        confirmPassword: 'Пароли должны совпадать',
        required: 'Обязательное поле',
      },
      home: {
        welcome: 'Главная страница',
      },
      notFound: {
        message: '404: Страница не найдена',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // Дефолтная локаль
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React сам защищает от XSS
    },
  });

export default i18n;
