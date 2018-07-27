
:: Delete old documentation
rmdir /q  build\documentation

:: build new documenentation
cd documentation\website
call yarn build
cd ..\..

:: Copy the documentation into place
mkdir build
robocopy /s /e documentation\website\build\ build\documentation\.

