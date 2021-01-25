set -eo pipefail

if [[ ( $RESET_DATABASE == "Yes" && $NODE_ENV != "production" ) ]]; then
    echo -e 'Resetting database'
    node db/reset-db.js # DANGER: reset database and add seed data
    echo -e 'Done resetting database'
    exit 0
fi

if [[ $MIGRATE_DATABASE == "Yes" ]]; then
    echo -e 'Applying migrations'
    node db/migrate-db.js
    echo -e 'Done applying migrations'
    exit 0
fi

echo -e 'Starting server from intialize.sh'
node server/server.js
