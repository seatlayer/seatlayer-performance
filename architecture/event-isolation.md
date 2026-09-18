# Event-scoped inventory architecture

Each event has its own live inventory state and ordered stream of changes.

One published venue version can be reused by many events. Each event pins its
venue snapshot and maintains its own live free, held, booked, blocked, hidden,
and closed state. Buyer and operator sessions are scoped to an event, and
inventory transitions for that event pass through one ordering authority.

```mermaid
flowchart TB
  V[Published venue version]

  subgraph A[Event A boundary]
    AA[Event A ordering authority]
    AS[Event A snapshot and deltas]
    AB[Event A buyer and operator sessions]
    AA --> AS --> AB
  end

  subgraph B[Event B boundary]
    BA[Event B ordering authority]
    BS[Event B snapshot and deltas]
    BB[Event B buyer and operator sessions]
    BA --> BS --> BB
  end

  subgraph C[Event C boundary]
    CA[Event C ordering authority]
    CS[Event C snapshot and deltas]
    CB[Event C buyer and operator sessions]
    CA --> CS --> CB
  end

  V --> AA
  V --> BA
  V --> CA

  P[Shared platform services]
  P -. scoped access and common dependencies .-> A
  P -. scoped access and common dependencies .-> B
  P -. scoped access and common dependencies .-> C
```

This structure gives every event independent inventory and an event-level
ordering boundary. Shared platform services authenticate and route scoped work
without merging the live inventory of separate events.

## Event boundary properties

- Events pin a published venue snapshot rather than mutating a shared live chart.
- Each event has independent live seat status.
- Connected sessions receive an event-scoped snapshot followed by inventory
  deltas.
- Holds, bookings, releases, and expiry for an event are serialized through one
  event authority, reducing the double-sale race window.
- Credentials and embedded sessions remain limited by workspace, resource,
  event, origin, mode, and explicit capability as applicable.
