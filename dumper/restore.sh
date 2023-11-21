#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$0")"

source "$SCRIPT_DIR/confirm.sh"

if [ ! -f "$SCRIPT_DIR/dump.sql" ]; then
    echo "Error: dump.sql does not exist."
    exit 1
fi

export $(cat "$SCRIPT_DIR/../.dev.vars" | xargs)

confirm "Are you sure you want to execute the psql command? [y/N]"

docker-compose exec postgres psql postgresql://postgres:$DB_PASS@$DB_HOST:5432/$DB_NAME < "$SCRIPT_DIR/dump.sql"

