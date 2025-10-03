-- Create a test user for local development
INSERT INTO "user" (id, email, name, created_at)
VALUES (
  'local-test-user-id',
  'test@local.dev',
  'Local Test User',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Add 1,000,000 credits to the user (admin grant)
INSERT INTO credit_ledger (
  operation_id,
  user_id,
  principal,
  balance,
  type,
  description,
  priority,
  created_at
)
VALUES (
  'local-credits-' || gen_random_uuid(),
  'local-test-user-id',
  1000000,
  1000000,
  'admin',
  'Initial credits for local development',
  1,
  NOW()
)
ON CONFLICT (operation_id) DO NOTHING;

-- Show the created user and credits
SELECT
  u.id,
  u.email,
  u.name,
  COALESCE(SUM(cl.balance), 0) as total_credits
FROM "user" u
LEFT JOIN credit_ledger cl ON u.id = cl.user_id
WHERE u.email = 'test@local.dev'
GROUP BY u.id, u.email, u.name;
