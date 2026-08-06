#!/usr/bin/env scotty

# Scotty.sh fuer ui.twiceware.cloud (quantum-forge, dspangenberg/twc-ui).
# Deploy:  scotty run deploy
# Anderer Branch:  scotty run deploy --branch=develop
#
# Voraussetzungen (auf dem Server eingerichtet):
#   - Deploy-Key /home/twiceware/.ssh/id_ed25519_github ist als Deploy-Key
#     im GitHub-Repo dspangenberg/twc-ui hinterlegt.
#   - twiceware darf per sudo das FPM-Pool-Update neu starten.
#   - node/pnpm liegen als Wrapper in /usr/local/bin (LD_LIBRARY_PATH gesetzt).

# @servers local=127.0.0.1 remote=twiceware@77.42.67.43
# @macro deploy startDeployment cloneRepository runComposer generateRegistry buildAssets updateSymlinks migrateDatabase blessNewRelease cleanOldReleases

# @option branch=main

BASE_DIR="/home/twiceware/vhosts/ui.twiceware.cloud/public_html"
RELEASES_DIR="$BASE_DIR/releases"
PERSISTENT_DIR="$BASE_DIR/persistent"
CURRENT_DIR="$BASE_DIR/current"
NEW_RELEASE_NAME=$(date +%Y%m%d-%H%M%S)
NEW_RELEASE_DIR="$RELEASES_DIR/$NEW_RELEASE_NAME"
REPOSITORY="dspangenberg/twc-ui"

# @task on:local
startDeployment() {
    git checkout $BRANCH
    git pull origin $BRANCH
}

# @task on:remote
cloneRepository() {
    [ -d $RELEASES_DIR ] || mkdir -p $RELEASES_DIR
    [ -d $PERSISTENT_DIR ] || mkdir -p $PERSISTENT_DIR
    [ -d $PERSISTENT_DIR/storage/framework ] || mkdir -p $PERSISTENT_DIR/storage/framework

    cd $RELEASES_DIR
    git clone --depth 1 --branch $BRANCH git@github.com:$REPOSITORY $NEW_RELEASE_NAME
}

# @task on:remote
runComposer() {
    cd $NEW_RELEASE_DIR
    ln -nfs $BASE_DIR/.env .env
    composer install --prefer-dist --no-dev -o
}

# @task on:remote
generateRegistry() {
    cd $NEW_RELEASE_DIR
    pnpm install --frozen-lockfile
    pnpm registry:create
}

# @task on:remote
buildAssets() {
    cd $NEW_RELEASE_DIR
    pnpm build
    rm -rf node_modules
}

# @task on:remote
updateSymlinks() {
    rm -rf $NEW_RELEASE_DIR/storage
    cd $NEW_RELEASE_DIR
    ln -nfs $PERSISTENT_DIR/storage storage
}

# @task on:remote
migrateDatabase() {
    cd $NEW_RELEASE_DIR
    php artisan migrate --force
}

# @task on:remote
blessNewRelease() {
    ln -nfs $NEW_RELEASE_DIR $CURRENT_DIR

    cd $NEW_RELEASE_DIR
    php artisan storage:link
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    php artisan cache:clear

    sudo systemctl reload php8.5-fpm
}

# @task on:remote
cleanOldReleases() {
    cd $RELEASES_DIR
    ls -dt $RELEASES_DIR/* | tail -n +4 | xargs rm -rf
}
