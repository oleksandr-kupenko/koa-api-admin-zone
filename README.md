
  
## You can: 

### Users
  - **get user**: GET http://localhost:3000/users/:userId
  - **create user**: POST http://localhost:3000/sign-up
    - example body:
```
{
    "fname": "User1",
    "lname": "Userov1",
    "email": "ddsa@mail.ru44",
    "isAdmin": true,
    "categoryId": 2,
    "password": "4444"
}
```
  - **delete user**: DEL http://localhost:3000/users
    - example body:
 ``` 
{
    "userId": 43
}
```
  - **get all users**: GET http://localhost:3000/users/
  - **sign in (authorization by jwt tokens)**: POST http://localhost:3000/sign-in
    - example body:
```
{
    "email": "ddsa@mail.ru44",
    "password": "4444"
}
```
  - **get profile (need accessToken in "Authorization" field in Headers)**: GET http://localhost:3000/users/profile
  - **refresh token**: GET (need refreshToken in "Authorization" field in Headers): GET http://localhost:3000/refresh/token
  - **get all users from category by id**: POST http://localhost:3000/users/category-name
    - example body:
```
{
    "categoryId": 2
}
```
  - **get all users from category by name**: POST http://localhost:3000/users/category-id
    - example body:
```
{
    "categoryName": "Junior"
}
```

### Categories
  - **get category**: GET http://localhost:3000/categories/:categoryId
  - **create category**: http://localhost:3000/categories
    - example body:
```
{
    "name": "Trainee"
}
```
  - **get all categories**: GET http://localhost:3000/categories
  - **delete category**: DEL http://localhost:3000/categories
  
  
