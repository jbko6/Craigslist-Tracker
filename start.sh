trap "sudo systemctl stop mongod.service; echo 'Stopping MongoDB service...'; kill -- -$$" EXIT

sudo systemctl start mongod
echo 'Starting MongoDB service...'

pip install -r requirements.txt
npm install

cd src
(cd backend; python3 -m flask run -p 5001 --debug &)
vite dev