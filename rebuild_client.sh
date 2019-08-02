cd ./client/ && npm run build
rm -r -f ../public/
cp -r -f ./build/ ../public/
cd .. && npm start