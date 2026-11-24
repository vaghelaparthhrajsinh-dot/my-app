# AD OCCASION — Security Specification & Threat Model

## 1. Master Source of Truth & Data Invariants
- **Bootstrapped Owner**: `parthhrajsinhvaghela@gmail.com` (requires `request.auth.token.email_verified == true`).
- **Role Hierarchy**: `owner` > `admin` > `user` (read-only) > `pending` (zero business access).
- **Business Data Isolation**: Unauthenticated users, unverified emails, `pending` users, and `revoked` users cannot read or write any business collection (`bookings`, `inventory`, `customers`, `advances`, `negotiations`, `expenses`, `categories`, `settings`, `auditHistory`).
- **Write Enforcement**:
  - `user` role is strictly read-only across all business collections.
  - Only `owner` or `admin` can create/update bookings, reservations, inventory, customers, advances, negotiations, and expenses.
  - Only `owner` (or `admin` if explicitly enabled in `settings/business.adminPermissions`) can delete records, manage users/invites, view/edit restricted financial settings, or perform backup imports.
- **Temporal & Identity Integrity**:
  - `createdAt` must equal `request.time` on creation and remain immutable on update.
  - `updatedAt` must equal `request.time` on both creation and update.
  - `createdBy` must equal `request.auth.uid` on creation and remain immutable on update.
  - Document IDs must match `^[a-zA-Z0-9_\-]+$` with max length 128.

## 2. Dirty Dozen Adversarial Payloads
1. **Privilege Escalation (Self-Owner)**: Non-owner attempts to create/update `/users/{uid}` with `role: "owner"`. -> **DENIED**.
2. **Unverified Email Spoof**: Request with `email == "parthhrajsinhvaghela@gmail.com"` and `email_verified == false`. -> **DENIED**.
3. **Read-Only User Booking Write**: User with `role: "user"` attempts to create or update `/bookings/{id}`. -> **DENIED**.
4. **Pending User Data Scrape**: User with `role: "pending"` attempts to list `/customers` or `/bookings`. -> **DENIED**.
5. **Shadow / Ghost Field Injection**: Admin sends `{ ...validBooking, isAdminApproved: true }` on `/bookings/{id}`. -> **DENIED** by strict `hasOnly()` key whitelist.
6. **ID Poisoning**: Client attempts to create `/bookings/` with 500-char ID or invalid characters (`../etc`). -> **DENIED** by `isValidId()`.
7. **Timestamp Forgery**: Client sends `createdAt: "2020-01-01T00:00:00Z"` instead of server `request.time`. -> **DENIED**.
8. **Immutable Field Tampering**: Admin attempts to overwrite `createdBy` or `createdAt` during booking update. -> **DENIED**.
9. **PII Leak via Users List**: Read-only `user` attempts `list` on `/users` to harvest team emails. -> **DENIED** (`resource.data.uid == request.auth.uid` enforced for non-admins).
10. **Negative / Invalid Quantity Poisoning**: Client attempts to write `quantity: -5` or `totalAmount: "free"` on `/bookings/{id}`. -> **DENIED**.
11. **Unbounded Array Exhaustion**: Client sends `items` array with > 25 elements on `/bookings/{id}`. -> **DENIED**.
12. **Audit Log Tampering**: Admin or user attempts to update or delete an immutable `/auditHistory/{id}` entry. -> **DENIED**.
