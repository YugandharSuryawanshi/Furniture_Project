import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { exe } from '../connection.js';
const router = express.Router();
const blacklist = new Set();


function authenticateToken(req, res, next) {
    const adminToken = req.headers['authorization']?.split(' ')[1];
    if (!adminToken) {
        return res.status(401).send('Unauthorized: No adminToken provided');
    }
    if (blacklist.has(adminToken)) {
        return res.status(403).send('adminToken is invalid (blacklisted)');
    }

    jwt.verify(adminToken, config.adminJwtSecret, (err, admin) => {
        if (err) {
            return res.status(403).send('adminToken is invalid or expired');
        }

        // Attach the decoded admin payload to the request object
        req.admin = admin;

        next();
    });
}

//Register New Admin
router.post('/adminRegister', async (req, res) => {
    const { admin_name, admin_mobile, admin_email, admin_password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(admin_password, 10);

        const sql = `INSERT INTO admins (admin_name, admin_mobile, admin_email, admin_password) VALUES (?, ?, ?, ?)`;
        const data = await exe(sql, [admin_name, admin_mobile, admin_email, hashedPassword]);

        res.status(201).send({ message: 'Admin registered successfully!', data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while registering admin.' });
    }
});

// 3. Login
router.post('/adminLogin', async (req, res) => {
    const { admin_email, admin_password } = req.body;

    if (!admin_email || !admin_password) {
        return res.status(400).send({ message: 'Email and password Both Fields are required' });
    }

    const sql = 'SELECT * FROM admins WHERE admin_email = ?';
    try {
        const results = await exe(sql, [admin_email]);

        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid Email or password' });
        }

        const admin = results[0];
        const isPasswordValid = await bcrypt.compare(admin_password, admin.admin_password);

        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid admin Email or Password, Please Enter Valid Email or Password' });
        const adminToken = jwt.sign(
            { id: admin.admin_id, admin_email: admin.admin_email },
            config.adminJwtSecret,
            { expiresIn: config.adminJwtExpire }
        );
        res.status(200).send({ message: 'Login successful', success: true, adminToken });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Database error' });
    }
});

// 3. Protected Route (Uses verifyToken middleware)
router.get('/adminProtected', authenticateToken, (req, res) => {
    res.json({
        message: 'Access granted to protected route',
        admin: req.admin,
    });
});

// 4. Logout admin
router.post('/adminLogout', authenticateToken, (req, res) => {
    const adminToken = req.headers['authorization']?.split(' ')[1];
    blacklist.add(adminToken); // Add the token to the blacklist
    res.json({ message: 'Logout successful' });
});

// 5. Fetch admin Details from admins table
router.get("/admin_details", authenticateToken, async (req, res) => {
    try {
        const sql = `SELECT * FROM admins WHERE admin_id = '${req.admin.id}'`;
        const admin_details = await exe(sql)
        res.status(200).json({ success: true, admin: admin_details[0] });
    } catch (error) {
        console.error("Error fetching admin details:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the admin details." });
    }
})

// 6. Update Admin Details
router.post('/update_admin', authenticateToken, async (req, res) => {
    const { admin_name, admin_mobile, admin_email, old_password, admin_password } = req.body;

    const admin_id = req.admin.id;

    var sql = `SELECT * FROM admins WHERE admin_id = '${admin_id}'`;
    var admin_details = await exe(sql)

    const hashedOldPassword = admin_details[0].admin_password;

    // Compare entered old password with hashed password
    const isMatchPassword = await bcrypt.compare(old_password, hashedOldPassword);

    if (!isMatchPassword) {
        return res.status(400).send({ success: false, message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(admin_password, 10);

    let admin_profile = null;

    if (req.files && req.files.admin_profile) {
        const uploadedProfile = req.files.admin_profile.name;
        admin_profile = new Date().getTime() + uploadedProfile;
        req.files.admin_profile.mv("public/uploads/" + admin_profile);
    }

    if (admin_profile) {
        const sql = `UPDATE admins SET admin_name = ?, admin_mobile = ?, admin_email = ?, admin_password = ?, admin_profile = ? WHERE admin_id = ?`;
        const data = await exe(sql, [admin_name, admin_mobile, admin_email, hashedPassword, admin_profile, admin_id], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false, message: 'An error occurred while updating the admin profile.' });
            }
            return res.status(200).send({ success: true, message: 'Admin profile updated successfully' });
        })
    }
    else {
        const sql = `UPDATE admins SET admin_name = ? , admin_mobile = ? , admin_email = ? , admin_password = ? WHERE admin_id = ? `;
        const data = await exe(sql, [admin_name, admin_mobile, admin_email, hashedPassword, admin_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false, message: 'An error occurred while updating the admin profile.' });
            }
            console.log('Admin profile updated successfully');
            return res.status(200).send({ success: true, message: 'Admin profile updated successfully' });
        })
    }

})

