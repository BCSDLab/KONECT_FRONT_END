# KONECT Frontend

모바일 중심의 동아리 통합 플랫폼 프론트엔드입니다.  
동아리 탐색, 지원, 채팅, 공지/알림, 일정 확인, 관리자 기능, 학습 타이머를 하나의 웹 경험으로 연결하는 데 초점을 맞췄습니다.

## 프로젝트 소개

KONECT는 학생이 동아리 활동 전반을 한 곳에서 처리할 수 있도록 설계된 서비스입니다.

- 동아리 목록 탐색과 검색
- 지원서 작성과 제출
- 채팅방 목록, 생성, 실시간 대화 흐름
- 일정, 학생회 공지, 인앱 알림 확인
- 회장단/운영진을 위한 관리자 화면
- 학습 타이머와 모바일 디바이스 제어 연동

## 핵심 기능

- 소셜 로그인: Google, Kakao, Naver, Apple
- 회원가입 플로우: 약관, 학교, 학번, 이름, 확인, 완료
- 홈 화면: 동아리, 일정, 학생회 공지, 타이머 배너
- 동아리: 목록, 검색, 상세, 지원, 회비 확인
- 채팅: 채팅방 목록, 검색, 생성, 대화방, 대화방 정보
- 알림: 인앱 알림함, unread count, 읽음 처리
- 일정: 행사/학사 일정 확인
- 타이머: 학습 타이머 및 네이티브 디바이스 제어
- 관리자 기능: 지원서 관리, 멤버 관리, 모집 관리, 회비/계좌, 시트 미리보기
- 법률 페이지: 이용약관, 개인정보처리방침, 마케팅 정책, OSS 라이선스

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | React 19, TypeScript, Vite 8 |
| Routing | `react-router-dom` v7 |
| Server State | `@tanstack/react-query` |
| Client State | `zustand` |
| Styling | Tailwind CSS v4 |
| Monitoring | Sentry |
| Tooling | ESLint, Prettier, pnpm |
| Runtime | Node `22.20.0+` |
