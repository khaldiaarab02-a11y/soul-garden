# Luna / Fairy

The technical component remains named `Fairy` for compatibility with the existing Soul Garden architecture.
The character's canonical identity is Luna.

## State API

`IDLE`, `WELCOME`, `LISTENING`, `THINKING`, `ENCOURAGING`, `CELEBRATING`, `FAREWELL`.

Example:

```jsx
<Fairy
  state="WELCOME"
  message="مرحبًا بكِ في حديقة الروح…"
/>
```

The artwork is intentionally a CSS/SVG-free placeholder layer. Future production artwork can replace the `LunaArtwork` implementation without changing the public component API.