// DELETE Admin Account
router.delete('/delete_admin', authenticateToken, async (req, res) => {
    const admin_id = req.admin.id;

    try {
        const sql = `DELETE FROM admins WHERE admin_id = ?`;
        const result = await exe(sql, [admin_id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Admin not found' });
        }
        res.status(200).send({ success: true, message: 'Admin account deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting admin account:', err);
        res.status(500).send({ success: false, message: 'An error occurred while deleting the account' });
    }
});

//Getting Users
router.get('/get_users', async (req, res) => {
    try {
        const sql = 'SELECT * FROM users';
        const data = await exe(sql);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the users.' });
    }
});

//Getting Single User
router.get('/get_user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const sql = 'SELECT * FROM users WHERE user_id =?';
        const data = await exe(sql, [userId]);

        if (data.length === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while fetching the user.' });
    }
});

//Update User Route
router.put('/update_user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { user_name, user_email, user_mobile, user_password } = req.body;

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const sql = 'UPDATE users SET user_name =?, user_email =?, user_mobile =? , user_password =? WHERE user_id =?';
        const result = await exe(sql, [user_name, user_email, user_mobile, hashedPassword, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the user.' });
    }
});

//Delete User
router.delete('/delete_user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const sql = 'DELETE FROM users WHERE user_id =?';
        const result = await exe(sql, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while deleting the user.' });
    }
});

// Save the Banner in banner table
// router.post('/save_banner', async (req, res) => {
//     try {
//         const { banner_title, banner_details, banner_link } = req.body;
//         let banner_image = null;

//         // Check if file upload exists
//         if (req.files && req.files.banner_image) {
//             const uploadedFile = req.files.banner_image;

//             // Generate unique filename
//             banner_image = new Date().getTime() + '_' + uploadedFile.name.replace(/\s+/g, '_');

//             // Ensure upload directory exists
//             const uploadDir = 'public/uploads/';
//             const fs = require('fs');
//             if (!fs.existsSync(uploadDir)) {
//                 fs.mkdirSync(uploadDir, { recursive: true });
//             }

//             // Move file to uploads folder
//             uploadedFile.mv(uploadDir + banner_image, (err) => {
//                 if (err) {
//                     console.error('Error moving file:', err);
//                     return res.status(500).json({ success: false, message: 'File upload failed' });
//                 }
//             });
//         }

//         // Update DB
//         const sql = banner_image
//             ? `UPDATE banner SET banner_title = ?, banner_details = ?, banner_link = ?, banner_image = ? WHERE banner_id = 1`
//             : `UPDATE banner SET banner_title = ?, banner_details = ?, banner_link = ? WHERE banner_id = 1`;

//         const params = banner_image
//             ? [banner_title, banner_details, banner_link, banner_image]
//             : [banner_title, banner_details, banner_link];

//         const result = await exe(sql, params);

//         if (result.affectedRows > 0) {
//             return res.status(200).json({ success: true, message: 'Banner updated successfully' });
//         } else {
//             return res.status(404).json({ success: false, message: 'Banner not found' });
//         }
//     } catch (error) {
//         console.error('Error updating banner:', error);
//         return res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// UPDATE banner
router.put("/save_banner", async (req, res) => {
    try {
        const { banner_title, banner_details, banner_link } = req.body;

        if (!req.files || !req.files.banner_image) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const uploadedFile = req.files.banner_image;
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const isAllowedType = allowedMimeTypes.includes(uploadedFile.mimetype);
        if (!isAllowedType) {
            return res.status(400).json({ success: false, message: 'Invalid file type. Only JPEG and PNG are allowed.' });
        }
        const fileSize = uploadedFile.size;
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (fileSize > maxSize) {
            return res.status(400).json({ success: false, message: 'File size is too large. Max size is 10MB.' });
        }

        const banner_image = new Date().getTime() + uploadedFile.name;
        uploadedFile.mv("public/uploads/" + banner_image);

        var sql = ` UPDATE banner SET banner_title ='${banner_title}',
        banner_details = '${banner_details}', banner_link='${banner_link}',
        banner_image='${banner_image}' WHERE banner_id = 1`;
        var data = await exe(sql);
        res.json({ success: true, message: 'Banner updated successfully!', data: data });
    } catch (error) {
        console.log(error);
    }
})

// Fetch the banner details from banner table
router.get("/manage_banner", async (req, res) => {
    try {
        const banner_info = await exe("SELECT * FROM banner");
        if (banner_info && banner_info.length > 0) {
            res.status(200).json({ success: true, banner: banner_info[0] });
        } else {
            res.status(404).json({ success: false, message: "No banner data found" });
        }
    } catch (error) {
        console.error("Error fetching banner data:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the banner data." });
    }
});

//Update product_type table
router.post("/save_product_type", async (req, res) => {
    const { product_type_name } = req.body; // Destructure the expected value
    if (product_type_name) {
        const sql = `INSERT INTO product_type(product_type_name) VALUES('${product_type_name}')`;
        try {
            const data = await exe(sql);
            res.status(200).json({ success: true, message: 'Product type added successfully' });
        } catch (err) {
            console.error('Error inserting product type:', err);
            res.status(500).json({ success: false, message: 'Failed to add product type.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Product type name is required' });
    }
});

// Fetch one product type
router.get('/one_product_type/:id', async (req, res) => {
    const product_type_id = req.params.id;
    if (product_type_id) {
        const sql = 'SELECT * FROM product_type WHERE product_type_id= ?';
        const product_type = await exe(sql, [product_type_id]);
        if (product_type && product_type.length > 0) {
            res.status(200).json({ success: true, product_type: product_type[0] });
        }
        else {
            res.status(404).json({ success: false, message: 'Product type not found.' });
        }
    }
})

// Fetch / get all product types
router.get('/product_types', async (req, res) => {
    try {
        const product_types = await exe('SELECT * FROM product_type');
        if (product_types && product_types.length > 0) {
            res.status(200).json({ success: true, product_types });
        } else {
            res.status(404).json({ success: false, message: 'No product types found.' });
        }
    } catch (err) {
        console.error('Error fetching product types:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the product types.' });
    }
});

