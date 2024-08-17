import db from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../middlewares/generateToken.js";

// Signup user
// Signup user
export const signupUser = async (req, res) => {
    const { 
        name, 
        email, 
        countryCode, 
        mobileNumber, 
        gender, 
        password, 
        countryName, 
        stateName 
    } = req.body;

    // Log the destructured data for debugging
    console.log({ name, email, countryCode, mobileNumber, gender, password, countryName, stateName });

    if (!name || !email || !password || !countryName || !stateName || !gender) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users 
            (user_name, user_email, user_country_code, user_mobile_number, user_gender, user_password, user_country_name, user_state_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [name, email, countryCode, mobileNumber, gender, hashedPassword, countryName, stateName], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Database error', error: err });
            }

            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error processing request', error: err });
    }
};


// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.user_password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const token = generateToken(user.user_id);
            res.json({ token, userId: user.user_id, userName: user.user_name });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users
export const getUsers = (req, res) => {
    const query = `
        SELECT 
            user_id, 
            user_name, 
            user_email, 
            CONCAT(user_country_code, user_mobile_number) AS contact_number, 
            user_gender, 
            user_country_name AS country, 
            user_state_name AS state, 
            created_at
        FROM users
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results);
    });
};

// Delete user
export const handleDelete = (req, res) => {
    const { userId } = req.params;

    db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    });
};

// Edit user

export const editUser = (req, res) => {
    const { userId } = req.params;
    const updatedUser = req.body;

    // Prepare the SQL query with an object for SET clause
    const sqlQuery = 'UPDATE users SET ? WHERE user_id = ?';

    db.query(sqlQuery, [updatedUser, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully' });
    });
};

//Checking email!..
export const checkEmail = (req, res) => {
    const { email } = req.body;
  
    try {
      db.query('SELECT * FROM users WHERE user_email = ?', [email], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'Email not found', exists: false });
        }
  
        // If email is found in the database
        return res.json({ exists: true, message: 'Email verified successfully' });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

//verifying the Password!..
export const updatePassword = (req, res) => {
    const { password, email } = req.body; // Assuming email is passed

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        db.query('UPDATE users SET user_password = ? WHERE user_email = ?', [hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Email not found' });
            }

            res.json({ success: true, message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
