//***************************************REQUIRE PACKAGES************************************//
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');



//***************************************PACKAGE CONFIGURE***********************************//
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//**************************************DATABASE CONNECTIVITY *******************************//
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Patient Management',
    port: 3306,
  });
  
  
  db.connect((err) => {
    if (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }
    console.log('Connected to the database');
  });
  

  //*************************************Routes*****************************************/

  const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token if present
  
    // If the token is not found, redirect or continue based on the request
    if (!token) {
      if (req.originalUrl !== '/') { // Check if it's not the login page or an exempted route
        return res.redirect('/login');  // Redirect to login if the token is missing
      } else {
        return next(); // Allow unauthenticated access to the root URL or other exempted routes
      }
    }
  
    // Verify the token
    jwt.verify(token, '&h$9a@Xq8GzBv!3JWfNcU^PzLmRtYwS2', (err, decoded) => {
      if (err) {
        // Handle token verification errors (e.g., expired or invalid token)
        console.error('Token verification failed:', err);
  
        if (req.originalUrl !== '/') {
          return res.redirect('/login'); // Redirect to login if the token is invalid
        } else {
          return next(); // Allow access for certain routes even if token is invalid (if needed)
        }
      }
  
      // Token is valid, attach the decoded userId to the request object
      req.userId = decoded.userId;
  
      // Proceed to the next middleware or route handler
      next();
    });
  }; 
  app.get('/register', (req, res) => {
    const query = 'SELECT * FROM user_authentication';
    db.query(query, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    
    // Log the received data to verify input
    console.log('Received data:', { username, password, role });
  
    try {
      // Check if username already exists
      const usernameCheckQuery = 'SELECT * FROM user_authentication WHERE username = ?';
      db.query(usernameCheckQuery, [username], async (err, usernameResults) => {
        if (err) {
          console.error('Database error while checking username:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        console.log('Username check result:', usernameResults);
  
        if (usernameResults.length > 0) {
          // Username already exists
          return res.status(400).json({ error: 'Username already exists' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Log hashed password for verification (avoid logging in production)
  
        // Store the username and hashed password in the database
        const insertQuery = 'INSERT INTO user_authentication (username, password, role) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, hashedPassword, role], (err, results) => {
          if (err) {
            console.error('Database error during insert:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          console.log('User registered successfully:', results); // Log insert result for verification
          return res.status(200).json({ success: true, message: 'User registered successfully' });
        });
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// PUT: Edit an existing user
app.put('/register/:UserID', async (req, res) => {
  const { UserID } = req.params; // Use 'UserID' as the parameter name
  const { username, password, role } = req.body;

  try {
    // If password is provided, hash it
    let updateFields = [];
    let queryValues = [];
    if (username) {
      updateFields.push('username = ?');
      queryValues.push(username);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      queryValues.push(hashedPassword);
    }
    if (role) {
      updateFields.push('role = ?');
      queryValues.push(role);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updateQuery = `UPDATE user_authentication SET ${updateFields.join(', ')} WHERE UserID = ?`;
    queryValues.push(UserID);

    db.query(updateQuery, queryValues, (err, results) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error' });

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ success: true, message: 'User updated successfully' });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Remove a user
app.delete('/register/:UserID', (req, res) => {
  const { UserID } = req.params; // Use 'UserID' as the parameter name

  const deleteQuery = 'DELETE FROM user_authentication WHERE UserID = ?';
  db.query(deleteQuery, [UserID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  });
});
  app.get('/login', (req, res) => {
    const query = 'SELECT * FROM user_authentication';
    db.query(query, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    const query = 'SELECT * FROM `user_authentication` WHERE username = ?';
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        const user = results[0];
        const hashedPassword = user.Password;
  
        try {
          const match = await bcrypt.compare(password, hashedPassword);
  
          if (match) {
            // Include role in the user object
            const { UserID, Username, Role } = user; // Ensure 'Role' is retrieved correctly
  
            const token = jwt.sign({ userId: UserID }, '&h$9a@Xq8GzBv!3JWfNcU^PzLmRtYwS2', { expiresIn: '8hr' });
  
            // Send response with the user info including role
            return res.status(200).json({
              success: true,
              user: { username: Username, role: Role }, // Ensure 'role' is part of the response
              token,
            });
          } else {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
        } catch (error) {
          console.error('Error comparing passwords:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
  
  app.get('/user-profile',   (req, res) => {
    const userId = req.userId; // Extracted from token by verifyToken middleware
  
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
  
    const query = 'SELECT username, role FROM `user_authentication` WHERE UserId = ? LIMIT 1';
    db.query(query, [userId], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (data.length > 0) {
        const user = data[0];
        // return res.json({ user }); // Ensure correct response structure
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
  

  app.get('/api/patients', (req, res) => {
    db.query('SELECT * FROM patient', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database error');
      } else {
        res.json(result);
      }
    });
  });
  
 // Add Patient
app.post('/api/patients', (req, res) => {
  const { name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4 } = req.body;
  const query = 'INSERT INTO patient (name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add patient', error: err });
    }
    res.status(201).json({ message: 'Patient added', patientId: result.insertId });
  });
});

// Edit Patient
app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4 } = req.body;
  const query = 'UPDATE patients SET name = ?, age = ?, gender = ?, phoneNumber = ?, emailAddress = ?, address = ?, familyHistory = ?, geneAPOE4 = ? WHERE PatientID = ?';
  db.query(query, [name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update patient', error: err });
    }
    res.status(200).json({ message: 'Patient updated', affectedRows: result.affectedRows });
  });
});

// Delete Patient
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM patients WHERE PatientID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to delete patient', error: err });
    }
    res.status(200).json({ message: 'Patient deleted', affectedRows: result.affectedRows });
  });
});


app.get('/api/assessments', (req, res) => {
  db.query('SELECT * FROM assessment', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
    } else {
      res.json(result);
    }
  });
});

app.post("/api/assessments", (req, res) => {
  const {
    assessmentID,
    patientID,
    riskScore,
    assessmentDate,
    recommendations,
    careType,
    startDate,
    endDate,
  } = req.body;

  const checkPatientQuery = 'SELECT * FROM patient WHERE PatientID = ?';

  db.query(checkPatientQuery, [patientID], (err, result) => {
    if (err) {
      console.error("Error checking patient:", err);
      return res.status(500).json({ message: "Error checking patient" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "PatientID does not exist in the patient table" });
    }

    const insertQuery = `
      INSERT INTO assessment (assessmentID, patientID, riskScore, assessmentDate, recommendations, careType, startDate, endDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [assessmentID, patientID, riskScore, assessmentDate, recommendations, careType, startDate, endDate],
      (err, results) => {
        if (err) {
          console.error("Error inserting assessment:", err);
          return res.status(500).json({ message: "Error inserting assessment" });
        }

        res.status(200).json({ message: "Assessment added successfully", data: results });
      }
    );
  });
});

// Edit assessment
app.put("/api/assessments/:assessmentID", (req, res) => {
  const assessmentID = req.params.assessmentID;
  const {
    patientID,
    riskScore,
    assessmentDate,
    recommendations,
    careType,
    startDate,
    endDate,
  } = req.body;

  const checkPatientQuery = 'SELECT * FROM patient WHERE PatientID = ?';

  db.query(checkPatientQuery, [patientID], (err, result) => {
    if (err) {
      console.error("Error checking patient:", err);
      return res.status(500).json({ message: "Error checking patient" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "PatientID does not exist in the patient table" });
    }

    const updateQuery = `
      UPDATE assessment
      SET patientID = ?, riskScore = ?, assessmentDate = ?, recommendations = ?, careType = ?, startDate = ?, endDate = ?
      WHERE assessmentID = ?
    `;

    db.query(
      updateQuery,
      [patientID, riskScore, assessmentDate, recommendations, careType, startDate, endDate, assessmentID],
      (err, results) => {
        if (err) {
          console.error("Error updating assessment:", err);
          return res.status(500).json({ message: "Error updating assessment" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Assessment not found" });
        }

        res.status(200).json({ message: "Assessment updated successfully" });
      }
    );
  });
});

// Delete assessment
app.delete("/api/assessments/:assessmentID", (req, res) => {
  const assessmentID = req.params.assessmentID;

  const deleteQuery = `DELETE FROM assessment WHERE assessmentID = ?`;

  db.query(deleteQuery, [assessmentID], (err, results) => {
    if (err) {
      console.error("Error deleting assessment:", err);
      return res.status(500).json({ message: "Error deleting assessment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ message: "Assessment deleted successfully" });
  });
});

 // API endpoint


app.post('/api/tests', (req, res) => {
  const {
    testID,
    patientID,
    testType,
    betaAmyloidResult,
    plaquePresence,
    cognitiveScore,
    testDate,
    testComment
  } = req.body;

  // SQL query to insert data into the database
  const query = `
    INSERT INTO test (
      testID, patientID, testType, betaAmyloidResult, plaquePresence,
      cognitiveScore, testDate, testComment
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    testID,
    patientID,
    testType,
    betaAmyloidResult,
    plaquePresence,
    cognitiveScore,
    testDate,
    testComment
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ message: 'Failed to submit test data' });
    }

    // console.log('Data inserted successfully:', result);
    res.status(201).json({ message: 'Test data submitted successfully' });
  });
});
  
  // Get Test by ID
  app.get('/api/tests', (req, res) => {
    db.query('SELECT * FROM test', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database error');
      } else {
        res.json(result);
      }
    });
  });


 
  

  app.get('/api/lifestyle', (req, res) => {
    db.query('SELECT * FROM healthLifestyledata', (err, result) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).send('Database error');
      }
      console.log("Fetched data:", result);
      res.json(result); // Return fetched data as JSON
    });
  });
  
  // POST request to insert lifestyle data
  app.post("/api/lifestyle", (req, res) => {
    const {
      DataID,
      PatientID,
      Diet,
      SocialEngagement,
      ExerciseFrequency,
      SmokingStatus,
      SleepQuality,
      HistoryOfHypertension,
      HistoryOfHeartDisease,
      DiabetesStatus,
      DataCollectedDate
    } = req.body;
  
    const query = `
      INSERT INTO healthLifestyledata (
        DataID, PatientID, Diet, SocialEngagement, ExerciseFrequency, 
        SmokingStatus, SleepQuality, HistoryOfHypertension, HistoryOfHeartDisease, 
        DiabetesStatus, DataCollectedDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      DataID,
      PatientID,
      Diet,
      SocialEngagement,
      ExerciseFrequency,
      SmokingStatus,
      SleepQuality,
      HistoryOfHypertension,
      HistoryOfHeartDisease,
      DiabetesStatus,
      DataCollectedDate
    ];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res.status(201).json({ message: "Data successfully inserted", data: result });
    });
  });
 
  app.get('/api/patients-form', (req, res) => {
    const query = `
      SELECT 
        patient.PatientID, patient.name, patient.age, patient.gender, patient.phoneNumber, 
        patient.emailAddress, patient.address, patient.familyHistory, patient.geneAPOE4, 
        assessment.assessmentID, assessment.riskScore, assessment.assessmentDate, 
        assessment.recommendations, assessment.careType, assessment.startDate, assessment.endDate, 
        test.testID, test.testType, test.betaAmyloidResult, test.plaquePresence, test.cognitiveScore, 
        test.testDate, test.testComment, 
        healthLifestyledata.DataID, healthLifestyledata.Diet, healthLifestyledata.SocialEngagement, 
        healthLifestyledata.ExerciseFrequency, healthLifestyledata.SmokingStatus, 
        healthLifestyledata.SleepQuality, healthLifestyledata.HistoryOfHypertension, 
        healthLifestyledata.HistoryOfHeartDisease, healthLifestyledata.DiabetesStatus, 
        healthLifestyledata.DataCollectedDate
      FROM patient
      LEFT JOIN assessment ON patient.PatientID = assessment.patientID
      LEFT JOIN test ON patient.PatientID = test.patientID
      LEFT JOIN healthLifestyledata ON patient.PatientID = healthLifestyledata.PatientID
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database error');
      } else {
        res.json(result);
      }
    });
  });

