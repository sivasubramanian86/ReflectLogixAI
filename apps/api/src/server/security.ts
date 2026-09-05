/**
 * Production Security & Guardrails Engine for ReflectLogixAI
 * Implements OWASP Top 10 for LLM Applications defense:
 * - LLM01: Prompt Injection & Jailbreak Defense
 * - LLM02: Sensitive Information Disclosure & PII Masking
 * - LLM06: Excessive Agency & Unsafe Execution Boundaries
 */

export interface SecurityScanResult {
  isSafe: boolean;
  sanitizedText: string;
  violations: string[];
  piiMaskedCount: number;
}

export class LLMSecurityGuardrail {
  private static readonly INJECTION_PATTERNS: RegExp[] = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|prompts|rules)/i,
    /reveal\s+(the\s+)?(system\s+prompt|hidden\s+instructions|api\s+keys?|master\s+keys?)/i,
    /bypass\s+(all\s+)?(safety|security|content)\s+filters/i,
    /you\s+are\s+now\s+(DAN|jailbroken|unrestricted|god\s+mode)/i,
    /act\s+as\s+an\s+unrestricted\s+ai/i,
    /system\s*:\s*override/i,
    /<\|im_start\|>system/i,
  ];

  private static readonly PII_PATTERNS = [
    { name: 'CREDIT_CARD', regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, mask: '[REDACTED_PAYMENT_CARD]' },
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g, mask: '[REDACTED_SSN]' },
    { name: 'API_KEY_STRING', regex: /\b(AIza[0-9A-Za-z-_]{20,40}|sk-[a-zA-Z0-9]{20,})\b/g, mask: '[REDACTED_API_KEY]' },
    { name: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, mask: '[REDACTED_EMAIL]' }
  ];

  /**
   * Scans and sanitizes user prompt inputs against injection attacks and PII leaks.
   */
  public static scanAndSanitize(input: string): SecurityScanResult {
    if (!input || typeof input !== 'string') {
      return { isSafe: true, sanitizedText: '', violations: [], piiMaskedCount: 0 };
    }

    const violations: string[] = [];
    let sanitizedText = input;
    let piiMaskedCount = 0;

    // 1. Check for Prompt Injections (OWASP LLM01)
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(sanitizedText)) {
        violations.push(`Prompt Injection Pattern Detected: ${pattern.source}`);
        // Neutralize the injection pattern
        sanitizedText = sanitizedText.replace(pattern, '[SECURITY_GUARDRAIL_NEUTRALIZED]');
      }
    }

    // 2. Scan and Mask Sensitive PII (OWASP LLM02)
    for (const pii of this.PII_PATTERNS) {
      const matches = sanitizedText.match(pii.regex);
      if (matches) {
        piiMaskedCount += matches.length;
        sanitizedText = sanitizedText.replace(pii.regex, pii.mask);
      }
    }

    return {
      isSafe: violations.length === 0,
      sanitizedText,
      violations,
      piiMaskedCount
    };
  }

  /**
   * In-Memory Token Bucket Rate Limiter per tenant / IP
   */
  private static rateLimitBuckets: Map<string, { count: number; resetTime: number }> = new Map();

  public static checkRateLimit(key: string, limit = 60, windowMs = 60000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const bucket = this.rateLimitBuckets.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > bucket.resetTime) {
      bucket.count = 1;
      bucket.resetTime = now + windowMs;
      this.rateLimitBuckets.set(key, bucket);
      return { allowed: true, remaining: limit - 1 };
    }

    if (bucket.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    bucket.count += 1;
    this.rateLimitBuckets.set(key, bucket);
    return { allowed: true, remaining: limit - bucket.count };
  }
}
