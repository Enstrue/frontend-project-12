import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      header: {
        brand: "Hexlet Chat",
        logout: "Выйти",
      },
      login: {
        title: "Вход в Hexlet Chat",
        username: "Ваш ник",
        password: "Пароль",
        login: "Войти",
        noAccount: "Нет аккаунта в Hexlet Chat?",
        signup: "Регистрация",
        error: "Неверные имя пользователя или пароль",
      },
      signup: {
        title: "Регистрация в Hexlet Chat",
        username: "Имя пользователя",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",
        signup: "Зарегистрироваться",
        alreadyRegistered: "Зарегистрированы в Hexlet Chat?",
        login: "Войти",
        usernameTaken: "Такой пользователь уже существует",
        validation: {
          username: "От 3 до 20 символов",
          password: "Не менее 6 символов",
          confirmPassword: "Пароли должны совпадать",
          required: "Обязательное поле",
        },
      },
      chat: {
        actions: "Действия",
        channels: "Каналы",
        chatIn: "Чат в",
        newMessage: "Введите сообщение...",
        addChannel: "Добавить канал",
        renameChannel: "Переименовать канал",
        deleteChannel: "Удалить канал",
        confirmDelete: "Вы уверены, что хотите удалить канал?",
        cancel: "Отмена",
        delete: "Удалить",
        send: "Отправить",
        notifications: {
          networkError: "Ошибка сети. Проверьте подключение.",
          fetchError: "Ошибка загрузки данных.",
          channelCreated: "Канал успешно создан.",
          channelRenamed: "Канал успешно переименован.",
          channelDeleted: "Канал успешно удалён.",
        },
      },
      home: {
        welcome: "Главная страница",
      },
      notFound: {
        message: "404: Страница не найдена",
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru", // Дефолтная локаль
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // React сам защищает от XSS
    },
  });

export default i18n;
