/****** Object:  UserDefinedFunction [dbo].[Check_PasswordStrength_fn]    Script Date: 30/05/2018 18:36:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[Check_PasswordStrength_fn](@Password varchar(255), @check int)
RETURNS INT
WITH ENCRYPTION 
AS
BEGIN
DECLARE @return INT,
       @i INT,
       @num int,
       @upper int,
       @lower int,
       @other int,
       @s_key varchar(5) = '13',
       @j int = 0,
       @sOutput varchar(255) = '',
       @sTmpStr varchar(255) = '',
       @sPrevStr varchar(255) = ''

/*
@check  0: --> length, 1: --> letters, 2: --> numbers, 3: --> special chars, 4: combination
*/

/*======================================================================
START - Delphi Function function Decrypt(sInput, sKey: String): string;
//======================================================================*/
       while (Len(@Password) > 2)
       begin
              set @j = @j + 1
              set @i = convert(int, (substring(@Password, 1, 1)))
              set @sTmpStr=substring(@Password, 2, @i)
  
              if @sPrevStr <> ''
                     set @sOutput =  @sOutput + char(convert(int, @sTmpStr) - convert(int, @sPrevStr) - (convert(int, @s_key)*@j))
              else
                     set @sOutput =  @sOutput + char(convert(int, @sTmpStr) - (convert(int, @s_key)*@j))

              set @Password= ltrim(rtrim((substring(@Password, (@i+2), len(@Password)))))

              if @sPrevStr <> ''
                     set @sPrevStr = ltrim(rtrim(convert(varchar(100), (convert(int, @sTmpStr) - convert(int, @sPrevStr) - (convert(int, @s_key)*@j)))))
              else
                     set @sPrevStr =  ltrim(rtrim(convert(varchar(100), (convert(int, @sTmpStr) - (convert(int, @s_key)*@j)))))
       end

       set @Password = @sOutput
/*======================================================================
END - Delphi Function function Decrypt(sInput, sKey: String): string;
//======================================================================*/

SET @i = 1
SET @return = 0   
SET @num = 0   
SET @upper = 0  
SET @lower = 0 
SET @other = 0

IF @check = 0 --length
BEGIN
       IF len(@Password) <= 4  SET @return = 0 
       ELSE IF len(@Password) between 5 and 7  SET @return = 1
       ELSE IF len(@Password) > 7  SET @return = 2
END
IF @check = 1 --letters
BEGIN
       WHILE @i <= DATALENGTH(@Password) 
       BEGIN
       
              IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 65 AND 90 --latin upper
                      SELECT @upper = @upper + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 193 AND 219 --greek upper
                      SELECT @upper = @upper + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 97 AND 122 --latin lower   
                      SELECT @lower = @lower + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 220 AND 254 --greek lower   
                      SELECT @lower = @lower + 1

          SET @i = @i + 1
       
       END
       
       IF @upper+@lower = 0 SET @return = 0
       ELSE IF (@lower = 0) OR (@upper = 0) SET @return = 1
       ELSE SET @return = 2

END
ELSE IF @check = 2 --numbers
BEGIN
       WHILE @i <= DATALENGTH(@Password) 
       BEGIN
       
              IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 48 AND 57 --numbers
                      SELECT @num = @num + 1
       
          SET @i = @i + 1
       
       END
       
       IF @num = 0 SET @return = 0
       ELSE IF @num between 1 and 2 SET @return = 1
       ELSE IF @num > 2 SET @return = 2

END
ELSE IF @check = 3 --special chars
BEGIN
       WHILE @i <= DATALENGTH(@Password) 
       BEGIN
       
              IF NOT ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 48 AND 57 --numbers
              AND NOT ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 65 AND 90 --latin upper
              AND NOT ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 193 AND 219 --greek upper
              AND NOT ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 97 AND 122 --latin lower
              AND NOT ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 220 AND 254 --greek lower  
                      SELECT @other = @other + 1
       
          SET @i = @i + 1
       
       END
       
       IF @other = 0 SET @return = 0
       ELSE IF @other = 1 SET @return = 1
       ELSE IF @other > 1 SET @return = 2

END
ELSE IF @check = 4 --combination
BEGIN
       WHILE @i <= DATALENGTH(@Password) 
       BEGIN
       
              IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 65 AND 90 --latin upper
                      SELECT @upper = @upper + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 193 AND 219 --greek upper
                      SELECT @upper = @upper + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 97 AND 122 --latin lower   
                      SELECT @lower = @lower + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 220 AND 254 --greek lower   
                      SELECT @lower = @lower + 1
              ELSE IF ASCII(SUBSTRING(@Password, @i, 1)) BETWEEN 48 AND 57 --numbers
                      SELECT @num = @num + 1
              ELSE SELECT @other = @other + 1
       
          SET @i = @i + 1
       
       END
       
       IF @other = 0 SET @return = 0
       ELSE IF (@other > 0) and (@num > 0) and ((@upper > 0 and @lower = 0) OR (@upper = 0 and @lower > 0))SET @return = 1
       ELSE SET @return = 2

END
RETURN @return

END
