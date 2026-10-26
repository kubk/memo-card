---
name: create-flashcards
description: Turn material into Memo Card flashcards. Use when the user wants to make flashcards, a deck or study cards from notes, a document, a conversation, a vocabulary list, code or any other source and save them to Memo Card
---

# Create flashcards in Memo Card

Use the Memo Card tools to save well-formed cards to the user's library. The user studies them later with spaced repetition in the Memo Card web app or Telegram, so every card must make sense on its own without this conversation.

## Find the destination first

1. If the user named a deck or folder, call `search_library` with that name. If it is not found or the name is ambiguous, call `get_library` and confirm the destination with the user
2. Before adding cards to an existing deck, call `get_decks` for that deck and skip cards whose front already exists, so the deck does not get duplicates
3. If the user wants a new deck, create it with its cards in one call: `create_deck` for a single deck, or `create_folder` when the material splits into several decks under one topic

## Write good cards

- One fact per card. Split lists and multi-part answers into separate cards
- The front is a question or cue that has one clear answer. Avoid fronts like "Tell me about X"
- The back is short. Put supporting context in `example` instead of making the back long
- Keep the user's wording and terminology when the material comes from their notes
- Do not invent facts that are not in the source material. If something is unclear, ask

For language learning:

- Put the word or phrase the user knows on one side and the target language on the other, consistently across the deck
- Add a natural example sentence in the target language to `example`
- When the deck should be spoken aloud, set the deck `speakLocale` to the target language and `speakField` to the side that holds it

## Confirm large batches

When the material produces more than about 30 cards, or when the user did not say where to save them, show a short plan first: deck names and the number of cards in each. Create the cards after the user agrees.

## Report what was saved

After the write tools succeed, say which decks were created or changed and how many cards each received. Never claim cards were saved unless the tool call succeeded. If a tool reports that the account has no access to Memo Card tools, tell the user that their Memo Card plan does not include this integration.
