# 프리온보딩 백엔드 인턴십 선발 과제
![Uploading image.png…]()

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [기술 스택](#기술-스택)
- [기능 설명](#기능-설명)
- [테스트](#테스트)
- [프로젝트 구조](#프로젝트-구조)


## 프로젝트 소개

프리온보딩 백엔드 인턴십 선발 과제로, 구인구직 웹서비스의 백엔드 부분을 Javascript를 사용해 구현했습니다. 

## 설치 및 실행 방법


### 요구 사항

- Node.js v20.16.0
- MySQL

### 설치 방법

```sh
git clone https://github.com/urimJ/wanted-pre-onboarding-backend.git  
cd wanted-pre-onboarding-backend  
npm i
```


### 데이터베이스 설정

1. MySQL을 설치하고 실행합니다.
2. 데이터베이스를 생성합니다.
    ```sql
    CREATE DATABASE wanted;
    ```
3. 환경 변수 파일(.env)을 설정합니다.
    ```
    DB_HOST=localhost
    DB_USERNAME=[your-username]
    DB_PASSWORD=[your-password]
    DB_DATABASE=wanted
    ```

### 실행 방법

      
    node app.js
    

## 기술 스택

- 언어: Javascript
- 프레임워크: Node.js, Express.js
- ORM: Sequelize
- 데이터베이스: MySQL
- 테스트: Mocha, Chai, Sinon
- 기타: Thunder Client

## 기능 설명

- **채용공고 등록**  
    - 회사는 채용공고를 등록할 수 있습니다.

- **채용공고 수정**  
    - 회사는 채용공고를 수정할 수 있습니다.

- **채용공고 삭제**  
    - 회사는 채용공고를 삭제할 수 있습니다.

- **채용공고 목록 조회**  
    - 채용공고 목록을 조회할 수 있습니다.

- **채용공고 검색 기능**  
    - 채용공고를 사용기술 또는 회사명으로 검색할 수 있습니다.

- **채용상세 페이지**  
    - 사용자는 채용상세 페이지에서 채용공고를 확인할 수 있습니다. 해당 회사가 올린 다른 공고의 채용공고_id도 함께 조회됩니다.

- **채용공고에 지원**  
    - 사용자는 채용공고에 지원할 수 있습니다. 단, 1회만 지원 가능합니다.

## 테스트

### 단위 테스트

프로젝트의 단위 테스트(Unit test)는 `test` 디렉토리 내에 위치합니다. 유닛 테스트를 실행하려면 아래 명령어를 사용합니다.  
```sh  
npm test
```

## 프로젝트 구조
    wanted-pre-onboarding-backend/
    ├── config/
    │   ├── database.js
    │   └── mysql.js
    ├── controllers/
    │   └── controllers.js
    ├── models/
    │   ├── corp.js
    │   ├── index.js
    │   ├── notics.js
    │   └── user.js
    ├── routes/
    │   └── routes.js
    ├── test/
    │   └── controller.test.js
    ├── .gitignore
    ├── README.md
    ├── app.js
    ├── package-lock.json
    ├── package.json
    └── seed.js    
