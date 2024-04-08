import { Translator } from "../lib/translator/translator.ts";
import { getUserLanguage } from "./get-user-language.ts";

const en = {
  user_stats_empty_text: "Study more cards to see the data",
  read_more: "Read more",
  hide_card_forever: "Hide forever",
  mute_cards: "Mute sound",
  unmute_cards: "Unmute sound",
  hide_card_forever_confirm_title:
    "Are you sure you want to hide this card forever? You will never see it again",
  wysiwyg_big_header: "Big header",
  next: "Next",
  review_wrong_label: "Wrong",
  review_correct_label: "Correct",
  wysiwyg_small_header: "Small header",
  wysiwyg_middle_header: "Middle header",
  wysiwyg_bold: "Bold",
  wysiwyg_italic: "Italic",
  wysiwyg_undo: "Undo",
  wysiwyg_redo: "Redo",
  wysiwyg_green: "Green",
  wysiwyg_red: "Red",
  wysiwyg_clear_formatting: "Clear formatting",
  my_decks: "My decks",
  formatting: "Formatting",
  choose_what_to_create: "Choose what to create",
  deck: "Deck",
  deck_description: "A collection of cards",
  folder: "Folder",
  folder_description: "A collection of decks",
  decks: "Decks",
  edit_folder: "Edit folder",
  add_folder: "Add folder",
  add_deck_to_folder: "Add deck to the folder",
  no_decks_to_add: "No more decks to add",
  show_all_decks: "Show all",
  hide_all_decks: "Hide",
  no_personal_decks_start: "You don't have any personal deck yet. Feel free to",
  no_personal_decks_create: "create one",
  no_personal_decks_explore:
    "or explore the public decks below. Happy learning! 😊",
  add_deck: "Add deck",
  add: "Add",
  edit_deck: "Edit deck",
  edit: "Edit",
  all_decks_reviewed: `Amazing work! 🌟 You've reviewed all the decks for now. Come back later for more.`,
  public_decks: "Public decks",
  explore_public_decks: "Explore more decks",
  news_and_updates: "News and updates",
  profile_section: "Profile",
  telegram_channel: "Telegram channel",
  settings: "Settings",
  deck_has_been_added: "This deck is on your list",
  deck_catalog: "Deck Catalog",
  translated_to: "Translated to",
  any_language: "Any language",
  category: "Category",
  any_category: "Any",
  deck_search_not_found: "No decks found",
  deck_search_not_found_description: "Try updating filters to see more decks",
  category_English: "English",
  category_Thai: "Thai",
  category_Geography: "Geography",
  category_History: "History",
  save: "Save",
  add_card: "Add card",
  edit_card: "Edit card",
  deck_preview: "Deck preview",
  card_preview: "Preview",
  add_card_short: "Add card",
  add_deck_short: "Deck",
  card_front_title: "Front side",
  card_back_title: "Back side",
  card_front_side_hint: "The prompt or question",
  card_back_side_hint: "The response you need to provide",
  card_field_example_title: "Example",
  card_field_example_hint: "Optional additional information",
  cards: "Cards",
  search_card: "Search card",
  card_sort_by_date: "Date",
  card_sort_by_front: "Front",
  card_sort_by_back: "Back",
  card_answer_back: "Back",
  sort_by: "Sort by",
  title: "Title",
  description: "Description",
  speaking_cards: "Speaking cards",
  voice_language: "Voice language",
  card_speak_side: "Speak side",
  card_speak_side_front: "Front",
  card_speak_side_back: "Back",
  card_speak_description:
    "Play spoken audio for each flashcard to enhance pronunciation",
  review_deck_finished: `You have finished this deck for now 🎉`,
  review_all_cards: `You have repeated all the cards for today 🎉`,
  review_finished_want_more: "Want more? You have",
  review_finished_to_review: "to study",
  review_deck: "Review deck",
  review_folder: "Review folder",
  cards_to_repeat: "Cards to repeat",
  cards_new: "New cards",
  cards_total: "Total cards",
  duplicate: "Duplicate",
  duplicate_deck_confirm: "Are you sure to duplicate this deck?",
  duplicate_folder_confirm: "Are you sure to duplicate this folder?",
  delete_deck_confirm:
    "Are you sure to remove the deck from your collection? This action can't be undone",
  deck_form_remove_card_confirm:
    "Are you sure you want to remove the card? All the card reviews from all the users will be lost",
  deck_form_remove_warning: "Deck must have at least one card",
  delete: "Delete",
  no_cards_to_review_in_deck: `Amazing work! 🌟 You've reviewed all the cards in this deck for now. Come back later for more.`,
  repeat_cards_anyway: `Repeat cards anyway`,
  no_cards_to_review_all: `Amazing work! 🌟 You've repeated all the cards for today. Come back later for more.`,
  review_need_to_repeat: "Need to review",
  review_right: "I got it right",
  review_show_answer: "Show answer",
  share: "Share",
  warning_telegram_outdated_title: "Your Telegram is outdated",
  warning_telegram_outdated_description:
    "Please update your Telegram to ensure stable functioning of this app.",
  settings_review_notifications: "Review notifications",
  settings_time: "Time",
  settings_review_notifications_hint:
    "Daily reminders help you remember to repeat cards",
  validation_deck_title: "The deck title is required",
  deck_form_quit_card_confirm: "Quit editing card without saving?",
  folder_form_quit_card_confirm: "Quit editing folder without saving?",
  deck_form_quit_deck_confirm: "Quit editing deck without saving?",
  deck_form_no_cards_alert: "Please add at least 1 card to create a deck",
  deck_category: "Deck category",
  validation_required: "This field is required",
  validation_number: "This field must be a number",
  validation_positive_number: "This field must be a positive number",
  share_perpetual_link: "Share perpetual link",
  share_one_time_link: "Share one-time link",
  share_deck_settings: "Share deck",
  share_folder_settings: "Share folder",
  share_one_time_access_link: "One-time access link",
  share_one_time_access_link_description:
    "The link is only available for one user. After the first use, the link will be invalid",
  share_access_duration: "Access duration",
  share_days: "Days",
  share_days_description:
    "How long the deck will be available after the first use",
  share_one_time_links_usage: "One-time links",
  share_used: "Link have been used by",
  share_unused: "Haven't been used",
  share_link_copied: "The link has been copied to your clipboard",
  share_copy_link: "Copy link",
  share_access_duration_days: "Access duration days",
  share_access_duration_no_limit: "No limit",
  share_deck_access_created_at: "Created at",
  share_no_links: "You haven't created any one-time links for this deck",
  settings_contact_support: "Contact support",
  settings_support_hint: "If you have any issues, questions or suggestions",
  payment_description: "Payment plan settings",
  payment_paid_until: "Paid until",
  payment_page_title: "Plans",
  payment_tos_and_pp_agree: "By purchasing MemoCard you agree to the ",
  payment_tos: "Terms of Service",
  payment_and: " and ",
  payment_pp: "Privacy Policy",
  share_no_links_for_folder:
    "You haven't created any one-time links for this folder",
  go_back: "Go back",
  validation_at_least_one_deck: "Please select at least 1 deck",
  add_answer: "Add quiz answer",
  edit_answer: "Edit answer",
  answer_text: "Answer text",
  is_correct: "Is correct",
  is_correct_explanation: `There can only be one correct answer`,
  card_advanced: "Advanced",
  review_idk: "I don't know",
  answer: "Card type",
  yes_no: "Remember",
  answer_type_choice: "Quiz",
  answer_type_explanation_remember: `A card with "Remember" and "Don't remember" buttons`,
  answer_type_explanation_choice: `A card with answer choices`,
  validation_answer_at_least_one_correct:
    "One answer should be selected as correct",
  validation_at_least_one_answer_required:
    "At least one answer should be provided",
  delete_folder_confirm: "Do you want to delete the folder?",
  user_stats_btn: "Statistics",
  user_stats_page: "My statistics",
  user_stats_remembered: "Remembered",
  user_stats_remembered_hint:
    "The number of cards reviewed correctly 5 times in a row",
  user_stats_learning: "Learning",
  user_stats_learning_hint:
    "The number of cards reviewed less than 5 times in a row",
  user_stats_total: "Total cards",
  user_stats_total_hint: "The total number of cards opened at least once",
  user_stats_learning_time: "Learning time distribution",
  user_stats_learning_time_hint:
    "How your time is allocated between learning new material and reviewing",
  user_stats_chart_min_expl: "Don't know the card",
  user_stats_chart_max_expl: "Know the card very well",
};

