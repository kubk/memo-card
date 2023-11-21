#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$0")"

source "$SCRIPT_DIR/confirm.sh"

confirm "Are you sure you want to create a prod dump? [y/N]"

export $(cat "$SCRIPT_DIR/../.dev.vars" | xargs)

docker-compose exec postgres pg_dump postgresql://postgres:$DB_PASS@$DB_HOST:5432/$DB_NAME > "$SCRIPT_DIR/dump.sql"
