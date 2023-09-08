/**
 -- DATABASE MIGRATION FOR jumprpak DATABASE
 This is all in one file for now as docker may not complete creation of all tables with one table creation file before trying to seed data
 which winds up running inserts for tables that do not yet exist.
 The pattern that this file should follow is:
 1.) Table with dependencies
 2.) Seed data immediately after each TABLE
 3.) Dependency/independent table creation
 4.) Dependency/independent seed data
 */

-- CREATE THE DATABASE

CREATE DATABASE IF NOT EXISTS jumprpak;

USE jumprpak;

-- TABLE: users

CREATE TABLE
    IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(50) DEFAULT '',
        lastname VARCHAR(50) DEFAULT '',
        phone VARCHAR(15) DEFAULT '',
        email VARCHAR(255) NOt NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 0
    );

INSERT INTO
    users (
        firstname,
        lastname,
        phone,
        email,
        password,
        created_at,
        updated_at,
        active
    )
VALUES (
        'Test',
        'JumprPak',
        '1234567890',
        'test@jumprpak.com',
        '$2b$12$p1.wcpUyLH2z1vZiQwgQDeb2G1mhM3EuutOIgIKTOgHNeu8H075jS',
        '2023-07-25 19:39:27',
        '2023-07-25 19:39:27',
        '1'
    );

-- TABLE: access_event_types

CREATE TABLE
    IF NOT EXISTS access_event_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type_key VARCHAR(75) NOT NULL,
        description VARCHAR(255) NOT NULL,
        UNIQUE (event_type_key)
    );

INSERT INTO
    access_event_types (event_type_key, description)
VALUES (
        'invalid_password_reset_attempt',
        'Password reset attempt was unsuccessful.'
    ), (
        'invalid_password_reset_request',
        'Password reset request was unsuccessful.'
    ), (
        'invalid_password_reset_token',
        'Password reset token was invalid or does not exist.'
    ), (
        'invalid_register_input',
        'Registration Failed: Validation errors detected.'
    ), (
        'invalid_verify_account_token',
        'Verify account token is not valid.'
    ), (
        'password_reset_success',
        'Password reset successfully.'
    ), (
        'password_reset_failure',
        'Password reset failure.'
    ), (
        'password_reset_token_created',
        'Password reset token successfully created.'
    ), (
        'user_account_created',
        'User account successfully created.'
    ), (
        'user_account_verified',
        'User account successfully verified.'
    ), (
        'user_address_added',
        'User has added an address.'
    ), (
        'user_address_deleted',
        'User has deleted an address.'
    ), (
        'user_address_set_primary',
        'User has set an address as their primary.'
    ), (
        'user_jwt_set_issued',
        'User logged in, JWT tokens issued.'
    ), (
        'user_jwt_refresh',
        'Refresh token successful. A new token set has been issued.'
    ), (
        'user_jwt_refresh_invalid',
        'Refresh token expired or invalid.'
    ), (
        'user_login_attempt',
        'User login attmpted. No matching Account Credentials.'
    ), (
        'user_login_failed',
        'User login failed. Bad Credentials.'
    ), (
        'user_login_success',
        'User has logged in from the login endpoint.'
    ), (
        'subscription_canceled',
        'Subscription was canceled.'
    ), (
        'subscription_changed',
        'Subscription was changed from a previous subscription.'
    ), (
        'subscription_completed',
        'Subscription was completed.'
    );

-- TABLE: access_logs

CREATE TABLE
    IF NOT EXISTS access_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        access_event_type_key VARCHAR(75),
        user_id INT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent VARCHAR(255) NOT NULL,
        access_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (access_event_type_key) REFERENCES access_event_types(event_type_key) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- TABLE: address_types

CREATE TABLE
    IF NOT EXISTS address_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description_short VARCHAR(255)
    );

INSERT INTO
    address_types (name, description_short)
VALUES (
        'Residential',
        'Address for any residence.'
    ), (
        'Business',
        'Address for any commercial busniss entity.'
    );

-- TABLE: user_addresses

CREATE TABLE
    IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        street VARCHAR(255) NOT NULL,
        street2 VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(10) NOT NULL,
        country VARCHAR(2) NOT NULL,
        country_long VARCHAR(100) NOT NULL,
        address_type_id INT NOT NULL,
        user_id INT NOT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        FOREIGN KEY (address_type_id) REFERENCES address_types(id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- TABLE: jwt_refresh_tokens

CREATE TABLE
    IF NOT EXISTS jwt_refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        refresh_token VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- TABLE: password_reset_tokens

CREATE TABLE
    IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        reset_token VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- TABLE: verify_account_tokens

CREATE TABLE
    IF NOT EXISTS verify_account_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        verify_token VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- TABLE: product_types

CREATE TABLE
    IF NOT EXISTS product_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_subscription TINYINT(1) DEFAULT 0
    );

INSERT INTO
    product_types (name, is_subscription)
VALUES ('Digital Subscription', 1), ('Physical', 0);

-- TABLE: products

CREATE TABLE
    IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        stripe_product_id VARCHAR(50) NOT NULL,
        stripe_api_id VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        product_type_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 0,
        FOREIGN KEY (product_type_id) REFERENCES product_types(id)
    );

INSERT INTO
    products (
        name,
        description,
        stripe_product_id,
        stripe_api_id,
        price,
        product_type_id,
        active
    )
VALUES (
        'JumprPak Basic',
        'Basic monthly subscription plan.',
        'prod_1234',
        'price_1234',
        25.00,
        1,
        1
    ), (
        'JumprPak Premium',
        'Premium monthly subscription plan.',
        'prod_1234',
        'price_1234',
        50.00,
        1,
        1
    ), (
        'JumprPak Pro',
        'Pro monthly subscription plan.',
        'prod_1234',
        'price_1234',
        125.00,
        1,
        1
    );

-- TABLE: subscription_terms

CREATE TABLE
    IF NOT EXISTS subscription_terms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        days_length INT
    );

INSERT INTO
    subscription_terms (name, days_length)
VALUES ('Weekly', 7), ('Bi-Weekly', 14), ('Monthly', 30), ('Quarterly', 90), ('Bi-Annual', 180), ('Annual', 365);

-- TABLE: products_to_subscription_terms

CREATE TABLE
    IF NOT EXISTS products_to_subscription_terms (
        product_id INT,
        subscription_term_id INT,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (subscription_term_id) REFERENCES subscription_terms(id),
        UNIQUE (
            product_id,
            subscription_term_id
        )
    );

INSERT INTO
    products_to_subscription_terms (
        product_id,
        subscription_term_id
    )
VALUES (1, 3), (2, 3), (3, 3);

-- TABLE: user_subscriptions

CREATE TABLE
    user_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        stripe_product_id VARCHAR(50),
        stripe_transaction_id VARCHAR(50) NOT NULL,
        term_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (term_id) REFERENCES subscription_terms(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
