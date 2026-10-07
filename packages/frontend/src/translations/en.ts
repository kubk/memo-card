import { selectPluralForm, type PlanDuration } from "api";
import { random } from "../lib/array/random.ts";
import type { ReviewIntervalUnit } from "../screens/deck-review/format-interval.ts";
import { encouragingMessages } from "./encouraging-messages/en.ts";

export const en = {
  encouraging_message: () => random(encouragingMessages),
  days_count: ({ days }: { days: number }) => {
    return `${days === 1 ? "1 day" : `${days} days`}`;
  },
  leaderboard_review_label: ({ count }: { count: number }) => {
    return selectPluralForm("en", count, {
      one: "review",
      other: "reviews",
    });
  },
  review_cards_label: ({ count }: { count: number }) => {
    return count === 1 ? `Review ${count} card` : `Review ${count} cards`;
  },
  frozen_cards_count: ({ cards }: { cards: number }) => {
    return cards === 1
      ? `1 card has been frozen`
      : `${cards} cards have been frozen`;
  },
  new_cards_count: ({ count }: { count: number }) => {
    return count === 1 ? `${count} new card` : `${count} new cards`;
  },
  buy_plan: ({ title, price }: { title: string; price: string }) => {
    return `Buy "${title}" for ${price}`;
  },
  days_ago: ({ daysText }: { daysText: string }) => {
    return `${daysText} days ago`;
  },
  review_again_interval: "<10 m",
  review_interval: ({
    value,
    unit,
  }: {
    value: number;
    unit: ReviewIntervalUnit;
  }) => {
    const units = {
      minute: "m",
      hour: "h",
      day: "d",
      week: "w",
      month: "mo",
      year: "y",
    };
    return `${value} ${units[unit]}`;
  },
  pro_duration: ({ duration }: { duration: PlanDuration }) => {
    const labels = {
      1: "1 month",
      6: "6 months",
      12: "1 year",
    };
    return labels[duration];
  },
  discount_label: ({ discount }: { discount: string }) => {
    return `${discount} off`;
  },
  navigation_main: "Main",
  navigation_review: "Review",
  leaderboard: "Leaderboard",
  leaderboard_this_week: "This week",
  leaderboard_your_position: "Your position",
  leaderboard_rank_label: "place",
  leaderboard_statistics: "Statistics",
  leaderboard_statistics_empty: "No results yet",
  leaderboard_empty: "No reviews this week",
  logout: "Logout",
  error_contact_support:
    "An error occurred. Please contact support so we can help you.",
  deck_not_found: "Can't find it",
  deck_was_deleted: "This deck was deleted by its author",
  think_error_contact_support:
    "If you think this is a mistake, contact support",
  login_google: "Login with Google",
  login_telegram: "Login with Telegram",
  login_telegram_failed: "Could not sign in with Telegram — try again",
  folder_form_no_decks: "No decks in the folder",
  card_next: "Next",
  card_previous: "Previous",
  user_stats_empty_text: "Study more cards to see the data",
  read_more: "Read more",
  hide_card_forever: "Hide forever",
  mute_cards: "Mute sound",
  unmute_cards: "Unmute sound",
  hide_card_forever_confirm_title:
    "Are you sure you want to hide this card forever? You will never see it again",
  wysiwyg_big_header: "Big header",
  next: "Next",
  custom_due_cards: "Due cards",
  custom_new_cards: "New cards",
  review_custom: "Choose decks",
  review_card_type: "Type of card",
  wysiwyg_text_color: "Text color",
  wysiwyg_bold: "Bold",
  wysiwyg_italic: "Italic",
  wysiwyg_undo: "Undo",
  wysiwyg_clear_formatting: "Clear formatting",
  my_decks: "My decks",
  formatting: "Formatting",
  create: "Create",
  deck: "Deck",
  create_deck_option: "Deck",
  deck_description: "A collection of cards",
  folder: "Folder",
  create_folder_option: "Folder",
  folder_description: "A collection of decks",
  decks: "Decks",
  edit_folder: "Edit folder",
  add_folder: "Add folder",
  add_deck_to_folder: "Add deck to the folder",
  decks_in_other_folders: "Decks in other folders",
  no_decks_to_add: "No more decks to add",
  show_all_decks: "Show all",
  hide_all_decks: "Hide",
  select_all: "Select all",
  deselect_all: "Deselect all",
  select: "Select",
  selected: "Selected",
  browser_no_personal_decks_start: "You don't have any personal deck yet",
  browser_no_personal_decks_link: "Learn how to use MemoCard on ",
  browser_no_personal_decks_end: ". Happy learning! 😊",
  add_deck: "Add deck",
  add: "Add",
  edit_deck: "Edit",
  edit: "Edit",
  view: "View",
  view_more: "View more",
  all_decks_reviewed: `Amazing work! 🌟 You've reviewed all the decks for now. Come back later for more.`,
  public_decks: "Public decks",
  explore_public_decks: "More decks",
  news_and_updates: "News and updates",
  youtube_channel: "YouTube channel",
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
  card_search_not_found: "No cards found",
  category_English: "English",
  category_Thai: "Thai",
  category_Geography: "Geography",
  category_History: "History",
  category_Chemistry: "Chemistry",
  category_Spanish: "Spanish",
  category_Other: "Other",
  save: "Save",
  add_card: "Add card",
  edit_card: "Edit",
  card_preview: "Preview",
  more: "More",
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
  sort_by: "Sort by",
  title: "Title",
  description: "Description",
  speaking_cards_enable: "Enable voice",
  speaking_cards: "Speaking cards",
  voice_language: "Voice language",
  speaking_card: "Voice",
  card_voiceover_deck_hint: "Configure voice language in [link:deck settings]",
  card_speak_side: "Speak side",
  card_speak_side_hint: "The selected side is voiced automatically",
  front: "Front",
  back: "Back",
  card_speak_description:
    "Play spoken audio for each flashcard to listen to the pronunciation",
  review_deck_finished: `You have finished this deck for now 🎉`,
  review_all_cards: `You have repeated all the cards for today 🎉`,
  review_finished_want_more: "Want more? You have",
  review_finished_to_review: "to study",
  review_deck: "Review deck",
  review_folder: "Review folder",
  cards_to_repeat: "To repeat",
  cards_new: "New cards",
  cards_total: ({ count }: { count: number }) => `Total cards: ${count}`,
  delete_item_title_deck: "Delete this deck?",
  delete_item_description_deck: "Will be removed from your collection",
  delete_item_remove_for_others_deck: "Remove this deck for other people too",
  delete_item_other_users_deck: "Other users having the same deck",
  delete_item_public_catalog_deck:
    "Remove this deck from the public catalog too",
  delete_item_title_folder: "Delete this folder?",
  delete_item_description_folder: "Will be removed from your collection",
  delete_item_remove_for_others_folder:
    "Remove this folder for other people too",
  delete_item_other_users_folder: "Other users having the same folder",
  delete_item_public_catalog_folder:
    "Remove this folder from the public catalog too",
  deck_form_remove_card_confirm: "Are you sure you want to remove the card?",
  deck_form_remove_cards_confirm:
    "Are you sure you want to remove all of the selected cards?",
  delete: "Delete",
  no_cards_to_review_in_deck: `Amazing work! 🌟 You've reviewed all the cards in this deck for now. Come back later for more.`,
  repeat_cards_anyway: `Repeat cards anyway`,
  no_cards_to_review_all: `Amazing work! 🌟 You've repeated all the cards for today. Come back later for more.`,
  review_again: "Again",
  review_hard: "Hard",
  review_good: "Good",
  review_easy: "Easy",
  review_show_answer: "Show answer",
  share: "Share",
  warning_telegram_outdated_title: "Your Telegram is outdated",
  warning_telegram_outdated_description:
    "Please update your Telegram to ensure stable functioning of this app.",
  settings_review_notifications: "Review notifications",
  settings_time: "Time",
  settings_lang: "Language",
  settings_review_notifications_hint:
    "Daily reminders help you remember to repeat cards",
  validation_deck_title: "The deck title is required",
  deck_form_quit_card_confirm: "Quit editing card without saving?",
  quit_without_saving: "Quit without saving?",
  folder_form_quit_card_confirm: "Quit editing folder without saving?",
  deck_form_quit_deck_confirm: "Quit editing deck without saving?",
  deck_category: "Deck category",
  validation_required: "This field is required",
  share_link_copied: "The link has been copied to your clipboard",
  copied: "Copied",
  copy_code: "Copy code",
  html_column: "Column",
  html_row: "Row",
  settings_contact_support: "Contact support in Telegram",
  settings_support_hint: "If you have any issues, questions or suggestions",
  payment_description: "Unlock more features ",
  payment_title: "Payment",
  payment_choose_duration: "Duration",
  payment_choose_subscription: "Subscription",
  payment_choose_method: "Payment method",
  payment_method_usd: "Bank card",
  payment_method_stars: "Telegram stars",
  payment_paid_until: "Paid until",
  payment_until_date: "Until [date]",
  payment_renews_on: "Renews on [date]",
  payment_cancel_subscription: "Cancel subscription",
  payment_cancel_subscription_confirm:
    "Cancel the subscription? Access will continue until the paid period ends",
  payment_cancel_subscription_error: "Unable to cancel subscription",
  payment_tos_and_pp_agree: "By purchasing, you agree to the ",
  payment_tos: "Terms of Service",
  payment_and: " and ",
  payment_pp: "Privacy Policy",
  privacy_policy: "Privacy Policy",
  go_back: "Back",
  validation_at_least_one_deck: "Please select at least 1 deck",
  add_answer: "Add quiz answer",
  answer_text: "Answer text",
  review_correct_label: "Correct",
  review_wrong_label: "Incorrect",
  advanced: "More",
  review_idk: "I don't know",
  card_answer_type: "Card type",
  yes_no: "Remember",
  answer_type_choice: "Quiz",
  answer_type_explanation_remember: `A card with "Remember" and "Don't remember" buttons`,
  answer_type_explanation_choice: `A card with answer choices`,
  validation_answer_at_least_one_correct:
    "One answer should be selected as correct",
  validation_at_least_one_answer_required:
    "At least one answer should be provided",
  user_stats_page: "My statistics",
  user_stats_daily_page: "Daily reviews",
  user_stats_card_reviews: "Card reviews",
  user_stats_today: "Today",
  user_stats_7d: "7d",
  user_stats_30d: "30d",
  user_stats_memory: "Cards",
  user_stats_to_review: "To review",
  user_stats_remembered_cards: "Remembered",
  user_stats_all_cards: "All",
  user_stats_streaks: "Streaks",
  user_stats_current_streak: "Current",
  user_stats_best_streak: "Best",
  teacher_stats_students: "Students",
  teacher_stats_decks_shared: "Decks being studied",
  teacher_stats_no_decks:
    "Create and share a deck first. Students who add your decks will appear here.",
  teacher_stats_top_students: "Top students",
  teacher_stats_no_student_activity:
    "No student activity yet. Share a deck link with your class.",
  teacher_stats_top_decks: "Top decks",
  teacher_stats_no_deck_activity: "Decks with students have no activity yet.",
  teacher_stats_all_students: "All students",
  teacher_stats_no_students: "No students yet.",
  teacher_stats_all_decks: "All decks",
  teacher_stats_no_shared_decks: "No decks with students yet.",
  teacher_stats_see_all: "See all",
  teacher_stats_last_repeat: "Last repeat",
  teacher_stats_decks: "Decks",
  teacher_stats_seen: "Seen",
  teacher_stats_due: "Due",
  teacher_stats_repeats: "Repeats",
  teacher_stats_users: "Users",
  teacher_stats_yesterday: "Yesterday",
  validate_positive: "Please enter a positive number",
  validate_under_100: "Please enter a number less than 100",
  freeze_confirm_freeze:
    "Are you sure you want to freeze your cards? This action can't be undone.",
  freeze_title: "Freeze cards",
  how: "How it works",
  freeze_rule_1:
    "All your cards will be paused, and you won't receive any notifications.",
  freeze_rule_2:
    "The amount of cards to review won't increase during the frozen period; you'll see the same number of cards when you resume.",
  freeze_rule_3: "Freezing cards can't be undone.",
  freeze_rule_4:
    "If you add a card during the freeze period, it will not be affected by the freeze.",
  freeze_for: "Freeze for",
  freeze_for_or_manual: "or type manually",
  freeze_notified: "You'll get notified on",
  freeze_hint: "Postpone studying cards",
  is_on: "On",
  is_off: "Off",
  error_solving: "We're solving the issue",
  error: "Error",
  user_settings_updated: "Settings have been updated",
  confirm_cancel: "Cancel",
  confirm_ok: "Confirm",

  upgrade_pro: "Upgrade to Pro",
  upgrade: "Upgrade",

  // Global Search
  global_search_placeholder: "Search decks, folders, cards",
  global_search_no_results: "No results found",
  global_search_start_typing:
    "Start typing to search for decks, folders, and cards",
  global_search_tabs_decks: "Decks",
  global_search_tabs_folders: "Folders",
  global_search_context_deck: "Deck",

  // About page
  about_title: "About",
  about_paragraph_1:
    "MemoCard was created to make reviewing flashcards simple and convenient.",
  about_paragraph_2:
    "During the Telegram Mini App Contest, I decided to create the flashcard app I had always dreamed of. No configuration, smart reminders, and a clean interface.",
  about_paragraph_3:
    "The app uses a scientifically grounded spaced repetition algorithm based on Ebbinghaus's forgetting curve. It helps you effectively memorize languages, facts, or any information by showing flashcards exactly when you need to review them.",
  about_paragraph_4:
    "MemoCard won a prize in the contest. Today, thousands of people use it to learn and remember more effectively.",
  about_visit_website: "Visit Website →",
  about_github_frontend: "GitHub Frontend Repository →",

  // Wysiwyg Help
  wysiwyg_help_title: "Text Formatting Guide",
  wysiwyg_help_step1: "Highlight the text you want to change",
  wysiwyg_help_step2: "Press any button from the toolbar",
  wysiwyg_help_bold: "Bold text",
  wysiwyg_help_italic: "Italic text",
  wysiwyg_help_color: "Change text color",
  wysiwyg_help_heading: "Make text bigger (heading)",
  wysiwyg_help_table: "Insert a table",
  wysiwyg_help_clear: "Remove all formatting",
  wysiwyg_help_undo: "Undo last action",

  card_created: "Card has been created",

  // Move card to deck
  move_card_to_deck_title: "Move",
  move_card_without_folder: "Without folder",
  move_card_open_deck: "Open deck",

  // Image related
  image: "Image",

  // Anki import
  anki_import_entry_button: "Import from Anki",
  anki_import_main_button: "Upload .apkg file",
  anki_import_heading: "Import Anki deck",
  anki_import_step_1_title: "Step 1",
  anki_import_step_1: "Open Anki, click [link:the gear icon] next to your deck",
  anki_import_step_2_title: "Step 2",
  anki_import_step_2: "Click [link:Export]",
  anki_import_step_3_title: "Step 3",
  anki_import_step_3: "Choose .apkg format, then click [link:Export]",
  anki_import_screenshot_gear_alt:
    "Anki deck list with gear icon next to a deck",
  anki_import_screenshot_export_menu_alt:
    "Anki deck options menu with Export selected",
  anki_import_screenshot_export_dialog_alt:
    "Anki export dialog with package export options",
  anki_import_invalid_file: "Please choose an .apkg file",
  anki_import_error: "Unable to import Anki deck",
  anki_import_success: "Anki deck imported",

  // Skip card
  skip_card_for_now: "Skip for now",
  skip_card_confirm: "Skip this card? It will be hidden until your next review",
  review_skipped: "Skipped",

  // MCP / ChatGPT
  telegramSetup: "Sign in with Telegram once to connect your library",
  pluginComingSoon: "Memo Card is coming to the ChatGPT directory soon",
  openPlugin: "Open Memo Card in ChatGPT",
  connectedApps: "Connected apps",
  stayConnected: "Stay connected until you disconnect",
  disconnect: "Disconnect",
  disconnectError: "Could not disconnect, please try again",
  benefitCreateTitle: "Create complete decks",
  benefitCreateDescription: "Folders, decks, and cards in 1 request",
  benefitImproveTitle: "Improve existing cards",
  benefitImproveDescription:
    "AI fixes wording, adds examples, and fills vocabulary gaps",
  benefitManageTitle: "Manage your whole library",
  benefitManageDescription: "AI quickly organizes cards into decks and folders",
  benefitTranscriptionTitle: "Add phonetic transcriptions",
  benefitTranscriptionDescription: "AI adds the correct pronunciation",
  proTitle: "Manage MemoCard with ChatGPT",
  proDescription: "Create, edit and improve your decks via ChatGPT",
  proBenefitsTitle: "Less busywork, more learning",
  proInputPlaceholder: "Ask ChatGPT",
  proShowExampleTitle: "Show example",
  proNewChatTitle: "New chat",
  proMoreTitle: "More",
  proAddTitle: "Add",
  proVoiceInputTitle: "Voice input",
  proVoiceModeTitle: "Start voice mode",
  proCreatePrompt: "Create 20 cards with English travel vocabulary",
  proCreateResponse: "Done — I added 20 new cards",
  proCreateDetail: "Your English · Travel deck now has 148 cards",
  proReviewPrompt: "Review my Family deck and add any missing words",
  proReviewResponse: "I found 6 missing words and added them",
  proReviewDetail: "Your Family deck now has 12 cards",
  proOrganizePrompt: "Organize my language decks into folders",
  proOrganizeResponse: "Done — I organized them into 3 folders",
  proOrganizeDetail: "Every card kept its review history",
  introTitle: "Connect ChatGPT to Memo Card",
  introDescription: "ChatGPT can create and update cards in MemoCard",
  startButton: "Start",
  openChatGptTitle: "Open ChatGPT",
  addedButton: "Added",
  tryAgentTitle: "Ask ChatGPT",
  decksCountPrompt: "How many decks do I have in Memo Card?",
  createCardsPrompt: "Generate 10 cards with capitals of the world",
  createLanguageCardsPrompt:
    "Generate 6 cards with English French words related to fruits",
  doneButton: "Done",
  configuredTitle: "ChatGPT is connected",
  instruction:
    "Open [link:ChatGPT plugins] in the browser, click «Add», then «Create MCP App» and enter:",
  nameLabel: "Name",
  descriptionValue: "Manage Memo Card folders, decks, and cards",
  serverUrlLabel: "Server URL",
  authenticationLabel: "Authentication",
  authenticationInstruction: "Select “No Auth”",
  guideLink: "Guide",
} as const;

export type Translation = typeof en;
export type TranslationResources = {
  [K in keyof Translation]: Translation[K] extends (
    ...args: infer Args
  ) => string
    ? (...args: Args) => string
    : string;
};
export type TranslationKeyByValue<Value> = {
  [K in keyof Translation]: Translation[K] extends Value ? K : never;
}[keyof Translation];
export type TranslationArguments<K extends keyof Translation> = {
  [Key in keyof Translation]: Translation[Key] extends (
    ...args: infer Args
  ) => string
    ? Args
    : [defaultValue?: string];
}[K];
