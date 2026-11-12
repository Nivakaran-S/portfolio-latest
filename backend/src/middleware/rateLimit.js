/**
 * Tiny in-memory fixed-window limiter (per IP). Single-instance only.
 * ponytail: swap for a shared store (Redis) if the backend ever scales out.
 */
export function rateLimit({ windowMs, max }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const e = hits.get(req.ip);
    if (!e || e.reset <= now) {
      // hard cap so a flood of distinct IPs can't grow the map between sweeps
      if (hits.size >= 10_000 && !hits.has(req.ip)) {
        return res.status(429).json({ error: "Too many requests. Slow down." });
      }
      hits.set(req.ip, { count: 1, reset: now + windowMs });
      return next();
    }
    if (++e.count > max) {
      res.set("Retry-After", String(Math.ceil((e.reset - now) / 1000)));
      return res.status(429).json({ error: "Too many requests. Slow down." });
    }
    next();
  };
}
