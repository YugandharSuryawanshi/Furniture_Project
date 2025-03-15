-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2025 at 07:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `furni_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(200) DEFAULT NULL,
  `admin_mobile` varchar(15) DEFAULT NULL,
  `admin_email` varchar(200) NOT NULL,
  `admin_password` varchar(350) NOT NULL,
  `admin_profile` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_name`, `admin_mobile`, `admin_email`, `admin_password`, `admin_profile`) VALUES
(2, 'Yugandhar Suryawanshi', '9359087068', 'yugandhar@gmail.com', '$2b$10$ehyXenucTJOkbk91whp2JOfW5WcUQgRm7Bv1jbotyHDYaBfqekQeO', '1736439598182study.jpg'),
(3, 'Chaitanya Kodre', '9359087069', 'chaitu@gmail.com', '$2a$10$7q1Z3nvV1HcsfvG6amkgueXZLxKOSWTQYW0h2t8qKYAnzyMiQ7Nqq', '1736446596106IMG_20220623_152031.jpg'),
(5, 'Radha Krishna', '9359087068', 'radhekrishna@gmail.com', '$2a$10$alD6Qg58fLjR9bH96gkE5uNhqgeNYMIGd0CDmulbdin9cxRQYXxWC', '1736420229774RadheKrishna.jpg'),
(8, 'Shahadev Warkhede', '1234567891', 'shahadev@gmail.com', '$2b$10$4U16zOJ3/krd0S8ivVCUxOpPm9EbB78IqiFG7sqvxKuphMu1v3/Lu', '17404872113151697381295688.jpg'),
(10, 'Chaitanya Kodre', '1234567890', 'chaitanya@gmail.com', '$2b$10$PW3EWjsPPs8wjLn0FgiUBeOCoLn4tBWZG/T5i/ZfSuuRy/A6oRA1e', '1741610784840IMG_20241217_215310.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `banner_id` int(11) NOT NULL,
  `banner_title` varchar(300) DEFAULT NULL,
  `banner_details` text DEFAULT NULL,
  `banner_link` text DEFAULT NULL,
  `banner_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`banner_id`, `banner_title`, `banner_details`, `banner_link`, `banner_image`) VALUES
(1, 'Your Online Destination for Stylish Furniture', 'Where Comfort Meets Style! Explore our vast collection of high-quality furniture pieces to elevate every corner of your home. From cozy sofas to elegant dining sets, we have everything you need to create your perfect living space. Shop now and bring luxury and functionality into your home with just a click!', 'http://www.google.com', '1738000076472couch.png');

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `blog_id` int(11) NOT NULL,
  `blog_image` text DEFAULT NULL,
  `blog_title` text DEFAULT NULL,
  `blog_post_date` varchar(150) DEFAULT NULL,
  `blog_post_time` varchar(150) DEFAULT NULL,
  `blog_post_by` varchar(400) DEFAULT NULL,
  `blog_post_by_position` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`blog_id`, `blog_image`, `blog_title`, `blog_post_date`, `blog_post_time`, `blog_post_by`, `blog_post_by_position`) VALUES
(1, '1737474406378_blog3.jpg', 'First Time Home Owner Ideas', '2025-01-21', '9:16 PM', 'Yugandhar Marathe', 'CEO'),
(2, '1737522609012_why-choose-us-img.jpg', 'How To Keep Your Furniture Clean', '2025-01-22', '11:34', 'Chaitanya Kodre', 'Manager'),
(3, '1737522184054_img-grid-1.jpg', 'Small Space Furniture Apartment Ideas', '2025-01-31', '8:34 PM', 'Shahadev Warkhede', 'Manager'),
(5, '1737526457832_post-1.jpg', 'First Time Home Owner Ideas', '2025-01-24', '2:45 PM', 'Rohit Bhosle', 'Manager'),
(6, '1737526559574_post-2.jpg', 'How To Keep Your Furniture Clean', '2025-01-25', '4:46 AM', 'Denish Patel', 'Employee');

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `contact_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `contact_gmail` varchar(150) DEFAULT NULL,
  `contact_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`contact_id`, `first_name`, `last_name`, `contact_gmail`, `contact_message`, `created_at`) VALUES
(1, 'Siya', 'Ram', 'ram@gmail.com', 'Good Service', '2025-02-17 16:25:13');

-- --------------------------------------------------------

--
-- Table structure for table `interior`
--

CREATE TABLE `interior` (
  `interior_id` int(11) NOT NULL,
  `first_image` text DEFAULT NULL,
  `second_image` text DEFAULT NULL,
  `third_image` text DEFAULT NULL,
  `heading` varchar(500) DEFAULT NULL,
  `interior_details` text DEFAULT NULL,
  `first_key` text DEFAULT NULL,
  `second_key` text DEFAULT NULL,
  `third_key` text DEFAULT NULL,
  `forth_key` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interior`
--

INSERT INTO `interior` (`interior_id`, `first_image`, `second_image`, `third_image`, `heading`, `interior_details`, `first_key`, `second_key`, `third_key`, `forth_key`) VALUES
(1, '1737229568232_interior1.jpg', '1737229929657_interior2.jpg', '1737229519835_post-2.jpg', 'We Help You Make Modern Interior Design', 'Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada', 'Donec vitae odio quis nisl dapibus malesuada', 'Donec vitae odio quis nisl dapibus malesuada', 'Donec vitae odio quis nisl dapibus malesuada', 'Donec vitae odio quis nisl dapibus malesuada');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `order_product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_qty` int(11) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `gst_amount` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `final_price` decimal(10,2) NOT NULL,
  `product_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`order_product_id`, `order_id`, `user_id`, `product_id`, `product_name`, `product_qty`, `product_price`, `gst_amount`, `discount_amount`, `final_price`, `product_details`) VALUES
(1, 1, 4, 1, 'Modern Classic 4 Seater Leatharrate Tufted 3+1+1Footrest Chesterfield Sofa', 1, 28998.00, 5219.64, 5799.60, 28418.04, 'No assembly required the product is delivered in a preassembled state.(only legs to be fix by the customer)Our delivery service is very fast, we deliver the order to the customer with 5 days guarantee after dispatch.\r\nModern Chesterfield Design: Designed with the traditional moden Chesterfield style in mind, this piece hits all the key elements, with deep button tufting, nailhead accents, scrolled arms and stylish legs.\r\nDIMENSION: 190 Lx 80Dx 80H.\r\nSeating Capacity: 3 Seat;'),
(2, 1, 4, 7, 'Sheesham Wooden Dining Set 6 Seater Dining Table with Chairs & Bench ', 1, 33900.00, 6102.00, 7458.00, 32544.00, 'Material: Wood- 100% Solid Sheesham Wood, Color- Walnut Finish (Glossy).\r\nAssembly: Only Table and Bench Requires Assembly(Comes With Tools & Self-Assembly Instructions & Based on Customer Basis), Chairs Comes Ready to Use.\r\nBuy With Confidence: Designed and Manufactured by Nisha Furniture. The Trusted Source for Stylish Furniture for Every Taste and Budget.'),
(3, 1, 4, 6, 'Furnilife Sliding Wardrobe 4 Doors with Mirror, Brown and Off White Color', 1, 35000.00, 6300.00, 7700.00, 33600.00, 'This wardrobe is suitable for many occasions, you can put it in children`s or adult`s bedroom, dressing room, living room, office, school, hospital, etc\r\nMade with engineered wood'),
(4, 2, 4, 1, 'Modern Classic 4 Seater Leatharrate Tufted 3+1+1Footrest Chesterfield Sofa', 1, 28998.00, 5219.64, 5799.60, 28418.04, 'No assembly required the product is delivered in a preassembled state.(only legs to be fix by the customer)Our delivery service is very fast, we deliver the order to the customer with 5 days guarantee after dispatch.\r\nModern Chesterfield Design: Designed with the traditional moden Chesterfield style in mind, this piece hits all the key elements, with deep button tufting, nailhead accents, scrolled arms and stylish legs.\r\nDIMENSION: 190 Lx 80Dx 80H.\r\nSeating Capacity: 3 Seat;'),
(5, 3, 4, 2, 'My Art Design - Scandinavian Chair with Padded & Solid Wood Oak Legs... ', 1, 3300.00, 594.00, 726.00, 3168.00, 'Provide best feel and comfert. Build Quality is good and used wood quality is best.'),
(6, 4, 3, 1, 'Modern Classic 4 Seater Leatharrate Tufted 3+1+1Footrest Chesterfield Sofa', 1, 28998.00, 5219.64, 5799.60, 28418.04, 'No assembly required the product is delivered in a preassembled state.(only legs to be fix by the customer)Our delivery service is very fast, we deliver the order to the customer with 5 days guarantee after dispatch.\r\nModern Chesterfield Design: Designed with the traditional moden Chesterfield style in mind, this piece hits all the key elements, with deep button tufting, nailhead accents, scrolled arms and stylish legs.\r\nDIMENSION: 190 Lx 80Dx 80H.\r\nSeating Capacity: 3 Seat;'),
(7, 5, 4, 9, 'Criss Cross Chair - Stylish PU Leather Accent Chair for Long Hours Sitting Comfort', 1, 9900.00, 1782.00, 1485.00, 10197.00, '✅RELAX IN STYLE: High density sponge-filled cushion and backrest will give you the feeling of sitting on the sofa, very comfortable and not easily deformed. The widened and soft seat executive chair allows you to sit comfortably in various positions including cross-legged for moments of relaxation while working or thinking.\r\n✅PREMIUM PU LEATHER: Upholstered in top-grain faux leather, the seat and backrest are durable for long-lasting use. Each support foot comes with a non-slip natural rubber foot pad to prevent scratches and slips. Our leather office chairs for work is waterproof, easy to clean, wear-resistant and durable.\r\n'),
(8, 6, 4, 9, 'Criss Cross Chair - Stylish PU Leather Accent Chair for Long Hours Sitting Comfort', 1, 9900.00, 1782.00, 1485.00, 10197.00, '✅RELAX IN STYLE: High density sponge-filled cushion and backrest will give you the feeling of sitting on the sofa, very comfortable and not easily deformed. The widened and soft seat executive chair allows you to sit comfortably in various positions including cross-legged for moments of relaxation while working or thinking.\r\n✅PREMIUM PU LEATHER: Upholstered in top-grain faux leather, the seat and backrest are durable for long-lasting use. Each support foot comes with a non-slip natural rubber foot pad to prevent scratches and slips. Our leather office chairs for work is waterproof, easy to clean, wear-resistant and durable.\r\n'),
(9, 7, 4, 5, 'Altamore Engineered Wood 2 Door Wardrobe with Drawer (Wenge Finish)', 1, 11900.00, 2142.00, 2499.00, 11543.00, 'Included Components: 1 Wardrobe, 1 Drawer\r\nProduct Dimensions ( in Centimeters) : 80.3 x 45.3 x 182\r\nStorage Details: Comes with 4 Shelves and a drawer which can be installed by the seller'),
(10, 8, 3, 2, 'My Art Design - Scandinavian Chair with Padded & Solid Wood Oak Legs... ', 1, 3300.00, 594.00, 726.00, 3168.00, 'Provide best feel and comfert. Build Quality is good and used wood quality is best.'),
(11, 9, 3, 7, 'Sheesham Wooden Dining Set 6 Seater Dining Table with Chairs & Bench ', 1, 33900.00, 6102.00, 7458.00, 32544.00, 'Material: Wood- 100% Solid Sheesham Wood, Color- Walnut Finish (Glossy).\r\nAssembly: Only Table and Bench Requires Assembly(Comes With Tools & Self-Assembly Instructions & Based on Customer Basis), Chairs Comes Ready to Use.\r\nBuy With Confidence: Designed and Manufactured by Nisha Furniture. The Trusted Source for Stylish Furniture for Every Taste and Budget.'),
(12, 10, 6, 8, 'FURNY Braustin 6 Seater Fabric LHS L Shape Sofa Set (Aqua Blue)', 1, 32500.00, 5850.00, 3250.00, 35100.00, '6 Seater Sofa Set for Living Rooms | PRIMARY MATERIAL- Solid Wood & high density Supersoft Air Foam -::- UPHOLSTERY MATERIAL- Premium Fabric -::- SEATING CAPACITY-6 seater\r\nFurny Sofas give best comfortable seating experience. Our Sofas are designed with High Quality which lasts longer. We have huge Catalogue of L shape Sofa Sets, 3 seater sofas, 2 seater sofas, Sofa Cum beds, Recliner Sofas, Beds, Mattresses, Dining Table Sets, browse & get the best fit for your Homes.\r\nAssembly: Do it By Yourself.'),
(13, 10, 6, 2, 'My Art Design - Scandinavian Chair with Padded & Solid Wood Oak Legs... ', 1, 3300.00, 594.00, 726.00, 3168.00, 'Provide best feel and comfert. Build Quality is good and used wood quality is best.'),
(14, 10, 6, 10, 'Stool', 1, 5000.00, 900.00, 750.00, 5150.00, 'The nightstand is a modern take on a retro look, with a sleek mid-century modern design that adds a touch of vintage styling to your bedroom.\r\nQuality details include floral carved top, handcarved drawer front,\r\nThis end table provides plenty of storage space for your bedtime essentials.\r\nMultifunctional Use, the simple and compact design of this nightstan; It measures 21\" tall , 14\" wide and 12\" depth'),
(15, 11, 7, 8, 'FURNY Braustin 6 Seater Fabric LHS L Shape Sofa Set (Aqua Blue)', 1, 32500.00, 5850.00, 3250.00, 35100.00, '6 Seater Sofa Set for Living Rooms | PRIMARY MATERIAL- Solid Wood & high density Supersoft Air Foam -::- UPHOLSTERY MATERIAL- Premium Fabric -::- SEATING CAPACITY-6 seater\r\nFurny Sofas give best comfortable seating experience. Our Sofas are designed with High Quality which lasts longer. We have huge Catalogue of L shape Sofa Sets, 3 seater sofas, 2 seater sofas, Sofa Cum beds, Recliner Sofas, Beds, Mattresses, Dining Table Sets, browse & get the best fit for your Homes.\r\nAssembly: Do it By Yourself.'),
(16, 11, 7, 10, 'Stool', 1, 5000.00, 900.00, 750.00, 5150.00, 'The nightstand is a modern take on a retro look, with a sleek mid-century modern design that adds a touch of vintage styling to your bedroom.\r\nQuality details include floral carved top, handcarved drawer front,\r\nThis end table provides plenty of storage space for your bedtime essentials.\r\nMultifunctional Use, the simple and compact design of this nightstan; It measures 21\" tall , 14\" wide and 12\" depth'),
(17, 11, 7, 5, 'Altamore Engineered Wood 2 Door Wardrobe with Drawer (Wenge Finish)', 1, 11900.00, 2142.00, 2499.00, 11543.00, 'Included Components: 1 Wardrobe, 1 Drawer\r\nProduct Dimensions ( in Centimeters) : 80.3 x 45.3 x 182\r\nStorage Details: Comes with 4 Shelves and a drawer which can be installed by the seller'),
(18, 12, 8, 1, 'Modern Classic 4 Seater Leatharrate Tufted 3+1+1Footrest Chesterfield Sofa', 1, 28998.00, 5219.64, 5799.60, 28418.04, 'No assembly required the product is delivered in a preassembled state.(only legs to be fix by the customer)Our delivery service is very fast, we deliver the order to the customer with 5 days guarantee after dispatch.\r\nModern Chesterfield Design: Designed with the traditional moden Chesterfield style in mind, this piece hits all the key elements, with deep button tufting, nailhead accents, scrolled arms and stylish legs.\r\nDIMENSION: 190 Lx 80Dx 80H.\r\nSeating Capacity: 3 Seat;'),
(19, 13, 9, 7, 'Sheesham Wooden Dining Set 6 Seater Dining Table with Chairs & Bench ', 1, 33900.00, 6102.00, 7458.00, 32544.00, 'Material: Wood- 100% Solid Sheesham Wood, Color- Walnut Finish (Glossy).\r\nAssembly: Only Table and Bench Requires Assembly(Comes With Tools & Self-Assembly Instructions & Based on Customer Basis), Chairs Comes Ready to Use.\r\nBuy With Confidence: Designed and Manufactured by Nisha Furniture. The Trusted Source for Stylish Furniture for Every Taste and Budget.'),
(20, 13, 9, 9, 'Criss Cross Chair - Stylish PU Leather Accent Chair for Long Hours Sitting Comfort', 2, 9900.00, 1782.00, 1485.00, 10197.00, '✅RELAX IN STYLE: High density sponge-filled cushion and backrest will give you the feeling of sitting on the sofa, very comfortable and not easily deformed. The widened and soft seat executive chair allows you to sit comfortably in various positions including cross-legged for moments of relaxation while working or thinking.\r\n✅PREMIUM PU LEATHER: Upholstered in top-grain faux leather, the seat and backrest are durable for long-lasting use. Each support foot comes with a non-slip natural rubber foot pad to prevent scratches and slips. Our leather office chairs for work is waterproof, easy to clean, wear-resistant and durable.\r\n'),
(21, 14, 9, 10, 'Stool', 1, 5000.00, 900.00, 750.00, 5150.00, 'The nightstand is a modern take on a retro look, with a sleek mid-century modern design that adds a touch of vintage styling to your bedroom.\r\nQuality details include floral carved top, handcarved drawer front,\r\nThis end table provides plenty of storage space for your bedtime essentials.\r\nMultifunctional Use, the simple and compact design of this nightstan; It measures 21\" tall , 14\" wide and 12\" depth');

-- --------------------------------------------------------

--
-- Table structure for table `order_tbl`
--

CREATE TABLE `order_tbl` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `country` varchar(255) NOT NULL,
  `c_fname` varchar(255) NOT NULL,
  `c_lname` varchar(255) NOT NULL,
  `c_address` text NOT NULL,
  `c_area` varchar(255) DEFAULT NULL,
  `c_state` varchar(255) NOT NULL,
  `c_postal_zip` varchar(20) NOT NULL,
  `c_email_address` varchar(255) NOT NULL,
  `c_phone` varchar(20) NOT NULL,
  `payment_mode` enum('COD','Online') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `total_gst` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_total` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `order_status` enum('Pending','Confirmed','Dispatched','Delivered','Cancelled','Rejected') DEFAULT 'Pending',
  `order_dispatch_date` timestamp NULL DEFAULT NULL,
  `order_delivered_date` timestamp NULL DEFAULT NULL,
  `order_cancel_date` timestamp NULL DEFAULT NULL,
  `order_reject_date` timestamp NULL DEFAULT NULL,
  `payment_status` enum('Pending','Paid','Failed') DEFAULT 'Pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_tbl`
--

INSERT INTO `order_tbl` (`order_id`, `user_id`, `country`, `c_fname`, `c_lname`, `c_address`, `c_area`, `c_state`, `c_postal_zip`, `c_email_address`, `c_phone`, `payment_mode`, `total_amount`, `total_gst`, `total_discount`, `final_total`, `order_date`, `order_status`, `order_dispatch_date`, `order_delivered_date`, `order_cancel_date`, `order_reject_date`, `payment_status`, `transaction_id`, `payment_date`) VALUES
(1, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Coloni , Bhakti Appartment flat no 43', 'Maharashtra', '123456', 'ram@gmail.com', '1234567898', 'COD', 97898.00, 17621.64, 20957.60, 94562.04, '2025-02-21 20:47:13', 'Confirmed', NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(2, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Appartment flat no 52', 'Maharashtra', '123456', 'ram@gmail.com', '1234567898', 'Online', 28998.00, 5219.64, 5799.60, 28418.04, '2025-02-21 20:48:44', 'Delivered', '2025-02-23 13:36:37', '2025-02-23 13:40:16', NULL, NULL, 'Paid', 'pay_PyUvwmsVBr1AQl', '2025-02-21 20:48:44'),
(3, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Appartment flat no 35', 'Maharashtra', '123454', 'ram@gmail.com', '1234567898', 'Online', 3300.00, 594.00, 726.00, 3168.00, '2025-02-21 20:52:34', 'Dispatched', '2025-02-23 13:20:33', NULL, NULL, NULL, 'Paid', 'pay_PyUzz8sbX6sIWl', '2025-02-21 20:52:34'),
(4, 3, 'India', 'Yugandhar', 'Suryawanshi', 'Amdad Tal. & Dist. Dhule.', 'In Front of Shiv mandir, House no 432', 'Maharashtra', '424301', 'yugandhar@gmail.com', '9359087068', 'Online', 28998.00, 5219.64, 5799.60, 28418.04, '2025-02-21 08:00:09', 'Delivered', '2025-02-24 11:06:00', '2025-02-24 11:06:55', NULL, NULL, 'Paid', 'pay_PygNAAdTvOhsg4', '2025-02-22 08:00:09'),
(5, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Appartment flat no 12', 'Maharashtra', '123456', 'ram@gmail.com', '1234567898', 'COD', 9900.00, 1782.00, 1485.00, 10197.00, '2025-02-22 12:34:01', 'Cancelled', '2025-02-23 13:30:41', '2025-02-23 13:31:00', '2025-02-23 13:42:38', '2025-02-23 13:31:57', 'Pending', NULL, NULL),
(6, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Appartment flat no 512', 'Maharashtra', '123456', 'ram@gmail.com', '1234567898', 'COD', 9900.00, 1782.00, 1485.00, 10197.00, '2025-02-23 15:30:51', 'Pending', NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(7, 4, 'India', 'Siya', 'Ram', 'Shree Ram Mandir Ayodhya', 'SiyaRam Appartment Flat no 124', 'Maharashtra', '123456', 'ram@gmail.com', '1234567898', 'Online', 11900.00, 2142.00, 2499.00, 11543.00, '2025-02-23 19:25:31', 'Confirmed', NULL, NULL, NULL, NULL, 'Paid', 'pay_PzGa3LE1Ztj8ff', '2025-02-23 19:25:31'),
(8, 3, 'India', 'Yugandhar', 'Suryawanshi', 'Amdad Tal. & Dist. Dhule.', 'In Front of Shiv mandir, House no 234', 'Maharashtra', '424301', 'yugandhar@gmail.com', '9359087068', 'Online', 3300.00, 594.00, 726.00, 3168.00, '2025-02-24 10:36:02', 'Dispatched', '2025-02-25 13:58:16', NULL, NULL, NULL, 'Paid', 'pay_PzW65FP35HW6oI', '2025-02-24 10:36:02'),
(9, 3, 'India', 'Yugandhar', 'Suryawanshi', 'Amdad Tal. & Dist. Dhule.', 'In Front of Shiv mandir , House no 234', 'Maharashtra', '424301', 'yugandhar@gmail.com', '9359087068', 'Online', 33900.00, 6102.00, 7458.00, 32544.00, '2025-02-24 10:48:10', 'Confirmed', NULL, NULL, NULL, NULL, 'Paid', 'pay_PzWItOIo1gr361', '2025-02-24 10:48:10'),
(10, 6, 'India', 'Chaitanya', 'Kodre', 'Tandulwadi, Latur', 'House no: 123', 'Maharashtra', '123456', 'chaitanya@gmail.com', '1234567890', 'Online', 40800.00, 7344.00, 4726.00, 43418.00, '2025-03-10 11:49:37', 'Confirmed', NULL, NULL, NULL, NULL, 'Paid', 'pay_Q54pV62ZIld7f7', '2025-03-10 11:49:37'),
(11, 7, 'India', 'Rushikesh', 'Pathade', 'Pathardi, Nagar', 'House no: 542 , near Shree Ram Madir , Pathardi', 'Maharashtra', '123456', 'rushi@gmail.com', '1234567893', 'Online', 49400.00, 8892.00, 6499.00, 51793.00, '2025-03-13 10:18:15', 'Confirmed', NULL, NULL, NULL, NULL, 'Paid', 'pay_Q6EsKnJa14fyrb', '2025-03-13 10:18:15'),
(12, 8, 'India', 'Jagdish', 'Gawali', 'Velhane , Tal and Dist. Dhule', 'House no: 342, RamSadan Nivas', 'Maharashtra', '123456', 'jagdish@gmail.com', '1234567894', 'COD', 28998.00, 5219.64, 5799.60, 28418.04, '2025-03-13 10:57:50', 'Pending', NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(13, 9, 'India', 'Akshay', 'Pawar', 'Velhane, Tal. and Dist. Dhule', 'House no:321', 'Maharashtra', '123456', 'akshu@gmail.com', '1234567894', 'COD', 43800.00, 7884.00, 8943.00, 42741.00, '2025-03-13 16:08:51', 'Pending', NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(14, 9, 'India', 'Akshay', 'Pawar', 'Velhane, Tal. and Dist. Dhule', 'House no:321', 'Maharashtra', '123456', 'akshu@gmail.com', '1234567894', 'Online', 5000.00, 900.00, 750.00, 5150.00, '2025-03-13 16:12:28', 'Dispatched', '2025-03-13 16:13:03', NULL, NULL, NULL, 'Paid', 'pay_Q6KuWYkty3E5og', '2025-03-13 16:12:28');

-- --------------------------------------------------------

--
-- Table structure for table `our_team`
--

CREATE TABLE `our_team` (
  `member_id` int(11) NOT NULL,
  `member_name` varchar(300) DEFAULT NULL,
  `member_position` varchar(400) DEFAULT NULL,
  `member_details` text DEFAULT NULL,
  `member_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `our_team`
--

INSERT INTO `our_team` (`member_id`, `member_name`, `member_position`, `member_details`, `member_image`) VALUES
(1, 'Yugandhar Marathe', 'CEO', 'MCA, Full Stack Developer', '1737540769912_study.jpg'),
(2, 'Shahadev Warkhede', 'Employee', 'BCA, Full Stack Developer', '1737544547071_IMG_20230819_152131.jpg'),
(3, 'Chaitanya Kodre', 'Manager', 'MCA', '1737541751690_1732680223275.jpg'),
(4, 'Rushikesh Pathade', 'Manager', 'MCA, Full Stack Developer', '1741700280186_IMG_20231125_171737.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_type_id` int(11) DEFAULT NULL,
  `product_name` text DEFAULT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `duplicate_price` decimal(10,2) DEFAULT NULL,
  `product_size` varchar(200) DEFAULT NULL,
  `product_color` varchar(70) DEFAULT NULL,
  `product_lable` varchar(200) DEFAULT NULL,
  `product_details` text DEFAULT NULL,
  `product_image` text DEFAULT NULL,
  `product_brand` varchar(400) NOT NULL,
  `product_weight` varchar(255) NOT NULL,
  `no_of_pieces` varchar(100) NOT NULL,
  `product_pattern` varchar(255) NOT NULL,
  `product_origin` varchar(255) NOT NULL,
  `product_material` varchar(255) NOT NULL,
  `product_warranty` varchar(255) NOT NULL,
  `product_care_instructions` text NOT NULL,
  `additional_details` text NOT NULL,
  `gst_percentage` decimal(5,2) DEFAULT 0.00,
  `discount_percentage` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_type_id`, `product_name`, `product_price`, `duplicate_price`, `product_size`, `product_color`, `product_lable`, `product_details`, `product_image`, `product_brand`, `product_weight`, `no_of_pieces`, `product_pattern`, `product_origin`, `product_material`, `product_warranty`, `product_care_instructions`, `additional_details`, `gst_percentage`, `discount_percentage`) VALUES
(1, 1, 'Modern Classic 4 Seater Leatharrate Tufted 3+1+1Footrest Chesterfield Sofa', 28998.00, 45999.00, '198.1D x 73.7W x 68.6H Centimeters', '#31271c', 'Recently  In Trending', 'No assembly required the product is delivered in a preassembled state.(only legs to be fix by the customer)Our delivery service is very fast, we deliver the order to the customer with 5 days guarantee after dispatch.\r\nModern Chesterfield Design: Designed with the traditional moden Chesterfield style in mind, this piece hits all the key elements, with deep button tufting, nailhead accents, scrolled arms and stylish legs.\r\nDIMENSION: 190 Lx 80Dx 80H.\r\nSeating Capacity: 3 Seat;', '1738325273295_sofa4.1.jpg,1738325273296_sofa4.2.jpg,1738325273296_sofa4.3.jpg,1738325273296_sofa4.4.jpg,1738325273296_sofa4.5.jpg,1738325273296_sofa4.6.jpg,1738325273296_sofa4.7.jpg', 'Furni', '80 Kg', '1', 'Solid', 'India', '‎Faux Leather & Wooden', '1 Year', 'Wipe Clean with Dry Cloth. For tougher stains, use a mild soap and water solution with a soft brush. Always test cleaning solutions on a small, hidden area first. Avoid using harsh chemicals or abrasive materials. Contact Furny for specific care instructions.', 'The button tufted stitching in the chaise offers an extra touch of sophistication that enhances its contemporary design. The diamond stitch pattern adds a bit of texture without sacrificing any comfort.\r\nThe seat, back and armrests are thickly padded, which makes the chaise lounge very comfortable, and the sturdy wooden feet contribute to the stability of the construction\r\nDURABLE DESIGN - A naturally strong frame is wrapped in supportive foam padding and durable polyester fabric, it has a maximum weight capacity of 498.2 lbs; the cushions are secured to the frame and are not removable.\r\n[Customer Guarantee] We want all of our customers to feel 100% satisfied. If you have any questions, please email us in time, we guarantee to reply within 24 hours and give you a satisfactory reply.', 18.00, 20.00),
(2, 2, 'My Art Design - Scandinavian Chair with Padded & Solid Wood Oak Legs... ', 3300.00, 5999.00, '42D x 47W x 82H Centimeters', '#d2ba98', 'Recently  In Most Trending', 'Provide best feel and comfert. Build Quality is good and used wood quality is best.', '1738322884789_chair1.1.jpg,1738322884789_chair1.3.jpg,1738322884789_chair1.5.jpg', 'Generic', '60 Kg', '1', 'Solid', 'India', 'Iron And Fibric', '30 Days', 'Wipe Clean Only.', 'My Art Design - Scandinavian Chair with Padded & Solid Wood Oak Legs... Chair for Cafe, Home, Hotel & Office (White Color Chair) (White)', 18.00, 22.00),
(5, 3, 'Altamore Engineered Wood 2 Door Wardrobe with Drawer (Wenge Finish)', 11900.00, 28000.00, '45.3D x 80.3W x 182H Centimeters', '#413730', 'Recently Added', 'Included Components: 1 Wardrobe, 1 Drawer\r\nProduct Dimensions ( in Centimeters) : 80.3 x 45.3 x 182\r\nStorage Details: Comes with 4 Shelves and a drawer which can be installed by the seller', '1738323610561_almirah1.1.jpg,1738323610562_almirah1.2.jpg,1738323610562_almirah1.3.jpg,1738323610562_almirah1.4.jpg,1738323610562_almirah1.5.jpg,1738323610562_almirah1.6.jpg', 'Furni', '54.5 Kg', '1', '‎Metal', 'India', 'Engineered Wood', '1 Year', 'Dry Clean Only.', 'Warranty: 1 year on manufacturing defects Finish: Wenge\r\nSpecial Features: - Made with 15 MM European standard engineered wood - Being termite-resistant, the product also ensures longevity and durability. Featuring full edging and secured with lamination, prevents the build-up of moisture. Also, it is easy to clean', 18.00, 21.00),
(6, 3, 'Furnilife Sliding Wardrobe 4 Doors with Mirror, Brown and Off White Color', 35000.00, 47000.00, '0.55D x 2W x 2H Meters', '#dca456', 'Recently  In Trending', 'This wardrobe is suitable for many occasions, you can put it in children`s or adult`s bedroom, dressing room, living room, office, school, hospital, etc\r\nMade with engineered wood', '1738324061107_almirah2.1.jpg,1738324061107_almirah2.2.jpg,1738324061107_almirah2.3.jpg,1738324061107_almirah2.4.jpg', 'Furnilife', '60 Kg', '1', 'Solid', 'India', 'Engineered Wood', '6 Months', 'Dry Clean Only', 'Easy to clean.\r\n‎1 Wardrobe with 4 sliding doors.\r\n ', 18.00, 22.00),
(7, 6, 'Sheesham Wooden Dining Set 6 Seater Dining Table with Chairs & Bench ', 33900.00, 45000.00, '57*35*30 Depth : 35.4 inches', '#6c5951', 'Most Dimanded', 'Material: Wood- 100% Solid Sheesham Wood, Color- Walnut Finish (Glossy).\r\nAssembly: Only Table and Bench Requires Assembly(Comes With Tools & Self-Assembly Instructions & Based on Customer Basis), Chairs Comes Ready to Use.\r\nBuy With Confidence: Designed and Manufactured by Nisha Furniture. The Trusted Source for Stylish Furniture for Every Taste and Budget.', '1738324658128_dining2.1.jpg,1738324658129_dining2.2.jpg,1738324658129_dining2.3.jpg,1738324658129_dining2.4.jpg,1738324658129_dining2.5.jpg,1738324658129_dining2.6.jpg,1738324658129_dining2.7.jpg', 'Furni', '130 Kg', '1', 'Solid', 'India', 'Wooden', '6 Months', 'wipe with dry clothes, keep away from direct sunlight', 'Size: Table- Length( 57 inches), Width(35.4 inches), Height( 30 inches) Chairs- Length(17.5 inches) Width(17.5 inches), Height(41 inches) Bench- length(52 inches), width(16 inches), height(18 inches).\r\nSeating Height- 18 inches, Beige Color Cushion For Seating, Rubber Bush is Provided Under All Items Legs.\r\nSheesham Wooden Dining Set 6 Seater Dining Table with Chairs & Bench | Solid Wood Dining Table for Home & Dining Room Furniture in Walnut Finish', 18.00, 22.00),
(8, 1, 'FURNY Braustin 6 Seater Fabric LHS L Shape Sofa Set (Aqua Blue)', 32500.00, 81000.00, '259D x 167.6W x 81.3H Centimeters', '#71b7af', 'Trending', '6 Seater Sofa Set for Living Rooms | PRIMARY MATERIAL- Solid Wood & high density Supersoft Air Foam -::- UPHOLSTERY MATERIAL- Premium Fabric -::- SEATING CAPACITY-6 seater\r\nFurny Sofas give best comfortable seating experience. Our Sofas are designed with High Quality which lasts longer. We have huge Catalogue of L shape Sofa Sets, 3 seater sofas, 2 seater sofas, Sofa Cum beds, Recliner Sofas, Beds, Mattresses, Dining Table Sets, browse & get the best fit for your Homes.\r\nAssembly: Do it By Yourself.', '1738322254711_sofa3.1.jpg,1738322254712_sofa3.2.jpg,1738322254712_sofa3.3.jpg,1738322254712_sofa3.4.jpg,1738322254712_sofa3.5.jpg', 'Furni', '60 Kg', '1', 'Solid', 'India', 'Foam , Wooden', '2 Year', 'Wipe Clean with Dry Cloth. For tougher stains, use a mild soap and water solution with a soft brush. Always test cleaning solutions on a small, hidden area first. Avoid using harsh chemicals or abrasive materials. Contact Furny for specific care instructions.', 'Furny Sofas give best comfortable seating experience. Our Sofas are designed with High Quality which lasts longer. We have huge Catalogue of L shape Sofa Sets, 3 seater sofas, 2 seater sofas, Sofa Cum beds, Recliner Sofas, Beds, Mattresses, Dining Table Sets, browse & get the best fit for your Homes.\r\nContact Furny for any questions related to customization or any other queries Please expect an unevenness of up to 1inch in the product due to differences in surfaces and floor levels. The color of the product may vary slightly compared to the picture displayed on your screen. PC/Laptop monitor or mobile display has a different capability to display colors, and every individual may see these colors differently. This is due to lighting, pixel quality and color settings.\r\nFurny offers Best Furniture with sturdy and durable design and we are devote to provide high quality Furniture.', 18.00, 10.00),
(9, 2, 'Criss Cross Chair - Stylish PU Leather Accent Chair for Long Hours Sitting Comfort', 9900.00, 15999.00, '49D x 57W x 90.5H Centimeters', '#c6b9b9', 'Recently  In Trending', '✅RELAX IN STYLE: High density sponge-filled cushion and backrest will give you the feeling of sitting on the sofa, very comfortable and not easily deformed. The widened and soft seat executive chair allows you to sit comfortably in various positions including cross-legged for moments of relaxation while working or thinking.\r\n✅PREMIUM PU LEATHER: Upholstered in top-grain faux leather, the seat and backrest are durable for long-lasting use. Each support foot comes with a non-slip natural rubber foot pad to prevent scratches and slips. Our leather office chairs for work is waterproof, easy to clean, wear-resistant and durable.\r\n', '1738326679763_chair2.1.jpg,1738326679764_chair2.2.jpg,1738326679764_chair2.3.jpg,1738326679764_chair2.4.jpg,1738326679764_chair2.5.jpg,1738326679764_chair2.6.jpg', 'Furni', '21 Kg', '1', 'Solid', 'India', '‎Leather and Steel', '3 Months', 'Wipe Clean with Dry Cloth.', '✅VERSATILE SEATING: From the living room to the home office, this chair brings luxurious comfort wherever you need it with its versatile design that accommodates different activities. You can use the powerful lever to adjust the seat height or keep the backrest upright, and turn the knob under the seat to control the tilt tension.\r\n✅CONTEMPORARY DESIGN: With clean lines and a minimalist aesthetic, this chair complements modern interiors in various spaces like the home office, living area or guest room. This desk chair no wheels also has a non-slip bottom design, which can protect your floor in all aspects.\r\n✅STURDY STEEL FRAME: Supported by a heavy-duty steel frame, the chair provides stability for weights up to 100 kg while its padded armrests offer additional support. The seat of this office chair can rotate 360 degrees, making the workspace more convenient.\r\n', 18.00, 15.00),
(10, 15, 'Stool', 5000.00, 6000.00, '31D x 34W x 53H Centimeters', '#a54322', 'Wooden', 'The nightstand is a modern take on a retro look, with a sleek mid-century modern design that adds a touch of vintage styling to your bedroom.\r\nQuality details include floral carved top, handcarved drawer front,\r\nThis end table provides plenty of storage space for your bedtime essentials.\r\nMultifunctional Use, the simple and compact design of this nightstan; It measures 21\" tall , 14\" wide and 12\" depth', '1738327194284_stool1.1.jpg,1738327194284_stool1.2.jpg,1738327194284_stool1.3.jpg,1738327194284_stool1.4.jpg', 'Furni', '60 Kg', '1', 'Solid', 'India', 'Wood', '6 Months', 'Wipe Clean Only.', 'Multifunctional Use, the simple and compact design of this nightstan; It measures 21\" tall , 14\" wide and 12\" depth.\r\nMaterial Type: Mango Wood; Assembly Instructions: Already Assembled; Size Name: Medium; Item Shape: Rectangle', 18.00, 15.00),
(11, 1, 'Single Sofa', 9000.00, 10000.00, '5x3', '#477657', 'Most Dimanded', 'Nice Product ', '1738062876474_sofa.png', 'Furni', '60 Kg', '1', 'Solid and Metal', 'India', 'Foam , Wooden', '1 Year', 'Dry Clean Only', 'Wood quality is Good becouse Sandle wood is used', 18.00, 22.00),
(12, 1, 'Prime Sofa', 32000.00, 45000.00, '2x1.7x1.7x Ft.', '#5a381c', 'Recently  In Trending', 'This is best build quality product and look primium and feel comfertable.\r\nThe seat, back and armrests are thickly padded, which makes the chaise lounge very comfortable, and the sturdy wooden feet contribute to the stability of the construction.', '1738327598687_sofa2.1.webp,1738327598687_sofa2.2.webp,1738327598687_sofa2.3.webp,1738327598687_sofa2.4.webp,1738327598687_sofa2.5.webp,1738327598687_sofa2.6.webp,1738327598687_sofa2.7.webp', 'Furni', '45 Kg', '1', 'Solid', 'India', 'Wooden', '6 Months', 'Wipe Clean with Dry Cloth. For tougher stains, use a mild soap and water solution with a soft brush. Always test cleaning solutions on a small, hidden area first. Avoid using harsh chemicals or abrasive materials. Contact Furny for specific care instructions.', 'Nice Product', 18.00, 21.00),
(13, 2, 'Stylux Premium Ergonomic Office Chair | Patented SmartGRID Technology', 15999.00, 359999.00, '49D x 62W x 124H Centimeters', '#89f0ef', 'Recently Added', 'Patented SmartGRID Technology: Our ergonomic high back chair incorporates the patented SmartGRID Technology, which offers pressure-free support to your buttocks and cradles your tailbone. The design of the office chair enhances your natural sitting posture, ensuring optimum comfort. The SmartGRID seat evenly distributes your weight, promoting healthy spinal alignment throughout the day.\r\nSpinePro Cushioned Lumbar Support: The ergonomic high back chair features the SpinePro Cushioned Lumbar Support, designed to support the natural curve of your spine and alleviate back pain by providing full support to your lumbar region. The contoured cushion of the office chair enhances circulation and reduces stress on your lower back.', '1738328080883_chair3.1.jpg,1738328080883_chair3.3.jpg,1738328080883_chair3.4.jpg,1738328080883_chair3.5.jpg', 'Furni', '21 Kg', '1', 'Solid Black & Blue', 'India', 'Smart GRID', '3 Year', '‎Wipe Clean', 'Super Lounge Dual Tilt Mechanism: Ergonomic high back office chair features a super lounge recline at 135 seat tilt for your ultimate comfort. Our dual lever mechanism lets you control seat height and backrest angle with ease. Find your perfect position in any situation with adjustable height and angles. Get ready to sit in comfort like never before.\r\nHeavy Duty Base Structure: The office chairs come with a heavy-duty nylon-finished dual caster & nylon wheelbase which is BIFMA certified Dated 20 April 2025. The wheels of the computer chair come with 360 swivel movement and are made of Anti-Scratch properties for easy movement on any surface.\r\nWarranty: Stylux ergo high back office chair is proudly made in India. It comes with a 3-year hassle-free warranty from the manufacturer', 18.00, 20.00),
(14, 6, 'SONA ART & CRAFTS Modern Furniture Solid Sheesham Wood Dining Table', 16299.00, 45000.00, '6 x 4', '#5b4425', 'Recently Added', 'Material : This Dining Table Set Is Fully Made By Solid Sheesham Wood , Table Top - Solid Sheesham Wood | Chair - Solid Sheesham Wood | This Dining Set Available in 3 More Different Color - Walnut , Honey Teak and Mahogany, Visit our all listing and choose your Matching Color .\r\nMulti Purpose Dining Table Set : Your can Enjoy your Dinner with Family on this Solid wood dining set, this is a 4 Seater Dining set , Dining table with 4 chair , Solid wood dining set | Also can use as Study Table | Working Table | Work From Home Table Dining table Set is Best Gift for Housewarming And Wedding', '1738321898508_dining1.1.jpg,1738321898509_dining1.3.jpg,1738321898509_dining1.4.jpg,1738321898509_dining1.5.jpg', 'Furni', '90 Kg', '1', 'Solid', 'India', 'Sheesham Wood', '1 Years', 'Dont wash this product.', 'Product 1 Dining Table With 4 Chairs.\r\nImportnt Note : Installation And Assembly Are Based On DO IT YOURSELF Bases, And It Requires Basic Asambely. Seller Will Not Provided Charges And Services For That.\r\nMulti Purpose Dining Table Set : Your can Enjoy your Dinner with Family on this Solid wood dining set, this is a 4 Seater Dining set , Dining table with 4 chair , Solid wood dining set | Also can use as Study Table | Working Table | Work From Home Table Dining table Set is Best Gift for Housewarming And Wedding\r\nWe Provide Quality Products. Every product goes through a tough quality check to ensure that we can serve it our best way. Only Made in India Products.', 0.00, 0.00),
(15, 12, 'VIKI | Dressing Table with Mirror and Open Shelf DIY | Frosty White', 2999.00, 4949.00, '24D x 70W x 120H Centimeters', '#e6d1d1', 'Recently Added', 'PRODUCT SIZE : Dresser dimensions 120cms(H)x70cms(W)x20cms(D)Compact design with a depth of 20cm, a spacious width of 70cm, and a tall height of 120cm, creating a functional and stylish dressing area.\r\nMATERIALS USED : We utilize termite, borer and scratch resistant boards from Associate Decor, India`s largest particle board manufacturing unit. Our hardware components are sourced exclusively from reputed companies. Our Products are Made in India\r\nFEATURES : The designer dressing table offers a mirrored vanity with storage. It has a modern style, compact size, and luxury finish. Perfect for your bedroom, it accommodates cosmetics and provides ample storage space.', '1738321085070_dressing1.1.jpg,1738321085070_dressing1.2.jpg,1738321085070_dressing1.3.jpg,1738321085070_dressing1.4.jpg,1738321085070_dressing1.5.jpg,1738321085070_dressing1.6.jpg', 'Furni', '15 Kg', '1', 'Solid', 'India', 'Engineered Wood', '1 Years', 'Dry Clean Only', 'ASSEMBLY SERVICE : This product doesn`t come with free assembly. You`ll need to assemble it yourself using the provided DIY instructions and hardware. We recommend hiring a carpenter if you prefer professional assembly assistance.\r\nCARE & INSTRUCTION : Wipe clean with damp cloth and mild cleaner, avoiding harsh chemicals. Dry with clean cloth. Avoid excessive moisture and direct sunlight to prevent damage. Use trays or organizers for accessories. Lift, don`t drag when moving. Regularly inspect and address loose hardware', 18.00, 16.00),
(16, 1, 'Sofa', 12000.00, 22000.00, '2x1.7x1.7x Ft.', '#000000', 'Trending', 'Good Product ', '1738253633290_sofa1.1.webp,1738253633291_sofa1.2.webp,1738253633292_sofa1.3.webp,1738253633292_sofa1.4.webp,1738253633292_sofa1.5.webp,1738253633292_sofa1.6.webp', 'Furni', '45 Kg', '1', 'Solid', 'France', 'Spanch , Wood', '1 Year', 'Dry Clean Only', 'Nice Look', 18.00, 22.00),
(17, 8, 'Prime TV Unit ', 12000.00, 15000.00, '28x79x34x42 Inch.', '#fe6262', 'Trending', 'This is highly demanded and this product specially build using unscrachable plywood and that why it is long lasting Product', '1740155738393_temp_img.avif', 'Furnilife', '15 Kg', '1', 'Solid', 'India', 'Plywood', '1 Year', 'Dry Clean Only', 'This product is Long lasting and give rich look to your home.', 18.00, 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `product_type`
--

CREATE TABLE `product_type` (
  `product_type_id` int(11) NOT NULL,
  `product_type_name` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_type`
--

INSERT INTO `product_type` (`product_type_id`, `product_type_name`) VALUES
(1, 'Sofa'),
(2, 'Chair'),
(3, 'Almira '),
(4, 'Table'),
(5, 'Bed'),
(6, 'Dining Set'),
(7, 'Desk Chair'),
(8, 'TV Unit'),
(9, 'Side Table'),
(10, 'Mirror'),
(11, 'Shoe Rack'),
(12, 'Dressing Table'),
(14, 'Sealings'),
(15, 'Stool');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `country` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `heading` text DEFAULT NULL,
  `review_img` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `product_id`, `user_id`, `rating`, `country`, `comment`, `heading`, `review_img`, `created_at`) VALUES
(11, 7, 4, 5, 'India', 'This product are really good and this product build quality are really fantastic.', 'Just go for it . It is fantastic Product', '1739732620431_dining2.1.jpg,1739732620432_dining2.2.jpg,1739732620432_dining2.3.jpg', '2025-02-16 19:03:40'),
(12, 1, 4, 4, 'India', 'This product are really fantastic it give rich look to home', 'Just go for it . ', '1739821107885_sofa4.1.jpg,1739821107886_sofa4.2.jpg,1739821107887_sofa4.3.jpg', '2025-02-17 19:38:27'),
(13, 1, 4, 5, 'India', 'I used this product upto 1 year. This product build quality are awesome and upto now this product are shine as it is.', 'Just go for it . It is fantastic Product', '1740205412491_sofa4.1.jpg,1740205412493_sofa4.5.jpg,1740205412493_sofa4.6.jpg', '2025-02-22 06:23:32'),
(14, 2, 4, 4, 'India', 'Good Product', 'Just go for it and specifically I would say the seller is fabulous', '1740205567685_chair1.1.jpg', '2025-02-22 06:26:07'),
(15, 8, 6, 4, 'India', 'This Product Build Quality is good and look are fantastic. this product gives rich look to your sweet house. i suggest you to buy this product.', 'Just go for it.', '1741606244929_sofa3.1.jpg,1741606244930_sofa3.3.jpg,1741606244931_sofa3.4.jpg', '2025-03-10 11:30:44'),
(16, 2, 6, 5, 'India', 'Just go for it and specifically I would say the seller is fabulous.\r\nI order this product before two days and within two day product are delevered also.\r\nProduct Look are awesome.\r\nWhen we sit on this chair fill comfertable and relax.', 'Just go for it and specifically I would say the seller is fabulous.', '1741606438060_chair1.1.jpg', '2025-03-10 11:33:58'),
(17, 5, 6, 5, 'India', 'Product build quality is good and Primium look', 'Good Product', '1741606903280_almirah1.1.jpg,1741606903281_almirah1.4.jpg', '2025-03-10 11:41:43'),
(18, 6, 6, 5, 'India', 'Nice Product, Build qaulity is good.', 'Just go for it.', '1741607059937_almirah1.png', '2025-03-10 11:44:19'),
(19, 10, 6, 4, 'India', 'This is awesome, quality is also good and look are fantastic.', 'Good Product', '1741607187900_stool1.1.jpg,1741607187901_stool1.3.jpg,1741607187902_stool1.4.jpg', '2025-03-10 11:46:27'),
(20, 1, 6, 4, 'India', 'This product are really so good. This product build quality are very good and This product look are really fantastic and awesome.', 'Just go for it and specifically I would say the seller is fabulous.', '1741612466090_sofa4.1.jpg,1741612466091_sofa4.4.jpg,1741612466092_sofa4.6.jpg', '2025-03-10 13:14:26'),
(21, 8, 7, 5, 'INDIA', 'This product is really good. It looks and Design are amazing and impressive. This product build quality is awesome.', 'Good Product', '1741860843813_sofa3.1.jpg,1741860843814_sofa3.3.jpg', '2025-03-13 10:14:03'),
(22, 10, 7, 5, 'INDIA', 'I like this product its looks and Build quality are amesing.', 'First Product', '1741860964755_stool1.1.jpg,1741860964757_stool1.4.jpg', '2025-03-13 10:16:04'),
(23, 1, 8, 5, 'INDIA', 'This product look and design are so awesome. Specially this product packing are really impressive. The product quality and used material are good.', 'Just go for it and specifically I would say the seller is good', '1741863355980_sofa4.1.jpg,1741863355981_sofa4.4.jpg,1741863355982_sofa4.6.jpg', '2025-03-13 10:55:55'),
(24, 7, 9, 5, 'INDIA', 'This product build quality is good. look are also fantastic.', 'Just go for it . It is fantastic Product.', '1741882000965_dining2.1.jpg,1741882000967_dining2.2.jpg', '2025-03-13 16:06:40'),
(25, 9, 9, 5, 'INDIA', 'This product is really fantastic. look are also good.', 'Just go for it.', '1741882089019_chair2.1.jpg,1741882089020_chair2.3.jpg', '2025-03-13 16:08:09');

-- --------------------------------------------------------

--
-- Table structure for table `testimonial`
--

CREATE TABLE `testimonial` (
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(500) DEFAULT NULL,
  `customer_position` text DEFAULT NULL,
  `customer_image` text DEFAULT NULL,
  `customer_massage` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonial`
--

INSERT INTO `testimonial` (`customer_id`, `customer_name`, `customer_position`, `customer_image`, `customer_massage`) VALUES
(1, 'Yugandhar Suryawanshi', 'CEO, Founder', '1737295736591_study.jpg', '“Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.”'),
(2, 'Shahadev Warkhede', 'Employee', '1737309766177_IMG_20230819_152131.jpg', '“Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.”'),
(3, 'Chaitanya Kodre', 'Manager', '1737310550393_1732680223275.jpg', '“Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.”'),
(5, 'Rushikesh Pathade', 'Manager', '1739009303110_IMG_20231125_171737.jpg', 'You Can perchase any furniture product in this website '),
(6, 'Vipul Yadav', 'Employee', '1739822225481_IMG_20231128_115346.jpg', '“Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.”');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(400) DEFAULT NULL,
  `user_mobile` varchar(15) DEFAULT NULL,
  `user_email` varchar(300) NOT NULL,
  `user_address` text DEFAULT NULL,
  `user_profile` text DEFAULT NULL,
  `user_password` varchar(450) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_mobile`, `user_email`, `user_address`, `user_profile`, `user_password`) VALUES
(3, 'Yugandhar Suryawanshi', '9359087068', 'yugandhar@gmail.com', 'Amdad Tal. & Dist. Dhule.', '1739793452719-yogi.jpg', '$2b$10$NpNPtIvl3dzTbRp4wiDmKejAiHsHQNW7lfcfDW./1K8U.ovi.m5hi'),
(4, 'Siya Ram', '1234567898', 'ram@gmail.com', 'Shree Ram Mandir Ayodhya', '1739732480355-RadheKrishna.jpg', '$2b$10$16mHGjzW6h/aFkfduThtOuXWtZeS2lN1ObTprKeK9hDIVNvKwUN/6'),
(5, 'Shahadev Warkhede', '0987654321', 'shahadev@gmail.com', NULL, NULL, '$2b$10$CPgJdhhikvQPUS4lW0jlVe8Mkw1qYAJx4rRsooRBjrltznORlNQpi'),
(6, 'Chaitanya Kodre', '12345678902', 'chaitanya@gmail.com', 'Tandulwadi, Latur', NULL, '$2b$10$gcaqeJ0HHAssW.Y9t847MetjbuNfId.qNzla3PyUAY0Zut1Hmr5fS'),
(7, 'Rushikesh Pathade', '1234567893', 'rushi@gmail.com', 'Pathardi, Nagar', NULL, '$2b$10$nZ5o5tsHnpwBTQ30hwSqaujMsoiEjiP00OvPfncxAf26uZY5Mm9Ri'),
(8, 'Jagdish Gawali', '1234567894', 'jagdish@gmail.com', 'Velhane, Tal and Dist. Dhule', NULL, '$2b$10$eMVVPM9u/ZRKY6lHR/7gX./bemdbVy0wmxlopcIJbYkrc3pmFggra'),
(9, 'Akshay Pawar', '1234567894', 'akshu@gmail.com', 'Velhane, Tal. and Dist. Dhule', NULL, '$2b$10$fhOktMS2Pn47SxB2wJ.zXOwYMTN0Syh0yl51AdsMM7yMuWJupEIke');

-- --------------------------------------------------------

--
-- Table structure for table `user_cart`
--

CREATE TABLE `user_cart` (
  `user_cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriber`
--

CREATE TABLE `user_subscriber` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_subscriber`
--

INSERT INTO `user_subscriber` (`id`, `name`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Yugandhar Suryawanshi', 'yugandhar@gmail.com', 'active', '2025-03-11 14:03:21', '2025-03-11 16:11:32'),
(3, 'Chaitanya Kodre', 'chaitanya@gmail.com', 'active', '2025-03-11 16:23:47', '2025-03-11 16:24:58'),
(4, 'Akshay Pawar', 'akshu@gmail.com', 'active', '2025-03-13 16:20:10', '2025-03-13 16:20:10');

-- --------------------------------------------------------

--
-- Table structure for table `why_choose_points`
--

CREATE TABLE `why_choose_points` (
  `why_choose_points_id` int(11) NOT NULL,
  `why_choose_points_img` text DEFAULT NULL,
  `why_choose_points_name` varchar(500) DEFAULT NULL,
  `why_choose_points_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `why_choose_points`
--

INSERT INTO `why_choose_points` (`why_choose_points_id`, `why_choose_points_img`, `why_choose_points_name`, `why_choose_points_details`) VALUES
(1, '1737438391015_truck.svg', 'Fast & Free Shipping', 'Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.'),
(2, '1737439387145_bag.svg', 'Easy to Shop', 'Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.'),
(3, '1737445678467_support.svg', '24/7 Support', 'Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.'),
(5, '1737440019030_return.svg', 'Hassle Free Returns', 'Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.');

-- --------------------------------------------------------

--
-- Table structure for table `why_choose_us`
--

CREATE TABLE `why_choose_us` (
  `why_choose_us_id` int(11) NOT NULL,
  `heading` text DEFAULT NULL,
  `why_choose_img` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `why_choose_us`
--

INSERT INTO `why_choose_us` (`why_choose_us_id`, `heading`, `why_choose_img`) VALUES
(1, 'We Help You Make Modern Interior Design', '1737318476619_why-choose-us-img.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_email` (`admin_email`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`blog_id`);

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`contact_id`),
  ADD UNIQUE KEY `contact_gmail` (`contact_gmail`);

--
-- Indexes for table `interior`
--
ALTER TABLE `interior`
  ADD PRIMARY KEY (`interior_id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`order_product_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_tbl`
--
ALTER TABLE `order_tbl`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `our_team`
--
ALTER TABLE `our_team`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `product_type`
--
ALTER TABLE `product_type`
  ADD PRIMARY KEY (`product_type_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `testimonial`
--
ALTER TABLE `testimonial`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Indexes for table `user_cart`
--
ALTER TABLE `user_cart`
  ADD PRIMARY KEY (`user_cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `user_subscriber`
--
ALTER TABLE `user_subscriber`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `why_choose_points`
--
ALTER TABLE `why_choose_points`
  ADD PRIMARY KEY (`why_choose_points_id`);

--
-- Indexes for table `why_choose_us`
--
ALTER TABLE `why_choose_us`
  ADD PRIMARY KEY (`why_choose_us_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `blog_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `interior`
--
ALTER TABLE `interior`
  MODIFY `interior_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `order_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order_tbl`
--
ALTER TABLE `order_tbl`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `our_team`
--
ALTER TABLE `our_team`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `testimonial`
--
ALTER TABLE `testimonial`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_cart`
--
ALTER TABLE `user_cart`
  MODIFY `user_cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `user_subscriber`
--
ALTER TABLE `user_subscriber`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `why_choose_points`
--
ALTER TABLE `why_choose_points`
  MODIFY `why_choose_points_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `why_choose_us`
--
ALTER TABLE `why_choose_us`
  MODIFY `why_choose_us_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `order_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_tbl` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_products_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_tbl`
--
ALTER TABLE `order_tbl`
  ADD CONSTRAINT `order_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_cart`
--
ALTER TABLE `user_cart`
  ADD CONSTRAINT `user_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
