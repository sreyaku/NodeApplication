
# User Management System
User management system is an application to manage user data. Database used is MongoDB .
Use env variables based on .env.sample file.

##  API CALLS


### User API s

#### Register user
- This API call is to create/signup users.
- End point : /user/signup 
- Request type : POST


#### User login
- This API call is to login users.
- End point : /user/login 
- Request type : POST


#### User verify email
- This API call is to verify email.
- End point : /user/verifyEmail 
- Request type : POST

#### User mobile verify
- This  API call is to verify phone number.
- End point : /user/verifyPhone 
- Request type : POST


#### User forgot password
- This API call is to send otp to email to reset password.
- End point : /user/forgotPassword 
- Request type : POST

#### User reset password
- This API call is to reset password.
- End point : /user/resetPassword 
- Request type : PUT
  


### Admin API s


#### Admin login
- This API call is to admin login.
- End point : /admin/login 
- Request type : POST

#### Admin getAll user data
- This API call is to read users data.
- End point : /admin/getAllUsers 
- Request type : GET

#### Admin update user status
- This API call is to update user status.
- End point : /admin/updateUserStatus 
- Request type : PUT

#### Admin hard delete user 
- This API call is to hard delete user.
- End point : /admin/userDelete/:id 
- Request type : DELETE

#### Admin delete user
- This API call is to (soft)delete user.
- End point : /admin/userSoftdelete 
- Request type : PUT
