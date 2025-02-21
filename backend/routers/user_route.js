import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import { config } from '../config/config.js';
import { exe } from '../connection.js';


const router = express.Router();
const blacklist = new Set();

// For Razorpay integration
const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret
});

// Middleware for authentication
function authenticateToken(req, res, next) {
    const userToken = req.headers['authorization']?.split(' ')[1];
    if (!userToken) {
        return res.status(401).send('Unauthorized: No userToken provided');
    }
    if (blacklist.has(userToken)) {
        return res.status(403).send('userToken is invalid (blacklisted)');
    }

    jwt.verify(userToken, config.userJwtSecret, (err, user) => {
        if (err) {
            return res.status(403).send('userToken is invalid or expired');
        }

        // Attach the decoded user payload to the request object
        req.user = user;
        console.log('Access From userToken Data IS :', JSON.stringify(req.user, null, 2));
        next();
    });
};

// Register new user
router.post('/register', async (req, res) => {
    const { user_name, user_mobile, user_email, user_address, user_password } = req.body;

    if (!user_name || !user_mobile || !user_email || !user_password) {
        return res.status(400).json({ status: 'failed', message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(user_password, 10); // Hash the password
        // const query = `CREATE TABLE users (user_id INT AUTO_INCREMENT PRIMARY KEY,user_name VARCHAR(400),user_mobile VARCHAR(15),user_email VARCHAR(300) NOT NULL UNIQUE, user_address TEXT, user_profile TEXT, user_password VARCHAR(450) NOT NULL)`;
        const query = 'INSERT INTO users (user_name, user_mobile, user_email, user_password) VALUES (?, ?, ?, ?)';
        exe(query, [user_name, user_mobile, user_email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error during user registration:', err);
                return res.status(500).json({ status: 'failed', message: 'Error registering user' });
            }
            res.status(200).json({ status: 'success', message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ status: 'failed', error: err.message });
    }
});

// Login User
router.post('/login', (req, res) => {
    const { user_email, user_password } = req.body;
    const sql = 'SELECT * FROM users WHERE user_email = ?';
    exe(sql, [user_email], async (err, results) => {
        if (err || results.length === 0) {
            console.error(err);
            return res.status(500).json({ message: 'Database error or user not found' });
        }

        const user = results[0];

        try {
            // Verify password
            const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const userToken = jwt.sign(
                { id: user.user_id, user_email: user.user_email },
                config.userJwtSecret, { expiresIn: config.userJwtExpire }
            );
            return res.json({ message: 'Login successful', userToken });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error during login' });
        }
    });
});

// Protected route example (requires authentication)
router.get('/userProtected', authenticateToken, (req, res) => {
    res.json({
        message: 'Access granted to protected route',
        user: req.user, // Token's decoded user payload
    });
});

// Logout User
router.post('/userLogout', authenticateToken, (req, res) => {
    const userToken = req.headers['authorization']?.split(' ')[1];

    blacklist.add(userToken);
    res.status(200).json({ message: 'Logged out successfully' });
    blacklist.add(userToken); // Add the token to the blacklist after logout
    console.log('User logged out:', req.user.user_email);

});

// logged In User Details
router.get('/userDetails', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await exe('SELECT * FROM users WHERE user_id =?', [userId]);
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user' });
    }
})

// Update User Details
router.put('/userUpdate', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { user_name, user_mobile, user_email, user_address } = req.body;

    console.log('Request Body:', req.body);
    console.log('User ID:', userId);

    // Check if all fields are provided
    if (!user_name || !user_mobile || !user_email || !user_address) {
        return res.status(400).json({ status: 'failed', message: 'All fields are required' });
    }

    try {
        const query = 'UPDATE users SET user_name = ?, user_mobile = ?, user_email = ?, user_address = ? WHERE user_id = ?';
        const result = await exe(query, [user_name, user_mobile, user_email, user_address, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'failed', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', message: 'User details updated successfully' });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).json({ status: 'failed', error: 'Error updating user details' });
    }
});

// Update User Profile
router.put('/userUpdateProfile', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!req.files || !req.files.user_profile) {
        console.log('No profile image provided');
        return res.status(400).json({ status: 'failed', message: 'Profile image is required.' });
    }

    try {
        const uploadedProfile = req.files.user_profile;
        const userProfileFileName = new Date().getTime() + '-' + uploadedProfile.name;
        uploadedProfile.mv('public/uploads/' + userProfileFileName, async (err) => {
            if (err) {
                console.log('Error moving file:', err);
                return res.status(500).json({ status: 'failed', message: 'Error uploading file' });
            }

            const query = 'UPDATE users SET user_profile = ? WHERE user_id = ?';
            const result = await exe(query, [userProfileFileName, userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'failed', message: 'User not found' });
            }

            res.status(200).json({
                status: 'success', message: 'User profile image updated successfully', user_profile: userProfileFileName,
            });
        });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ status: 'failed', error: 'Error updating user profile' });
    }
});

