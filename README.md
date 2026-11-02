# She Deserves

A mobile-first, privacy-minded support prototype for adult performers. It includes a real-time, invite-only peer chat that encrypts message contents in each browser before relaying them through the NestJS API.

> **Prototype, not a production safety service.** Chat encryption and privacy controls have not received an independent security review. Do not share identifying details or rely on this service for crisis response. The preview does not have trained moderators, user accounts, safety reporting, or a staffed support team.

## Run locally

Requirements: Node.js 20.11 or newer and npm.

```bash
npm install
npm run dev
```

The web app is available at `http://localhost:3000`. Start the API separately:

```bash
npm run dev:api
```

The API listens at `http://localhost:4000`; its health check is `http://localhost:4000/api/health`. PostgreSQL is optional for local chat. If configuring it, copy `apps/api/.env.example` to `apps/api/.env`. The health check tests connectivity only; no personal-data tables or chat-message storage are implemented.

For a deployed web app, configure `NEXT_PUBLIC_API_URL` to the API's HTTPS origin and `WEB_ORIGIN` to the exact web origin. Deploy behind HTTPS. Web Crypto requires a secure context; browsers treat `localhost` as secure for local development.

## Anonymous peer chat

1. Select **Create a private chat room** or paste a room invitation link.
2. Share the generated link only with people you trust. Its URL fragment contains a random 256-bit AES key; the browser does not send the fragment to the API.
3. Messages are encrypted and decrypted with AES-GCM in the browser. The Socket.IO relay accepts ciphertext only, keeps no message history, and limits room size and send rate. Messages remain in tab memory until cleared or the tab closes.
4. **Leave & clear** disconnects and removes the invitation fragment from the address bar. Export is optional and saves an unencrypted text file on the user's device.

Room links are bearer secrets: anyone who obtains one can join and read messages. This prototype does not authenticate participants, provide moderator access, support key rotation/revocation, prevent screenshots or copying, provide confidential abuse reports, or defend against compromised devices or malicious hosting. Network operators and hosting infrastructure may still see connection metadata such as IP addresses. Do not treat the chat as fully anonymous or production-secure.

## Requirement check

| Requirement | Status in this prototype |
|---|---|
| Mobile-first Next.js, React, TypeScript, Tailwind, NestJS, PostgreSQL connectivity | Implemented; PostgreSQL is used only for an optional health check. |
| Anonymous/pseudonymous onboarding | Temporary browser-generated chat alias and an 18+ self-attestation; no account or passkey. WebAuthn and actual age verification are not implemented. |
| Anonymous peer chat | Invite-only, live one-to-one/group relay (12 participant cap); client-side AES-GCM; no server message storage. Needs independent protocol/security review and human moderation/reporting before real use. |
| Encrypted sensitive PostgreSQL fields | Not implemented; the app currently stores no personal content in PostgreSQL. |
| Ads, analytics, tracking, location collection, identity documents | No analytics/ad/tracking scripts or collection fields are included. Network providers can observe transport metadata. |
| Confidential safety reporting | Not implemented. Harassment, trafficking concerns, coercion, doxxing, unsafe work, and platform abuse are identified as future reporting categories only. |
| Wellbeing and crisis tools | Grounding, a simple safety-planning prompt, boundary scripts, rest/stress guidance, and crisis guidance included. Offline help page is cached after the first visit; location-specific services require internet and are linked through Find A Helpline/IASP. Crisis protocols are not staffed or tested. |
| Optional therapy referrals and career-transition resources | Described in the interface, but directories/referrals and vetted resources are not connected. |
| Quick exit and discreet app name | Persistent quick-exit and crisis controls; browser/PWA label defaults to “Support” with an optional discreet header view. |
| Dashboard, export, permanent deletion | Chat can be exported to a local unencrypted file or cleared from the tab. Account-wide data export/deletion is not available because accounts and persistent personal records do not exist. |
| WCAG 2.2 AA and escalation testing | Keyboard focus styles, labels, reduced-motion support, responsive text/layout, and semantic controls are included. A formal WCAG audit, contrast certification, assistive-technology test, and escalation-protocol test remain outstanding. |
| AI care disclaimer | No AI feature is provided. The interface states that AI is not a replacement for licensed therapy or emergency services. |

## Before production

Co-design with performers; perform threat modeling and independent cryptographic/security review; add safe moderation/reporting and human escalation for an E2EE service; define a key lifecycle and abuse response; implement reviewed WebAuthn/pseudonymous identity, data access/deletion, and encrypted-at-rest storage only where justified; set strict retention, audit/access controls, and infrastructure log limits; test offline crisis instructions and escalation protocols with local experts; and complete WCAG 2.2 AA and privacy reviews. Never promise absolute anonymity.
