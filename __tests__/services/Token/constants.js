module.exports = {
  tokenData: {
    badToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpbmZvQGRpZGkub3JnLmFyIiwiaWF0IjoxNjIzMTYxNDU1LCJleHAiOjE2MjM3NjYyNTV9.LjdD9NXE93uzZvki0XB6SLcT1nIVJ_3scYpdLp-KhOBQULv0u6rss1M7SVOHvd-d1pFGGvKH_Gkhbe-9a8LXPA',
    goodToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE2MjQ5Nzg3NjcsInN1YiI6ImRpZDpldGhyOjB4MzQxYjczYzRkYWI2ZGE3YTJiMDM3YWUxNmU2YTFmMDNkMTI0NWU5OSIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiUGhvbmUiOnsicHJldmlldyI6eyJ0eXBlIjowLCJmaWVsZHMiOlsicGhvbmVOdW1iZXIiXX0sImNhdGVnb3J5IjoiaWRlbnRpdHkiLCJkYXRhIjp7InBob25lTnVtYmVyIjoiKzU0MjQ5NDYwMzI4NiJ9fX19LCJpc3MiOiJkaWQ6ZXRocjoweDc3NzRhMzNmMGEwYzgxMGNhMDc5NDA3NDI1YThmYjUwY2M0ZGRlMTQifQ.k9FimYdzwC-TdZkJ6Fh6v_kGovU36jGrtPOOsngwHHBrGfpezTCB9XX99q9y6-M5q4NT6Qjcdhky9awk1uMz6QE',
  },
  dataResponse: {
    good: {
      iat: 1624978767,
      sub: 'did:ethr:0x341b73c4dab6da7a2b037ae16e6a1f03d1245e99',
      issuer: 'did:ethr:0x7774a33f0a0c810ca079407425a8fb50cc4dde14',
    },
    bad: {
      sub: 'info@didi.org.ar',
      iat: 1623161455,
    },
  },
  error: {
    code: 'INVALID_TOKEN',
    message: 'El token de aplicación es inválido, por favor verificalo.',
  },
};
