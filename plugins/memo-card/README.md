# Memo Card for Claude

[Memo Card](https://memocard.org) is a spaced repetition flashcard app for Telegram and the web. This plugin connects Claude to your Memo Card library, so you can ask Claude to add cards, create decks, improve existing cards and organize them into folders, then study in Memo Card.

## Requirements

A Memo Card account with a paid plan. You sign in with Telegram on the Memo Card page that opens when you connect.

## Example prompts

- Add a card "der Hund → the dog" to my German deck in Memo Card
- Create five Spanish restaurant flashcards in a new Memo Card deck
- Improve the examples in a Memo Card deck I choose

## Tools

The plugin connects to the Memo Card MCP server at `https://api.memocard.org/mcp/chatgpt`. Its tools read your folders, decks and cards, search them by text, create folders, decks and cards, edit them, move cards between decks while keeping their review history, and delete cards only when you explicitly ask. Studying and review scheduling stay in the Memo Card app.

## Privacy

The plugin talks only to the Memo Card server. Memo Card receives the inputs Claude passes to its tools, not your full conversation. Read the [privacy policy](https://app.memocard.org/privacy-policy) and [terms of service](https://app.memocard.org/terms-of-service). To disconnect, remove the Memo Card connector in Claude's settings.

## Support

[Memo Card support on Telegram](https://t.me/memocard_support) or [support@memocard.org](mailto:support@memocard.org).

## License

MIT
