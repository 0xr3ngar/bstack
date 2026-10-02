---
name: coding-best-practices
description: How to plan changes, keep diffs small, and write TypeScript a junior can read line by line.
disable-model-invocation: true
license: MIT
compatibility: "Requires access to the code under review."
---

# Coding best practices

Follow this when you implement or review code. It merges workspace agent rules with TypeScript style defaults.

## Before you code

State assumptions. If the request is ambiguous, say so and ask instead of guessing.

When several designs fit, list them with tradeoffs. Say if a simpler option exists. Push back when the extra work does not buy anything.

If something is still unclear, stop and name what is missing.

## Scope and diffs

Ship the minimum that satisfies the request. No extra features, config hooks, or abstractions used once.

Do not edit unrelated lines, comments, or formatting. Do not refactor code the task did not touch. Match the file's existing style.

Every changed line should trace to the request. Mention unrelated dead code; do not delete it unless asked.

When your edit leaves unused imports or locals, remove those. Do not remove pre-existing dead code unless asked.

## How you run the task

Turn the request into checks you can verify.

Examples: "add validation" means tests for bad inputs, then code that passes them. "Fix the bug" means a failing test that reproduces it, then a fix. "Refactor X" means tests green before and after.

For multi-step work, write a short plan. Each step names what you will verify when it is done.

Prefer strong success criteria over "make it work."

## KISS, YAGNI, DRY

Keep it simple. Two fixed output shapes can be two branches, not a framework.

Build what the task needs now. A CSV export does not need PDF unless someone asked for PDF.

Repeat business rules once. Share one discount calculation across checkout and invoices instead of copying formulas.

## Readable TypeScript

Write for a junior reader. Prefer straight loops and `if` over chained `map`/`filter`/`reduce` and clever one-liners. A few extra lines are fine if each step has a name.

Use inferred return types where they stay clear. Treat inputs and shared data as read-only. Local accumulators may mutate.

### Defaults

- Dedupe, transform, and filter in one loop with a `Set` or named steps, not a long chain of array methods.
- Collect matches with a loop. Skip non-matches first, then push.
- Sum with a running total in a loop, not `reduce`, when the sum is the whole story.
- Find the first match with a loop and early return. Do not `filter` then take index zero.
- Group into a `Map` with explicit "missing group" handling, not a dense `reduce`.
- Map fixed codes to labels with a `satisfies Record<...>` object, not nested ternaries.
- Name intermediate values in math and business logic.
- Validate with early returns for bad input, then fall through to the happy path.
- Prefer a single options object over several boolean positional args.
- Return new objects instead of mutating inputs. Mark input parameters `Readonly` when you copy.
- Guard preconditions, return early, then run side effects. No `condition && action()` as control flow.

## Examples

### Dedupe, double, filter in one pass

```typescript
// bad
Array.from(new Set(array)).map((x) => x * 2).filter((x) => x > 10);

// good
const result: number[] = [];
const seen = new Set<number>();
for (const x of array) {
  if (seen.has(x)) {
    continue;
  }
  seen.add(x);
  const doubled = x * 2;
  const isAboveThreshold = doubled > 10;
  if (!isAboveThreshold) {
    continue;
  }
  result.push(doubled);
}
```

### Collect emails for active users

```typescript
// bad
const emails = users
  .filter((user) => user.active)
  .map((user) => user.email);

// good
const emails: string[] = [];
for (const user of users) {
  if (!user.active) {
    continue;
  }
  emails.push(user.email);
}
```

### Sum amounts

```typescript
// bad
const total = amounts.reduce((sum, amount) => sum + amount, 0);

// good
let total = 0;
for (const amount of amounts) {
  total += amount;
}
```

### Find user by id

The parameter is read-only so callers know you will not mutate the array or user objects.

```typescript
// bad
function findUser(users: ReadonlyArray<Readonly<User>>, targetId: string) {
  return users.filter((user) => user.id === targetId)[0];
}

// good
function findUser(users: ReadonlyArray<Readonly<User>>, targetId: string) {
  for (const user of users) {
    if (user.id === targetId) {
      return user;
    }
  }
  return undefined;
}
```

### Group orders by customer

```typescript
// bad
const ordersByCustomer = orders.reduce((groups, order) => {
  const group = groups.get(order.customerId) ?? [];
  group.push(order);
  groups.set(order.customerId, group);
  return groups;
}, new Map<string, Order[]>());

// good
const ordersByCustomer = new Map<string, Order[]>();

for (const order of orders) {
  const customerOrders = ordersByCustomer.get(order.customerId);

  if (customerOrders === undefined) {
    ordersByCustomer.set(order.customerId, [order]);
    continue;
  }

  customerOrders.push(order);
}
```

### Fixed code to label map

```typescript
// bad
type ResultCode = 0 | 1 | 2;
type ResultLabel = "Retry" | "Pass" | "Excellent";

function getResultLabel(code: ResultCode) {
  return code === 2 ? "Excellent" : code === 1 ? "Pass" : "Retry";
}

// good
type ResultCode = 0 | 1 | 2;
type ResultLabel = "Retry" | "Pass" | "Excellent";

const resultLabels = {
  0: "Retry",
  1: "Pass",
  2: "Excellent",
} satisfies Record<ResultCode, ResultLabel>;

console.log(resultLabels[code]);
```

### Name intermediate totals

```typescript
// bad
const total = unitPriceCents * quantity * (1 - discountRate) + shippingCents;

// good
const subtotalCents = unitPriceCents * quantity;
const discountedSubtotalCents = subtotalCents * (1 - discountRate);
const total = discountedSubtotalCents + shippingCents;
```

### Early returns for validation

```typescript
// bad
function getQuantityError(quantity: number) {
  if (Number.isInteger(quantity)) {
    if (quantity > 0) {
      return undefined;
    } else {
      return "Quantity must be positive.";
    }
  } else {
    return "Quantity must be a whole number.";
  }
}

// good
function getQuantityError(quantity: number) {
  if (!Number.isInteger(quantity)) {
    return "Quantity must be a whole number.";
  }

  if (quantity <= 0) {
    return "Quantity must be positive.";
  }

  return undefined;
}
```

### Options object at the call site

```typescript
// bad
function createUser(name: string, isAdmin: boolean, isActive: boolean) {
  return { name, isAdmin, isActive };
}

const user = createUser("Sam", false, true);

// good
function createUser(options: Readonly<{
  name: string;
  isAdmin: boolean;
  isActive: boolean;
}>) {
  return { ...options };
}

const user = createUser({
  name: "Sam",
  isAdmin: false,
  isActive: true,
});
```

### Immutable update

```typescript
// bad
function activateUser(user: User) {
  user.active = true;
  return user;
}

// good
function activateUser(user: Readonly<User>) {
  return { ...user, active: true };
}
```

### Preconditions before side effects

```typescript
// bad
function handleStart() {
  isReady && startJob();
}

// good
function handleStart() {
  if (!isReady) {
    return;
  }

  startJob();
}
```