type Translation = typeof en;

const ru: Translation = {
  deck_form_remove_warning: "Колода должна содержать хотя бы одну карточку",
  folder_form_quit_card_confirm: "Выйти без сохранения папки?",
  card_answer_back: "Назад",
  read_more: "Читать далее",
  profile_section: "Профиль",
  review_wrong_label: "Неправильно",
  review_correct_label: "Правильно",
  user_stats_empty_text: "Изучите больше карточек, чтобы увидеть данные",
  hide_card_forever_confirm_title:
    "Вы уверены, что хотите скрыть эту карточку навсегда? Вы больше не увидите её",
  hide_card_forever: "Скрыть навсегда",
  review_idk: "Не знаю",
  mute_cards: "Выключить звук",
  unmute_cards: "Включить звук",
  wysiwyg_italic: "Курсив",
  wysiwyg_red: "Красный",
  next: "Далее",
  payment_pp: "Политикой конфиденциальности",
  payment_and: " и ",
  payment_tos_and_pp_agree: "При покупке MemoCard вы соглашаетесь с ",
  payment_tos: "Условиями использования",
  payment_page_title: "Тарифы",
  payment_description: "Настройки тарифного плана",
  payment_paid_until: "Оплачено до",
  wysiwyg_clear_formatting: "Очистить форматирование",
  wysiwyg_bold: "Жирный",
  wysiwyg_small_header: "Маленький заголовок",
  wysiwyg_middle_header: "Средний заголовок",
  wysiwyg_big_header: "Большой заголовок",
  wysiwyg_green: "Зеленый",
  wysiwyg_redo: "Повторить",
  wysiwyg_undo: "Отменить",
  repeat_cards_anyway: `Всё равно повторить`,
  formatting: "Форматирование",
  validation_at_least_one_deck: "Пожалуйста выберите хотя бы 1 колоду",
  duplicate_folder_confirm: "Вы уверены, что хотите продублировать эту папку?",
  validation_answer_at_least_one_correct: "Выберите хотя бы 1 правильный ответ",
  add_answer: "Добавить ответ",
  answer_text: "Текст ответа",
  card_advanced: "Дополнительно",
  edit_answer: "Редактировать ответ",
  is_correct: "Правильный",
  validation_at_least_one_answer_required: "Укажите хотя бы 1 ответ",
  is_correct_explanation: `Может быть только один правильный ответ`,
  share_folder_settings: "Настройки шеринга папки",
  share_no_links_for_folder:
    "Вы еще не создали одноразовых ссылок для этой папки",
  choose_what_to_create: "Выберите что создать",
  card_preview: "Предпросмотр",
  deck: "Колода",
  add_deck_short: "Колода",
  deck_description: "Коллекция карточек",
  folder: "Папка",
  folder_description: "Коллекция колод",
  review_folder: "Повторить папку",
  add_deck_to_folder: "Добавить колоду в папку",
  add_folder: "Добавить папку",
  edit_folder: "Редактировать папку",
  no_decks_to_add: "Больше нет колод для добавления",
  decks: "Колоды",
  my_decks: "Мои колоды",
  deck_preview: "Предпросмотр колоды",
  show_all_decks: "Показать",
  hide_all_decks: "Скрыть",
  no_personal_decks_start: "У вас еще нет персональных колод. Вы можете",
  no_personal_decks_create: "создать колоду",
  no_personal_decks_explore: "или выбрать публичную колоду ниже. Удачи! 😊",
  add_deck: "Добавить колоду",
  add: "Добавить",
  edit_deck: "Редактировать колоду",
  edit: "Изменить",
  all_decks_reviewed: `Отличная работа! 🌟 Вы прошли все колоды. Возвращайтесь позже за новыми.`,
  public_decks: "Публичные колоды",
  explore_public_decks: "Посмотреть еще",
  edit_card: "Редактировать карточку",
  news_and_updates: "Новости и обновления",
  telegram_channel: "Телеграм канал",
  settings: "Настройки",
  deck_has_been_added: "Колода уже в вашем списке",
  deck_catalog: "Каталог Колод",
  translated_to: "Переведено на",
  any_language: "Любой язык",
  category: "Категория",
  any_category: "Любая",
  deck_search_not_found: "Нет подходящих колод",
  deck_form_remove_card_confirm:
    "Вы уверены, что хотите удалить карточку? Все повторения этой карточки будут удалены у всех пользователей",
  deck_search_not_found_description:
    "Попробуйте изменить фильтры чтобы увидеть больше",
  // TODO: move to database
  category_English: "Английский",
  category_Thai: "Тайский",
  category_Geography: "География",
  category_History: "История",
  save: "Сохранить",
  add_card: "Добавить карточку",
  card_front_title: "Лицевая сторона",
  card_back_title: "Обратная сторона",
  card_front_side_hint: "Вопрос или подсказка",
  card_back_side_hint: "Ответ",
  card_field_example_title: "Пример",
  card_field_example_hint: "Дополнительная информация (необязательно)",
  cards: "Карточки",
  search_card: "Поиск карточки",
  card_sort_by_date: "Дата",
  card_sort_by_front: "Вопрос",
  card_sort_by_back: "Ответ",
  sort_by: "Сортировка",
  title: "Название",
  description: "Описание",
  speaking_cards: "Озвучка карточек",
  voice_language: "Язык озвучки",
  card_speak_side: "Сторона карточки",
  card_speak_side_front: "Лицевая",
  card_speak_side_back: "Обратная",
  card_speak_description: "Позволяет улучшить произношение",
  review_deck_finished: `Вы прошли эту колоду 🎉`,
  review_all_cards: `Вы повторили все карточки на сегодня 🎉`,
  review_finished_want_more: "Хотите ещё? У вас есть",
  review_finished_to_review: "для изучения",
  review_deck: "Повторить колоду",
  cards_to_repeat: "Карточек для повторения",
  cards_new: "Новых",
  cards_total: "Всего",
  duplicate: "Копировать",
  duplicate_deck_confirm: "Вы уверены, что хотите продублировать эту колоду?",
  delete_deck_confirm:
    "Вы уверены, что хотите удалить колоду из своей коллекции? Это действие нельзя отменить",
  delete: "Удалить",
  no_cards_to_review_in_deck: `Отличная работа! 🌟 Вы прошли все карточки в этой колоде. Возвращайтесь позже за новыми.`,
  no_cards_to_review_all: `Отличная работа! 🌟 Вы повторили все карточки на сегодня`,
  review_need_to_repeat: "Не помню",
  review_right: "Помню",
  review_show_answer: "Показать ответ",
  share: "Поделиться",
  warning_telegram_outdated_title: "Ваш Телеграм устарел",
  warning_telegram_outdated_description:
    "Пожалуйста обновите Телеграм для стабильной работы приложения.",
  settings_review_notifications: "Напоминания о повторении",
  settings_time: "Время",
  settings_review_notifications_hint:
    "Ежедневные напоминания помогают не забывать повторять карточки",
  validation_deck_title: "Название колоды обязательно",
  deck_form_quit_card_confirm: "Выйти без сохранения карточки?",
  deck_form_quit_deck_confirm: "Выйти без сохранения колоды?",
  deck_form_no_cards_alert: "Пожалуйста добавьте хотя бы 1 карточку",
  deck_category: "Категория колоды",
  add_card_short: "Карточка",
  validation_required: "Это поле обязательно",
  validation_number: "Это поле должно быть числом",
  validation_positive_number: "Это поле должно быть положительным числом",
  share_access_duration_days: "Длительность доступа в днях",
  share_used: "Ссылка была использована",
  share_one_time_access_link: "Одноразовая ссылка",
  share_deck_settings: "Настройки шеринга колоды",
  share_access_duration: "Длительность доступа",
  share_access_duration_no_limit: "Без ограничений",
  share_days_description:
    "Как долго колода будет доступна после первого использования",
  share_copy_link: "Скопировать",
  share_days: "Дни",
  share_one_time_links_usage: "Одноразовые ссылки",
  share_no_links: "Вы еще не создали одноразовых ссылок для этой колоды",
  share_deck_access_created_at: "Создана",
  share_one_time_access_link_description:
    "Ссылка доступна только одному пользователю. После первого использования ссылка станет недействительной",
  share_link_copied: "Ссылка скопирована",
  share_one_time_link: "Поделиться одноразовой ссылкой",
  share_perpetual_link: "Поделиться постоянной ссылкой",
  share_unused: "Не использована",
  go_back: "Назад",
  settings_contact_support: "Связаться с поддержкой",
  settings_support_hint: "Если у вас есть вопросы, проблемы или предложения",
  delete_folder_confirm: "Вы уверены, что хотите удалить папку?",
  user_stats_btn: "Статистика",
  user_stats_page: "Моя статистика",
  user_stats_remembered: "Запомнено карточек",
  user_stats_remembered_hint: 'Нажато "Помню" 5 раз подряд',
  user_stats_learning: "В процессе изучения",
  user_stats_learning_hint: 'Нажато "Помню" менее 5 раз подряд',
  user_stats_total: "Всего карточек",
  user_stats_total_hint: "Карточки, открытые хотя бы один раз",
  user_stats_learning_time: "Распределение времени обучения",
  user_stats_learning_time_hint:
    "Как распределяется ваше время между изучением нового материала и повторением",
  user_stats_chart_min_expl: "Не помню карточку",
  user_stats_chart_max_expl: "Знаю карточку очень хорошо",
  answer: "Тип карточки",
  yes_no: "Помню",
  answer_type_choice: "Тест",
  answer_type_explanation_remember: `Карточка с кнопками "Помню" и "Не помню"`,
  answer_type_explanation_choice: `Карточка с вариантами ответов`,
};

