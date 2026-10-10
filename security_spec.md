# Security Specification & Threat Model

## Data Invariants
1. **Ownership Invariant**: Users can only read, create, update, or delete their own `users`, `audit_reports`, and `saved_appeals`. No cross-user access.
2. **Identity Integrity**: `userId` in document payloads MUST equal `request.auth.uid`. Spoofing other users' UIDs is completely forbidden.
3. **Temporal Integrity**: `createdAt` must be `request.time` on creation. `createdAt` is immutable on update. `updatedAt` must be `request.time` on updates.
4. **Schema Strictness**: All documents must satisfy size bounds, strict string lengths, allowed enum ranges, and no unapproved keys.
5. **Terminal State**: In `saved_appeals`, once an appeal reaches terminal state (`approved` or `rejected`), it cannot be updated except by admins.

## The "Dirty Dozen" Payloads
1. Unauthenticated creation of `audit_reports` (returns `PERMISSION_DENIED`).
2. Spoofed UID: Authenticated user A submits `audit_reports` with `userId` = User B (returns `PERMISSION_DENIED`).
3. Ghost / Shadow Fields: Document with unrecognized key `ghostField: "inject"` (returns `PERMISSION_DENIED`).
4. Resource Poisoning: `videoTitle` exceeding 200 characters or containing 1MB payload (returns `PERMISSION_DENIED`).
5. Client-forged Timestamp: `createdAt` provided as arbitrary past timestamp instead of `request.time` (returns `PERMISSION_DENIED`).
6. ID Poisoning: Invalid document ID with malformed path chars `/audit_reports/../../hack` (returns `PERMISSION_DENIED`).
7. PII Snooping: User A attempts to `get` or `list` User B's `/users/{userId}` profile (returns `PERMISSION_DENIED`).
8. Blanket Query Attack: Requesting `audit_reports` without `userId == request.auth.uid` filter (returns `PERMISSION_DENIED`).
9. Immutable Field Mutation: Updating `userId` or `createdAt` on an existing report (returns `PERMISSION_DENIED`).
10. Invalid Enum: Submitting `riskLevel` with invalid status `SUPER_SAFE_BYPASS` (returns `PERMISSION_DENIED`).
11. Terminal Bypass: Updating an appeal whose status is `approved` without admin privileges (returns `PERMISSION_DENIED`).
12. Value Type Poisoning: Submitting numeric score as string `"100"` or negative value (returns `PERMISSION_DENIED`).
