confirm() {
    read -r -p "${1:-Are you sure? [y/N]} " response
    if [ "$response" != "y" ]; then
        echo "Operation cancelled."
        exit 1
    fi
}