// Edit patient details
app.put('/api/patients-form/:id', (req, res) => {
  const patientID = req.params.id;
  const {
    name,
    age,
    gender,
    phoneNumber,
    emailAddress,
    address,
    familyHistory,
    geneAPOE4,
    assessmentID,
    riskScore,
    assessmentDate,
    recommendations,
    careType,
    startDate,
    endDate,
    testID,
    testType,
    betaAmyloidResult,
    plaquePresence,
    cognitiveScore,
    testDate,
    testComment,
    DataID,
    Diet,
    SocialEngagement,
    ExerciseFrequency,
    SmokingStatus,
    SleepQuality,
    HistoryOfHypertension,
    HistoryOfHeartDisease,
    DiabetesStatus,
    DataCollectedDate,
  } = req.body;

  // Start SQL transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to start transaction');
    }

    const updatePatientQuery = `
      UPDATE patient
      SET 
        name = ?, age = ?, gender = ?, phoneNumber = ?, emailAddress = ?, address = ?, familyHistory = ?, geneAPOE4 = ?
      WHERE PatientID = ?;
    `;

    const updateAssessmentQuery = `
      UPDATE assessment
      SET 
        riskScore = ?, assessmentDate = ?, recommendations = ?, careType = ?, startDate = ?, endDate = ?
      WHERE assessmentID = ?;
    `;

    const updateTestQuery = `
      UPDATE test
      SET 
        testType = ?, betaAmyloidResult = ?, plaquePresence = ?, cognitiveScore = ?, testDate = ?, testComment = ?
      WHERE testID = ?;
    `;

    const updateLifestyleQuery = `
      UPDATE healthLifestyledata
      SET 
        Diet = ?, SocialEngagement = ?, ExerciseFrequency = ?, SmokingStatus = ?, SleepQuality = ?, HistoryOfHypertension = ?, 
        HistoryOfHeartDisease = ?, DiabetesStatus = ?, DataCollectedDate = ?
      WHERE DataID = ?;
    `;

    const patientValues = [name, age, gender, phoneNumber, emailAddress, address, familyHistory, geneAPOE4, patientID];
    const assessmentValues = [riskScore, assessmentDate, recommendations, careType, startDate, endDate, assessmentID];
    const testValues = [testType, betaAmyloidResult, plaquePresence, cognitiveScore, testDate, testComment, testID];
    const lifestyleValues = [
      Diet, SocialEngagement, ExerciseFrequency, SmokingStatus, SleepQuality, HistoryOfHypertension,
      HistoryOfHeartDisease, DiabetesStatus, DataCollectedDate, DataID
    ];

    // Execute all updates
    db.query(updatePatientQuery, patientValues, (err) => {
      if (err) {
        return db.rollback(() => {
          console.error(err);
          res.status(500).send('Failed to update patient details');
        });
      }

      db.query(updateAssessmentQuery, assessmentValues, (err) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).send('Failed to update assessment details');
          });
        }

        db.query(updateTestQuery, testValues, (err) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).send('Failed to update test details');
            });
          }

          db.query(updateLifestyleQuery, lifestyleValues, (err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res.status(500).send('Failed to update lifestyle details');
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).send('Transaction commit failed');
                });
              }

              res.status(200).send('Patient data updated successfully');
            });
          });
        });
      });
    });
  });
});

