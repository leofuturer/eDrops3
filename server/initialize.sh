set -eo pipefail

if [[ $RESET_DATABASE == "Yes" ]]; then
    echo -e 'Resetting database'
    node db/reset-db.js # DANGER: reset database and add seed data
fi

if [[ $MIGRATE_DATABSE == "Yes" ]]; then
    echo -e 'Applying migrations'
    node db/migrate-db.js
fi

echo -e 'Starting server from intialize.sh'
node server/server.js

