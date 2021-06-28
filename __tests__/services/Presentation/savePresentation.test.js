const { savePresentation, getPresentation } = require('../../../services/PresentationService');
const {
  missingJwt, missingId,
} = require('../../../constants/serviceErrors');

describe('services/Presentation/savePresentation.test.js', () => {
  test('Expect savePresentation to throw on missing jwts', async () => {
    try {
      await savePresentation({ jwts: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  test('Expect savePresentation', async () => {
    try {
      var jwts = ["eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE2MjM0MzgwMTksInN1YiI6ImRpZDpldGhyOjB4YjgzZjlmOGJhNjI2MTdiY2QyZWM0ZGUwYTNkODExNTY5MmUwMzliNSIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiRW1haWwiOnsicHJldmlldyI6eyJ0eXBlIjowLCJmaWVsZHMiOlsiZW1haWwiXX0sImNhdGVnb3J5IjoiaWRlbnRpdHkiLCJkYXRhIjp7ImVtYWlsIjoiZnN1YXJlejkxQGdtYWlsLmNvbSJ9fX19LCJpc3MiOiJkaWQ6ZXRocjoweDc3NzRhMzNmMGEwYzgxMGNhMDc5NDA3NDI1YThmYjUwY2M0ZGRlMTQifQ.u1JO4mIW8S-ML4Nqamv6YbRAityIjGKmN9CghPY2sDHyE9UMEae78h8lkaeuqWlrdciPFvPADbJ7QogjWrnErAE"];
      await savePresentation({jwts: jwts});
    } catch (e) {
      console.log(e);
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});