// Delete patient
app.delete('/api/patients-form/:id', (req, res) => {
  const patientID = req.params.id;

  // Start SQL transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to start transaction');
    }

    const deletePatientQuery = `DELETE FROM patient WHERE PatientID = ?;`;
    const deleteAssessmentQuery = `DELETE FROM assessment WHERE patientID = ?;`;
    const deleteTestQuery = `DELETE FROM test WHERE patientID = ?;`;
    const deleteLifestyleQuery = `DELETE FROM healthLifestyledata WHERE PatientID = ?;`;

    db.query(deletePatientQuery, [patientID], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error(err);
          res.status(500).send('Failed to delete patient');
        });
      }

      db.query(deleteAssessmentQuery, [patientID], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).send('Failed to delete assessment');
          });
        }

        db.query(deleteTestQuery, [patientID], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).send('Failed to delete test');
            });
          }

          db.query(deleteLifestyleQuery, [patientID], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res.status(500).send('Failed to delete lifestyle data');
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).send('Transaction commit failed');
                });
              }

              res.status(200).send('Patient data deleted successfully');
            });
          });
        });
      });
    });
  });
});

  
  
  //******************************PORT LISTENING  ON  8081**************************************************//

app.listen(8081, () => {
    console.log(' listening.......');
  });
  