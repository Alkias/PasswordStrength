ALTER function [dbo].[PasswordStrength_fn](@pwd VARCHAR(255) ) 
RETURNS INT
WITH ENCRYPTION 
AS
BEGIN
DECLARE @strength int

SET @strength=0

--check for length
SET @strength =  CASE WHEN dbo.Check_PasswordStrength_fn(@pwd,0) = 0  THEN @strength + 5
                WHEN dbo.Check_PasswordStrength_fn(@pwd,0) = 1 THEN @strength + 10
                WHEN dbo.Check_PasswordStrength_fn(@pwd,0) = 2 THEN @strength + 25
END


--check for letters
SET @strength =  CASE WHEN dbo.Check_PasswordStrength_fn(@pwd,1) = 0  THEN @strength + 0
                WHEN dbo.Check_PasswordStrength_fn(@pwd,1) = 1 THEN @strength + 10
                WHEN dbo.Check_PasswordStrength_fn(@pwd,1) = 2 THEN @strength + 20
END

--check for numbers
SET @strength =  CASE WHEN dbo.Check_PasswordStrength_fn(@pwd,2) = 0  THEN @strength + 0
                WHEN dbo.Check_PasswordStrength_fn(@pwd,2) = 1 THEN @strength + 10
                WHEN dbo.Check_PasswordStrength_fn(@pwd,2) = 2 THEN @strength + 20
END

--check for special chars
SET @strength =  CASE WHEN dbo.Check_PasswordStrength_fn(@pwd,3) = 0  THEN @strength + 0
                WHEN dbo.Check_PasswordStrength_fn(@pwd,3) = 1 THEN @strength + 10
                WHEN dbo.Check_PasswordStrength_fn(@pwd,3) = 2 THEN @strength + 25
END

--check for combination
SET @strength =  CASE WHEN dbo.Check_PasswordStrength_fn(@pwd,4) = 0  THEN @strength + 2
                WHEN dbo.Check_PasswordStrength_fn(@pwd,4) = 1 THEN @strength + 3
                WHEN dbo.Check_PasswordStrength_fn(@pwd,4) = 2 THEN @strength + 5
END

RETURN @strength

END
