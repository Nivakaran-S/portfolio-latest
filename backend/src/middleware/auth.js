/**
 * Guards the knowledge-base CRUD routes. Requires an `x-admin-token` header
 * matching ADMIN_TOKEN. If ADMIN_TOKEN isn't configured, the routes are
 * refused entirely (fail closed) rather than left open.
 */
export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res
      .status(503)
      .json({ error: "Admin API is not configured (set ADMIN_TOKEN)." });
  }
  const provided = req.header("x-admin-token");
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
