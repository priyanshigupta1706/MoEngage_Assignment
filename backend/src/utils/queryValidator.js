// Validate SQL queries for safety
const validateQuery = (query) => {
  const trimmedQuery = query.trim().toLowerCase();

  // Check if query is empty
  if (!trimmedQuery) {
    return { isValid: false, error: 'Query cannot be empty' };
  }

  // Allowed query types
  const allowedKeywords = ['select', 'insert', 'update', 'delete'];
  const startsWithAllowed = allowedKeywords.some(keyword => 
    trimmedQuery.startsWith(keyword)
  );

  if (!startsWithAllowed) {
    return { 
      isValid: false, 
      error: 'Query must start with SELECT, INSERT, UPDATE, or DELETE' 
    };
  }

  // Dangerous operations to block
  const dangerousPatterns = [
    /drop\s+table/i,
    /drop\s+database/i,
    /truncate\s+table/i,
    /alter\s+table/i,
    /create\s+table/i,
    /create\s+database/i,
    /pragma/i,
    /attach\s+database/i,
    /detach\s+database/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(query)) {
      return { 
        isValid: false, 
        error: `Dangerous operation detected: ${pattern.toString()}` 
      };
    }
  }

  return { isValid: true };
};

module.exports = { validateQuery };