const es: Translation = {
  yes_no: "Recordar",
  answer: "Tipo de tarjeta",
  answer_type_explanation_choice: `Una tarjeta con opciones de respuesta`,
  answer_type_explanation_remember: `Una tarjeta con botones "Recordar" y "No recordar"`,
  answer_type_choice: "Elección",
  profile_section: "Perfil",
  folder_form_quit_card_confirm: "¿Salir sin guardar la carpeta?",
  deck_form_remove_warning: "La baraja debe tener al menos una tarjeta",
  card_answer_back: "Atrás",
  read_more: "Leer más",
  review_idk: "No sé",
  review_wrong_label: "Incorrecto",
  review_correct_label: "Correcto",
  user_stats_empty_text: "Estudia más tarjetas para ver los datos",
  hide_card_forever: "Ocultar para siempre",
  mute_cards: "Silenciar sonido",
  unmute_cards: "Activar sonido",
  hide_card_forever_confirm_title:
    "¿Estás seguro de que quieres ocultar esta tarjeta para siempre? No la volverás a ver",
  next: "Siguiente",
  payment_tos_and_pp_agree: "Al comprar MemoCard aceptas los ",
  payment_pp: "Política de privacidad",
  payment_and: " y ",
  payment_tos: "Términos de servicio",
  payment_paid_until: "Pagado hasta",
  payment_description: "Configuración del plan de pago",
  payment_page_title: "Planes",
  wysiwyg_red: "Rojo",
  wysiwyg_bold: "Negrita",
  wysiwyg_undo: "Deshacer",
  wysiwyg_redo: "Rehacer",
  wysiwyg_green: "Verde",
  repeat_cards_anyway: `Repetir de todos modos`,
  wysiwyg_big_header: "Encabezado grande",
  wysiwyg_middle_header: "Encabezado mediano",
  wysiwyg_clear_formatting: "Borrar formato",
  wysiwyg_small_header: "Encabezado pequeño",
  wysiwyg_italic: "Cursiva",
  formatting: "Formato",
  validation_at_least_one_deck: "Por favor, selecciona al menos 1 mazo",
  duplicate_folder_confirm: "¿Estás seguro de duplicar esta carpeta?",
  validation_at_least_one_answer_required:
    "Se debe proporcionar al menos una respuesta",
  is_correct: "Es correcto",
  validation_answer_at_least_one_correct:
    "Se debe seleccionar al menos una respuesta correcta",
  edit_answer: "Editar respuesta",
  card_advanced: "Avanzado",
  answer_text: "Texto de la respuesta",
  add_answer: "Añadir respuesta",
  is_correct_explanation: `Solo puede haber una respuesta correcta`,
  card_preview: "Vista previa",
  share_no_links_for_folder:
    "No has creado ningún enlace de un solo uso para esta carpeta",
  share_folder_settings: "Compartir carpeta",
  review_folder: "Repasar carpeta",
  folder_description: "Una colección de mazos",
  add_deck_short: "Mazo",
  folder: "Carpeta",
  deck_description: "Una colección de tarjetas",
  deck: "Mazo",
  choose_what_to_create: "Elige qué crear",
  edit_folder: "Editar carpeta",
  add_folder: "Añadir carpeta",
  add_deck_to_folder: "Añadir mazo a la carpeta",
  no_decks_to_add: "No hay más mazos para añadir",
  decks: "Mazos",
  my_decks: "Mis mazos",
  show_all_decks: "Mostrar todos",
  deck_preview: "Vista previa del mazo",
  hide_all_decks: "Ocultar",
  no_personal_decks_start:
    "Todavía no tienes ningún mazo personal. Siéntete libre de",
  no_personal_decks_create: "crear uno",
  no_personal_decks_explore:
    "o explorar los mazos públicos a continuación. ¡Feliz aprendizaje! 😊",
  add_deck: "Añadir mazo",
  deck_form_remove_card_confirm:
    "¿Estás seguro de que quieres eliminar la tarjeta? Todas las revisiones de tarjetas de todos los usuarios se perderán",
  edit_deck: "Editar mazo",
  edit_card: "Editar tarjeta",
  add: "Añadir",
  edit: "Editar",
  all_decks_reviewed: `¡Increíble trabajo! 🌟 Has repasado todos los mazos por ahora. Vuelve más tarde para más.`,
  public_decks: "Mazos públicos",
  explore_public_decks: "Explorar más mazos",
  news_and_updates: "Noticias y actualizaciones",
  telegram_channel: "Canal de Telegram",
  settings: "Configuración",
  deck_has_been_added: "Este mazo está en tu lista",
  deck_catalog: "Catálogo de Mazos",
  translated_to: "Traducido a",
  any_language: "Cualquier idioma",
  category: "Categoría",
  any_category: "Cualquiera",
  deck_search_not_found: "No se encontraron mazos",
  deck_search_not_found_description:
    "Intenta actualizar los filtros para ver más mazos",
  category_English: "Inglés",
  category_Thai: "Tailandés",
  category_Geography: "Geografía",
  category_History: "Historia",
  save: "Guardar",
  add_card: "Añadir tarjeta",
  add_card_short: "Añadir",
  card_front_title: "Cara frontal",
  card_back_title: "Cara posterior",
  card_front_side_hint: "La pregunta o indicación",
  card_back_side_hint: "La respuesta que necesitas proporcionar",
  card_field_example_title: "Ejemplo",
  card_field_example_hint: "Información adicional opcional",
  cards: "Tarjetas",
  search_card: "Buscar tarjeta",
  card_sort_by_date: "Fecha",
  card_sort_by_front: "Frente",
  card_sort_by_back: "Dorso",
  sort_by: "Ordenar por",
  title: "Título",
  description: "Descripción",
  speaking_cards: "Tarjetas habladas",
  voice_language: "Idioma de voz",
  card_speak_side: "Lado de la tarjeta",
  card_speak_side_front: "Frente",
  card_speak_side_back: "Dorso",
  card_speak_description:
    "Reproducir audio hablado para cada tarjeta y mejorar la pronunciación",
  review_deck_finished: `Has terminado este mazo por ahora 🎉`,
  review_all_cards: `Has repasado todas las tarjetas por hoy 🎉`,
  review_finished_want_more: "¿Quieres más? Tienes",
  review_finished_to_review: "para estudiar",
  review_deck: "Repasar mazo",
  cards_to_repeat: "Tarjetas para repetir",
  cards_new: "Nuevas tarjetas",
  cards_total: "Total de tarjetas",
  duplicate: "Duplicar",
  duplicate_deck_confirm: "¿Estás seguro de duplicar este mazo?",
  delete_deck_confirm:
    "¿Estás seguro de eliminar el mazo de tu colección? Esta acción no se puede deshacer",
  delete: "Eliminar",
  no_cards_to_review_in_deck: `¡Increíble trabajo! 🌟 Has repasado todas las tarjetas en este mazo por ahora. Vuelve más tarde para más.`,
  no_cards_to_review_all: `¡Increíble trabajo! 🌟 Has repasado todas las tarjetas por hoy. Vuelve más tarde para más.`,
  review_need_to_repeat: "Necesito repasar",
  review_right: "Lo recordé bien",
  review_show_answer: "Mostrar respuesta",
  share: "Compartir",
  warning_telegram_outdated_title: "Tu Telegram está desactualizado",
  warning_telegram_outdated_description:
    "Por favor, actualiza tu Telegram para asegurar el funcionamiento estable de esta aplicación.",
  settings_review_notifications: "Notificaciones de repaso",
  settings_time: "Hora",
  settings_review_notifications_hint:
    "Los recordatorios diarios te ayudan a recordar repetir las tarjetas",
  validation_deck_title: "El título del mazo es obligatorio",
  deck_form_quit_card_confirm: "¿Salir sin guardar la tarjeta?",
  deck_form_quit_deck_confirm: "¿Salir sin guardar el mazo?",
  deck_form_no_cards_alert:
    "Por favor, añade al menos 1 tarjeta para crear un mazo",
  deck_category: "Categoría del mazo",
  validation_required: "Este campo es obligatorio",
  validation_number: "Este campo debe ser un número",
  validation_positive_number: "Este campo debe ser un número positivo",
  share_unused: "No se ha utilizado",
  share_one_time_link: "Compartir enlace de un solo uso",
  share_link_copied: "El enlace se ha copiado en el portapapeles",
  share_one_time_access_link_description:
    "El enlace solo está disponible para un usuario. Después del primer uso, el enlace será inválido",
  share_no_links: "No has creado ningún enlace de un solo uso para este mazo",
  share_one_time_links_usage: "Enlaces únicos",
  share_deck_access_created_at: "Creado en",
  share_days: "Días",
  share_copy_link: "Copiar enlace",
  share_days_description:
    "Cuánto tiempo estará disponible el mazo después del primer uso",
  share_access_duration_no_limit: "Sin límite",
  share_access_duration: "Duración del acceso",
  share_used: "El enlace ha sido utilizado por",
  share_one_time_access_link: "Enlace de acceso de un solo uso",
  share_access_duration_days: "Duración del acceso en días",
  settings_support_hint: "Si tienes algún problema, pregunta o sugerencia",
  settings_contact_support: "Contactar con soporte",
  share_deck_settings: "Compartir un mazo",
  share_perpetual_link: "Compartir enlace perpetuo",
  go_back: "Volver",
  delete_folder_confirm:
    "¿Quieres eliminar la carpeta?",
  user_stats_btn: "Estadísticas",
  user_stats_page: "Mi estadística",
  user_stats_remembered: "Tarjetas recordadas",
  user_stats_remembered_hint: "Presionado 'Recuerdo' 5 veces seguidas",
  user_stats_learning: "En proceso de aprendizaje",
  user_stats_learning_hint: "Presionado 'Recuerdo' menos de 5 veces seguidas",
  user_stats_total: "Total de tarjetas",
  user_stats_total_hint: "Tarjetas abiertas al menos una vez",
  user_stats_learning_time: "Distribución del tiempo de aprendizaje",
  user_stats_learning_time_hint:
    "Cómo se distribuye tu tiempo entre el aprendizaje de material nuevo y la revisión",
  user_stats_chart_max_expl: "Conozco la tarjeta muy bien",
  user_stats_chart_min_expl: "No conozco la tarjeta",
};

