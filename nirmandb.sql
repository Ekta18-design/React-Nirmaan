-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2024 at 10:48 PM
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
-- Database: `nirmandb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_BuildingUnitMaster` (IN `p_flag` INT, IN `p_buildingunitid` INT, IN `p_projectid` INT, IN `p_buildingid` INT, IN `p_unitcategoryid` INT, IN `p_unitshortname` VARCHAR(255), IN `p_unitreferencename` VARCHAR(255), IN `p_unitarea` DECIMAL(10,2), IN `p_unitareareference` VARCHAR(255), IN `p_isactive` TINYINT(1), IN `p_isdeleted` TINYINT(1))   BEGIN
    CASE p_flag
        -- Flag 1: Retrieve all building units
        WHEN 1 THEN
            SELECT * FROM tbl_BuildingUnitMaster WHERE isdeleted = 0;

        -- Flag 2: Add a new building unit
        WHEN 2 THEN
            -- Check for required fields
            IF p_projectid IS NULL OR p_buildingid IS NULL OR p_unitcategoryid IS NULL OR 
               p_unitshortname IS NULL OR p_unitreferencename IS NULL OR p_unitarea IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'All fields except isactive and isdeleted are required';
            END IF;

            -- Check if project exists
            IF NOT EXISTS (SELECT * FROM tbl_ProjectMaster WHERE projectid = p_projectid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project does not exist';
            END IF;

            -- Check if building exists and belongs to the selected project
            IF NOT EXISTS (SELECT * FROM tbl_BuildingMaster WHERE buildingid = p_buildingid AND projectid = p_projectid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Building does not exist or does not belong to the selected project';
            END IF;

            -- Check if unit category exists
            IF NOT EXISTS (SELECT * FROM tbl_UnitCategoryMaster WHERE unitcategoryid = p_unitcategoryid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unit Category does not exist';
            END IF;

            INSERT INTO tbl_BuildingUnitMaster (projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea, unitareareference, isactive, isdeleted)
            VALUES (p_projectid, p_buildingid, p_unitcategoryid, p_unitshortname, p_unitreferencename, p_unitarea, p_unitareareference, p_isactive, p_isdeleted);

            SELECT LAST_INSERT_ID() AS buildingunitid;

        -- Flag 3: Retrieve a single building unit by ID
        WHEN 3 THEN
            IF p_buildingunitid IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Building Unit ID cannot be NULL';
            END IF;

            SELECT * FROM tbl_BuildingUnitMaster WHERE buildingunitid = p_buildingunitid AND isdeleted = 0;

        -- Flag 4: Update a building unit by ID
        WHEN 4 THEN
            IF p_buildingunitid IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Building Unit ID cannot be NULL for update';
            END IF;

            -- Check if project exists
            IF NOT EXISTS (SELECT * FROM tbl_ProjectMaster WHERE projectid = p_projectid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project does not exist';
            END IF;

            -- Check if building exists and belongs to the selected project
            IF NOT EXISTS (SELECT * FROM tbl_BuildingMaster WHERE buildingid = p_buildingid AND projectid = p_projectid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Building does not exist or does not belong to the selected project';
            END IF;

            -- Check if unit category exists
            IF NOT EXISTS (SELECT * FROM tbl_UnitCategoryMaster WHERE unitcategoryid = p_unitcategoryid) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unit Category does not exist';
            END IF;

            UPDATE tbl_BuildingUnitMaster
            SET projectid = p_projectid, 
                buildingid = p_buildingid, 
                unitcategoryid = p_unitcategoryid, 
                unitshortname = p_unitshortname, 
                unitreferencename = p_unitreferencename, 
                unitarea = p_unitarea, 
                unitareareference = p_unitareareference,
                isactive = p_isactive,
                isdeleted = p_isdeleted
            WHERE buildingunitid = p_buildingunitid;

            SELECT p_buildingunitid AS updatedId;

        -- Flag 5: Delete a building unit by ID (soft delete)
        WHEN 5 THEN
            IF p_buildingunitid IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Building Unit ID cannot be NULL for deletion';
            END IF;

            UPDATE tbl_BuildingUnitMaster SET isdeleted = 1 WHERE buildingunitid = p_buildingunitid;

            SELECT p_buildingunitid AS deletedId;

        ELSE
            -- Handle invalid flag error
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
    END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ManageBuilder` (IN `p_flag` INT, IN `p_builderid` INT, IN `p_userid` INT, IN `p_companyname` VARCHAR(255), IN `p_companylogo` VARCHAR(255), IN `p_companyestyear` INT, IN `p_headofficephone` VARCHAR(50), IN `p_companydescription` TEXT, IN `p_headofficeaddress` TEXT, IN `p_headofficeemail` VARCHAR(100), IN `p_alternateofficeemail` VARCHAR(100), IN `p_alternateofficephone` VARCHAR(50), IN `p_alternateofficeaddress` TEXT, IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
  CASE p_flag
    -- Flag 1: Get all active builders
    WHEN 1 THEN
      SELECT * FROM tbl_BuilderMaster WHERE isdeleted = 0;

    -- Flag 2: Insert a new builder
    WHEN 2 THEN
      IF p_builderid IS NULL THEN
        INSERT INTO tbl_BuilderMaster (
          userid, companyname, companylogo, companyestyear, headofficephone,
          companydescription, headofficeaddress, headofficeemail,
          alternateofficeemail, alternateofficephone, alternateofficeaddress,
          isactive, isdeleted
        ) VALUES (
          p_userid, p_companyname, p_companylogo, p_companyestyear, p_headofficephone,
          p_companydescription, p_headofficeaddress, p_headofficeemail,
          p_alternateofficeemail, p_alternateofficephone, p_alternateofficeaddress,
          p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'builderid must be NULL for new builder insertion';
      END IF;

    -- Flag 3: Update an existing builder by ID
    WHEN 3 THEN
      IF p_builderid IS NOT NULL THEN
        UPDATE tbl_BuilderMaster 
        SET userid = p_userid, companyname = p_companyname, companylogo = p_companylogo, 
            companyestyear = p_companyestyear, headofficephone = p_headofficephone,
            companydescription = p_companydescription, headofficeaddress = p_headofficeaddress,
            headofficeemail = p_headofficeemail, alternateofficeemail = p_alternateofficeemail, 
            alternateofficephone = p_alternateofficephone, alternateofficeaddress = p_alternateofficeaddress, 
            isactive = p_isactive, isdeleted = p_isdeleted
        WHERE builderid = p_builderid;
        SELECT p_builderid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'builderid cannot be NULL for update';
      END IF;

    -- Flag 4: Get builder by ID
    WHEN 4 THEN
      IF p_builderid IS NOT NULL THEN
        SELECT * FROM tbl_BuilderMaster WHERE builderid = p_builderid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'builderid cannot be NULL for fetching builder';
      END IF;

    -- Flag 5: Delete builder by ID
    WHEN 5 THEN
      IF p_builderid IS NOT NULL THEN
        UPDATE tbl_BuilderMaster SET isdeleted = TRUE WHERE builderid = p_builderid;
        SELECT p_builderid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'builderid cannot be NULL for deletion';
      END IF;

    ELSE
      -- Handle invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ManageBuilding` (IN `p_flag` INT, IN `p_buildingid` INT, IN `p_buildingname` VARCHAR(255), IN `p_builderid` INT, IN `p_projectid` INT, IN `p_buildingsiteaddress` TEXT, IN `p_buildingdescription` TEXT, IN `p_buildingreferencename` VARCHAR(255), IN `p_buildingwingname` VARCHAR(255), IN `p_buildingarea` DECIMAL(10,2), IN `p_nooffloors` INT, IN `p_noofflats` INT, IN `p_noofshops` INT, IN `p_noofotherunits` INT, IN `p_noofparking` INT, IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
  CASE p_flag
    -- Flag 1: Get all active buildings
    WHEN 1 THEN
      SELECT * FROM tbl_BuildingMaster WHERE isdeleted = 0;

    -- Flag 2: Insert a new building
    WHEN 2 THEN
      IF p_buildingid IS NULL THEN
        INSERT INTO tbl_BuildingMaster (
          buildingname, builderid, projectid, buildingsiteaddress, buildingdescription,
          buildingreferencename, buildingwingname, buildingarea, nooffloors, noofflats,
          noofshops, noofotherunits, noofparking, isactive, isdeleted
        ) VALUES (
          p_buildingname, p_builderid, p_projectid, p_buildingsiteaddress, p_buildingdescription,
          p_buildingreferencename, p_buildingwingname, p_buildingarea, p_nooffloors, p_noofflats,
          p_noofshops, p_noofotherunits, p_noofparking, p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'buildingid must be NULL for new building insertion';
      END IF;

    -- Flag 3: Get building by ID
    WHEN 3 THEN
      IF p_buildingid IS NOT NULL THEN
        SELECT * FROM tbl_BuildingMaster WHERE buildingid = p_buildingid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'buildingid cannot be NULL for fetching building';
      END IF;

    -- Flag 4: Update an existing building by ID
    WHEN 4 THEN
      IF p_buildingid IS NOT NULL THEN
        UPDATE tbl_BuildingMaster
        SET buildingname = p_buildingname, builderid = p_builderid, projectid = p_projectid,
            buildingsiteaddress = p_buildingsiteaddress, buildingdescription = p_buildingdescription,
            buildingreferencename = p_buildingreferencename, buildingwingname = p_buildingwingname,
            buildingarea = p_buildingarea, nooffloors = p_nooffloors, noofflats = p_noofflats,
            noofshops = p_noofshops, noofotherunits = p_noofotherunits, noofparking = p_noofparking,
            isactive = p_isactive, isdeleted = p_isdeleted
        WHERE buildingid = p_buildingid;
        SELECT p_buildingid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'buildingid cannot be NULL for update';
      END IF;

    -- Flag 5: Soft-delete building by ID (set isdeleted to true)
    WHEN 5 THEN
      IF p_buildingid IS NOT NULL THEN
        UPDATE tbl_BuildingMaster SET isdeleted = TRUE WHERE buildingid = p_buildingid;
        SELECT p_buildingid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'buildingid cannot be NULL for deletion';
      END IF;

    ELSE
      -- Handle invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ManageClient` (IN `p_flag` INT, IN `p_clientid` INT, IN `p_clientname` VARCHAR(100), IN `p_clientreferencename` VARCHAR(100), IN `p_clientemail` VARCHAR(255), IN `p_clientaddress` VARCHAR(255), IN `p_clientpanno` VARCHAR(50), IN `p_clientaadharno` VARCHAR(50), IN `p_clientphone` VARCHAR(15), IN `p_clientpanphoto` VARCHAR(255), IN `p_clientaadharphoto` VARCHAR(255), IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
    CASE p_flag
        -- Flag 1: Retrieve all active clients
        WHEN 1 THEN
            SELECT * FROM tbl_ClientMaster WHERE isdeleted = 0;

        -- Flag 2: Insert a new client
        WHEN 2 THEN
            -- Check for required fields
            IF p_clientname IS NULL OR p_clientreferencename IS NULL OR 
               p_clientemail IS NULL OR p_clientaddress IS NULL OR 
               p_clientpanno IS NULL OR p_clientaadharno IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'All fields are required';
            END IF;

            INSERT INTO tbl_ClientMaster (
                clientname, clientpanphoto, clientaadharphoto, clientreferencename, 
                clientemail, clientaddress, clientpanno, clientaadharno, 
                clientphone, isactive, isdeleted
            ) VALUES (
                p_clientname, p_clientpanphoto, p_clientaadharphoto, 
                p_clientreferencename, p_clientemail, p_clientaddress, 
                p_clientpanno, p_clientaadharno, p_clientphone, p_isactive, p_isdeleted
            );

            -- Return the ID of the newly inserted client
            SELECT LAST_INSERT_ID() AS insertId;

        -- Flag 3: Retrieve a client by ID
        WHEN 3 THEN
            IF p_clientid IS NOT NULL THEN
                SELECT * FROM tbl_ClientMaster WHERE clientid = p_clientid AND isdeleted = 0;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Client ID cannot be NULL';
            END IF;

        -- Flag 4: Update a client by ID
        WHEN 4 THEN
            IF p_clientid IS NOT NULL THEN
                UPDATE tbl_ClientMaster
                SET clientname = p_clientname,
                    clientpanphoto = p_clientpanphoto,
                    clientaadharphoto = p_clientaadharphoto,
                    clientreferencename = p_clientreferencename,
                    clientemail = p_clientemail,
                    clientaddress = p_clientaddress,
                    clientpanno = p_clientpanno,
                    clientaadharno = p_clientaadharno,
                    clientphone = p_clientphone,
                    isactive = p_isactive,
                    isdeleted = p_isdeleted
                WHERE clientid = p_clientid;
                SELECT p_clientid AS updatedId;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Client ID cannot be NULL for update';
            END IF;

        -- Flag 5: Soft-delete a client by ID (set isdeleted to true)
        WHEN 5 THEN
            IF p_clientid IS NOT NULL THEN
                UPDATE tbl_ClientMaster SET isdeleted = TRUE WHERE clientid = p_clientid;
                SELECT p_clientid AS deletedId;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Client ID cannot be NULL for deletion';
            END IF;

        ELSE
            -- Handle invalid flag error
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
    END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ManageProject` (IN `p_flag` INT, IN `p_projectid` INT, IN `p_builderid` INT, IN `p_projectname` VARCHAR(255), IN `p_projectstartdate` DATE, IN `p_projectenddate` DATE, IN `p_projectarea` DECIMAL(10,2), IN `p_projectsiteaddress` TEXT, IN `p_surveyno` VARCHAR(50), IN `p_hissano` VARCHAR(50), IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
  CASE p_flag
    -- Flag 1: Get all active projects
    WHEN 1 THEN
      SELECT * FROM tbl_ProjectMaster WHERE isdeleted = 0;

    -- Flag 2: Insert a new project
    WHEN 2 THEN
      IF p_projectid IS NULL THEN
        INSERT INTO tbl_ProjectMaster (
          builderid, projectname, projectstartdate, projectenddate,
          projectarea, projectsiteaddress, surveyno, hissano,
          isactive, isdeleted
        ) VALUES (
          p_builderid, p_projectname, p_projectstartdate, p_projectenddate,
          p_projectarea, p_projectsiteaddress, p_surveyno, p_hissano,
          p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'projectid must be NULL for new project insertion';
      END IF;

    -- Flag 3: Get project by ID
    WHEN 3 THEN
      IF p_projectid IS NOT NULL THEN
        SELECT * FROM tbl_ProjectMaster WHERE projectid = p_projectid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'projectid cannot be NULL for fetching project';
      END IF;

    -- Flag 4: Update an existing project by ID
    WHEN 4 THEN
      IF p_projectid IS NOT NULL THEN
        UPDATE tbl_ProjectMaster
        SET builderid = p_builderid,
            projectname = p_projectname,
            projectstartdate = p_projectstartdate,
            projectenddate = p_projectenddate,
            projectarea = p_projectarea,
            projectsiteaddress = p_projectsiteaddress,
            surveyno = p_surveyno,
            hissano = p_hissano,
            isactive = p_isactive,
            isdeleted = p_isdeleted
        WHERE projectid = p_projectid;
        SELECT p_projectid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'projectid cannot be NULL for update';
      END IF;

    -- Flag 5: Soft-delete project by ID (set isdeleted to true)
    WHEN 5 THEN
      IF p_projectid IS NOT NULL THEN
        UPDATE tbl_ProjectMaster SET isdeleted = TRUE WHERE projectid = p_projectid;
        SELECT p_projectid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'projectid cannot be NULL for deletion';
      END IF;

    ELSE
      -- Handle invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ManageUnitCategory` (IN `p_flag` INT, IN `p_unitcategoryid` INT, IN `p_categoryname` VARCHAR(255), IN `p_categoryreferencename` VARCHAR(255), IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
  CASE p_flag
    -- Flag 1: Get all active Unit Categories
    WHEN 1 THEN
      SELECT * FROM tbl_UnitCategoryMaster WHERE isdeleted = 0;

    -- Flag 2: Insert a new Unit Category
    WHEN 2 THEN
      IF p_unitcategoryid IS NULL THEN
        INSERT INTO tbl_UnitCategoryMaster (
          categoryname, categoryreferencename, isactive, isdeleted
        ) VALUES (
          p_categoryname, p_categoryreferencename, p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'unitcategoryid must be NULL for new category insertion';
      END IF;

    -- Flag 3: Get Unit Category by ID
    WHEN 3 THEN
      IF p_unitcategoryid IS NOT NULL THEN
        SELECT * FROM tbl_UnitCategoryMaster WHERE unitcategoryid = p_unitcategoryid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'unitcategoryid cannot be NULL for fetching category';
      END IF;

    -- Flag 4: Update an existing Unit Category
    WHEN 4 THEN
      IF p_unitcategoryid IS NOT NULL THEN
        UPDATE tbl_UnitCategoryMaster
        SET categoryname = p_categoryname,
            categoryreferencename = p_categoryreferencename,
            isactive = p_isactive,
            isdeleted = p_isdeleted
        WHERE unitcategoryid = p_unitcategoryid;
        SELECT p_unitcategoryid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'unitcategoryid cannot be NULL for update';
      END IF;

    -- Flag 5: Soft-delete Unit Category by ID (set isdeleted to true)
    WHEN 5 THEN
      IF p_unitcategoryid IS NOT NULL THEN
        UPDATE tbl_UnitCategoryMaster SET isdeleted = TRUE WHERE unitcategoryid = p_unitcategoryid;
        SELECT p_unitcategoryid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'unitcategoryid cannot be NULL for deletion';
      END IF;

    ELSE
      -- Handle invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_UploadMaster` (IN `p_flag` INT, IN `p_uploadid` INT, IN `p_builderid` INT, IN `p_projectid` INT, IN `p_buildingid` INT, IN `p_unitcategoryid` INT, IN `p_documentfile` VARCHAR(255), IN `p_documenttitle` VARCHAR(255), IN `p_documentdescription` TEXT, IN `p_documenttags` VARCHAR(255))   BEGIN
    DECLARE lastId INT;  -- Variable to store the last inserted ID

    CASE p_flag
        -- Flag 1: Retrieve all uploads
        WHEN 1 THEN
            SELECT * FROM tbl_UploadMaster;

        -- Flag 2: Insert a new upload
        WHEN 2 THEN
            -- Check for required fields
            IF p_builderid IS NULL OR p_projectid IS NULL OR 
               p_documentfile IS NULL OR p_documenttitle IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Builder ID, Project ID, Document File, and Document Title are required';
            END IF;

            INSERT INTO tbl_UploadMaster (
                builderid, projectid, buildingid, unitcategoryid, documentfile, 
                documenttitle, documentdescription, documenttags
            ) VALUES (
                p_builderid, p_projectid, p_buildingid, p_unitcategoryid, 
                p_documentfile, p_documenttitle, p_documentdescription, 
                p_documenttags
            );

            -- Return the ID of the newly inserted upload
            SELECT LAST_INSERT_ID() AS uploadid;

        -- Flag 3: Retrieve an upload by ID
        WHEN 3 THEN
            IF p_uploadid IS NOT NULL THEN
                SELECT * FROM tbl_UploadMaster WHERE uploadid = p_uploadid;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Upload ID cannot be NULL';
            END IF;

        -- Flag 4: Update an upload by ID
        WHEN 4 THEN
            IF p_uploadid IS NOT NULL THEN
                UPDATE tbl_UploadMaster
                SET builderid = p_builderid, 
                    projectid = p_projectid, 
                    buildingid = p_buildingid, 
                    unitcategoryid = p_unitcategoryid,
                    documentfile = p_documentfile,
                    documenttitle = p_documenttitle,
                    documentdescription = p_documentdescription,
                    documenttags = p_documenttags
                WHERE uploadid = p_uploadid;

                -- Return the ID of the updated upload
                SELECT p_uploadid AS updatedId;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Upload ID cannot be NULL for update';
            END IF;

        -- Flag 5: Delete an upload by ID
        WHEN 5 THEN
            IF p_uploadid IS NOT NULL THEN
                DELETE FROM tbl_UploadMaster WHERE uploadid = p_uploadid;
                SELECT p_uploadid AS deletedId;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Upload ID cannot be NULL for deletion';
            END IF;

        ELSE
            -- Handle invalid flag error
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
    END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_UserMaster` (IN `p_flag` INT, IN `p_userid` INT, IN `p_username` VARCHAR(255), IN `p_user_firstname` VARCHAR(255), IN `p_user_lastname` VARCHAR(255), IN `p_user_email` VARCHAR(255), IN `p_user_phone` VARCHAR(15), IN `p_user_password` VARCHAR(255), IN `p_user_confirmpassword` VARCHAR(255), IN `p_role` VARCHAR(50), IN `p_isactive` BOOLEAN, IN `p_isdeleted` BOOLEAN)   BEGIN
  CASE p_flag
    -- Flag 1: Fetch all users (who are not deleted)
    WHEN 1 THEN
      SELECT * FROM tbl_UserMaster WHERE isdeleted = 0;

    -- Flag 2: Insert new user
    WHEN 2 THEN
      IF p_userid IS NULL THEN
        INSERT INTO tbl_UserMaster (
          username, user_firstname, user_lastname, user_email, user_phone, 
          user_password, user_confirmpassword, role, isactive, isdeleted
        ) VALUES (
          p_username, p_user_firstname, p_user_lastname, p_user_email, p_user_phone,
          p_user_password, p_user_confirmpassword, p_role, p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID must be NULL for new user insertion';
      END IF;

    -- Flag 3: Update existing user
    WHEN 3 THEN
      IF p_userid IS NOT NULL THEN
        UPDATE tbl_UserMaster 
        SET username = p_username, 
            user_firstname = p_user_firstname, 
            user_lastname = p_user_lastname, 
            user_email = p_user_email,
            user_phone = p_user_phone, 
            user_password = p_user_password, 
            user_confirmpassword = p_user_confirmpassword, 
            role = p_role,
            isactive = p_isactive, 
            isdeleted = p_isdeleted
        WHERE userid = p_userid;
        SELECT p_userid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for update';
      END IF;

    -- Flag 4: Fetch user by ID
    WHEN 4 THEN
      IF p_userid IS NOT NULL THEN
        SELECT * FROM tbl_UserMaster WHERE userid = p_userid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for fetching user';
      END IF;

    -- Flag 5: Soft delete user by ID
    WHEN 5 THEN
      IF p_userid IS NOT NULL THEN
        UPDATE tbl_UserMaster SET isdeleted = TRUE WHERE userid = p_userid;
        SELECT p_userid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for deletion';
      END IF;

    ELSE
      -- Invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_buildermaster`
--

CREATE TABLE `tbl_buildermaster` (
  `builderid` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `companyname` varchar(255) NOT NULL,
  `companylogo` varchar(255) DEFAULT NULL,
  `companyestyear` varchar(255) DEFAULT NULL,
  `headofficephone` varchar(15) DEFAULT NULL,
  `companydescription` text DEFAULT NULL,
  `headofficeaddress` varchar(255) DEFAULT NULL,
  `headofficeemail` varchar(255) DEFAULT NULL,
  `alternateofficeemail` varchar(255) DEFAULT NULL,
  `alternateofficephone` varchar(15) DEFAULT NULL,
  `alternateofficeaddress` varchar(255) DEFAULT NULL,
  `isactive` tinyint(1) NOT NULL DEFAULT 1,
  `isdeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_buildermaster`
--

INSERT INTO `tbl_buildermaster` (`builderid`, `userid`, `companyname`, `companylogo`, `companyestyear`, `headofficephone`, `companydescription`, `headofficeaddress`, `headofficeemail`, `alternateofficeemail`, `alternateofficephone`, `alternateofficeaddress`, `isactive`, `isdeleted`) VALUES
(1, 1, 'Npm', NULL, '2018', '9878456312', 'abc', 'abc', 'npm@gmail.com', 'npm1@gmail.com', '7896547896', 'abc', 0, 0),
(2, 2, 'Mm2', 'uploads\\1723020646473-h2.jpg', '2018', '9874569845', 'abc', 'abc', 'mm@gmail.com', 'mm1@gmail.com', '7896547896', 'abc', 1, 0),
(3, 2, 'Lp', 'uploads\\1723020587619-building-1491692_1280.jpg', '2019', '9878564589', 'def', 'def', 'lp@gmail.com', 'lp1@gmail.com', '7896547896', 'def', 1, 0),
(4, 1, 'Pop', 'uploads\\1723020735972-h1.jpg', '2017', '9878964578', 'gh', 'gh', 'pop@gmail.com', 'pop1@gmail.com', '8596324578', 'gh', 1, 0),
(5, 2, 'Ekta estate', 'uploads\\1724235445869-icons8-kitchen-50.png', '2016', '98745964585', 'abc', 'abc', 'abc@gmail.com', 'abc@gmail.com', '8596457845', 'abc', 1, 0),
(6, 2, 'ekta-estate', 'uploads\\1724235636668-icons8-electrical-80 (1).png', '2016', '8569745696', 'abc', 'abc', 'abc@gmail.com', 'abc@gmail.com', '9654789645', 'abc', 1, 0),
(7, 2, 'A', 'uploads\\1724235721118-screencapture-localhost-5173-metronic8-react-demo3-auth-2024-07-14-22_53_05.png', '2016', '7896548236', 'abc', 'abc', 'abc@gmail.com', 'abc@gmail.com', '7896547845', 'abc', 1, 0),
(8, 9, 'A One', 'uploads\\1724927252109-icons8-flooring-50.png', '2015', '9874563652', 'abcd', 'abc', 'aone@gmail.com', 'aone@gmail.com', '7896354578', 'abc', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_buildingmaster`
--

CREATE TABLE `tbl_buildingmaster` (
  `buildingid` int(11) NOT NULL,
  `buildingname` varchar(255) NOT NULL,
  `builderid` int(11) NOT NULL,
  `projectid` int(11) NOT NULL,
  `buildingsiteaddress` text NOT NULL,
  `buildingdescription` text NOT NULL,
  `buildingreferencename` varchar(255) NOT NULL,
  `buildingwingname` varchar(255) NOT NULL,
  `buildingarea` varchar(255) NOT NULL,
  `nooffloors` varchar(255) NOT NULL,
  `noofflats` varchar(255) NOT NULL,
  `noofshops` varchar(255) NOT NULL,
  `noofotherunits` varchar(255) NOT NULL,
  `noofparking` varchar(255) NOT NULL,
  `isactive` tinyint(1) NOT NULL DEFAULT 1,
  `isdeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_buildingmaster`
--

INSERT INTO `tbl_buildingmaster` (`buildingid`, `buildingname`, `builderid`, `projectid`, `buildingsiteaddress`, `buildingdescription`, `buildingreferencename`, `buildingwingname`, `buildingarea`, `nooffloors`, `noofflats`, `noofshops`, `noofotherunits`, `noofparking`, `isactive`, `isdeleted`) VALUES
(2, 'Housing1', 1, 3, 'abc', 'abc', 'abcd', 'A', 'abc', '5', '20', '10', '2', '2', 1, 0),
(3, 'mauli', 4, 2, 'Borivali', 'abc', 'abcd', 'A', 'abc', '5', '20', '10', '2', '2', 1, 0),
(4, 'B', 5, 6, 'Borivali', 'abc', 'abcd', 'b', 'abc', '3', '12', '5', '2', '1', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_buildingunitmaster`
--

CREATE TABLE `tbl_buildingunitmaster` (
  `buildingunitid` int(11) NOT NULL,
  `projectid` int(11) DEFAULT NULL,
  `buildingid` int(11) DEFAULT NULL,
  `unitcategoryid` int(11) DEFAULT NULL,
  `unitshortname` varchar(255) DEFAULT NULL,
  `unitreferencename` text DEFAULT NULL,
  `unitarea` varchar(50) DEFAULT NULL,
  `unitareareference` varchar(50) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 1,
  `isdeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_buildingunitmaster`
--

INSERT INTO `tbl_buildingunitmaster` (`buildingunitid`, `projectid`, `buildingid`, `unitcategoryid`, `unitshortname`, `unitreferencename`, `unitarea`, `unitareareference`, `isactive`, `isdeleted`) VALUES
(1, 3, 2, 1, '2BHK', '2BHK', 'abc', 'abc', 1, 0),
(2, 3, 2, 2, 'Frist Shop', 'firstshop', 'nm', 'nm', 1, 0),
(3, 6, 4, 1, 'flats', 'flats', 'abc', 'abc', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_clientmaster`
--

CREATE TABLE `tbl_clientmaster` (
  `clientid` int(11) NOT NULL,
  `clientname` varchar(255) NOT NULL,
  `clientpanphoto` varchar(255) DEFAULT NULL,
  `clientaadharphoto` varchar(255) DEFAULT NULL,
  `clientreferencename` varchar(255) DEFAULT NULL,
  `clientemail` varchar(15) DEFAULT NULL,
  `clientaddress` text DEFAULT NULL,
  `clientpanno` varchar(255) DEFAULT NULL,
  `clientaadharno` varchar(255) DEFAULT NULL,
  `clientphone` varchar(15) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 0,
  `isdeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_clientmaster`
--

INSERT INTO `tbl_clientmaster` (`clientid`, `clientname`, `clientpanphoto`, `clientaadharphoto`, `clientreferencename`, `clientemail`, `clientaddress`, `clientpanno`, `clientaadharno`, `clientphone`, `isactive`, `isdeleted`) VALUES
(3, 'Abcd', 'uploads\\1723111616556-g2 (1).jpg', 'uploads\\1723111616586-h.jpg', 'abcd', 'abc@gmail.com', 'jkh', 'nm5478963654', 'lo8965741236', '9636547896', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_projectmaster`
--

CREATE TABLE `tbl_projectmaster` (
  `projectid` int(11) NOT NULL,
  `builderid` int(11) DEFAULT NULL,
  `projectname` varchar(255) DEFAULT NULL,
  `projectstartdate` date DEFAULT NULL,
  `projectenddate` date DEFAULT NULL,
  `projectarea` text DEFAULT NULL,
  `projectsiteaddress` text DEFAULT NULL,
  `surveyno` varchar(255) DEFAULT NULL,
  `hissano` varchar(255) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 1,
  `isdeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_projectmaster`
--

INSERT INTO `tbl_projectmaster` (`projectid`, `builderid`, `projectname`, `projectstartdate`, `projectenddate`, `projectarea`, `projectsiteaddress`, `surveyno`, `hissano`, `isactive`, `isdeleted`) VALUES
(1, 3, 'First', '2023-05-17', '2025-09-25', 'abc', 'abc', '145265', '968545', 1, 0),
(2, 4, 'Demo4', '2024-03-11', '2026-02-18', 'abc', 'abc', '854578', '854796', 1, 0),
(3, 1, 'Second', '2024-03-13', '2026-05-01', 'abc', 'abc', '859645', '789654', 1, 0),
(4, 2, 'Rpj', '2023-08-16', '2025-10-17', 'mnp', 'mnp', '856932', '785496', 1, 0),
(5, 1, 'Bright', '2023-09-20', '2025-08-22', 'ghj', 'ghj', '789654', '147896', 1, 0),
(6, 5, 'First', '2024-08-15', '2024-12-20', 'abc', 'abc', '987896', '456987', 1, 0),
(7, 5, 'F1', '2024-08-23', '2024-08-23', 'abc', 'abc', '859645', '125463', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_unitcategorymaster`
--

CREATE TABLE `tbl_unitcategorymaster` (
  `unitcategoryid` int(11) NOT NULL,
  `categoryname` varchar(255) NOT NULL,
  `categoryreferencename` varchar(255) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 1,
  `isdeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_unitcategorymaster`
--

INSERT INTO `tbl_unitcategorymaster` (`unitcategoryid`, `categoryname`, `categoryreferencename`, `isactive`, `isdeleted`) VALUES
(1, 'Flat', 'flat', 1, 0),
(2, 'Shop', 'shop1', 1, 0),
(3, 'Parking', 'parking', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_uploadmaster`
--

CREATE TABLE `tbl_uploadmaster` (
  `uploadid` int(11) NOT NULL,
  `builderid` int(11) DEFAULT NULL,
  `projectid` int(11) DEFAULT NULL,
  `buildingid` int(11) DEFAULT NULL,
  `unitcategoryid` int(11) DEFAULT NULL,
  `documentfile` varchar(255) DEFAULT NULL,
  `documenttitle` varchar(255) NOT NULL,
  `documentdescription` text NOT NULL,
  `documenttags` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_uploadmaster`
--

INSERT INTO `tbl_uploadmaster` (`uploadid`, `builderid`, `projectid`, `buildingid`, `unitcategoryid`, `documentfile`, `documenttitle`, `documentdescription`, `documenttags`) VALUES
(8, 1, 3, 2, 1, '1-3-2-1-home-1622401_1920.jpg', 'Flat Image', 'flat image first', '#F'),
(9, 2, 4, NULL, NULL, '2-4-0-0-icons8-kitchen-50.png', 'Project Site', 'project site doc', '#P'),
(10, 4, 2, 3, NULL, '4-2-3-0-building-1491692_1920.jpg', 'Building Image', 'building image', '#B'),
(13, 2, 4, NULL, NULL, '2-4-0-0-reactjs_tutorial.pdf', 'File', 'file', '#F'),
(14, 5, 6, NULL, NULL, '5-6-0-0-screencapture-localhost-5173-metronic8-react-demo3-apps-chat-group-chat-2024-07-15-04_32_21.png', '7/12', '7/12', '#7'),
(15, 5, 6, 4, 1, 'fileupload\\builder-5\\5-6-4-1-Minimalist Modern Engineering and Construction Logo.png', 'flat', 'image', '#flat'),
(16, 4, 2, 3, 2, '4-2-3-2-1.png', 'shop image', 'shop', '#shop');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_usermaster`
--

CREATE TABLE `tbl_usermaster` (
  `userid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `user_firstname` varchar(50) NOT NULL,
  `user_lastname` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_confirmpassword` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `isactive` tinyint(1) NOT NULL DEFAULT 1,
  `isdeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_usermaster`
--

INSERT INTO `tbl_usermaster` (`userid`, `username`, `user_firstname`, `user_lastname`, `user_email`, `user_phone`, `user_password`, `user_confirmpassword`, `role`, `isactive`, `isdeleted`) VALUES
(1, 'Demo1', 'de', 'mo', 'demo@gmail.com', '8945789645', '123', '123', 'user', 1, 0),
(2, 'Ekta', 'ekta', 'shah', 'ekta@gmail.com', '9874569845', '123', '123', 'admin', 1, 0),
(3, 'Vicky', 'Vicky', 'ajmera', 'vicky@gmail.com', '9878459621', '123', '123', 'user', 1, 0),
(6, 'Rk', 'Rk', 'kp', 'rk@gmail.com', '8569745698', '123', '123', 'user', 1, 0),
(8, 'Nirav', 'Nirav', 'Ajmera', 'nirav@gmail.com', '9656897456', '123', '123', 'admin', 1, 0),
(9, 'Lk', 'Lk', 'Mn1', 'lk@gmail.com', '8569745689', '123', '123', 'admin', 1, 0),
(10, 'jk', 'Jk', 'os', 'jk@gmail.com', '8569321452', '123', '123', 'admin', 1, 0),
(11, 'One', 'one', 'two', 'one@gmail.com', '987456987456', '123', '123', 'user', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_buildermaster`
--
ALTER TABLE `tbl_buildermaster`
  ADD PRIMARY KEY (`builderid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `tbl_buildingmaster`
--
ALTER TABLE `tbl_buildingmaster`
  ADD PRIMARY KEY (`buildingid`),
  ADD KEY `fk_builder` (`builderid`),
  ADD KEY `fk_project` (`projectid`);

--
-- Indexes for table `tbl_buildingunitmaster`
--
ALTER TABLE `tbl_buildingunitmaster`
  ADD PRIMARY KEY (`buildingunitid`),
  ADD KEY `projectid` (`projectid`),
  ADD KEY `buildingid` (`buildingid`),
  ADD KEY `unitcategoryid` (`unitcategoryid`);

--
-- Indexes for table `tbl_clientmaster`
--
ALTER TABLE `tbl_clientmaster`
  ADD PRIMARY KEY (`clientid`);

--
-- Indexes for table `tbl_projectmaster`
--
ALTER TABLE `tbl_projectmaster`
  ADD PRIMARY KEY (`projectid`),
  ADD KEY `builderid` (`builderid`);

--
-- Indexes for table `tbl_unitcategorymaster`
--
ALTER TABLE `tbl_unitcategorymaster`
  ADD PRIMARY KEY (`unitcategoryid`);

--
-- Indexes for table `tbl_uploadmaster`
--
ALTER TABLE `tbl_uploadmaster`
  ADD PRIMARY KEY (`uploadid`),
  ADD KEY `builderid` (`builderid`),
  ADD KEY `projectid` (`projectid`),
  ADD KEY `buildingid` (`buildingid`),
  ADD KEY `unitcategoryid` (`unitcategoryid`);

--
-- Indexes for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_buildermaster`
--
ALTER TABLE `tbl_buildermaster`
  MODIFY `builderid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_buildingmaster`
--
ALTER TABLE `tbl_buildingmaster`
  MODIFY `buildingid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_buildingunitmaster`
--
ALTER TABLE `tbl_buildingunitmaster`
  MODIFY `buildingunitid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_clientmaster`
--
ALTER TABLE `tbl_clientmaster`
  MODIFY `clientid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_projectmaster`
--
ALTER TABLE `tbl_projectmaster`
  MODIFY `projectid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_unitcategorymaster`
--
ALTER TABLE `tbl_unitcategorymaster`
  MODIFY `unitcategoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_uploadmaster`
--
ALTER TABLE `tbl_uploadmaster`
  MODIFY `uploadid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_buildermaster`
--
ALTER TABLE `tbl_buildermaster`
  ADD CONSTRAINT `tbl_buildermaster_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `tbl_usermaster` (`userid`);

--
-- Constraints for table `tbl_buildingmaster`
--
ALTER TABLE `tbl_buildingmaster`
  ADD CONSTRAINT `fk_builder` FOREIGN KEY (`builderid`) REFERENCES `tbl_buildermaster` (`builderid`),
  ADD CONSTRAINT `fk_project` FOREIGN KEY (`projectid`) REFERENCES `tbl_projectmaster` (`projectid`);

--
-- Constraints for table `tbl_buildingunitmaster`
--
ALTER TABLE `tbl_buildingunitmaster`
  ADD CONSTRAINT `tbl_buildingunitmaster_ibfk_1` FOREIGN KEY (`projectid`) REFERENCES `tbl_projectmaster` (`projectid`),
  ADD CONSTRAINT `tbl_buildingunitmaster_ibfk_2` FOREIGN KEY (`buildingid`) REFERENCES `tbl_buildingmaster` (`buildingid`),
  ADD CONSTRAINT `tbl_buildingunitmaster_ibfk_3` FOREIGN KEY (`unitcategoryid`) REFERENCES `tbl_unitcategorymaster` (`unitcategoryid`);

--
-- Constraints for table `tbl_projectmaster`
--
ALTER TABLE `tbl_projectmaster`
  ADD CONSTRAINT `tbl_projectmaster_ibfk_1` FOREIGN KEY (`builderid`) REFERENCES `tbl_buildermaster` (`builderid`);

--
-- Constraints for table `tbl_uploadmaster`
--
ALTER TABLE `tbl_uploadmaster`
  ADD CONSTRAINT `tbl_uploadmaster_ibfk_1` FOREIGN KEY (`builderid`) REFERENCES `tbl_buildermaster` (`builderid`) ON DELETE SET NULL,
  ADD CONSTRAINT `tbl_uploadmaster_ibfk_2` FOREIGN KEY (`projectid`) REFERENCES `tbl_projectmaster` (`projectid`) ON DELETE SET NULL,
  ADD CONSTRAINT `tbl_uploadmaster_ibfk_3` FOREIGN KEY (`buildingid`) REFERENCES `tbl_buildingmaster` (`buildingid`) ON DELETE SET NULL,
  ADD CONSTRAINT `tbl_uploadmaster_ibfk_4` FOREIGN KEY (`unitcategoryid`) REFERENCES `tbl_unitcategorymaster` (`unitcategoryid`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
