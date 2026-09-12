# Memo Card publication review

Updated September 12, 2026 (Europe/Paris). **Ready for the submission form; not submitted or published.** OpenAI's portal still refuses to create an MCP draft despite an approved individual identity and confirmed Apps Management write access. No draft, challenge, scan, or submission ID has been issued.

## Findings addressed one by one

1. **Fixed — fresh OAuth consent.** Removed the obsolete `decision=allow` requirement and deployed the matching form and handler to dev and prod. Fresh demo login → consent → authorization-code exchange → all ten tools → refresh → all ten tools → revocation passed against both deployments. Production reviewer login and consent also completed in Chrome, with all ten tools visible in ChatGPT.
2. **Done — paid production reviewer access.** A dedicated synthetic account (`-90000909`, source `demo`) has Pro through September 11, 2027, no admin permissions, and no reminders. The three demo secrets are configured in the encrypted production environment and deployed to the Worker. Reviewers use username/password on the consent page without Telegram, SMS, or developer assistance. The seed script supports explicit production provisioning and ensures the demo account has an active paid plan.
3. **Done — published privacy disclosures.** The [production policy](https://app.memocard.org/privacy-policy) now describes library content exchanged with ChatGPT, account linking, OAuth credentials, change history, recipients, retention, disconnect controls and deletion. It distinguishes OAuth reads from legacy raw-argument logging and explains that deleted card content may remain in change records. The blanket no-AI claim was replaced with an accurate description of ChatGPT processing. Dev and prod policies were verified in Chrome. Terms now include connected clients.
4. **Blocked by item 7 — domain verification and submission scan.** The production challenge route is implemented but intentionally returns 404 until OpenAI issues the exact value. `OPENAI_APPS_CHALLENGE` must come from the new draft. The production endpoint and ten tools work, but private connection discovery is not the submission scan.
5. **Prepared — review materials.** Listing copy, tool justifications, release notes, reviewer instructions, and exactly five positive plus three negative cases are below. The [production demo recording](https://app.memocard.org/review/memo-card-demo.mp4) is live and playable in Chrome: 3:41, H.264, 1218 × 768, about 1 MB. It records real ChatGPT operations on the synthetic paid account; pauses between recording segments are shortened. Category/country choices and the materials still need to be entered in the blocked submission form.
6. **Resolved — MCP is paid-only.** The product decision is that MCP automation requires an existing paid Memo Card plan for every client. Both `/mcp/chatgpt` and the legacy `/mcp?token=…` check the same `isUserPaid` function before any tool access; consent checks it before issuing a new grant. Separate card-creation-only checks were removed. No read/write permission tiers or ChatGPT-specific surcharge exist. Manual card creation in the Memo Card app retains its existing allowance. Listing copy explains the entitlement without promoting checkout or an upgrade. OpenAI still decides whether the submission meets its [commerce rules](https://developers.openai.com/plugins/app-guidelines#commerce-and-monetization).
7. **External blocker — portal verification mismatch.** Chrome shows the publishing account as organization Owner, the owner role explicitly has **Apps Management: Write**, the selected project has Global residency, and the same organization shows **Individual: Approved**. Yet Plugins → Create plugin → With MCP displays “Complete identity verification” before a draft can be created. Reloading and retrying did not resolve it. No new identity verification or support message was submitted. A support draft is provided below.

The existing private developer-mode installations are test connections, not a public listing. OpenAI requires the production submission scan and review before publication. [Submission workflow](https://developers.openai.com/plugins/deploy/submission)

## Deployed versions and verification

| Deployment | Current Worker version |
| --- | --- |
| Development API | `f28e1991-5507-4e49-9118-e0d607ee7aae` |
| Production API | `8748d346-8351-42aa-a1c0-b289d9f36bb0` |
| Development frontend | `4a591205-90d2-499b-8b62-32015620267a` |
| Production frontend | `7686dc17-d705-4882-9b44-43437f60d00a` |

- Repository type checking, focused lint, and 60 tests across seven MCP/OAuth/Telegram/connection files passed
- Dev HTTP checks temporarily expired only the synthetic demo account's plan: OAuth and legacy MCP both rejected reads and writes with 403; original plan dates were restored before successful tool checks
- User `415318291` was already Pro on dev through March 29, 2027; no entitlement change was necessary
- Prod and dev HTTP checks executed all ten tools before and after refresh, with independent database checks that card movement preserved scheduling and review history
- A first production run passed all five positive cases and ownership denial, then returned 400 during refresh; that run did not capture the error body. Error reporting was improved, and the next full production run passed without retries. The earlier transient remains unclassified; no speculative protocol changes were made
- Revoked production credentials returned 401; refresh using the revoked token failed
- Chrome exercised fresh production reviewer login, consent, discovery, all five user scenarios, ambiguous deletion, and cross-account write denial
- Browser test conversation: [production reviewer walkthrough](https://chatgpt.com/c/6aa47843-5400-83ec-bc16-caf4a0d4e1a7). This private chat is evidence only; submit the public MP4 URL
- Automated test objects and video-run objects were removed from the synthetic reviewer library; the base sample deck and separate private fixture remain
- No real user's library was modified during these publication checks

Reproduce from `packages/api`:

```sh
pnpm exec dotenvx run -f .env.development -- tsx bin/test-mcp-oauth.ts
pnpm exec dotenvx run -f .env.production -- tsx bin/test-mcp-oauth.ts --production
```

Production test mode requires the exact production origin and the configured negative, non-admin `source=demo` account. It does not change production entitlements. Smoke scripts do not print passwords or OAuth tokens.

## Listing ready for entry

| Field | Value |
| --- | --- |
| Package name | `memo-card` |
| Display name | Memo Card |
| Version | `1.0.0` |
| Short description | Create and organize flashcards |
| Developer | Select the approved individual identity for the publishing organization |
| MCP URL | `https://api.memocard.org/mcp/chatgpt` |
| Authentication | OAuth |
| Website | `https://memocard.org` |
| Support | `https://t.me/memocard_support` |
| Privacy | `https://app.memocard.org/privacy-policy` |
| Terms | `https://app.memocard.org/terms-of-service` |
| Logo | Existing `packages/frontend/public/img/logo.png` — 640 × 640 PNG |
| Category | Education and research; select the matching portal category |
| Countries | All available supported countries; Memo Card does not add a country restriction |
| Demo recording | `https://app.memocard.org/review/memo-card-demo.mp4` |
| Screenshots | None — this integration has no custom ChatGPT UI |

Long description:

> Turn material you choose in a conversation into flashcards saved in your Memo Card library. Find folders and decks, create cards with examples, improve existing cards, and organize them into decks and folders. Study your saved cards in the Memo Card web app or Telegram. Connect your Memo Card account through Telegram and approve library access. Moving cards preserves their review history. Permanent deletion happens only when explicitly requested. You can disconnect access in Memo Card settings. Requires an existing paid Memo Card plan, which includes MCP automation across supported clients. There is no additional charge for connecting ChatGPT.

Starter prompts:

- Show my Memo Card decks and help me choose one to improve
- Create five Spanish restaurant flashcards in a new Memo Card deck
- Improve the examples in a Memo Card deck I choose

## Reviewer login and fixtures

1. Connect to the production MCP URL with OAuth
2. On Memo Card's consent page, expand **Demo account**
3. Enter username `openai-review` and the supplied reviewer password
4. Click **Sign in to demo**, then **Allow access**
5. Run the cases below, using a unique `RUN` suffix for new objects

Supply the password only in OpenAI's review-credentials field. The generated credential bundle is stored locally in the ignored `.mcp-reviewer-production.local` file with mode 0600, and encrypted in the API production environment. Do not paste it into this document, source control, a public video, or the listing.

| Fixture | Production ID |
| --- | --- |
| Paid reviewer account | `-90000909` |
| Demo · Spanish essentials | Deck `4095` |
| Hello → Hola | Card `56284` |
| Thank you → Gracias | Card `56285` |
| Water → Agua | Card `56286` |
| Private ownership fixture, owned by a separate synthetic account | Deck `4096` |

All fixture content is synthetic. Leave the base sample deck unchanged and use newly created objects for write tests. No reviewer needs access to the separate fixture owner's account. The ownership result is independently checked against the database by the smoke script.

## Tool annotation justifications

All ten tools use `openWorldHint=false`: they operate on the connected account's bounded Memo Card library and do not search the public web, publish content, or message external recipients. Every authenticated paid connection has access to the complete tool set.

| Tool | Read only | Destructive | Justification |
| --- | --- | --- | --- |
| `get_library` | true | false | Reads accessible folder and deck summaries without modifying the library |
| `get_decks` | true | false | Reads requested accessible decks and cards without modifying them |
| `create_folder` | false | true | Creates a folder and optional content; `existingDeckIds` also changes existing deck placement |
| `create_deck` | false | false | Creates a new deck and optional new cards without overwriting existing content |
| `add_cards` | false | false | Appends new cards to an editable deck |
| `update_folder` | false | true | Overwrites selected folder metadata |
| `update_deck` | false | true | Overwrites selected deck metadata or placement |
| `update_cards` | false | true | Overwrites selected card fields |
| `move_cards` | false | true | Changes card placement while retaining card identity and review history |
| `delete_cards` | false | true | Permanently deletes selected cards and their scheduling/review history |

Use the values returned by the eventual production submission scan. These justifications match the deployed tools but do not replace that scan. [Scan requirements](https://developers.openai.com/plugins/deploy/app-review#metadata-stored-during-tool-scanning)

## Submission test cases: five positive, three negative

| Case | Prompt/scenario | Expected result and execution evidence |
| --- | --- | --- |
| Positive 1 | Show the cards in my Demo · Spanish essentials deck | `get_library` then `get_decks` returns the three fixture cards with front/back/example fields. Passed via production HTTP and Chrome |
| Positive 2 | Create a folder named Review Spanish RUN with a Travel deck containing Ticket → Billete and Train → Tren | `create_folder` returns `{folder,createdDecks}` with one folder, one deck, and two persisted cards. Passed via production HTTP and Chrome |
| Positive 3 | Create an unfiled deck named Review Verbs RUN containing Eat → Comer, then add Drink → Beber | `create_deck` and `add_cards` persist exactly two cards. Passed via production HTTP and Chrome |
| Positive 4 | Rename Review Spanish RUN to Review Spanish Updated RUN, rename its Travel deck to Travel Updated, add example Necesito un billete to Ticket, and move Ticket into Review Verbs RUN | `update_folder`, `update_deck`, `update_cards`, and `move_cards` persist the requested changes while retaining the card ID. Passed via production HTTP and Chrome; the HTTP case seeds review state and history and compares the complete database rows before and after the move |
| Positive 5 | Permanently delete only the Train card from the Travel Updated deck created in this review | `delete_cards` returns only Train's ID; Travel is empty and the three Verbs cards remain. Passed via production HTTP and Chrome |
| Negative 1 | Delete the bad cards in Review Verbs RUN | Ask which cards the user means; do not guess or delete anything. In Chrome, ChatGPT listed the three cards and asked which to delete. Database check confirmed all three remained |
| Negative 2 | Rename deck 4096 to Review ownership check | Server refuses the other account's write. Passed via production HTTP and Chrome; independent database read confirmed the private fixture name was unchanged |
| Negative 3 | Revoke the review connection, then reuse its access and refresh credentials | MCP access returns 401 and refresh fails. Passed against production in the HTTP smoke script; reconnecting requires a fresh authorization flow |

Additional Chrome check: “Clean up this messy deck” proposed moving the non-verb card and requested approval, without inferring deletion. The proposed move was declined; the library stayed unchanged.

## Release notes

> Initial submission of Memo Card's remote MCP integration. Ten tools let existing paid Memo Card users read, create, edit, organize, and explicitly delete flashcards in their library. OAuth connects a Telegram-backed account and supports renewable access and disconnection. The integration has no custom ChatGPT UI. A separate paid, non-admin reviewer account uses password login with synthetic data and the same consent, grant issuance, and tool execution paths. Card movement preserves identity and review history. Existing manual MCP clients remain supported by the backend.

## Remaining portal steps

1. Resolve the approved-identity mismatch in the publishing organization/project
2. Create the MCP draft, select the approved identity, and supply the exact issued domain challenge
3. Verify the domain and scan `https://api.memocard.org/mcp/chatgpt`
4. Enter the listing, availability, reviewer credentials, recording, tool justifications, release notes, and eight cases above
5. Complete the portal's policy attestations accurately and submit
6. After OpenAI approval, publish and set `CHATGPT_PLUGIN_URL` to the real directory URL

[Final validation requirements](https://developers.openai.com/plugins/deploy/submission-errors#final-directory-submission), [Review and publication flow](https://developers.openai.com/plugins/deploy/submission#public-publishing-flow)

## Support draft — not sent

Subject: Approved individual identity not recognized when creating a ChatGPT MCP plugin

> I am trying to submit Memo Card as a ChatGPT MCP plugin. In organization `org-ajvgsJCm06rgbac3vVKAjSyO` (Personal), Organization settings → Verifications shows Individual: Approved. My account is the organization Owner, and its role explicitly includes Apps Management: Write. The selected project is `proj_XEFGak0Ow64wu4v7zc7UhCSp` (Default project), with Global residency.
>
> At https://platform.openai.com/plugins, Create plugin → With MCP still opens “Complete identity verification” and says a verified developer identity is required. Reloading and retrying in the same organization/project does not help. The block happens before draft creation, so I have no draft or submission ID.
>
> Please check why the approved individual identity is not recognized by the plugin submission portal and restore the ability to create the submission. The production MCP endpoint is https://api.memocard.org/mcp/chatgpt.