// Update User Password Only
router.put('/userUpdatePassword', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    try {
        const query = 'SELECT user_password FROM users WHERE user_id = ?';
        const result = await exe(query, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ status: 'userNotFound', message: 'User Which Password Are You Want To Update this is not found' });
        }

        const user = result[0];

        const match = await bcrypt.compare(current_password, user.user_password);
        if (!match) {
            return res.status(400).json({ status: 'passNotMatch', message: 'Current password is incorrect..!' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        console.log('Hashed Password : ' + hashedPassword);
        const updateQuery = 'UPDATE users SET user_password = ? WHERE user_id = ?';
        const updateResult = await exe(updateQuery, [hashedPassword, userId]);

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ status: 'failed', message: 'Password update failed' });
        }

        return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ status: 'failed', message: 'An error occurred while updating password' });
    }
});

// Get All Home Page Data
router.get('/home', async (req, res) => {
    try {
        // const users = await exe('SELECT * FROM users');
        var banner_info = await exe("SELECT * FROM banner");
        var products = await exe(`SELECT * FROM product ORDER BY product_id DESC LIMIT 3`);
        var about = await exe("SELECT * FROM why_choose_us");
        var about_points = await exe("SELECT * FROM why_choose_points");
        var interior = await exe("SELECT * FROM interior");
        var testimonial = await exe("SELECT * FROM testimonial");
        var blog = await exe(`SELECT * FROM blog ORDER BY blog_id DESC LIMIT 3`);
        var blogs = await exe(`SELECT * FROM blog`);
        var team = await exe("SELECT * FROM our_team");
        console.log(blog);

        res.status(200).json({ banner_info, products, about, about_points, interior, testimonial, blog, team, blogs });

    } catch (err) {
        console.log('Error fetching users:', err);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get Shop Page List
router.get('/products', async (req, res) => {
    const page = req.query.page || 1;
    const limit = 8; // Adjust as needed
    const offset = (page - 1) * limit;

    await exe('SELECT * FROM product LIMIT ?, ?', [offset, limit], (err, results) => {

        if (err) throw err;
        // Fetch the total number of pages
        exe('SELECT COUNT(*) AS total FROM product', (err, countResult) => {
            if (err) throw err;
            const totalPages = Math.ceil(countResult[0].total / limit);
            res.json({ products: results, totalPages });
        });
    });
});

// Getting Product Info
router.get('/product', (req, res) => {
    const productId = parseInt(req.query.id); // Get the product ID from query params
    if (!productId) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    exe('SELECT * FROM product WHERE product_id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result[0]); // Return the product details
    });
});

//Save Review
router.post('/save_review', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const { product_id, rating, country, comment, heading } = req.body;

        if (!product_id || !rating || !comment || !country || !heading) {
            return res.status(400).json({ status: 'failed', message: 'All fields are required' });
        }

        let file_name = null;
        let file_names = [];
        if (req.files && req.files.review_img) {
            if (Array.isArray(req.files.review_img)) {
                for (let i = 0; i < req.files.review_img.length; i++) {
                    let fn = new Date().getTime() + "_" + req.files.review_img[i].name;
                    console.log('Multiple image are : ' + fn);

                    req.files.review_img[i].mv("public/uploads/" + fn);
                    file_names.push(fn);
                }
                file_name = file_names.join(",");
            } else {
                var fn = new Date().getTime() + "_" + req.files.review_img.name;
                console.log('Single Image is : ' + fn);

                req.files.review_img.mv("public/uploads/" + fn);
                file_name = fn;
            }
        }

        let sql, values;

        if (file_name) {
            sql = `INSERT INTO reviews (product_id, user_id, rating, country, comment, heading, review_img)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values = [product_id, userId, rating, country, comment, heading, file_name];
        } else {
            sql = `INSERT INTO reviews (product_id, user_id, rating, country, comment, heading)
                    VALUES (?, ?, ?, ?, ?, ?)`;
            values = [product_id, userId, rating, country, comment, heading];
        }

        const data = await exe(sql, values);

        if (data.affectedRows > 0) {
            return res.status(200).json({ status: 'success', message: 'Review saved successfully' });
        } else {
            return res.status(500).json({ status: 'failed', message: 'Error saving review' });
        }

    } catch (error) {
        console.error('Error saving review:', error);
        return res.status(500).json({ status: 'failed', message: 'An error occurred while saving review' });
    }
});

// Get Reviews
router.get('/get_reviews/:product_id', async (req, res) => {
    const productId = parseInt(req.params.product_id);

    if (!productId) {
        return res.status(400).json({ status: 'failed', message: 'Invalid product ID' });
    }

    try {
        // Query for Top 2 Reviews with Rating >= 4
        const sql1 = `SELECT r.review_id, r.product_id, r.user_id, r.rating, r.country, r.comment, r.heading, r.review_img , r.created_at, u.user_name, u.user_profile
            FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? AND r.rating >= 4 ORDER BY r.created_at DESC LIMIT 2; `;
        const topReviews = await exe(sql1, [productId]);

        // Query for All Reviews with Rating >= 4
        const sql2 = `SELECT r.review_id, r.product_id, r.user_id, r.rating, r.country, r.comment, r.heading, r.review_img , r.created_at, u.user_name, u.user_profile
            FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? AND r.rating >= 4 ORDER BY r.created_at DESC; `;
        const allReviews = await exe(sql2, [productId]);

        // Return Send Response
        if (topReviews.length > 0) {
            return res.status(200).json({
                status: 'success',
                topReviews: topReviews,
                allReviews: allReviews
            });
        } else {
            return res.status(404).json({ status: 'failed', message: 'No reviews found for this product' });
        }

    } catch (err) {
        console.error("Error in /get_reviews:", err.message);
        return res.status(500).json({ status: 'failed', message: 'Internal Server Error', error: err.message });
    }
});

router.post('/add_to_cart', authenticateToken, async (req, res) => {
    var product_id = req.body.product_id;
    var user_id = req.user.id;
    var quantity = 1;
    try {
        // Check already added the product in the cart or not.
        let sql = `SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?`;
        const userCart = await exe(sql, [user_id, product_id]);

        if (userCart.length > 0) {
            // Checking Product is already in the cart or not
            return res.status(400).json({
                status: 'failed', message: 'Product already added to cart', isProductAdded: true
            });
        }

        sql = `INSERT INTO user_cart (user_id, product_id, qty) VALUES (?, ?, ?)`;
        await exe(sql, [user_id, product_id, quantity]);

        res.status(200).json({
            status: 'success', message: 'Product added to cart successfully'
        });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error adding product to cart' });
    }
});

// Check if product is in the cart for product_info page
router.get('/get_cart_status/:product_id', authenticateToken, async (req, res) => {
    const product_id = req.params.product_id;
    const user_id = req.user.id;


    try {
        // Check if the product is in the cart
        let sql = `SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?`;
        const userCart = await exe(sql, [user_id, product_id]);
        if (userCart.length > 0) {
            return res.status(200).json({ isProductAdded: true });
        } else {
            return res.status(200).json({ isProductAdded: false });
        }
    } catch (error) {
        console.error('Error checking cart status:', error);
        res.status(500).json({ status: 'failed', message: 'Error checking cart status' });
    }
});

// Get Cart Products
router.get('/get_cart_items', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    try {
        var products = await exe(`
            SELECT * FROM user_cart JOIN product ON product.product_id = user_cart.product_id WHERE user_cart.user_id = ?`, [user_id]);

        if (products.length > 0) {

            return res.status(200).json({ status: 'success', products });
        } else {
            return res.status(404).json({ status: 'failed', message: 'No products found in the cart' });
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
});

//Update / increse or decrease cart product Quantity
router.post('/update_cart_quantity', authenticateToken, async (req, res) => {
    try {
        const { cartId, action } = req.body;

        let updateQuery = '';

        if (action === 'increase') {
            updateQuery = `UPDATE user_cart SET qty = qty + 1 WHERE user_cart_id = ?`;
        } else if (action === 'decrease') {
            updateQuery = `UPDATE user_cart SET qty = GREATEST(qty - 1, 1) WHERE user_cart_id = ?`;
        } else {
            return res.status(400).json({ status: 'failed', message: 'Invalid action' });
        }

        await exe(updateQuery, [cartId]);
        res.status(200).json({ status: 'success', message: 'Cart quantity updated' });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ status: 'failed', message: 'Error updating cart quantity' });
    }
})

//Remove product in cart
router.delete('/remove_from_cart/:cartId', authenticateToken, async (req, res) => {
    const cartId = parseInt(req.params.cartId);
    const user_id = req.user.id;

    try {
        await exe(`DELETE FROM user_cart WHERE user_cart_id =? AND user_id =?`, [cartId, user_id]);
        res.status(200).json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error removing product from cart' });
    }
})

//Get User Info
router.get('/user_info', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ status: 'failed', message: 'Invalid user ID' });
    }

    try {
        const user = await exe(`SELECT * FROM users WHERE user_id =?`, [userId]);

        if (user.length > 0) {
            return res.status(200).json({ status: 'success', user: user[0] });
        } else {
            return res.status(404).json({ status: 'failed', message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
})

// Create Razorpay Order
router.post('/create_order', authenticateToken, async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ success: false, message: 'Amount and currency are required' });
        }

        const options = {
            amount: amount * 100, // Razorpay requires the amount in paise thats why it
            currency: currency,
            receipt: `order_rcptid_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        return res.json({ success: true, order });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
});

// ONLINE Payment Gateway order Save
// router.post('/verify_payment', authenticateToken, async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
//         const userId = req.user.id;

//         if (!orderDetails || !razorpay_payment_id || !orderDetails.cartProducts || orderDetails.cartProducts.length === 0) {
//             console.error(" Missing order details or empty cart:", req.body);
//             return res.status(400).json({ success: false, message: 'Missing order details or empty cart' });
//         }

//         // Here Verify Razorpay Signature
//         const hmac = crypto.createHmac('sha256', config.razorpayKeySecret); // our Razorpay secret key
//         hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//         const generatedSignature = hmac.digest('hex');

//         if (generatedSignature !== razorpay_signature) {
//             console.error(" Payment verification failed. Signatures do not match.");
//             return res.status(400).json({ success: false, message: 'Payment verification failed' });
//         }

//         // Insert Order data into `order_tbl`
//         const orderSql = `INSERT INTO order_tbl
//             (user_id, country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email_address, c_phone, payment_mode,
//             order_date, order_status, order_dispatch_date, order_delivered_date, order_cancel_date, order_reject_date, payment_status,
//             transaction_id, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`;

//         const orderValues = [
//             userId, orderDetails.c_country, orderDetails.c_fname, orderDetails.c_lname, orderDetails.c_address, orderDetails.c_area,
//             orderDetails.c_state, orderDetails.c_postal_zip, orderDetails.c_email, orderDetails.c_phone, "online", "Confirmed",
//             null, null, null, null, "Paid", razorpay_payment_id, new Date()
//         ];

//         // const orderResult = await exe(orderSql, orderValues);
//         const orderId = orderResult.insertId; // here orderId is store due to add in order_products table

//         // Insert Ordered Products into `order_products` table for print in orders
//         const productSql = `INSERT INTO order_products (order_id, user_id, product_id, product_name, product_qty, product_price, product_details)
//                             VALUES (?, ?, ?, ?, ?, ?, ?)`;

//         for (let product of orderDetails.cartProducts) {
//             const productValues = [orderId, userId, product.product_id, product.product_name, product.qty, product.product_price, product.product_details];
//             // await exe(productSql, productValues);
//             // console.log(` Product Inserted: ${product.product_name} (Qty: ${product.qty})`);
//         }

//         // Send Success Response
//         console.log('Payment Verified & Order Stored Successfully');
//         res.status(200).json({ success: true, message: 'Order placed successfully!' });

//     } catch (error) {
//         console.error(' Error verifying payment:', error);
//         res.status(500).json({ success: false, message: 'Error verifying payment Failed' });
//     }
// });

// const crypto = require('crypto'); // ✅ Fix crypto import
import crypto from 'crypto';

router.post('/verify_payment', authenticateToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

        const userId = req.user.id;

        if (!orderDetails || !razorpay_payment_id || !orderDetails.cartProducts || orderDetails.cartProducts.length === 0) {
            console.error("Missing order details or empty cart:", req.body);
            return res.status(400).json({ success: false, message: 'Missing order details or empty cart' });
        }

        //Verify Razorpay Signature
        const hmac = crypto.createHmac('sha256', config.razorpayKeySecret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
            console.error("Payment verification failed. Signatures do not match.");
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        //Calculate Order Totals calculations
        let total_amount = 0;
        let total_gst = 0, total_discount = 0, final_total = 0;

        function calculatePrice(product) {
            let product_price = parseFloat(product.product_price);
            let gst_percentage = parseFloat(product.gst_percentage);
            let discount_percentage = parseFloat(product.discount_percentage);

            let gst_amount = (product_price * gst_percentage) / 100;
            let discount_amount = (product_price * discount_percentage) / 100;
            let final_price = product_price + gst_amount - discount_amount;

            total_amount += product_price; //Base Price with GST & Discount..
            total_gst += gst_amount;
            total_discount += discount_amount;
            final_total += final_price;

            return { gst_amount, discount_amount, final_price };
        }


        // Process each product calculation
        for (let product of orderDetails.cartProducts) {
            calculatePrice(product);
        }

        // Insert Order Data into order_tbl table
        const orderSql = `
            INSERT INTO order_tbl (
                user_id, country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email_address, c_phone,
                payment_mode, order_date, order_status, order_dispatch_date, order_delivered_date, order_cancel_date,
                order_reject_date, payment_status, transaction_id, payment_date, total_amount, total_gst, total_discount, final_total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const orderValues = [
            userId, orderDetails.c_country, orderDetails.c_fname, orderDetails.c_lname, orderDetails.c_address, orderDetails.c_area,
            orderDetails.c_state, orderDetails.c_postal_zip, orderDetails.c_email, orderDetails.c_phone, "online",
            "Confirmed", null, null, null, null, "Paid", razorpay_payment_id, new Date(),
            total_amount, total_gst, total_discount, final_total
        ];

        const orderResult = await exe(orderSql, orderValues);
        if (!orderResult || !orderResult.insertId) throw new Error("Order insertion failed.");

        const orderId = orderResult.insertId;

        //Insert Ordered Products
        const productSql = `
            INSERT INTO order_products (order_id, user_id, product_id, product_name, product_qty, product_price,
                gst_amount, discount_amount, final_price, product_details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (let product of orderDetails.cartProducts) {
            let { gst_amount, discount_amount, final_price } = calculatePrice(product);
            const productValues = [
                orderId,
                userId,
                product.product_id,
                product.product_name,
                product.qty,
                product.product_price,
                gst_amount,
                discount_amount,
                final_price,
                product.product_details
            ];
            await exe(productSql, productValues);
        }

        //Send Success Response
        console.log('Payment Verified & Order Stored Successfully');
        res.status(200).json({ success: true, message: 'Order placed successfully!' });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
});





// COD Order save details
// router.post('/place_cod_order', authenticateToken, async (req, res) => {
//     try {
//         const { c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone, cartProducts } = req.body;
//         const userId = req.user.id;
//         var data = req.body;

//         const orderSql = ` INSERT INTO order_tbl ( user_id , country , c_fname , c_lname , c_address , c_area , c_state , c_postal_zip ,
//             c_email_address , c_phone , payment_mode , order_status , payment_status , order_date )
//             VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , 'cod' , 'Pending' , 'Pending' , NOW() )`;

//         const orderValues = [
//             userId, c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone
//         ];

//         const orderResult = await exe(orderSql, orderValues);
//         const orderId = orderResult.insertId; // Getting order id for insert order_products table.

//         var productSql = `INSERT INTO order_products (order_id, user_id, product_id,product_name, product_qty, product_price, product_details) VALUES (?, ?, ?, ?, ?, ?, ?)`;

//         for (let product of cartProducts) {
//             const productValues = [orderId, userId, product.product_id, product.product_name, product.qty, product.product_price, product.product_details];
//             await exe(productSql, productValues);
//         }
//         res.status(200).json({ status: 'success', message: 'COD order placed successfully' });
//     } catch (error) {
//         console.error('Error placing COD order:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });
// router.post('/place_cod_order', authenticateToken, async (req, res) => {
//     try {
//         const { c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone, cartProducts } = req.body;
//         const userId = req.user.id;

//         if (!cartProducts || cartProducts.length === 0) {
//             console.error("Missing order details or empty cart:", req.body);
//             return res.status(400).json({ success: false, message: 'Missing order details or empty cart' });
//         }

//         // Function to calculate order totals and prepare product values
//         let total_amount = 0, total_gst = 0, total_discount = 0, final_total = 0;
//         let productValuesArray = [];

//         for (let product of cartProducts) {
//             let product_price = parseFloat(product.product_price);
//             let gst_percentage = parseFloat(product.gst_percentage);
//             let discount_percentage = parseFloat(product.discount_percentage);

//             let gst_amount = (product_price * gst_percentage) / 100;
//             let discount_amount = (product_price * discount_percentage) / 100;
//             let final_price = product_price + gst_amount - discount_amount;

//             // Accumulate totals
//             total_amount += product_price;
//             total_gst += gst_amount;
//             total_discount += discount_amount;
//             final_total += final_price;

//             // Store product values for batch insert
//             productValuesArray.push([
//                 product.product_id, product.product_name, product.qty, product_price,
//                 gst_amount, discount_amount, final_price, product.product_details
//             ]);
//         }

//         // Insert Order Data into order_tbl table
//         const orderSql = `
//             INSERT INTO order_tbl (
//                 user_id, country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email_address, c_phone,
//                 payment_mode, order_date, order_status, order_dispatch_date, order_delivered_date, order_cancel_date,
//                 order_reject_date, payment_status, transaction_id, payment_date, total_amount, total_gst, total_discount, final_total
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         const orderValues = [
//             userId, c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone, "cod",
//             "Pending", null, null, null, null, "Pending", null, null,
//             total_amount, total_gst, total_discount, final_total
//         ];

//         const orderResult = await exe(orderSql, orderValues);
//         if (!orderResult || !orderResult.insertId) throw new Error("Order insertion failed.");

//         const orderId = orderResult.insertId; // Get order_id for order_products table

//         // Insert all products in a single query
//         const productSql = `
//             INSERT INTO order_products (
//                 order_id, user_id, product_id, product_name, product_qty, product_price,
//                 gst_amount, discount_amount, final_price, product_details
//             ) VALUES ?
//         `;

//         // Add order_id and user_id to each product entry
//         const finalProductValues = productValuesArray.map(productValues => [orderId, userId, ...productValues]);

//         await exe(productSql, [finalProductValues]); // Batch insert

//         // Send Success Response
//         console.log('COD Order Placed Successfully');
//         res.status(200).json({ success: true, message: 'COD order placed successfully!' });

//     } catch (error) {
//         console.error('Error placing COD order:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });


router.post('/place_cod_order', authenticateToken, async (req, res) => {
    try {
        const { c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone, cartProducts } = req.body;
        const userId = req.user.id;

        if (!cartProducts || cartProducts.length === 0) {
            console.error("Missing order details or empty cart:", req.body);
            return res.status(400).json({ success: false, message: 'Missing order details or empty cart' });
        }

        // Function to calculate totals for order & products
        let total_amount = 0, total_gst = 0, total_discount = 0, final_total = 0;

        function calculateTotals(price, gst_percentage, discount_percentage) {
            let gst_amount = (price * gst_percentage) / 100;
            let discount_amount = (price * discount_percentage) / 100;
            let final_price = price + gst_amount - discount_amount;

            total_amount += price;
            total_gst += gst_amount;
            total_discount += discount_amount;
            final_total += final_price;

            return { gst_amount, discount_amount, final_price };
        }

        // Calculate totals for all products
        for (let product of cartProducts) {
            calculateTotals(
                parseFloat(product.product_price),
                parseFloat(product.gst_percentage),
                parseFloat(product.discount_percentage)
            );
        }

        // Insert Order Data into order_tbl table
        const orderSql = `
            INSERT INTO order_tbl (
                user_id, country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email_address, c_phone,
                payment_mode, order_date, order_status, order_dispatch_date, order_delivered_date, order_cancel_date,
                order_reject_date, payment_status, transaction_id, payment_date, total_amount, total_gst, total_discount, final_total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const orderValues = [
            userId, c_country, c_fname, c_lname, c_address, c_area, c_state, c_postal_zip, c_email, c_phone, "cod",
            "Pending", null, null, null, null, "Pending", null, null,
            total_amount, total_gst, total_discount, final_total
        ];

        const orderResult = await exe(orderSql, orderValues);
        if (!orderResult || !orderResult.insertId) throw new Error("Order insertion failed.");

        const orderId = orderResult.insertId;

        // Insert each product into order_products table
        const productSql = `
            INSERT INTO order_products (
                order_id, user_id, product_id, product_name, product_qty, product_price,
                gst_amount, discount_amount, final_price, product_details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (let product of cartProducts) {
            let { gst_amount, discount_amount, final_price } = calculateTotals(
                parseFloat(product.product_price),
                parseFloat(product.gst_percentage),
                parseFloat(product.discount_percentage)
            );

            const productValues = [
                orderId, userId, product.product_id, product.product_name, product.qty, product.product_price,
                gst_amount, discount_amount, final_price, product.product_details
            ];

            await exe(productSql, productValues);
        }

        // Send Success Response
        console.log('COD Order Placed Successfully');
        res.status(200).json({ success: true, status: 'success', message: 'COD order placed successfully!' });

    } catch (error) {
        console.error('Error placing COD order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});







// Clear Cart
router.delete('/clear_cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ status: 'failed', message: 'Invalid user ID' });
        }
        const sql = `DELETE FROM user_cart WHERE user_id = ?`;
        await exe(sql, [userId]);
        return res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ status: 'failed', message: 'Error clearing cart' });
    }
});

// Get All My Orders
router.get('/my_orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const sql = `SELECT order_tbl.*,
            (SELECT SUM(product_qty * product_price) FROM order_products
            WHERE order_products.order_id = order_tbl.order_id) AS total_amt
            FROM order_tbl WHERE user_id = ? AND order_status != 'payment_pending'
            ORDER BY order_date DESC`;

        const orders = await exe(sql, [userId]);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
});

//Get Order Status (Tracking order)
router.get('/track_order/:order_id', authenticateToken, async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const userId = req.user.id;

        const sql = `SELECT order_status FROM order_tbl WHERE order_id = ? AND user_id = ?`;
        const order = await exe(sql, [orderId, userId]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const status = order[0].order_status;
        let progress = 0;

        //Define progress percentage for different status
        switch (status) {
            case 'Pending': progress = 20; break;
            case 'Confirmed': progress = 40; break;
            case 'Dispatched': progress = 60; break;
            case 'Out for Delivery': progress = 80; break;
            case 'Delivered': progress = 100; break;
            default: progress = 10;
        }

        res.status(200).json({
            success: true,
            order_status: status,
            progress: progress
        });

    } catch (error) {
        console.error('Error fetching order tracking:', error);
        res.status(500).json({ success: false, message: 'Error fetching order tracking' });
    }
});

//Cancel Order (Only if Pending/Confirmed)
router.post('/cancel_order/:order_id', authenticateToken, async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const userId = req.user.id;

        // Check order status
        const checkOrderSql = `SELECT order_status FROM order_tbl WHERE order_id = ? AND user_id = ?`;
        const order = await exe(checkOrderSql, [orderId, userId]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const orderStatus = order[0].order_status;

        if (orderStatus !== 'Pending' && orderStatus !== 'Confirmed') {
            return res.status(400).json({ success: false, message: `Order cannot be canceled at this stage! If you don't want this product you can return after delivered..!` });
        }

        // Update order status to "Cancelled"
        const cancelSql = `UPDATE order_tbl SET order_status = 'Cancelled', order_cancel_date = NOW() WHERE order_id = ?`;
        await exe(cancelSql, [orderId]);

        res.status(200).json({ success: true, message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ success: false, message: 'Error canceling order' });
    }
});

// Print Order
router.get('/get_order_receipt/:order_id', authenticateToken, async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const userId = req.user.id;

        const orderSql = `SELECT * FROM order_tbl WHERE order_id = ? AND user_id = ?`;
        const order = await exe(orderSql, [orderId, userId]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const productSql = `SELECT * FROM order_products WHERE order_id = ?`;
        const products = await exe(productSql, [orderId]);

        order[0].items = products;
        res.status(200).json({ success: true, order: order[0] });

    } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).json({ success: false, message: 'Error retrieving order receipt' });
    }
});

// Save Contact Us Information
router.post('/contact_us', async (req, res) => {
    try {
        const { first_name, last_name, contact_gmail, contact_message } = req.body;

        const sql = `INSERT INTO contact_us (first_name, last_name, contact_gmail, contact_message, created_at) VALUES (?,?,?,?, NOW())`;
        await exe(sql, [first_name, last_name, contact_gmail, contact_message]);

        res.status(200).json({ success: true, message: 'Thank you for contacting us. We will get back to you soon.' });
    } catch (error) {
        console.error('Error saving contact us information:', error);
        res.status(500).json({ success: false, message: 'Error saving contact us information' });
    }
});

export { router as userRoute };

