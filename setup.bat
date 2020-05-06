:: Clone 
git clone git@github.com:commitd/jonah-server.git
git clone git@github.com:commitd/jonah-ui.git

:: Install documentation too
call setup-documentation.bat

cd jonah-server
call setup.bat
cd -

cd jonah-ui
call setup.bat
cd -
