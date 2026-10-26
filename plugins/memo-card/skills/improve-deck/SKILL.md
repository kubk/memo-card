---
name: improve-deck
description: Review and clean up an existing Memo Card deck or folder. Use when the user asks to improve, fix, review, reorganize, deduplicate or add examples to their Memo Card cards
---

# Improve a Memo Card deck

Help the user raise the quality of cards they already study without losing their progress.

## Read before changing anything

1. Find the deck with `search_library` or `get_library`
2. Load its cards with `get_decks`
3. Look for cards that are hard to review: duplicates, fronts with more than one correct answer, backs that are long paragraphs, typos, missing examples, and cards that belong in a different deck

## Propose, then apply

Summarize the problems you found and the changes you suggest, grouped by type. Apply them after the user agrees. Small fixes that the user explicitly asked for, such as "add examples to every card", can be applied directly.

Use the tool that matches each change:

- `update_cards` to fix the front, back or example of existing cards. Review history stays attached to the card
- `add_cards` to add missing cards
- `move_cards` to move cards to another deck. Never delete and recreate a card to move it, because that erases its review history
- `update_deck` or `update_folder` to rename, describe or regroup decks and folders
- `create_folder` with `existingDeckIds` to group existing decks into a new folder

## Deleting cards

Deleting a card also deletes its review history and cannot be undone. Use `delete_cards` only for specific cards the user explicitly agreed to delete. For requests like "remove the bad cards", list the cards you would delete and ask first.

## Out of scope

Studying, grading answers and scheduling reviews happen in the Memo Card app. Do not try to mark cards as reviewed or change their schedule.