// Update product type
router.put('/edit_product_type/:id', async (req, res) => {
    const product_type_id = req.params.id;
    const { product_type_name } = req.body;
    try {
        const sql = `UPDATE product_type SET product_type_name = '${product_type_name}' WHERE product_type_id = '${product_type_id}'`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product type not found' });
        }
        res.status(200).json({ success: true, message: 'Product type updated successfully' });
    }
    catch (err) {
        console.error('Error updating product type:', err);
        res.status(500).json({ success: false, message: 'Error occurred while updating product type' });
    }
});

// Delete product type
router.delete('/delete_product_type/:id', async (req, res) => {
    const product_type_id = req.params.id;
    if (product_type_id) {
        const sql = `DELETE FROM product_type WHERE product_type_id= '${product_type_id}'`;
        const data = await exe(sql)
        if (data.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product type not found.' });
        }
        res.status(200).json({ success: true, message: 'Product type deleted successfully' });
    }
})

// Create a new product
// Save product route
router.post("/save_product", async (req, res) => {
    try {
        let file_names = [];
        if (req.files && req.files.product_image) {
            // Handle file uploads
            if (Array.isArray(req.files.product_image)) {
                for (let i = 0; i < req.files.product_image.length; i++) {
                    let fn = new Date().getTime() + "_" + req.files.product_image[i].name;
                    req.files.product_image[i].mv("public/uploads/" + fn);
                    file_names.push(fn);
                }
                var file_name = file_names.join(",");
            } else {
                var fn = new Date().getTime() + "_" + req.files.product_image.name;
                req.files.product_image.mv("public/uploads/" + fn);
                var file_name = fn;
            }
        }

        const d = req.body;

        d.product_details = d.product_details.replace(/'/g, "`"); // replace globally
        d.additional_details = d.additional_details.replace(/'/g, "`"); // replace globally

        const sql = `INSERT INTO product (
            product_type_id, product_name, product_price, duplicate_price, product_size,
            product_color, product_lable, product_details, product_image, product_brand,
            product_weight, no_of_pieces, product_pattern, product_origin, product_material,
            product_warranty, product_care_instructions, additional_details, gst_percentage, discount_percentage)
    VALUES ('${d.product_type_id}', '${d.product_name}', '${d.product_price}', '${d.duplicate_price}',
        '${d.product_size}', '${d.product_color}', '${d.product_lable}', '${d.product_details}',
        '${file_name}', '${d.product_brand}', '${d.product_weight}', '${d.no_of_pieces}',
        '${d.product_pattern}', '${d.product_origin}', '${d.product_material}',
        '${d.product_warranty}', '${d.product_care_instructions}', '${d.additional_details}',
        '${d.gst_percentage}', '${d.discount_percentage}')`;

        const data = await exe(sql);

        if (data.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Product saved successfully" });
        } else {
            res.status(500).json({ success: false, message: "Failed to save product in the database" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }

});

// Fetch all products info from the database
router.get('/products', async (req, res) => {
    try {
        const products = await exe(`SELECT * FROM product,product_type WHERE product.product_type_id = product_type.product_type_id`);
        if (products && products.length > 0) {
            res.status(200).json({ success: true, products });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while fetching the products.' });
    }
})

// Search Product Route
router.get('/product_search', async (req, res) => {
    try {
        const { str } = req.query;
        const sql = `SELECT * FROM product, product_type WHERE product.product_type_id = product_type.product_type_id AND (product_name LIKE '%${str}%' OR product_type_name LIKE '%${str}%'OR product_size LIKE '%${str}%'OR product_price LIKE '%${str}%'OR product_lable LIKE '%${str}%'OR product_details LIKE '%${str}%')`;

        const products = await exe(sql);

        if (products.length > 0) {
            res.status(200).json({ success: true, products });
        } else {
            res.status(200).json({ success: true, products: [] }); // Return empty array if no matches
        }
    } catch (err) {
        console.error("Error in /product_search:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

//Get Single Product And That Product Images
router.get('/single_product/:id', async (req, res) => {
    const product_id = req.params.id;

    try {
        const sql = `SELECT * FROM product, product_type WHERE product.product_type_id = product_type.product_type_id AND product.product_id = ${product_id}`;
        const product = await exe(sql);

        const imgQuery = `SELECT product_image FROM product WHERE product_id =?`;
        const images = await exe(imgQuery, [product_id]);

        if (product.length > 0) {
            const images_urls = images.map((img) => `${img.product_image}`);
            res.status(200).json({ success: true, single_product: product[0], images: images_urls });
        } else {
            res.status(404).json({ success: false, message: 'Product not found.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// Product Update
router.put('/product_update/:id', async (req, res) => {
    const d = req.body;
    const product_id = req.params.id;

    try {
        let file_names = [];
        if (req.files && req.files.product_image) {
            if (Array.isArray(req.files.product_image)) {
                for (let i = 0; i < req.files.product_image.length; i++) {
                    let fn = new Date().getTime() + "_" + req.files.product_image[i].name;
                    req.files.product_image[i].mv("public/uploads/" + fn);
                    file_names.push(fn);
                }
                var file_name = file_names.join(",");
            } else {
                var fn = new Date().getTime() + "_" + req.files.product_image.name;
                req.files.product_image.mv("public/uploads/" + fn);
                var file_name = fn;
            }
        }

        d.product_details = d.product_details.replace(/'/g, "`"); // replace globally
        d.additional_details = d.additional_details.replace(/'/g, "`"); // replace globally

        const sql = `UPDATE product
            SET product_type_id = '${d.product_type_id}',
                product_name = '${d.product_name}',
                product_price = '${d.product_price}',
                duplicate_price = '${d.duplicate_price}',
                product_size = '${d.product_size}',
                product_color = '${d.product_color}',
                product_lable = '${d.product_lable}',
                product_details = '${d.product_details}',
                product_image = '${file_name}',
                product_brand = '${d.product_brand}',
                product_weight = '${d.product_weight}',
                no_of_pieces = '${d.no_of_pieces}',
                product_pattern = '${d.product_pattern}',
                product_origin = '${d.product_origin}',
                product_material = '${d.product_material}',
                product_warranty = '${d.product_warranty}',
                product_care_instructions = '${d.product_care_instructions}',
                additional_details = '${d.additional_details}',
                gst_percentage = '${d.gst_percentage}',
                discount_percentage = '${d.discount_percentage}'
            WHERE product_id = '${product_id}'`;

        const data = await exe(sql);

        if (data.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Product updated successfully" });
        } else {
            res.status(500).json({ success: false, message: "Failed to update product in the database" });
        }

    } catch (err) {
        console.error("Error in /save_product:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Product Delete
router.delete('/product_delete/:id', async (req, res) => {
    const product_id = req.params.id;

    try {
        // Step 1: Get the product details (including images) from the database
        const getProductSql = `SELECT product_image FROM product WHERE product_id = ?`;
        const product = await exe(getProductSql, [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Extract product images
        const productImages = product[0].product_image.split(',');

        // Step 2: Delete images from the public/uploads folder
        productImages.forEach((image) => {
            const filePath = path.join(__dirname, "public/uploads", image);

            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath); // Delete the image
                } catch (err) {
                    console.error(`Error deleting file ${filePath}:`, err.message);
                }
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        });

        // Step 3: Delete product from the database
        const sql = `DELETE FROM product WHERE product_id = ?`;
        const result = await exe(sql, [product_id]);

        return res.status(200).json({
            success: true,
            message: "Product and associated images deleted successfully",
        });
    } catch (err) {
        console.error("Error in /product_delete:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

// Save Interior Route
// router.post('/save_interior', async (req, res) => {
//     try {
//         // Extract form data
//         const { heading, interior_details, first_key, second_key, third_key, forth_key } = req.body;
//         const d = req.files; // `req.files` will contain the uploaded files

//         console.log("Form data:", { heading, interior_details, first_key, second_key, third_key, forth_key });
//         console.log("Uploaded files:", d);

//         // Ensure all required images are uploaded
//         if (!d || !d.first_image || !d.second_image || !d.third_image) {
//             return res.status(400).json({ success: false, message: "Missing required image files" });
//         }

//         // File upload and renaming logic
//         let file_names = [];

//         // Save first image
//         if (d.first_image) {
//             let fn = new Date().getTime() + "_" + d.first_image.name;
//             d.first_image.mv("public/uploads/" + fn, (err) => {
//                 if (err) {
//                     console.error("Error moving first image:", err);
//                     return res.status(500).json({ success: false, message: "Failed to upload first image" });
//                 }
//             });
//             file_names.push(fn);
//         }

//         // Save second image
//         if (d.second_image) {
//             let fn = new Date().getTime() + "_" + d.second_image.name;
//             d.second_image.mv("public/uploads/" + fn, (err) => {
//                 if (err) {
//                     console.error("Error moving second image:", err);
//                     return res.status(500).json({ success: false, message: "Failed to upload second image" });
//                 }
//             });
//             file_names.push(fn);
//         }

//         // Save third image
//         if (d.third_image) {
//             let fn = new Date().getTime() + "_" + d.third_image.name;
//             d.third_image.mv("public/uploads/" + fn, (err) => {
//                 if (err) {
//                     console.error("Error moving third image:", err);
//                     return res.status(500).json({ success: false, message: "Failed to upload third image" });
//                 }
//             });
//             file_names.push(fn);
//         }

//         // SQL query to insert interior design data into the database
//         const sql = `
//             INSERT INTO interior (heading, interior_details, first_key, second_key, third_key, forth_key, first_image, second_image, third_image)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         // Prepare the data for the query
//         const queryData = [
//             heading,
//             interior_details,
//             first_key,
//             second_key,
//             third_key,
//             forth_key,
//             file_names[0] || null,
//             file_names[1] || null,
//             file_names[2] || null
//         ];


//         var data = await(sql, queryData, (err, result) => {
//             if (err) {
//                 console.error("Error inserting data:", err.message);
//                 return res.status(500).json({ success: false, message: "Error inserting data into the table" });
//             }
//             console.log("Data inserted successfully:", result);
//             return res.status(200).json({ success: true, message: "Data inserted successfully!" });
//         });

//     } catch (err) {
//         console.error("Error in /save_interior:", err.message);
//         res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
//     }
// });

// Update Interior

router.put('/update_interior', async (req, res) => {
    try {
        // Extract form data
        const { heading, interior_details, first_key, second_key, third_key, forth_key } = req.body;
        const d = req.files;

        // Initialize file_names array
        let first_image = null;
        let second_image = null;
        let third_image = null;

        // Ensure only one image is updated at a time
        if (d.first_image) {
            let fn = new Date().getTime() + "_" + d.first_image.name;
            d.first_image.mv("public/uploads/" + fn);
            first_image = fn; // Update first image
        }

        if (d.second_image) {
            let fn = new Date().getTime() + "_" + d.second_image.name;
            d.second_image.mv("public/uploads/" + fn);
            second_image = fn; // Update second image
        }

        if (d.third_image) {
            let fn = new Date().getTime() + "_" + d.third_image.name;
            d.third_image.mv("public/uploads/" + fn);
            third_image = fn; // Update third image
        }

        // Prepare the SET clause for the SQL query based on the uploaded files
        let setClause = [];
        let values = [];

        // Always include the text fields in the update
        setClause.push('heading = ?');
        setClause.push('interior_details = ?');
        setClause.push('first_key = ?');
        setClause.push('second_key = ?');
        setClause.push('third_key = ?');
        setClause.push('forth_key = ?');
        values.push(heading, interior_details, first_key, second_key, third_key, forth_key);

        // Dynamically add the image fields only if they are updated
        if (first_image) {
            setClause.push('first_image = ?');
            values.push(first_image);
        }

        if (second_image) {
            setClause.push('second_image = ?');
            values.push(second_image);
        }

        if (third_image) {
            setClause.push('third_image = ?');
            values.push(third_image);
        }

        // Construct the SQL query
        let sql = `UPDATE interior SET ${setClause.join(', ')} WHERE interior_id = 1`;

        var data = await exe(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating data:", err.message);
                return res.status(500).json({ success: false, message: "Error updating data in the table" });
            }
            return res.status(200).json({ success: true, message: "Data updated successfully!" });
        });

    } catch (err) {
        console.error("Error in /update_interior:", err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

// Fetch interior design data
router.get('/interior_data', async (req, res) => {
    try {
        const sql = `SELECT * FROM interior WHERE interior_id = 1`;
        var data = await exe(sql, [], (err, result) => {
            if (err) {
                console.error("Error fetching data:", err.message);
                return res.status(500).json({ success: false, message: "Error fetching data from the table" });
            }
            return res.status(200).json({ success: true, data: result[0] });
        });
    } catch (err) {
        console.error("Error in /interior_data:", err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
})

// CREATE AND SAVE Testimonial
router.post('/save_testimonial', async (req, res) => {
    const d = req.body;
    try {
        let file_name = [];
        if (req.files && req.files.customer_image) {
            let fn = new Date().getTime() + "_" + req.files.customer_image.name;
            req.files.customer_image.mv("public/uploads/" + fn);
            file_name.push(fn);
            var sql = `INSERT INTO testimonial(customer_name,customer_position,customer_image,customer_massage)VALUES('${d.customer_name}','${d.customer_position}','${file_name}','${d.customer_massage}')`;
            var data = await exe(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error inserting data into the table" });
                }
                return res.status(200).json({ success: true, message: "Data inserted successfully!" });
            })
        }
        var sql = `INSERT INTO testimonial(customer_name,customer_position,customer_massage)VALUES('${d.customer_name}','${d.customer_position}','${d.customer_massage}')`;
        var data = await exe(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error inserting data into the table" });
            }
            return res.status(200).json({ success: true, message: "Data inserted successfully!" });
        });
    }
    catch {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
})

// Fetch all testimonials
router.get('/get_testimonial', (req, res) => {
    try {
        var sql = `SELECT * FROM testimonial`;
        var data = exe(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error fetching data from the table" });
            }
            return res.status(200).json({ success: true, data: result });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
})

//get One testimonial
router.get('/get_one_testimonial/:id', (req, res) => {
    try {
        const sql = `SELECT * FROM testimonial WHERE customer_id=${req.params.id}`;
        exe(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error fetching data from the table" });
            }
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "Testimonial not found" });
            }
            return res.status(200).json({ success: true, data: result[0] }); // Return first object directly
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

//Update Testimonial
router.put('/update_testimonial/:id', (req, res) => {
    const d = req.body;
    try {
        let file_name = [];
        if (req.files && req.files.customer_image) {
            let fn = new Date().getTime() + "_" + req.files.customer_image.name;
            req.files.customer_image.mv("public/uploads/" + fn);
            file_name.push(fn);
        }
        if (file_name && file_name.length > 0) {
            var sql = `UPDATE testimonial SET customer_name='${d.customer_name}',customer_position='${d.customer_position}',customer_image='${file_name}',customer_massage='${d.customer_massage}' WHERE customer_id=${req.params.id}`;
            var data = exe(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data updated successfully!" });
            })
        }
        else {
            var sql = `UPDATE testimonial SET customer_name='${d.customer_name}',customer_position='${d.customer_position}',customer_massage='${d.customer_massage}' WHERE customer_id=${req.params.id}`;
            var data = exe(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data updated successfully!" });
            })
        }
    }
    catch {
        console.error("Error in /update_testimonial/:id:", err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
})

//Delete testimonial
router.delete('/delete_testimonial/:id', (req, res) => {
    try {
        const sql = `DELETE FROM testimonial WHERE customer_id=${req.params.id}`;
        exe(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error deleting data from the table" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Testimonial not found" });
            }
            return res.status(200).json({ success: true, message: "Testimonial deleted successfully!" });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
})

//Why Choose US Update
router.put('/update_why_choose_us', (req, res) => {
    const d = req.body;
    let fileName = null;

    try {
        // If an image is provided
        if (req.files && req.files.why_choose_img) {
            fileName = new Date().getTime() + "_" + req.files.why_choose_img.name;
            req.files.why_choose_img.mv("public/uploads/" + fileName, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "File upload failed" });
                }

                // After file upload
                const sql = `UPDATE why_choose_us SET heading='${d.heading}', why_choose_img='${fileName}' WHERE why_choose_us_id=1`;
                exe(sql, (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: "Error updating details" });
                    }
                    res.status(200).json({ success: true, message: "Data updated successfully!" });
                });
            });
        } else {
            // Update without image
            const sql = `UPDATE why_choose_us SET heading='${d.heading}' WHERE why_choose_us_id=1`;
            exe(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                res.status(200).json({ success: true, message: "Data updated successfully!" });
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

//Fetch data of Why Choose US
router.get('/get_why_choose_us', async (req, res) => {
    try {
        const sql = `SELECT * FROM why_choose_us WHERE why_choose_us_id=1`;
        const data = await exe(sql);
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Why Choose Us data not found" });
        }
        res.status(200).json({ success: true, data: data[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// Add data of Why Choose Us Points
router.post('/save_why_choose_us_point', (req, res) => {
    const d = req.body;

    try {
        let file_name = null;

        if (req.files && req.files.why_choose_points_img) {
            file_name = new Date().getTime() + "_" + req.files.why_choose_points_img.name;

            req.files.why_choose_points_img.mv("public/uploads/" + file_name, (err) => {
                if (err) {
                    console.error("File upload error:", err.message);
                    return res.status(500).json({ success: false, message: "File upload failed" });
                }

                const sql = `INSERT INTO why_choose_points (why_choose_points_img, why_choose_points_name, why_choose_points_details) 
                        VALUES ('${file_name}', '${d.why_choose_points_name}', '${d.why_choose_points_details}')`;
                exe(sql, (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: "Error saving data in the table" });
                    }
                    return res.status(200).json({ success: true, message: "Data saved successfully!" });
                });
            });
        } else {
            // If no image is uploaded, Then insert only name and details
            const sql = `INSERT INTO why_choose_points (why_choose_points_name, why_choose_points_details)
                      VALUES ('${d.why_choose_points_name}', '${d.why_choose_points_details}')`;
            exe(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error saving data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data saved successfully!" });
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Get/ Fetch data of Why Choose Us Points
router.get('/get_why_choose_points', async (req, res) => {
    try {
        const sql = `SELECT * FROM why_choose_points`;
        const data = await exe(sql);
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

//Get One Why Choose Us Point By id
router.get('/get_why_choose_point/:id', async (req, res) => {
    try {
        const sql = `SELECT * FROM why_choose_points WHERE why_choose_points_id=${req.params.id}`;
        const data = await exe(sql);
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Why Choose Us Point not found" });
        }
        res.status(200).json({ success: true, data: data[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// Update One Why Choose Us Point By id
router.put('/update_why_choose_point/:id', (req, res) => {
    const d = req.body;
    let file_name = null;

    if (req.files && req.files.why_choose_points_img) {
        file_name = new Date().getTime() + "_" + req.files.why_choose_points_img.name;

        // Upload the image
        req.files.why_choose_points_img.mv("public/uploads/" + file_name, (err) => {
            if (err) {
                console.error("File upload error:", err.message);
                return res.status(500).json({ success: false, message: "File upload failed" });
            }

            const sql = `UPDATE why_choose_points SET why_choose_points_img = ?, why_choose_points_name = ?, why_choose_points_details = ? WHERE why_choose_points_id = ?`;

            const variable = [file_name, d.why_choose_points_name, d.why_choose_points_details, req.params.id];

            exe(sql, variable, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data updated successfully!" });
            });
        });
    } else {
        // If no new image is uploaded, update the fields without changing the image
        const sql = `UPDATE why_choose_points SET why_choose_points_name = ?, why_choose_points_details = ? WHERE why_choose_points_id = ?`;

        const variable = [d.why_choose_points_name, d.why_choose_points_details, req.params.id];

        exe(sql, variable, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error updating data in the table" });
            }
            return res.status(200).json({ success: true, message: "Data updated successfully!" });
        });
    }
});

// Delete One Why Choose Us Point By id
router.delete('/delete_why_choose_point/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM why_choose_points WHERE why_choose_points_id=${req.params.id}`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Why Choose Us Point not found" });
        }
        res.status(200).json({ success: true, message: "Data deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Save/ Add Blog Data
router.post('/save_blog', async (req, res) => {
    const d = req.body;
    let file_name = null;

    // Check if file is uploaded
    if (req.files && req.files.blog_image) {
        file_name = new Date().getTime() + "_" + req.files.blog_image.name;

        req.files.blog_image.mv("public/uploads/" + file_name, (err) => {
            if (err) {
                console.error("File upload error:", err.message);
                return res.status(500).json({ success: false, message: "File upload failed" });
            }

            var sql = `INSERT INTO blog (blog_image, blog_title, blog_post_date, blog_post_time, blog_post_by, blog_post_by_position) VALUES (?, ?, ?, ?, ?, ?)`;
            var values = [file_name, d.blog_title, d.blog_post_date, d.blog_post_time, d.blog_post_by, d.blog_post_by_position];

            exe(sql, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error saving data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data saved successfully!" });
            });
        });
    } else {
        var sql = `INSERT INTO blog ( blog_title, blog_post_date, blog_post_time, blog_post_by, blog_post_by_position) VALUES ( ?, ?, ?, ?, ?)`;
        var values = [d.blog_title, d.blog_post_date, d.blog_post_time, d.blog_post_by, d.blog_post_by_position];

        exe(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error saving data in the table" });
            }
            return res.status(200).json({ success: true, message: "Data saved successfully!" });
        });
    }
});

// Get/ Fetch data of All Blogs
router.get('/get_blogs', async (req, res) => {
    try {
        const sql = `SELECT * FROM blog`;
        const data = await exe(sql);
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

//Get Single Blog Data
router.get('/get_single_blog/:id', async (req, res) => {
    try {
        const sql = `SELECT * FROM blog WHERE blog_id=${req.params.id}`;
        const data = await exe(sql);
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({ success: true, data: data[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

//Update Blog Data
router.put('/update_blog/:id', async (req, res) => {
    const d = req.body;
    let file_name = null;

    if (req.files && req.files.blog_image) {
        file_name = new Date().getTime() + "_" + req.files.blog_image.name;

        req.files.blog_image.mv("public/uploads/" + file_name, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "File upload failed" });
            }

            const sql = `UPDATE blog SET blog_image =?, blog_title =?, blog_post_date =?, blog_post_time =?, blog_post_by =?, blog_post_by_position =? WHERE blog_id =?`;
            const values = [file_name, d.blog_title, d.blog_post_date, d.blog_post_time, d.blog_post_by, d.blog_post_by_position, req.params.id];

            exe(sql, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                return res.status(200).json({ success: true, message: "Data updated successfully with new image!" });
            });
        });
    } else {
        const sql = `UPDATE blog SET blog_title =?, blog_post_date =?, blog_post_time =?, blog_post_by =?, blog_post_by_position =? WHERE blog_id =?`;
        const values = [d.blog_title, d.blog_post_date, d.blog_post_time, d.blog_post_by, d.blog_post_by_position, req.params.id];
        exe(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error updating data in the table" });
            }
            return res.status(200).json({ success: true, message: "Data updated successfully without new image!" });
        });
    }
});

// Delete One Blog By id
router.delete('/delete_blog/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM blog WHERE blog_id=${req.params.id}`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({ success: true, message: "Data deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Save Team Member information
router.post('/save_team_member', async (req, res) => {
    const d = req.body;
    let file_name = null;
    try {
        if (req.files && req.files.member_image) {
            file_name = new Date().getTime() + "_" + req.files.member_image.name;

            req.files.member_image.mv("public/uploads/" + file_name, async (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error uploading image" });
                }

                const sql = `INSERT INTO our_team (member_image, member_name, member_position, member_details) VALUES (?,?,?,?)`;
                const values = [file_name, d.member_name, d.member_position, d.member_details];

                exe(sql, values, (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: "Error saving data in the table" });
                    }
                    return res.status(200).json({ success: true, message: "Team Member added successfully!" });
                });
            });
        } else {
            const sql = `INSERT INTO our_team (member_name, member_position, member_details) VALUES (?,?,?)`;
            const values = [d.member_name, d.member_position, d.member_details];
            exe(sql, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error saving data in the table" });
                }
                return res.status(200).json({ success: true, message: "Team Member added successfully!" });
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error saving team member" });
    }
});

// Fetch/ Get All Team Members
router.get('/get_team_members', async (req, res) => {
    try {
        const sql = `SELECT * FROM our_team`;
        const data = await exe(sql);
        if (data.length > 0) {
            res.status(200).json({ success: true, data: data });
        } else {
            res.status(404).json({ success: false, message: "No team members found" });
        }
    } catch (err) {
        console.error("Error fetching team members: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Fetch/ Get Single Team Member
router.get('/get_single_team_member/:id', async (req, res) => {
    try {
        const sql = `SELECT * FROM our_team WHERE member_id=${req.params.id}`;
        const data = await exe(sql);
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }
        res.status(200).json({ success: true, data: data[0] });
    } catch (err) {
        console.error("Error fetching team member: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Update Team Member
router.put('/update_team_member/:id', async (req, res) => {
    const d = req.body;
    let file_name = null;
    if (req.files && req.files.member_image) {
        file_name = new Date().getTime() + "_" + req.files.member_image.name;
        req.files.member_image.mv("public/uploads/" + file_name, (err) => {

            const sql = `UPDATE our_team SET member_image =?, member_name =?, member_position =?, member_details =? WHERE member_id =?`;
            const values = [file_name, d.member_name, d.member_position, d.member_details, req.params.id];

            const data = exe(sql, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error updating data in the table" });
                }
                return res.status(200).json({ success: true, message: "Team Member updated successfully!" });
            });
        })
    } else {
        const sql = `UPDATE our_team SET member_name =?, member_position =?, member_details =? WHERE member_id =?`;
        const values = [d.member_name, d.member_position, d.member_details, req.params.id];
        const data = await exe(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error updating data in the table" });
            }
            return res.status(200).json({ success: true, message: "Team Member updated successfully!" });
        });
    }
})

// Delete One Team Member By id
router.delete('/delete_team_member/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM our_team WHERE member_id=${req.params.id}`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }
        res.status(200).json({ success: true, message: "Team Member deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Get all Orders
router.get('/get_orders', async (req, res) => {
    try {
        const sql = `SELECT
        o.order_id, o.user_id, o.order_status, o.order_date, o.payment_status, o.payment_mode,
        o.c_fname, o.c_lname, o.c_address, o.c_state, o.c_postal_zip, o.c_phone, o.transaction_id,
        o.total_amount, o.total_gst, o.total_discount, o.final_total,
        GROUP_CONCAT(p.product_name SEPARATOR ', ') AS products,
        SUM(p.product_qty * p.product_price) AS total_amount,
        u.user_id, u.user_name, u.user_email, u.user_mobile, u.user_profile
    FROM order_tbl o
    JOIN order_products p ON o.order_id = p.order_id
    JOIN users u ON o.user_id = u.user_id
    GROUP BY o.order_id
    ORDER BY o.order_date DESC;`;

        const data = await exe(sql);
        if (data.length > 0) {
            res.status(200).json({ success: true, data });
        } else {
            res.status(404).json({ success: false, message: "No orders found" });
        }
    } catch (err) {
        console.error("Error fetching orders: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

//Get Order Details By order_id
router.get('/get_order_details/:id', async (req, res) => {
    var order_id = req.params.id;
    console.log(req.params.id);
    try {
        const sql = `SELECT
        o.order_id, o.user_id, o.order_status, o.order_date, o.payment_status, o.payment_mode,
        o.c_fname, o.c_lname, o.c_address, o.c_state, o.c_postal_zip, o.c_phone, o.transaction_id,
        o.total_amount, o.total_gst, o.total_discount, o.final_total,
        GROUP_CONCAT(p.product_name SEPARATOR ', ') AS products,
        SUM(p.product_qty * p.product_price) AS total_amount,
        u.user_id, u.user_name, u.user_email, u.user_mobile, u.user_profile
    FROM order_tbl o
    JOIN order_products p ON o.order_id = p.order_id
    JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = '${order_id}'
    GROUP BY o.order_id
    ORDER BY o.order_date DESC;`;
        const data = await exe(sql);
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: data[0] });

    } catch (err) {
        console.error("Error fetching order details: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// update order

router.put('/update_order', async (req, res) => {
    try {
        const { order_id, order_status, payment_status } = req.body;

        if (!order_id || !order_status || !payment_status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        console.log("Updating order:", order_id);
        console.log("New order status:", order_status);
        console.log("New payment status:", payment_status);

        // Base query to update order status and payment status
        let updateQuery = `
            UPDATE order_tbl
            SET order_status = ?, payment_status = ?
        `;

        let queryParams = [order_status, payment_status];

        // Add conditionally based on order status
        if (order_status === "Dispatched") {
            updateQuery += `, order_dispatch_date = NOW()`;
        } else if (order_status === "Delivered") {
            updateQuery += `, order_delivered_date = NOW()`;
        } else if (order_status === "Cancelled") {
            updateQuery += `, order_cancel_date = NOW()`;
        } else if (order_status === "Rejected") {
            updateQuery += `, order_reject_date = NOW()`;
        }

        updateQuery += ` WHERE order_id = ?`; // Corrected order_id parameter binding
        queryParams.push(order_id); // Push order_id into queryParams

        // Execute the update query correctly
        const result = await exe(updateQuery, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order updated successfully!" });

    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Contact Us
router.get('/contact_us', async (req, res) => {
    try {
        const sql = `SELECT * FROM contact_us ORDER BY contact_id DESC`;
        const data = await exe(sql);
        if (data.length > 0) {
            res.status(200).json({ success: true, data });
        } else {
            res.status(404).json({ success: false, message: "No messages found" });
        }
    } catch (err) {
        console.error("Error fetching contact us messages: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// Delete Contact Us
router.delete('/delete_contact_us/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM contact_us WHERE contact_id=${req.params.id}`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.status(200).json({ success: true, message: "Contact Message deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Get All Subscribers
router.get('/get_subscribers', async (req, res) => {
    try {
        const sql = `SELECT * FROM user_subscriber`;
        const data = await exe(sql);
        if (data.length > 0) {
            res.status(200).json({ success: true, data });
        } else {
            res.status(404).json({ success: false, message: "No subscribers found" });
        }
    } catch (err) {
        console.error("Error fetching subscribers: ", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Update subscriber

router.put('/update_subscriber', async (req, res) => {
    try {
        const d = req.body;
        console.log(d);
        
        if (!d.id || !d.name || !d.email || !d.status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        console.log("Updating subscriber:", d.id);
        let updateQuery = `UPDATE user_subscriber SET name =?, email =?, status =? WHERE id =?`;
        let queryParams = [d.name, d.email, d.status, d.id];
        const result = await exe(updateQuery, queryParams);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Subscriber not found" });
        }
        res.status(200).json({ success: true, message: "Subscriber updated successfully!" });
    } catch (err) {
        console.error("Error updating subscriber:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
})

// Delete subscriber
router.delete('/delete_subscriber/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM user_subscriber WHERE id=${id}`;
        const result = await exe(sql);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Subscriber not found" });
        }
        res.status(200).json({ success: true, message: "Subscriber deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});


export { router as adminRoute };

