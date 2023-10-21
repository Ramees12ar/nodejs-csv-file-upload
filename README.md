
# Nodejs csv file uploader

### Host: ```http://localhost:3005```

### Execution
    npm install
    npm run dev
### Testing
    npm run mochatest

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

## get status of a upload

status of uploaded file.

### API Reference

#### get status

```http
  GET /api/status
```
Query
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `importId` | `string` | **Required**. query|

## get data of upload file 

get data from db 

### API Reference

#### get data

```http
  GET /api/:importId/data
```
Params and Query
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `importId` | `string` | **Required** params.|
| `page` | `number` | **Optional** query.|
| `limit` | `number` | **Optional** query.|

## test cases

### mocha test cases added