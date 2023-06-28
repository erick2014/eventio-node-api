#!/bin/bash
DB_NAME=$MARIADB_DATABASE
DB_USER=$MARIADB_USER
ROOT_PASS=$MARIADB_ROOT_PASSWORD

echo "*******start creating db for tets*********"
mysql -u root -p"$ROOT_PASS" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME}_test ;"
mysql -u root -p"$ROOT_PASS" -e "GRANT ALL PRIVILEGES ON ${DB_NAME}_test.* TO '$DB_USER'@'%';"
mysql -u root -p"$ROOT_PASS" -e "FLUSH PRIVILEGES;"
echo "** Finished creating db for tests...."