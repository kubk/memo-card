import { Translator } from "../lib/translator/translator.ts";
import { getUserLanguage } from "./get-user-language.ts";

const en = {
  my_decks: "My decks",
  show_all_decks: "Show all",
  hide_all_decks: "Hide",
  no_personal_decks_start: "You don't have any personal deck yet. Feel free to",
  no_personal_decks_create: "create one",
  no_personal_decks_explore:
    "or explore the public decks below. Happy learning! 😊",
  add_deck: "Add deck",
  edit_deck: "Edit deck",
  edit: "Edit",
  all_decks_reviewed: `Amazing work! 🌟 You've reviewed all the decks for now. Come back later for more.`,
  public_decks: "Public decks",
  explore_public_decks: "Explore more decks",
  news_and_updates: "News and updates",
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
  category_Geography: "Geography",
  category_History: "History",
  save: "Save",
  add_card: "Add card",
  add_card_short: "Add card",
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
  cards_to_repeat: "Cards to repeat",
  cards_new: "New cards",
  cards_total: "Total cards",
  duplicate: "Duplicate",
  duplicate_confirm: "Are you sure to duplicate this deck?",
  delete_deck_confirm:
    "Are you sure to remove the deck from your collection? This action can't be undone",
  delete: "Delete",
  no_cards_to_review_in_deck: `Amazing work! 🌟 You've reviewed all the cards in this deck for now. Come back later for more.`,
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
  deck_form_quit_deck_confirm: "Quit editing deck without saving?",
  deck_form_no_cards_alert: "Please add at least 1 card to create a deck",
  deck_category: "Deck category",
  validation_required: "This field is required",
  validation_number: "This field must be a number",
  validation_positive_number: "This field must be a positive number",
  share_perpetual_link: "Share perpetual link",
  share_one_time_link: "Share one-time link",
  share_deck_settings: "Share deck",
  share_one_time_access_link: "One-time access link",
  share_one_time_access_link_description:
    "The link is only available for one user. After the first use, the link will be invalid",
  share_access_duration: "Access duration",
  share_days: "Days",
  share_days_description:
    "How long the deck will be available after the first use",
  share_one_time_links_usage: "One-time links",
  share_used: "Link have been used ✅",
  share_unused: "Haven't been used",
  share_link_copied: "The link has been copied to your clipboard",
  share_copy_link: "Copy link",
  share_access_duration_days: "Access duration days",
  share_access_duration_no_limit: "No limit",
  share_deck_access_created_at: "Created at",
  share_no_links: "You haven't created any one-time links for this deck",
};

type Translation = typeof en;

const ru: Translation = {
  my_decks: "Мои колоды",
  show_all_decks: "Показать",
  hide_all_decks: "Скрыть",
  no_personal_decks_start: "У вас еще нет персональных колод. Вы можете",
  no_personal_decks_create: "создать колоду",
  no_personal_decks_explore: "или выбрать публичную колоду ниже. Удачи! 😊",
  add_deck: "Добавить колоду",
  edit_deck: "Редактировать колоду",
  edit: "Изменить",
  all_decks_reviewed: `Отличная работа! 🌟 Вы прошли все колоды. Возвращайтесь позже за новыми.`,
  public_decks: "Публичные колоды",
  explore_public_decks: "Посмотреть еще",
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
  deck_search_not_found_description:
    "Попробуйте изменить фильтры чтобы увидеть больше",
  category_English: "Английский",
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
  duplicate_confirm: "Вы уверены, что хотите продублировать эту колоду?",
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
  share_used: "Использована ✅",
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
};

const es: Translation = {
  my_decks: "Mis mazos",
  show_all_decks: "Mostrar todos",
  hide_all_decks: "Ocultar",
  no_personal_decks_start:
    "Todavía no tienes ningún mazo personal. Siéntete libre de",
  no_personal_decks_create: "crear uno",
  no_personal_decks_explore:
    "o explorar los mazos públicos a continuación. ¡Feliz aprendizaje! 😊",
  add_deck: "Añadir mazo",
  edit_deck: "Editar mazo",
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
  duplicate_confirm: "¿Estás seguro de duplicar este mazo?",
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
  share_used: "El enlace ha sido utilizado ✅",
  share_one_time_access_link: "Enlace de acceso de un solo uso",
  share_access_duration_days: "Duración del acceso en días",
  share_deck_settings: "Compartir un mazo",
  share_perpetual_link: "Compartir enlace perpetuo",
};

const ptBr: Translation = {
  my_decks: "Meus baralhos",
  show_all_decks: "Mostrar todos",
  hide_all_decks: "Ocultar",
  no_personal_decks_start:
    "Você ainda não tem nenhum baralho pessoal. Sinta-se à vontade para",
  no_personal_decks_create: "criar um",
  no_personal_decks_explore:
    "ou explorar os baralhos públicos abaixo. Bom aprendizado! 😊",
  add_deck: "Adicionar baralho",
  edit_deck: "Editar baralho",
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
  duplicate_confirm: "Tem certeza de que deseja duplicar este baralho?",
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
  share_used: "O link foi usado ✅",
  share_one_time_access_link: "Link de acesso único",
  share_access_duration: "Duração do acesso",
  share_access_duration_no_limit: "Sem limite",
  share_days_description:
    "Quanto tempo o baralho estará disponível após o primeiro uso",
  share_copy_link: "Copiar link",
  share_days: "Dias",
  share_deck_access_created_at: "Criado em",
  share_one_time_links_usage: "Enlaces descartáveis",
  share_no_links:
    "Você ainda não criou nenhum link de acesso único para este baralho",
  share_one_time_access_link_description:
    "O link está disponível apenas para um usuário. Após o primeiro uso, o link será inválido",
  share_link_copied: "O link foi copiado para a área de transferência",
  share_one_time_link: "Compartilhar link de acesso único",
  share_unused: "Não utilizado",
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
