# Memo Card for Claude

[Memo Card](https://memocard.org) is a spaced repetition flashcard app for Telegram and the web. This plugin connects Claude to your Memo Card library, so you can turn notes, documents, vocabulary lists and conversations into flashcards, then study them in Memo Card.

## What you can do

- Create decks and folders with cards in one request
- Find cards, decks and folders by text
- Improve existing cards: fix wording, add example sentences, remove duplicates
- Reorganize cards between decks and folders while keeping their review history
- Delete specific cards when you explicitly ask

Studying and review scheduling stay in the Memo Card app.

## What's included

- **Memo Card connector**: the remote MCP server at `https://api.memocard.org/mcp/claude` with eleven tools for reading and editing your library
- **create-flashcards skill**: guides Claude to write clear one-fact cards, avoid duplicates and confirm large batches
- **improve-deck skill**: guides Claude to review a deck, propose fixes and apply them without losing review history

## Requirements

- A Memo Card account. Sign in with Telegram on the consent page when you connect
- A paid Memo Card plan. Without one, the tools explain that the account has no access and make no changes

## Setup

1. Install the plugin from the Claude directory, or in Claude Code run `/plugin install memo-card --marketplace kubk/memo-card`
2. When Claude first uses a Memo Card tool, sign in on the Memo Card page that opens and approve access
3. Ask Claude something like the examples below

## Example prompts

- Show my Memo Card decks and help me choose one to improve
- Create five Spanish restaurant flashcards in a new Memo Card deck
- Turn these lecture notes into a Memo Card deck called Biology week 3
- Improve the examples in a Memo Card deck I choose
- Move the verbs from my Spanish basics deck into a new Spanish verbs deck

## Tools

| Tool | What it does |
| --- | --- |
| `get_library` | Lists your folders and decks |
| `get_decks` | Reads the cards in selected decks |
| `search_library` | Finds cards, decks and folders by text |
| `create_folder` | Creates a folder with decks and cards, or groups existing decks |
| `create_deck` | Creates a deck with cards |
| `add_cards` | Adds cards to a deck |
| `update_folder` | Renames or describes a folder |
| `update_deck` | Renames, describes, moves or sets speech for a deck |
| `update_cards` | Edits card fronts, backs and examples |
| `move_cards` | Moves cards between decks and keeps their review history |
| `delete_cards` | Permanently deletes selected cards |

Read-only tools are marked as read-only, and tools that change or delete data are marked as destructive, so Claude asks before running them.

## Privacy

The plugin talks only to the Memo Card server at `api.memocard.org`. Memo Card receives the inputs Claude passes to its tools, such as card text and deck names, not your full conversation. Claude receives the folders, decks and cards that the tools return. Write tools keep before and after copies of changed items so support can investigate problems. The skills run no scripts and send no data anywhere else.

Read the [Memo Card privacy policy](https://app.memocard.org/privacy-policy) and [terms of service](https://app.memocard.org/terms-of-service) for collection, retention and deletion details.

To disconnect, remove the Memo Card connector in Claude's connector settings. Disconnecting does not delete your Memo Card library.

## Troubleshooting

- **The sign-in page says a paid plan is required**: upgrade your plan in the Memo Card app, then connect again
- **Claude says the account has no access to Memo Card tools**: your paid plan has ended. Renew it in the Memo Card app
- **Sign-in fails or the connection expired**: disconnect the connector in Claude and connect again

## Support

Write to [Memo Card support on Telegram](https://t.me/memocard_support) or [support@memocard.org](mailto:support@memocard.org).

## License

MIT
