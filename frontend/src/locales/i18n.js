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
        username: "Имя пользователя",
        password: "Пароль",
        login: "Войти",
        noAccount: "Нет аккаунта в Hexlet Chat?",
        signup: "Регистрация",
        error: "Неправильный логин или пароль",
      },
      signup: {
        title: "Регистрация в Hexlet Chat",
        username: "Логин",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",
        signup: "Зарегистрироваться",
        alreadyRegistered: "Зарегистрированы в Hexlet Chat?",
        login: "Войти",
        usernameTaken: "Такой пользователь уже существует",
        validation: {
          usernameMin: "Имя должно содержать от 3 до 20 символов",
          usernameMax: "Имя должно содержать до 20 символов",
          passwordMin: "Пароль от 6 символов",
          confirmPassword: "Пароли должны совпадать",
          required: "Поле обязательное для заполнения",
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