const ptBr: Translation = {
  yes_no: "Lembrar",
  answer: "Tipo de cartão",
  answer_type_explanation_choice: `Um cartão com opções de resposta`,
  answer_type_explanation_remember: `Um cartão com botões "Lembrar" e "Não lembrar"`,
  answer_type_choice: "Escolha",
  profile_section: "Perfil",
  folder_form_quit_card_confirm: "Sair sem salvar a pasta?",
  deck_form_remove_warning: "O baralho deve ter pelo menos um cartão",
  card_answer_back: "Costas",
  read_more: "Leia mais",
  review_idk: "Não sei",
  review_wrong_label: "Incorreto",
  review_correct_label: "Correto",
  user_stats_empty_text: "Estude mais cartões para ver os dados",
  hide_card_forever: "Ocultar para sempre",
  mute_cards: "Silenciar som",
  unmute_cards: "Ativar som",
  hide_card_forever_confirm_title:
    "Tem certeza de que deseja ocultar este cartão para sempre? Você nunca mais o verá",
  next: "Próximo",
  payment_tos_and_pp_agree: "Ao comprar o MemoCard, você concorda com os ",
  payment_page_title: "Planos",
  payment_description: "Configurações do plano de pagamento",
  payment_paid_until: "Pago até",
  payment_pp: "Política de Privacidade",
  payment_tos: "Termos de Serviço",
  payment_and: " e ",
  wysiwyg_red: "Vermelho",
  wysiwyg_bold: "Negrito",
  wysiwyg_clear_formatting: "Limpar formatação",
  wysiwyg_small_header: "Cabeçalho pequeno",
  wysiwyg_middle_header: "Cabeçalho médio",
  repeat_cards_anyway: `Repetir mesmo assim`,
  wysiwyg_italic: "Itálico",
  wysiwyg_big_header: "Cabeçalho grande",
  wysiwyg_green: "Verde",
  wysiwyg_redo: "Refazer",
  wysiwyg_undo: "Desfazer",
  formatting: "Formatação",
  validation_answer_at_least_one_correct:
    "Selecione pelo menos uma resposta correta",
  is_correct_explanation: `Só pode haver uma resposta correta`,
  duplicate_folder_confirm: "Tem certeza de que deseja duplicar esta pasta?",
  add_answer: "Adicionar resposta",
  answer_text: "Texto da resposta",
  card_advanced: "Avançado",
  edit_answer: "Editar resposta",
  is_correct: "É correto",
  validation_at_least_one_answer_required:
    "Pelo menos uma resposta deve ser fornecida",
  validation_at_least_one_deck: "Por favor, selecione pelo menos 1 baralho",
  share_folder_settings: "Compartilhar pasta",
  share_no_links_for_folder: "Você ainda não criou nenhum link para esta pasta",
  card_preview: "Visualização",
  review_folder: "Revisar pasta",
  add_deck_short: "Baralho",
  choose_what_to_create: "Escolha o que criar",
  deck: "Baralho",
  deck_description: "Uma coleção de cartões",
  folder: "Pasta",
  folder_description: "Uma coleção de baralhos",
  no_decks_to_add: "Não há mais baralhos para adicionar",
  add_deck_to_folder: "Adicionar baralho à pasta",
  add_folder: "Adicionar pasta",
  edit_folder: "Editar pasta",
  decks: "Baralhos",
  my_decks: "Meus baralhos",
  show_all_decks: "Mostrar todos",
  hide_all_decks: "Ocultar",
  deck_preview: "Visualização do baralho",
  no_personal_decks_start:
    "Você ainda não tem nenhum baralho pessoal. Sinta-se à vontade para",
  deck_form_remove_card_confirm:
    "Tem certeza de que deseja remover o cartão? Todas as revisões de cartões de todos os usuários serão perdidas",
  no_personal_decks_create: "criar um",
  no_personal_decks_explore:
    "ou explorar os baralhos públicos abaixo. Bom aprendizado! 😊",
  add_deck: "Adicionar baralho",
  add: "Adicionar",
  edit_deck: "Editar baralho",
  edit_card: "Editar cartão",
  edit: "Editar",
  all_decks_reviewed: `Ótimo trabalho! 🌟 Você já revisou todos os baralhos por enquanto. Volte posteriormente para mais.`,
  public_decks: "Baralhos públicos",
  explore_public_decks: "Explorar mais baralhos",
  news_and_updates: "Notícias e atualizações",
  telegram_channel: "Canal do Telegram",
  settings: "Configurações",
  deck_has_been_added: "Este baralho está na sua lista",
  deck_catalog: "Catálogo de Baralhos",
  translated_to: "Traduzido para",
  any_language: "Qualquer idioma",
  category: "Categoria",
  any_category: "Qualquer",
  deck_search_not_found: "Nenhum baralho encontrado",
  deck_search_not_found_description:
    "Tente atualizar os filtros para ver mais baralhos",
  category_English: "Inglês",
  category_Thai: "Tailandês",
  category_Geography: "Geografia",
  category_History: "História",
  save: "Salvar",
  add_card: "Adicionar cartão",
  add_card_short: "Cartão",
  card_front_title: "Lado da frente",
  card_back_title: "Lado de trás",
  card_front_side_hint: "A pergunta ou indicação",
  card_back_side_hint: "A resposta que você precisa fornecer",
  card_field_example_title: "Explanação",
  card_field_example_hint: "Informação adicional opcional",
  cards: "Cartões",
  search_card: "Buscar cartão",
  card_sort_by_date: "Data",
  card_sort_by_front: "Frente",
  card_sort_by_back: "Verso",
  sort_by: "Ordenar por",
  title: "Título",
  description: "Descrição",
  speaking_cards: "Cartões com voz",
  voice_language: "Idioma da voz",
  card_speak_side: "Lado do cartão",
  card_speak_side_front: "Frente",
  card_speak_side_back: "Verso",
  card_speak_description:
    "Reproduzir áudio falado para cada cartão para melhorar a pronúncia",
  review_deck_finished: `Parabéns! Você terminou este baralho por enquanto. 🎉`,
  review_all_cards: `Você revisou todos os cartões para hoje 🎉`,
  review_finished_want_more: "Quer mais? Você tem",
  review_finished_to_review: "para estudar",
  review_deck: "Revisar baralho",
  cards_to_repeat: "Cartões para repetir",
  cards_new: "Novos cartões",
  cards_total: "Total de cartões",
  duplicate: "Duplicar",
  duplicate_deck_confirm: "Tem certeza de que deseja duplicar este baralho?",
  delete_deck_confirm:
    "Tem certeza de que deseja remover o baralho da sua coleção? Esta ação não pode ser desfeita",
  delete: "Deletar",
  no_cards_to_review_in_deck: `Ótimo trabalho! 🌟 Você já revisou todos os cartões neste baralho por enquanto. Volte posteriormente para mais.`,
  no_cards_to_review_all: `Ótimo trabalho! 🌟 Você revisou todos os cartões para hoje. Volte posteriormente para mais.`,
  review_need_to_repeat: "Preciso revisar",
  review_right: "Acertei",
  review_show_answer: "Mostrar resposta",
  share: "Compartilhar",
  warning_telegram_outdated_title: "Seu Telegram está desatualizado",
  warning_telegram_outdated_description:
    "Por favor, atualize seu Telegram para garantir o funcionamento estável deste aplicativo.",
  settings_review_notifications: "Notificações de revisão",
  settings_time: "Hora",
  settings_review_notifications_hint:
    "Lembretes diários ajudam você a lembrar de repetir os cartões",
  validation_deck_title: "O título do baralho é obrigatório",
  deck_form_quit_card_confirm: "Sair sem salvar o cartão?",
  deck_form_quit_deck_confirm: "Sair sem salvar o baralho?",
  deck_form_no_cards_alert:
    "Por favor, adicione pelo menos 1 cartão para criar um baralho",
  deck_category: "Categoria do baralho",
  validation_required: "Este campo é obrigatório",
  validation_number: "Este campo deve ser um número",
  validation_positive_number: "Este campo deve ser um número positivo",
  share_perpetual_link: "Compartilhar link perpétuo",
  share_deck_settings: "Compartilhar um baralho",
  share_access_duration_days: "Duração do acesso em dias",
  share_used: "O link foi usado por",
  share_one_time_access_link: "Link de acesso único",
  share_access_duration: "Duração do acesso",
  share_access_duration_no_limit: "Sem limite",
  share_days_description:
    "Quanto tempo o baralho estará disponível após o primeiro uso",
  share_copy_link: "Copiar link",
  share_days: "Dias",
  share_deck_access_created_at: "Criado em",
  share_one_time_links_usage: "Enlaces descartáveis",
  settings_contact_support: "Contatar suporte",
  settings_support_hint: "Se você tiver algum problema, dúvida ou sugestão",
  share_no_links:
    "Você ainda não criou nenhum link de acesso único para este baralho",
  share_one_time_access_link_description:
    "O link está disponível apenas para um usuário. Após o primeiro uso, o link será inválido",
  share_link_copied: "O link foi copiado para a área de transferência",
  share_one_time_link: "Compartilhar link de acesso único",
  share_unused: "Não utilizado",
  go_back: "Voltar",
  delete_folder_confirm:
    "Você quer deletar a pasta?",
  user_stats_btn: "Estatísticas",
  user_stats_page: "Minha Estatística",
  user_stats_remembered: "Cartões Memorizados",
  user_stats_remembered_hint: "Clicado 'Acertei' 5 vezes seguidas",
  user_stats_learning: "Em Processo de Aprendizagem",
  user_stats_learning_hint: "Clicado 'Acertei' menos de 5 vezes seguidas",
  user_stats_total: "Total de Cartões",
  user_stats_total_hint: "Cartões abertos pelo menos uma vez",
  user_stats_learning_time: "Distribuição do Tempo de Aprendizagem",
  user_stats_learning_time_hint:
    "Como o seu tempo é distribuído entre o estudo de material novo e a revisão",
  user_stats_chart_min_expl: "Não conheço o cartão",
  user_stats_chart_max_expl: "Conheço o cartão muito bem",
};

const translations = { en, ru, es, "pt-br": ptBr };
export type Language = keyof typeof translations;

export const translateCategory = (category: string) => {
  return t(`category_${category}` as any, category);
};

export const translator = new Translator<Language, Translation>(
  translations,
  getUserLanguage(),
);

export const t = (key: keyof Translation, defaultValue?: string) => {
  return translator.translate(key, defaultValue);
};
