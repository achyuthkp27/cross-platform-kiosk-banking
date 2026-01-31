import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp up to 50 users fast (STRESS)
    { duration: '30s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate>0.1'], // We EXPECT failures (429s), so this threshold checks if we are getting them.
  },
};

export default function () {
  // 1. Attempt Login (Should hit Rate Limit of 5 req/min quickly)
  const payload = JSON.stringify({
    userId: 'STRESS_TESTER',
    dob: '01011990',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://host.docker.internal:8080/v1/auth/login', payload, params);

  // Check for 429 (Rate Limit) OR 200/401 (Success/Auth Fail)
  check(res, {
    'is status 429 (Rate Limited)': (r) => r.status === 429,
    'is status 401 (Auth Failed)': (r) => r.status === 401,
  });

  sleep(0.5); // Very aggressive
}
