# Telegram catalog import (future)

Drop exported catalog photos here, then map them to SKUs.

Suggested layout after sync:

```
media/import/telegram/{message_id}.jpg
media/products/{SKU}/01.jpg
media/products/{SKU}/02.jpg
media/products/{SKU}/proof.mp4
```

Keep original Telegram filenames in a sidecar JSON during import so ~7k photos can be reconciled with артикул.
