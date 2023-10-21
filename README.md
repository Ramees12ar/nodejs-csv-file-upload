
# Nodejs csv file uploader

### Host: ```http://localhost:3005```

### Execution
    npm install
    npm run dev

## Login

user login

### API Reference

#### login API

```http
  POST /api/login
```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. |
| `password` | `string` | **Required**.|

## demo user:
username: admin,
password: admin@123,




## csv file upload

here we can upload csv file.

### API Reference

#### uploader

```http
  POST /api/upload
```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `file` | **Required**.|

#### *NB: need to pass accessToken in headers
