
echo "Cleaning old build"
rmdir /s /q build/
mkdir build

echo "Build UI"

cd jonah-ui
call build.sh
cd ..


cd jonah-server
call build.sh
cd ..

call build-documentation.sh

echo "Collating to build directory"
robocopy /s /e jonah-server\build\* build\.
robocopy /s /e jonah-ui\build\* build\.
robocopy /s /e config\*  build\.
