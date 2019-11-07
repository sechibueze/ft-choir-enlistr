export default {
  tableQuery: `
  -- Create Members Table 
    CREATE TABLE IF NOT EXISTS
    members(
      user_id SERIAL NOT NULL PRIMARY KEY,
      choir_id VARCHAR(255) NOT NULL UNIQUE,
      surname VARCHAR(255) NOT NULL ,
      firstname VARCHAR(255) NOT NULL ,
      middlename VARCHAR(255) NOT NULL,
      group VARCHAR(255) NOT NULL ,
      part VARCHAR(255) NOT NULL ,
      gender VARCHAR(255) NOT NULL ,
      phone VARCHAR(255) NOT NULL,
      accomodation BOOLEAN NOT NULL DEFAULT FALSE,
      availability TEXT[] NOT NULL,
      entry_date DATE NOT NULL DEFAULT NOW()
    );
    
  -- Create Qualifiers Table 
    CREATE TABLE IF NOT EXISTS
    qualifiers(
      user_id SERIAL NOT NULL PRIMARY KEY,
      choir_id VARCHAR(255) NOT NULL UNIQUE,
      surname VARCHAR(255) NOT NULL
    );
  `
}