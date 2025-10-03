-- Create a session token for the local test user
INSERT INTO session (
  "sessionToken",
  "userId",
  expires,
  type
)
VALUES (
  'local-test-session-token',
  'local-test-user-id',
  NOW() + INTERVAL '30 days',
  'cli'
)
ON CONFLICT ("sessionToken") DO UPDATE
SET expires = NOW() + INTERVAL '30 days';

-- Show the created session
SELECT
  s."sessionToken",
  s."userId",
  s.type,
  s.expires,
  u.email
FROM session s
JOIN "user" u ON s."userId" = u.id
WHERE s."sessionToken" = 'local-test-session-token';
