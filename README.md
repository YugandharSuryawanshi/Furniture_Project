# Furniture Project
<h4>Welcome! <br> This is My E-commerce Furniture Website</h4>
<br>
<h4>An Online E-Commerce platform for purchasing high-quality furniture. This project is built using Angular (Frontend), Node.Js(Backend), and MySQL (Database) with JWT authentication and Razorpay payment integration.</h4>
<hr>
 In this project two modules are present:
 <br>
 <ul>
  <li>User Module</li>
  <li>Admin Module</li>
 </ul>
 <br>
 Step to run this project :
 <br>
1) Clone this project
<br>2) In this project inside the backend/config folder create a new file named config.env
<br>3) In config.env file add this : -
<ul>
    <li># .env file containing secrets and configurations

<br>USER_JWT_SECRET='Your_Secret'
<br>USER_JWT_EXPIRE=4h
<br>ADMIN_JWT_SECRET='Your_any_Secret'
<br>ADMIN_JWT_EXPIRE=4h
<br>RAZORPAY_KEY_ID=your_razorPay_key_id
<br>RAZORPAY_KEY_SECRET=your_razorPay_key_Secret
<br>DB_HOST=localhost
<br>DB_USER=root
<br>DB_PASSWORD=
<br>DB_NAME=furni_shop

</li>
    <br>//Replace/add your JWT secret and razorpay id and key secret
</ul>
<br>4) Run npm install command in backend folder path and run using nodemon index.js
<br>5) Run npm install command in frontend/furniProject path and run using ng serve -o
<br>6) Start xampp then start apache and mysql and open phpMyAdmin server
<br>7) Create new database with furni_shop name and import database using in backend/database/furni_shop.db file.
<br>
<hr>
_______________________________________________________________________________________________________________

